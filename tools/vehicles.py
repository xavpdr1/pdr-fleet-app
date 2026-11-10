"""Generic display vehicles for the shop preview (no brand styling or logos).

Sizes follow the two US best-sellers in their class (2025 sales):
  suv   - mid-size SUV, Toyota RAV4 size (2026 LE/XLE): 180.9 x 73.0 x 67.0 in, 105.9 in wheelbase
  truck - full-size pickup, Ford F-150 SuperCrew 5.5 ft box size (2026, 4x4):
          232.0 x 79.9 (95.7 with mirrors) x 77.1 in, 145.4 in wheelbase

Frame matches colibri_geometry.py: mm, X = along the lane, Y = across, Z = up, floor at 0.
Vehicles are built nose toward -X (the direction a car drives through the lane in the app).
"""
import numpy as np
import trimesh
from shapely.geometry import Point, Polygon, box as sbox

IN = 25.4
GLASS = [27, 35, 44, 255]
TIRE = [21, 21, 21, 255]
HUB = [154, 160, 166, 255]
HEAD = [235, 235, 225, 255]
TAIL = [190, 25, 30, 255]

VEHICLES = {
    "suv": dict(
        label="Mid-size SUV (Toyota RAV4 size)", color=[168, 35, 43, 255],
        L=180.9 * IN, W=73.0 * IN, H=67.0 * IN, WB=105.9 * IN, front_oh=900,
        track=1600, tire_r=362, tire_w=225, clearance=200, mirrors=0),
    "truck": dict(
        label="Full-size pickup (Ford F-150 SuperCrew size)", color=[59, 69, 82, 255],
        L=232.0 * IN, W=79.9 * IN, H=77.1 * IN, WB=145.4 * IN, front_oh=1000,
        track=67.9 * IN, tire_r=407, tire_w=275, clearance=240, mirrors=95.7 * IN),
}


def _extrude_y(poly_xz, y0, y1, cut=None):
    """Extrude an (X, Z) profile across Y from y0 to y1, minus optional wheel-well cut."""
    shape = Polygon(poly_xz).buffer(0) if not hasattr(poly_xz, "geom_type") else poly_xz
    if cut is not None:
        shape = shape.difference(cut)
    geoms = getattr(shape, "geoms", [shape])
    m = trimesh.util.concatenate([trimesh.creation.extrude_polygon(g, y1 - y0) for g in geoms])
    # (u=x, v=z, w=extrude) -> (x=u, y=y1-w, z=v)  (proper rotation, keeps normals outward)
    m.apply_transform(np.array([[1, 0, 0, 0], [0, 0, -1, y1], [0, 1, 0, 0], [0, 0, 0, 1]], float))
    return m


def _box(x0, x1, y0, y1, z0, z1):
    m = trimesh.creation.box(extents=[x1 - x0, y1 - y0, z1 - z0])
    m.apply_translation([(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2])
    return m


def _wheel(x, y, r, w):
    tire = trimesh.creation.cylinder(radius=r, height=w, sections=36)
    hub = trimesh.creation.cylinder(radius=r * 0.6, height=w + 6, sections=24)
    for m in (tire, hub):
        m.apply_transform(trimesh.transformations.rotation_matrix(np.pi / 2, [1, 0, 0]))
        m.apply_translation([x, y, r])
    return tire, hub


def build(kind):
    """Return {part_name: (mesh, rgba)} for one vehicle, nose toward +X before the final flip."""
    v = VEHICLES[kind]
    L, W, H, c = v["L"], v["W"], v["H"], v["clearance"]
    xf, xr = L / 2, -L / 2
    hw = W / 2
    belt = c + 0.52 * (H - c)
    xa_f = xf - v["front_oh"]
    xa_r = xa_f - v["WB"]
    r = v["tire_r"]
    wells = Point(xa_f, r).buffer(r + 45).union(Point(xa_r, r).buffer(r + 45))
    parts = {}
    if kind == "suv":
        body = [(xr, c + 50), (xf, c + 50), (xf, c + 420), (xf - 90, c + 640), (xf - 1000, belt),
                (xr + 60, belt), (xr, belt - 120)]
        cabin = [(xf - 1000, belt), (xf - 1650, H - 25), (xr + 380, H - 25), (xr + 80, belt)]
        roof = [(xf - 1630, H - 40), (xr + 360, H - 40), (xr + 340, H), (xf - 1650, H)]
        parts["body"] = (_extrude_y(body, -hw, hw, wells), v["color"])
        parts["cabin_glass"] = (_extrude_y(cabin, -hw * 0.88, hw * 0.88), GLASS)
        parts["roof"] = (_extrude_y(roof, -hw * 0.9, hw * 0.9), v["color"])
    else:
        cab_front, cab_rear = xf - 1900, xr + 1700 + 80     # windshield base / back of cab
        bed_top = c + 0.56 * (H - c)
        body = [(xr, c + 80), (xf, c + 80), (xf, c + 600), (xf - 60, belt + 60),
                (cab_front, belt + 120), (cab_rear, belt + 120), (cab_rear, c + 80)]
        parts["body"] = (_extrude_y(body, -hw, hw, wells), v["color"])
        cabin = [(cab_front, belt + 120), (cab_front - 650, H - 30), (cab_rear + 60, H - 30),
                 (cab_rear, belt + 120)]
        parts["cabin_glass"] = (_extrude_y(cabin, -hw * 0.9, hw * 0.9), GLASS)
        parts["roof"] = (_box(cab_rear + 60, cab_front - 630, -hw * 0.92, hw * 0.92, H - 45, H), v["color"])
        # open bed: floor, two sides, tailgate (bed runs from the cab back to the tail)
        bx0, bx1, t = xr, cab_rear - 20, 70
        parts["bed_floor"] = (_extrude_y(sbox(bx0, c + 80, bx1, c + 600), -hw, hw, wells), v["color"])
        side = sbox(bx0, c + 80, bx1, bed_top)
        parts["bed_side_l"] = (_extrude_y(side, hw - t, hw, wells), v["color"])
        parts["bed_side_r"] = (_extrude_y(side, -hw, -hw + t, wells), v["color"])
        parts["tailgate"] = (_box(bx0, bx0 + t, -hw, hw, c + 600, bed_top), v["color"])
        parts["bed_front"] = (_box(bx1 - t, bx1, -hw, hw, c + 600, bed_top), v["color"])
        if v["mirrors"]:
            mw = (v["mirrors"] - W) / 2
            for s, n in ((1, "l"), (-1, "r")):
                y0, y1 = sorted((s * hw, s * (hw + mw)))
                parts[f"mirror_{n}"] = (_box(cab_front - 260, cab_front - 60, y0, y1, belt + 160, belt + 420), v["color"])

    # lights so the direction of travel is obvious
    lz = c + 0.55 * (belt - c)
    for s, n in ((1, "l"), (-1, "r")):
        y0, y1 = sorted((s * (hw - 60), s * (hw - 420)))
        parts[f"headlight_{n}"] = (_box(xf - 18, xf, y0, y1, lz, lz + 120), HEAD)
        parts[f"taillight_{n}"] = (_box(xr, xr + 18, y0, y1, lz + 80, lz + 260), TAIL)

    # wheels, outer face just inside the body side
    yt = hw - v["tire_w"] / 2 - 15
    for xa, a in ((xa_f, "front"), (xa_r, "rear")):
        for s, n in ((1, "l"), (-1, "r")):
            tire, hub = _wheel(xa, s * yt, v["tire_r"], v["tire_w"])
            parts[f"tire_{a}_{n}"] = (tire, TIRE)
            parts[f"hub_{a}_{n}"] = (hub, HUB)

    # nose toward -X: turn 180 degrees about Z
    R = trimesh.transformations.rotation_matrix(np.pi, [0, 0, 1])
    for m, _ in parts.values():
        m.apply_transform(R)
    return parts


if __name__ == "__main__":
    for k in VEHICLES:
        ps = build(k)
        allv = np.vstack([m.vertices for m, _ in ps.values()])
        e = allv.max(0) - allv.min(0)
        print(k, "L x W x H mm:", np.round(e).tolist())
