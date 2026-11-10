"""Build the shop-preview.html models: public/colibri.glb, public/colibri-xl.glb and the
sun-cover versions public/colibri-cover.glb, public/colibri-xl-cover.glb.

Arch geometry comes from colibri_geometry.py (dimensions measured from the Fusion models).
Adds the blue drive-through lane outline on the floor: CLEAR_FT of open space at each
end of the scanner, measured from its outermost front/back faces (the sun cover's ends
when the cover is on).

glTF frame (what model-viewer expects): metres, Y up, the lane runs along Z and the origin
is the centre of the scanner on the floor, so in the camera view the scanner lands where the
phone points and turning it pivots on the scanner. The 16FT-18FT signs stand on both sides
of the lane, which keeps the whole model centred on the scanner.

"-only" files are the scanner alone (no lane, signs or vehicle), for placing it first.

Run from the repo root:  python3 tools/build_shop_preview_glb.py
"""
import os
import sys

import numpy as np
import trimesh

sys.path.insert(0, os.path.dirname(__file__))
import colibri_geometry as cg  # noqa: E402
import vehicles as vh  # noqa: E402

CLEAR_FT = 17
CLEAR_M = CLEAR_FT * 0.3048
LANE = [46, 117, 181, 255]     # same blue as the previous models
STRIP = 0.12                   # lane line width, m
THICK = 0.012                  # lane line height, m
OUT = {("colibri", False): "public/colibri.glb", ("colibri_xl", False): "public/colibri-xl.glb",
       ("colibri", True): "public/colibri-cover.glb", ("colibri_xl", True): "public/colibri-xl-cover.glb"}


LABEL = "16FT-18FT"
LABEL_FILL = 0.85              # label length as a share of the end zone length
LABEL_DEPTH = 0.08             # thickness of the standing letters, m
LABEL_GAP = 0.3                # labels stand this far outside the lane edge, clear of the vehicle
DRIVE_SPEED = 1.2              # display vehicle speed through the scanner, m/s
DRIVE_PAUSE = 1.5              # pause at each end of the drive, s


def text_mesh(text, width):
    """Bold 3D letters standing upright on the floor, centred on the lane.

    Runs lengthwise along the lane, reading left to right toward the scanner (-Z) when
    seen from the +X side of the lane (the side the 3D view opens on).
    """
    from functools import reduce
    from matplotlib.font_manager import FontProperties
    from matplotlib.textpath import TextPath
    from shapely.geometry import Polygon

    path = TextPath((0, 0), text, size=1, prop=FontProperties(family="DejaVu Sans", weight="bold"))
    rings = [Polygon(p) for p in path.to_polygons() if len(p) >= 3]
    shape = reduce(lambda a, b: a.symmetric_difference(b), rings)   # even-odd fill keeps holes
    x0, y0, x1, y1 = shape.bounds
    k = width / (x1 - x0)
    from shapely import affinity
    shape = affinity.scale(affinity.translate(shape, -(x0 + x1) / 2, -(y0 + y1) / 2), k, k, origin=(0, 0))
    geoms = getattr(shape, "geoms", [shape])
    parts = [trimesh.creation.extrude_polygon(g, LABEL_DEPTH) for g in geoms]
    m = trimesh.util.concatenate(parts)
    h = (y1 - y0) * k
    # (u right, v up, w extrude) -> (x = w, y = v, z = -u), standing on the floor, centred on x = 0
    m.apply_transform(np.array([[0, 0, 1, -LABEL_DEPTH / 2], [0, 1, 0, h / 2], [-1, 0, 0, 0], [0, 0, 0, 1]], float))
    return m


def add_drive_animation(path, travel):
    """Group the vehicle_* nodes under one 'vehicle' node and loop it through the scanner.

    Keyframes: pause at the start, drive `travel` metres toward -Z at DRIVE_SPEED,
    pause, then the loop restarts at the start position. model-viewer plays it with autoplay.
    """
    import struct
    from pygltflib import (GLTF2, Accessor, Animation, AnimationChannel, AnimationChannelTarget,
                           AnimationSampler, BufferView, Node)
    g = GLTF2().load(path)
    scene = g.scenes[g.scene or 0]
    veh_idx = [i for i in scene.nodes if (g.nodes[i].name or "").startswith("vehicle_")]
    g.nodes.append(Node(name="vehicle", children=veh_idx, translation=[0.0, 0.0, 0.0]))
    parent = len(g.nodes) - 1
    scene.nodes = [i for i in scene.nodes if i not in veh_idx] + [parent]

    drive = travel / DRIVE_SPEED
    times = [0.0, DRIVE_PAUSE, DRIVE_PAUSE + drive, 2 * DRIVE_PAUSE + drive]
    moves = [(0.0, 0.0, 0.0), (0.0, 0.0, 0.0), (0.0, 0.0, -travel), (0.0, 0.0, -travel)]
    blob = bytearray(g.binary_blob())
    def add(data, count, typ, mn=None, mx=None):
        while len(blob) % 4:
            blob.append(0)
        off = len(blob)
        blob.extend(data)
        g.bufferViews.append(BufferView(buffer=0, byteOffset=off, byteLength=len(data)))
        g.accessors.append(Accessor(bufferView=len(g.bufferViews) - 1, componentType=5126,
                                    count=count, type=typ, min=mn, max=mx))
        return len(g.accessors) - 1
    t_acc = add(struct.pack(f"<{len(times)}f", *times), len(times), "SCALAR", [times[0]], [times[-1]])
    m_acc = add(struct.pack(f"<{3 * len(moves)}f", *[c for m in moves for c in m]), len(moves), "VEC3")
    g.animations.append(Animation(name="drive_through", samplers=[AnimationSampler(input=t_acc, output=m_acc, interpolation="LINEAR")],
                                  channels=[AnimationChannel(sampler=0, target=AnimationChannelTarget(node=parent, path="translation"))]))
    g.buffers[0].byteLength = len(blob)
    g.set_binary_blob(bytes(blob))
    g.save_binary(path)


def material(col):
    return trimesh.visual.material.PBRMaterial(
        baseColorFactor=col, metallicFactor=0.2, roughnessFactor=0.6)


def main():
    jobs = [(name, cover, veh, out if veh is None else out.replace(".glb", f"-{veh}.glb"))
            for (name, cover), out in OUT.items() for veh in (None, "suv", "truck", "only")]
    for name, cover, veh, out in jobs:
        p = cg.MODELS[name]
        parts = cg.build(p, cover=cover)
        allv = np.vstack([m.vertices for m, _ in parts.values()])
        only = veh == "only"
        if only:
            veh = None
        # display vehicle parked under the centre of the scanner, nose toward the far end
        if veh:
            for vname, (m, col) in vh.build(veh).items():
                parts[f"vehicle_{vname}"] = (m, col)
        depth_mm = allv[:, 0].max() - allv[:, 0].min()
        width_m = (allv[:, 1].max() - allv[:, 1].min()) / 1000
        lane_len = depth_mm / 1000 + 2 * CLEAR_M

        # (X depth, Y width, Z up) mm  ->  glTF (x=width, y=up, z=depth) m, arch centred on the lane
        T = np.array([[0, 1, 0, 0], [0, 0, 1, 0], [1, 0, 0, 0], [0, 0, 0, 1]], float)
        scene = trimesh.Scene()
        for pname, (m, col) in parts.items():
            g = m.copy()
            g.apply_transform(T)
            g.apply_scale(0.001)
            g.apply_translation([0, 0, -lane_len / 2])
            g.visual = trimesh.visual.TextureVisuals(material=material(col))
            scene.add_geometry(g, node_name=pname, geom_name=pname)

        if veh:   # start position: nose at the scanner entrance, kept inside the lane
            car_l, zc, depth = vh.VEHICLES[veh]["L"] / 1000, -lane_len / 2, depth_mm / 1000
            start_c = min(zc + depth / 2 + car_l / 2, -car_l / 2 - 0.05)
            end_c = max(zc - depth / 2 - car_l / 2, -lane_len + car_l / 2 + 0.05)
            for gname, g in scene.geometry.items():
                if gname.startswith("vehicle_"):
                    g.apply_translation([0, 0, start_c - zc])
            travel = start_c - end_c

        hw = width_m / 2
        if only:          # scanner alone: centre it on the origin and stop here
            for g in scene.geometry.values():
                g.apply_translation([0, 0, lane_len / 2])
            scene.export(out)
            e = scene.bounds[1] - scene.bounds[0]
            print(f"{out}: scanner only, width {e[0]:.3f} m, height {e[1]:.3f} m, length {e[2]:.3f} m")
            continue
        strips = {
            "lane_left": ([-hw, -hw + STRIP], [-lane_len, 0]),
            "lane_right": ([hw - STRIP, hw], [-lane_len, 0]),
            "lane_far_end": ([-hw, hw], [-lane_len, -lane_len + STRIP]),
            "lane_near_end": ([-hw, hw], [-STRIP, 0]),
            # marker line across the lane at its midpoint (under the centre of the scanner)
            "lane_mid": ([-hw, hw], [-lane_len / 2 - STRIP / 2, -lane_len / 2 + STRIP / 2]),
        }
        for sname, ((x0, x1), (z0, z1)) in strips.items():
            b = trimesh.creation.box(extents=[x1 - x0, THICK, z1 - z0])
            b.apply_translation([(x0 + x1) / 2, THICK / 2, (z0 + z1) / 2])
            b.visual = trimesh.visual.TextureVisuals(material=material(LANE))
            scene.add_geometry(b, node_name=sname, geom_name=sname)

        # standing lengthwise signs just outside both lane edges, in the middle of each end zone;
        # the -X side copy is turned round so it reads correctly from that side
        label = text_mesh(LABEL, width=LABEL_FILL * CLEAR_M)
        flip = trimesh.transformations.rotation_matrix(np.pi, [0, 1, 0])
        for lname, z in {"label_near_end": -CLEAR_M / 2,
                         "label_far_end": -lane_len + CLEAR_M / 2}.items():
            for side, sfx in ((1, ""), (-1, "_other_side")):
                t = label.copy()
                if side < 0:
                    t.apply_transform(flip)
                t.apply_translation([side * (hw + LABEL_GAP), 0, z])
                t.visual = trimesh.visual.TextureVisuals(material=material(LANE))
                scene.add_geometry(t, node_name=lname + sfx, geom_name=lname + sfx)

        # origin at the scanner centre (the lane was built from 0 to -lane_len)
        for g in scene.geometry.values():
            g.apply_translation([0, 0, lane_len / 2])
        scene.export(out)
        if veh:
            add_drive_animation(out, travel)
        e = scene.bounds[1] - scene.bounds[0]
        print(f"{out}: width {e[0]:.3f} m, height {e[1]:.3f} m, "
              f"lane {lane_len:.3f} m (scanner {depth_mm / 1000:.3f} m + {CLEAR_FT} ft each end)")


if __name__ == "__main__":
    main()
