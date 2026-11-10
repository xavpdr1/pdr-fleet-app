"""Build animated USDZ files for iPhone AR Quick Look from the shop-preview GLBs.

model-viewer converts a GLB to USDZ on the fly for iPhones, but that conversion drops
animations, so the display vehicle stood still in the iPhone camera view. These files
carry the same geometry, colours and the looping drive-through, and the page hands them
to Quick Look through model-viewer's ios-src.

Only the vehicle versions need one (the others have nothing to animate).
Run from the repo root after build_shop_preview_glb.py:  python3 tools/build_usdz.py
"""
import glob
import os
import struct
import tempfile

import numpy as np
import trimesh
from pxr import Gf, Sdf, Usd, UsdGeom, UsdShade, UsdUtils, Vt

FPS = 24


def drive_keys(path):
    """(times, z offsets) of the vehicle's drive_through animation in the GLB."""
    from pygltflib import GLTF2
    g = GLTF2().load(path)
    blob = g.binary_blob()
    s = g.animations[0].samplers[0]

    def read(acc_i, n_comp):
        a = g.accessors[acc_i]
        bv = g.bufferViews[a.bufferView]
        off = (bv.byteOffset or 0) + (a.byteOffset or 0)
        return np.array(struct.unpack_from(f"<{a.count * n_comp}f", blob, off)).reshape(a.count, n_comp)

    return read(s.input, 1)[:, 0], read(s.output, 3)[:, 2]


def safe(name):
    return "".join(c if c.isalnum() else "_" for c in name)


def add_mesh(stage, path, mesh, mat):
    m = UsdGeom.Mesh.Define(stage, path)
    m.CreatePointsAttr(Vt.Vec3fArray.FromNumpy(mesh.vertices.astype(np.float32)))
    m.CreateFaceVertexCountsAttr(Vt.IntArray([3] * len(mesh.faces)))
    m.CreateFaceVertexIndicesAttr(Vt.IntArray(mesh.faces.astype(np.int32).ravel().tolist()))
    # flat shading: one normal per face corner, and no subdivision (keeps boxes crisp)
    n = np.repeat(mesh.face_normals.astype(np.float32), 3, axis=0)
    m.CreateNormalsAttr(Vt.Vec3fArray.FromNumpy(n))
    m.SetNormalsInterpolation(UsdGeom.Tokens.faceVarying)
    m.CreateSubdivisionSchemeAttr(UsdGeom.Tokens.none)
    m.CreateDoubleSidedAttr(True)
    b = mesh.bounds
    m.CreateExtentAttr(Vt.Vec3fArray([Gf.Vec3f(*b[0]), Gf.Vec3f(*b[1])]))
    UsdShade.MaterialBindingAPI.Apply(m.GetPrim()).Bind(mat)


def material(stage, cache, rgba):
    key = tuple(int(c) for c in rgba[:3])
    if key in cache:
        return cache[key]
    path = f"/Root/Materials/m_{key[0]}_{key[1]}_{key[2]}"
    mat = UsdShade.Material.Define(stage, path)
    sh = UsdShade.Shader.Define(stage, path + "/Surface")
    sh.CreateIdAttr("UsdPreviewSurface")
    sh.CreateInput("diffuseColor", Sdf.ValueTypeNames.Color3f).Set(Gf.Vec3f(*[c / 255 for c in key]))
    sh.CreateInput("metallic", Sdf.ValueTypeNames.Float).Set(0.2)
    sh.CreateInput("roughness", Sdf.ValueTypeNames.Float).Set(0.6)
    mat.CreateSurfaceOutput().ConnectToSource(sh.ConnectableAPI(), "surface")
    cache[key] = mat
    return mat


def build(glb, out):
    times, zs = drive_keys(glb)
    scene = trimesh.load(glb)
    tmp = tempfile.mkdtemp()
    usdc = os.path.join(tmp, "model.usdc")
    stage = Usd.Stage.CreateNew(usdc)
    UsdGeom.SetStageUpAxis(stage, UsdGeom.Tokens.y)
    UsdGeom.SetStageMetersPerUnit(stage, 1.0)
    stage.SetTimeCodesPerSecond(FPS)
    stage.SetStartTimeCode(0)
    stage.SetEndTimeCode(round(times[-1] * FPS))
    root = UsdGeom.Xform.Define(stage, "/Root")
    stage.SetDefaultPrim(root.GetPrim())
    UsdGeom.Scope.Define(stage, "/Root/Materials")
    veh = UsdGeom.Xform.Define(stage, "/Root/vehicle")
    op = veh.AddTranslateOp()
    for t, z in zip(times, zs):
        op.Set(Gf.Vec3d(0, 0, float(z)), Usd.TimeCode(float(t) * FPS))
    cache = {}
    for name, mesh in scene.geometry.items():
        col = mesh.visual.material.baseColorFactor
        parent = "/Root/vehicle" if name.startswith("vehicle_") else "/Root"
        add_mesh(stage, f"{parent}/{safe(name)}", mesh, material(stage, cache, col))
    stage.GetRootLayer().Save()
    UsdUtils.CreateNewARKitUsdzPackage(usdc, out)
    return times[-1]


def check(path):
    """Run USD's own core, geometry, shading and USDZ validators on the package."""
    from pxr import UsdValidation
    ctx = UsdValidation.ValidationContext(keywords=
        ["UsdCoreValidators", "UsdGeomValidators", "UsdShadeValidators", "UsdUtilsValidators", "UsdzValidators"])
    errors = ctx.Validate(Usd.Stage.Open(path))
    bad = [f"{e.GetName()}: {e.GetMessage()[:120]}" for e in errors
           if e.GetType() in (UsdValidation.ValidationErrorType.Error, UsdValidation.ValidationErrorType.Warn)]
    return bad, []


if __name__ == "__main__":
    for glb in sorted(glob.glob("public/colibri*-suv.glb") + glob.glob("public/colibri*-truck.glb")):
        out = glb[:-4] + ".usdz"
        dur = build(glb, out)
        errs, fails = check(out)
        print(f"{out}: {os.path.getsize(out) // 1024} KB, loop {dur:.1f} s, "
              f"ARKit check: {'pass' if not errs and not fails else errs + fails}")
