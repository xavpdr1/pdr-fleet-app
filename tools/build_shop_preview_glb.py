"""Build public/colibri.glb and public/colibri-xl.glb for shop-preview.html.

Arch geometry comes from colibri_geometry.py (dimensions measured from the Fusion models).
Adds the blue drive-through lane outline on the floor: CLEAR_FT of open space at each
end of the scanner, measured from the scanner's outermost front/back faces.

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

CLEAR_FT = 17
CLEAR_M = CLEAR_FT * 0.3048
LANE = [46, 117, 181, 255]     # same blue as the previous models
STRIP = 0.12                   # lane line width, m
THICK = 0.012                  # lane line height, m
OUT = {"colibri": "public/colibri.glb", "colibri_xl": "public/colibri-xl.glb"}


LABEL = "16FT-18FT"
LABEL_FILL = 0.85              # label length as a share of the end zone length


def text_mesh(text, width):
    """Flat bold text lying on the floor, centred on the origin.

    Runs lengthwise along the lane: reading left to right toward the scanner (-Z) with
    letter tops pointing to -X, so it is upright seen from the +X side of the lane
    (the side the 3D view opens on).
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
    parts = [trimesh.creation.extrude_polygon(g, THICK) for g in geoms]
    m = trimesh.util.concatenate(parts)
    # (u right, v up, w extrude) -> (x = -v, y = w, z = -u)
    m.apply_transform(np.array([[0, -1, 0, 0], [0, 0, 1, 0], [-1, 0, 0, 0], [0, 0, 0, 1]], float))
    return m


def material(col):
    return trimesh.visual.material.PBRMaterial(
        baseColorFactor=col, metallicFactor=0.2, roughnessFactor=0.6)


def main():
    for name, p in cg.MODELS.items():
        parts = cg.build(p)
        allv = np.vstack([m.vertices for m, _ in parts.values()])
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
            # centre marker line down the whole lane, front to back (through the scanner)
            "lane_centre": ([-STRIP / 2, STRIP / 2], [-lane_len, 0]),
        }
        for sname, ((x0, x1), (z0, z1)) in strips.items():
            b = trimesh.creation.box(extents=[x1 - x0, THICK, z1 - z0])
            b.apply_translation([(x0 + x1) / 2, THICK / 2, (z0 + z1) / 2])
            b.visual = trimesh.visual.TextureVisuals(material=material(LANE))
            scene.add_geometry(b, node_name=sname, geom_name=sname)

        # lengthwise floor label in the middle of each end zone, set beside the centre
        # line on the +X side (halfway between the centre line and the lane edge)
        label = text_mesh(LABEL, width=LABEL_FILL * CLEAR_M)
        for lname, z in {"label_near_end": -CLEAR_M / 2,
                         "label_far_end": -lane_len + CLEAR_M / 2}.items():
            t = label.copy()
            t.apply_translation([hw / 2, 0, z])
            t.visual = trimesh.visual.TextureVisuals(material=material(LANE))
            scene.add_geometry(t, node_name=lname, geom_name=lname)

        scene.export(OUT[name])
        e = scene.bounds[1] - scene.bounds[0]
        print(f"{OUT[name]}: width {e[0]:.3f} m, height {e[1]:.3f} m, "
              f"lane {lane_len:.3f} m (scanner {depth_mm / 1000:.3f} m + {CLEAR_FT} ft each end)")


if __name__ == "__main__":
    main()
