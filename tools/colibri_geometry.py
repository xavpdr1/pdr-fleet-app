"""Simplified Colibri / Colibri XL stand-in models.

Dimensions measured from the Fusion viewer (mm). Frame used here:
  X = drive-through direction (depth), Y = across the arch (width), Z = up, floor at Z=0.
Outputs per model:
  <name>.stl  - single watertight mesh, mm, Z-up (for printing; scale in the slicer)
  <name>.glb  - coloured, metres, Y-up (for the web / AR "Colibri in your shop" preview)
"""
import numpy as np
import trimesh
from shapely.geometry import Polygon, box
from shapely.ops import unary_union

DARK = [43, 45, 48, 255]      # arch shell
TRIM = [185, 180, 154, 255]   # light edge trim on the arch faces
WING = [30, 31, 34, 255]      # camera wing modules
POD = [70, 72, 76, 255]       # roof-mounted units

MODELS = {
    "colibri": dict(
        W=1632, H=2606, t=96, rx=1060, rz=1180, D=986, top=2826, side=1648,
        wings=[  # x0, x1, y0, y1, z0, z1
            (409, 1117, 1360, 1632, 32, 1517), (409, 1117, -1624, -1388, 32, 1517),
            (-1117, -450, 1497, 1632, 32, 1517), (-1117, -450, -1615, -1479, 32, 1517),
        ]),
    "colibri_xl": dict(
        W=1993, H=2893, t=96, rx=1018, rz=1159, D=990, top=3112, side=2026,
        wings=[
            (409, 1117, 1766, 2002, 30, 1515), (409, 1117, -2002, -1767, 30, 1515),
            (-1117, -450, 1859, 1993, 30, 1515), (-1117, -450, -1993, -1858, 30, 1515),
        ]),
}


def arch_profile(W, H, t, rx, rz, n=48):
    """Open-bottom arch ring in the (Y, Z) plane."""
    pts = [(-W, 0), (-W, H - rz)]
    for a in np.linspace(np.pi, np.pi / 2, n):          # left corner
        pts.append((-W + rx + rx * np.cos(a), H - rz + rz * np.sin(a)))
    for a in np.linspace(np.pi / 2, 0, n):              # right corner
        pts.append((W - rx + rx * np.cos(a), H - rz + rz * np.sin(a)))
    pts += [(W, H - rz), (W, 0)]
    outer = Polygon(pts)
    inner = unary_union([outer.buffer(-t, join_style=2), box(-W + t, -1, W - t, t + 1)])
    # simplify drops the duplicate points where corners meet straights,
    # which otherwise leave the extrusion non-watertight
    return outer.difference(inner).simplify(0.5)


def extrude_x(poly, x0, x1):
    """Extrude a (Y,Z) polygon along X from x0 to x1."""
    m = trimesh.creation.extrude_polygon(poly, x1 - x0)
    T = np.array([[0, 0, 1, x0], [1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1]], float)
    m.apply_transform(T)
    return m


def cuboid(x0, x1, y0, y1, z0, z1):
    m = trimesh.creation.box(extents=[x1 - x0, y1 - y0, z1 - z0])
    m.apply_translation([(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2])
    return m


def build(p):
    ring = arch_profile(p["W"], p["H"], p["t"], p["rx"], p["rz"])
    h, trim = p["D"] / 2, 25
    parts = {
        "arch_shell": (extrude_x(ring, -h + trim, h - trim), DARK),
        "arch_trim_front": (extrude_x(ring, h - trim, h), TRIM),
        "arch_trim_back": (extrude_x(ring, -h, -h + trim), TRIM),
    }
    for i, w in enumerate(p["wings"]):
        parts[f"wing_{i + 1}"] = (cuboid(*w), WING)
    # roof units (cameras / electronics) bring the top to the measured overall height
    H, top = p["H"], p["top"]
    for i, y in enumerate((-0.45 * p["W"], 0, 0.45 * p["W"])):
        parts[f"roof_unit_{i + 1}"] = (cuboid(-160, 160, y - 120, y + 120, H - 5, top), POD)
    # side sockets/handles bring the width to the measured overall width
    for i, s in enumerate((1, -1)):
        y0, y1 = sorted((s * (p["W"] - 5), s * p["side"]))
        parts[f"side_socket_{i + 1}"] = (cuboid(-80, 80, y0, y1, 900, 1100), POD)
    return parts


def main(out):
    import os
    os.makedirs(out, exist_ok=True)
    for name, p in MODELS.items():
        parts = build(p)
        # STL: watertight union, mm, Z-up
        solid = trimesh.boolean.union([m for m, _ in parts.values()], engine="manifold")
        solid.export(f"{out}/{name}_standin_mm.stl")
        # GLB: coloured, metres, Y-up (glTF convention), X stays the drive-through axis
        to_gltf = np.array([[1, 0, 0, 0], [0, 0, 1, 0], [0, -1, 0, 0], [0, 0, 0, 1]], float)
        scene = trimesh.Scene()
        for pname, (m, col) in parts.items():
            g = m.copy()
            g.apply_transform(to_gltf)
            g.apply_scale(0.001)
            g.visual = trimesh.visual.ColorVisuals(g, face_colors=col)
            mat = trimesh.visual.material.PBRMaterial(
                baseColorFactor=col, metallicFactor=0.2, roughnessFactor=0.6)
            g.visual = trimesh.visual.TextureVisuals(material=mat)
            scene.add_geometry(g, node_name=pname, geom_name=pname)
        scene.export(f"{out}/{name}_standin.glb")
        e = solid.bounds[1] - solid.bounds[0]
        print(f"{name}: watertight={solid.is_watertight} "
              f"depth={e[0]:.0f} width={e[1]:.0f} height={e[2]:.0f} mm")


if __name__ == "__main__":
    import sys
    main(sys.argv[1] if len(sys.argv) > 1 else "out")
