"""Generic display vehicles for the shop preview (no brand styling or logos).

Sizes follow the two US best-sellers in their class (2025 sales):
  suv   - mid-size SUV, Toyota RAV4 size (2026 LE/XLE): 180.9 x 73.0 x 67.0 in, 105.9 in wheelbase
  truck - full-size pickup, Ford F-150 SuperCrew 5.5 ft box size (2026, 4x4):
          232.0 x 79.9 (95.7 with mirrors) x 77.1 in, 145.4 in wheelbase

Shapes are lofted from rounded cross-sections (a body that narrows toward the top and the
ends, a glass greenhouse with pillars and a roof skin, bumpers, grille, lights, mirrors,
rimmed wheels in cut-out wheel arches), so they read as real vehicles while staying
generic and small.

Frame matches colibri_geometry.py: mm, X = along the lane, Y = across, Z = up, floor at 0.
Vehicles are built nose toward +X, then turned so the nose points to -X (the direction a
vehicle drives through the lane in the app).
"""
import numpy as np
import trimesh

IN = 25.4
GLASS = [24, 32, 42, 255]
TIRE = [24, 24, 24, 255]
RIM = [120, 126, 133, 255]     # rim disc
SPOKE = [196, 200, 205, 255]
TRIM = [38, 40, 43, 255]      # bumpers, grille, mirror arms
HEAD = [236, 236, 228, 255]
TAIL = [184, 22, 28, 255]

VEHICLES = {
    "suv": dict(
        label="Mid-size SUV (Toyota RAV4 size)", color=[160, 30, 38, 255],
        L=180.9 * IN, W=73.0 * IN, H=67.0 * IN, WB=105.9 * IN, front_oh=900,
        tire_r=362, tire_w=225, clearance=200, mirrors=0),
    "truck": dict(
        label="Full-size pickup (Ford F-150 SuperCrew size)", color=[62, 72, 86, 255],
        L=232.0 * IN, W=79.9 * IN, H=77.1 * IN, WB=145.4 * IN, front_oh=1000,
        tire_r=407, tire_w=275, clearance=240, mirrors=95.7 * IN),
}


# ---------- shape helpers ----------

def ring(hw_bot, hw_top, zb, zt, r, n=7):
    """Rounded section in (y, z) that narrows from hw_bot at the bottom to hw_top at the top."""
    h = max(zt - zb, 12.0)
    zt = zb + h
    r = max(min(r, hw_bot * 0.9, h * 0.48), 2.0)
    pts = []
    for cy, cz, a0, a1 in ((hw_bot - r, zb + r, -90, 0), (hw_bot - r, zt - r, 0, 90),
                           (-hw_bot + r, zt - r, 90, 180), (-hw_bot + r, zb + r, 180, 270)):
        for a in np.radians(np.linspace(a0, a1, n)):
            pts.append((cy + r * np.cos(a), cz + r * np.sin(a)))
    pts = np.array(pts)
    pts[:, 0] *= 1 + (hw_top / hw_bot - 1) * (pts[:, 1] - zb) / h      # tumblehome
    return pts


def loft(xs, rings):
    """Closed mesh through same-sized rings placed at stations xs along X (end caps fanned)."""
    m = len(rings[0])
    V = np.vstack([np.column_stack([np.full(m, x), r[:, 0], r[:, 1]]) for x, r in zip(xs, rings)])
    F = []
    for i in range(len(xs) - 1):
        a, b = i * m, (i + 1) * m
        for j in range(m):
            j2 = (j + 1) % m
            F += [[a + j, b + j, b + j2], [a + j, b + j2, a + j2]]
    for i, flip in ((0, True), (len(xs) - 1, False)):
        c = len(V)
        V = np.vstack([V, V[i * m:(i + 1) * m].mean(0)])
        for j in range(m):
            f = [c, i * m + (j + 1) % m, i * m + j]
            F.append(f[::-1] if flip else f)
    mesh = trimesh.Trimesh(V, np.array(F), process=True)
    trimesh.repair.fix_normals(mesh)
    return mesh


def beam(p0, p1, w, t):
    """Box of cross-section w x t running from p0 to p1 (pillars, spokes)."""
    p0, p1 = np.asarray(p0, float), np.asarray(p1, float)
    d = p1 - p0
    b = trimesh.creation.box(extents=[w, t, np.linalg.norm(d)])
    b.apply_transform(trimesh.geometry.align_vectors([0, 0, 1], d / np.linalg.norm(d)))
    b.apply_translation((p0 + p1) / 2)
    return b


def rbox(x0, x1, hw, zb, zt, r):
    """Rounded box from x0 to x1, half-width hw, z from zb to zt."""
    return loft([x0, x1], [ring(hw, hw, zb, zt, r)] * 2)


def cyl_y(rad, width, x, y, z, sections=40):
    c = trimesh.creation.cylinder(radius=rad, height=width, sections=sections)
    c.apply_transform(trimesh.transformations.rotation_matrix(np.pi / 2, [1, 0, 0]))
    c.apply_translation([x, y, z])
    return c


def wheel(x, y, side, r, w):
    """Tire, rim, five spokes and hub centred at (x, y); side = +1 / -1 for left / right."""
    face = y + side * w / 2
    parts = {"tire": (cyl_y(r, w, x, y, r), TIRE),
             "rim": (cyl_y(r * 0.63, 14, x, face + side * 2, r), RIM),
             "hub": (cyl_y(r * 0.16, 30, x, face + side * 10, r, 16), SPOKE)}
    for k in range(5):
        a = 2 * np.pi * k / 5
        p0 = [x, face + side * 9, r]
        p1 = [x + r * 0.58 * np.cos(a), face + side * 9, r + r * 0.58 * np.sin(a)]
        parts[f"spoke{k}"] = (beam(p0, p1, 40, 14), SPOKE)
    return parts


def prof(xn, pts):
    """Piecewise-linear profile value at normalised position xn (0 = rear, 1 = front)."""
    a = np.array(pts, float)
    return np.interp(xn, a[:, 0], a[:, 1])


# ---------- vehicles ----------

def build(kind):
    """Return {part_name: (mesh, rgba)} for one vehicle (nose toward -X)."""
    v = VEHICLES[kind]
    L, W, H, c, col = v["L"], v["W"], v["H"], v["clearance"], v["color"]
    hw = W / 2
    X = lambda xn: -L / 2 + xn * L
    r_t = v["tire_r"]
    xa_f = L / 2 - v["front_oh"]
    xa_r = xa_f - v["WB"]
    parts = {}

    if kind == "suv":
        belt = 1060
        bottom = [(0, c + 170), (0.06, c + 70), (0.94, c + 70), (1, c + 230)]
        top = [(0, 980), (0.03, 1040), (0.1, belt + 10), (0.72, belt), (0.8, 930), (0.95, 860), (1, 760)]
        plan = [(0, 0.88), (0.05, 0.97), (0.15, 1.0), (0.85, 1.0), (0.95, 0.95), (1, 0.84)]
        body_from = 0.0
        gh_x = (0.075, 0.725)                   # rear glass base .. windshield base
        roof = [(0.075, belt + 15), (0.13, H - 25), (0.6, H - 25), (0.725, belt + 15)]
        roof_skin = (0.12, 0.61)
        pillars = [0.075, 0.42, 0.725]          # rear / middle / windshield
        tail_z = (760, 1020)
    else:
        belt = 1330
        bottom = [(0, c + 260), (0.04, c + 110), (0.95, c + 110), (1, c + 300)]
        top = [(0.385, belt), (0.66, belt), (0.72, 1270), (0.9, 1235), (1, 1150)]
        plan = [(0.385, 1.0), (0.85, 1.0), (0.95, 0.97), (1, 0.9)]
        body_from = 0.385                       # cab + front; the bed is built separately
        gh_x = (0.40, 0.665)
        roof = [(0.40, belt + 15), (0.415, H - 25), (0.56, H - 25), (0.665, belt + 15)]
        roof_skin = (0.41, 0.565)
        pillars = [0.40, 0.53, 0.665]
        tail_z = (920, 1340)

    xs_n = np.linspace(body_from, 1, 34)
    inset = lambda xn: X(xn) + (25 if xn <= 0 else -25 if xn >= 1 else 0)
    body = loft([inset(x) for x in xs_n],
                [ring(hw * prof(x, plan), hw * prof(x, plan) * 0.95, prof(x, bottom), prof(x, top), 120)
                 for x in xs_n])

    if kind == "truck":   # bed: floor box, two side walls, tailgate, front wall
        bed_floor, rail, t = c + 640, 1380, 75
        bx0, bx1 = X(0.0), X(0.385) + 20
        body = trimesh.util.concatenate([body, rbox(bx0 + 25, bx1, hw * 0.99, c + 110, bed_floor, 60)])
        for s, n in ((1, "l"), (-1, "r")):
            wall = loft([bx0, bx1], [ring(t / 2, t / 2, bed_floor - 40, rail, 20)] * 2)
            wall.apply_translation([0, s * (hw - t / 2), 0])
            parts[f"bed_wall_{n}"] = (wall, col)
        parts["tailgate"] = (rbox(bx0 + 10, bx0 + 80, hw, bed_floor - 40, rail, 20), col)
        parts["bed_front"] = (rbox(bx1 - 90, bx1 - 20, hw, bed_floor - 40, rail, 20), col)

    # wheel arches cut out of the body (and the bed walls)
    arches = [cyl_y(r_t + 55, W + 200, xa, 0, r_t) for xa in (xa_f, xa_r)]
    def cut(m):
        try:
            return trimesh.boolean.difference([m] + arches, engine="manifold")
        except Exception:
            return m
    parts["body"] = (cut(body), col)
    for k in [k for k in parts if k.startswith("bed_wall")]:
        parts[k] = (cut(parts[k][0]), col)

    # glass greenhouse: narrower than the body, leaning in toward the roof
    gx = np.linspace(gh_x[0], gh_x[1], 22)
    gh_b, gh_t = hw * 0.93, hw * 0.78
    parts["glass"] = (loft([X(x) for x in gx], [ring(gh_b, gh_t, belt - 20, prof(x, roof), 90) for x in gx]), GLASS)

    # roof skin and pillars over the glass
    rx = np.linspace(roof_skin[0], roof_skin[1], 8)
    parts["roof"] = (loft([X(x) for x in rx], [ring(gh_t + 18, gh_t + 8, H - 32, H, 30)] * len(rx)), col)
    for s, n in ((1, "l"), (-1, "r")):
        for i, pn in enumerate(pillars):
            xt = X(roof_skin[0]) if i == 0 else X(roof_skin[1]) if i == 2 else X(pn)
            p0 = [X(pn), s * (gh_b + 6), belt - 10]
            p1 = [xt, s * (gh_t + 10), H - 30]
            parts[f"pillar_{i}_{n}"] = (beam(p0, p1, 85 if i != 1 else 70, 26), col)

    # bumpers, grille, lights
    bzf, bzr, nose_top = prof(1, bottom), prof(0, bottom), prof(1, top)
    parts["bumper_front"] = (rbox(X(1) - 240, X(1), hw * 0.92, bzf - 40, bzf + 230, 70), TRIM)
    parts["bumper_rear"] = (rbox(X(0), X(0) + 220, hw * 0.92, bzr - 40, bzr + 210, 70), TRIM)
    if kind == "suv":
        parts["grille"] = (rbox(X(1) - 50, X(1) - 8, hw * 0.42, bzf + 250, nose_top - 120, 40), TRIM)
        lz = (nose_top - 150, nose_top - 40)
    else:
        parts["grille"] = (rbox(X(1) - 52, X(1) - 8, hw * 0.62, bzf + 260, nose_top - 70, 50), TRIM)
        lz = (nose_top - 260, nose_top - 80)
    for s, n in ((1, "l"), (-1, "r")):
        hwf, hwr = hw * prof(1, plan), hw * prof(0 if kind == "suv" else 0.385, plan)
        y0, y1 = sorted((s * hwf * 0.52, s * hwf * 0.9))
        parts[f"headlight_{n}"] = (trimesh.creation.box(bounds=[[X(1) - 46, y0, lz[0]], [X(1) - 4, y1, lz[1]]]), HEAD)
        y0, y1 = sorted((s * hwr * 0.6, s * hwr * 0.92))
        parts[f"taillight_{n}"] = (trimesh.creation.box(bounds=[[X(0) + 4, y0, tail_z[0]], [X(0) + 40, y1, tail_z[1]]]), TAIL)

    # mirrors (the pickup's stated width includes them)
    mw = (v["mirrors"] - W) / 2 if v["mirrors"] else 150
    mx = X(gh_x[1]) - 120
    for s, n in ((1, "l"), (-1, "r")):
        y0, y1 = sorted((s * (hw - 20), s * (hw + mw)))
        parts[f"mirror_{n}"] = (trimesh.creation.box(bounds=[[mx - 110, y0, belt + 30], [mx + 50, y1, belt + 230]]), col)
        y0, y1 = sorted((s * (hw - 5), s * (hw + mw * 0.4)))
        parts[f"mirror_arm_{n}"] = (trimesh.creation.box(bounds=[[mx - 60, y0, belt + 80], [mx, y1, belt + 130]]), TRIM)

    # wheels, outer face just inside the body side
    yw = hw - v["tire_w"] / 2 - 20
    for xa, a in ((xa_f, "front"), (xa_r, "rear")):
        for s, n in ((1, "l"), (-1, "r")):
            for pname, (m, pc) in wheel(xa, s * yw, s, r_t, v["tire_w"]).items():
                parts[f"{pname}_{a}_{n}"] = (m, pc)

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
        print(k, "L x W x H mm:", np.round(e).tolist(), "parts", len(ps),
              "faces", sum(len(m.faces) for m, _ in ps.values()),
              "body watertight", ps["body"][0].is_watertight)
