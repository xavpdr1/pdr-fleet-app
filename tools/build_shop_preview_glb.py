"""Build the shop-preview.html models: public/colibri.glb, public/colibri-xl.glb and the
sun-cover versions public/colibri-cover.glb, public/colibri-xl-cover.glb.

Arch geometry comes from colibri_geometry.py (dimensions measured from the Fusion models).
Adds the blue drive-through lane outline on the floor: CLEAR_FT of open space at each
end of the scanner, measured from its outermost front/back faces (the sun cover's ends
when the cover is on).

glTF frame (what model-viewer expects): metres, Y up, the lane runs along -Z from the
origin, so in AR the scanner appears ahead of where the phone is pointed.

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


def material(col):
    return trimesh.visual.material.PBRMaterial(
        baseColorFactor=col, metallicFactor=0.2, roughnessFactor=0.6)


def main():
    jobs = [(name, cover, veh, out if veh is None else out.replace(".glb", f"-{veh}.glb"))
            for (name, cover), out in OUT.items() for veh in (None, "suv", "truck")]
    for name, cover, veh, out in jobs:
        p = cg.MODELS[name]
        parts = cg.build(p, cover=cover)
        allv = np.vstack([m.vertices for m, _ in parts.values()])
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

        hw = width_m / 2
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

        # standing lengthwise label in the middle of each end zone
        label = text_mesh(LABEL, width=LABEL_FILL * CLEAR_M)
        for lname, z in {"label_near_end": -CLEAR_M / 2,
                         "label_far_end": -lane_len + CLEAR_M / 2}.items():
            t = label.copy()
            t.apply_translation([0, 0, z])
            t.visual = trimesh.visual.TextureVisuals(material=material(LANE))
            scene.add_geometry(t, node_name=lname, geom_name=lname)

        scene.export(out)
        e = scene.bounds[1] - scene.bounds[0]
        print(f"{out}: width {e[0]:.3f} m, height {e[1]:.3f} m, "
              f"lane {lane_len:.3f} m (scanner {depth_mm / 1000:.3f} m + {CLEAR_FT} ft each end)")


if __name__ == "__main__":
    main()
