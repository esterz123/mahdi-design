"""Scene 'Or Atelier' : noeud de tore or champagne sur fond papier, boucle seamless.
Usage test : blender -b --python render_gold.py -- --mode still
Usage loop : blender -b --python render_gold.py -- --mode loop
"""
import bpy, sys, math, os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)))
PAPER = (0.980, 0.973, 0.945, 1.0)
GOLD = (0.784, 0.678, 0.525, 1.0)

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
MODE = "loop"
for i, a in enumerate(argv):
    if a == "--mode" and i + 1 < len(argv):
        MODE = argv[i + 1]

# --- reset ---
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.context.preferences.edit.keyframe_new_interpolation_type = "LINEAR"

def make_knot():
    # noeud de tore p=2 q=3 en courbe procedurale (aucune dependance)
    N, R, B, C, P, Q = 420, 1.55, 0.55, 0.55, 2, 3
    cu = bpy.data.curves.new("KnotCurve", type="CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = 0.46
    cu.bevel_resolution = 8
    spl = cu.splines.new("POLY")
    spl.points.add(N - 1)
    spl.use_cyclic_u = True
    for i in range(N):
        t = 2 * math.pi * i / N
        r = R + B * math.cos(Q * t)
        spl.points[i].co = (r * math.cos(P * t), r * math.sin(P * t), C * math.sin(Q * t), 1.0)
    o = bpy.data.objects.new("KnotOr", cu)
    bpy.context.collection.objects.link(o)
    o.location = (0, 0, 1.2)
    o.rotation_euler = (math.radians(90), 0, 0)
    return o

# --- objet : noeud / tore dore ---
knot = make_knot()
knot.name = "KnotOr"

mat = bpy.data.materials.new("OrChampagne")
mat.use_nodes = True
bsdf = mat.node_tree.nodes["Principled BSDF"]
bsdf.inputs["Base Color"].default_value = (0.66, 0.46, 0.24, 1.0)
bsdf.inputs["Metallic"].default_value = 1.0
bsdf.inputs["Roughness"].default_value = 0.22
knot.data.materials.append(mat)

# --- sol papier reel (balaye studio infini) ---
bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 0, 0))
sol = bpy.context.active_object
sol.name = "Sol"
solmat = bpy.data.materials.new("PapierSol")
solmat.use_nodes = True
solmat.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = PAPER
solmat.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 1.0
sol.data.materials.append(solmat)

# --- softbox : cartes de reflexion pour l'or ---
def softbox(name, loc, rot, energy, color, sx=6, sy=4):
    bpy.ops.mesh.primitive_plane_add(size=1, location=loc, rotation=rot)
    o = bpy.context.active_object
    o.name = name
    o.scale = (sx, sy, 1)
    m = bpy.data.materials.new(name + "M")
    m.use_nodes = True
    e = m.node_tree.nodes.new("ShaderNodeEmission")
    e.inputs[0].default_value = color
    e.inputs[1].default_value = energy
    out = m.node_tree.nodes["Material Output"]
    m.node_tree.links.new(e.outputs[0], out.inputs[0])
    o.data.materials.append(m)
    o.hide_render = False
    return o

softbox("SoftG", (-7, -1, 5), (math.radians(60), 0, math.radians(80)), 30.0, (1.0, 0.95, 0.88, 1.0))
softbox("SoftD", (7, -2, 4), (math.radians(65), 0, math.radians(-75)), 20.0, (0.95, 0.97, 1.0, 1.0))
softbox("SoftH", (0, 1, 10), (0, 0, 0), 40.0, (1.0, 1.0, 1.0, 1.0), 10, 6)

# --- monde papier ---
world = bpy.data.worlds.new("Papier")
world.use_nodes = True
world.node_tree.nodes["Background"].inputs[0].default_value = PAPER
world.node_tree.nodes["Background"].inputs[1].default_value = 1.0
bpy.context.scene.world = world

# --- lumieres ---
bpy.ops.object.light_add(type="SUN", location=(4, -3, 8))
sun = bpy.context.active_object
sun.data.energy = 3.0
bpy.ops.object.light_add(type="AREA", location=(-5, -4, 6))
key = bpy.context.active_object
key.data.energy = 900
key.data.size = 5
bpy.ops.object.light_add(type="AREA", location=(5, 4, 3))
rim = bpy.context.active_object
rim.data.energy = 350
rim.data.size = 3
rim.data.color = (1.0, 0.92, 0.78)

# --- camera ---
bpy.ops.object.camera_add(location=(0, -8.6, 3.4))
cam = bpy.context.active_object
bpy.context.scene.camera = cam
bpy.ops.object.empty_add(location=(0, 0, 1.1))
tgt = bpy.context.active_object
c = cam.constraints.new("TRACK_TO")
c.target = tgt
c.track_axis = "TRACK_NEGATIVE_Z"
c.up_axis = "UP_Y"

# --- boucle seamless : rotation 360 du noeud ---
sc = bpy.context.scene
sc.frame_start = 1
sc.frame_end = 96
knot.rotation_euler[2] = 0
knot.keyframe_insert(data_path="rotation_euler", frame=1)
knot.rotation_euler[2] = math.radians(360)
knot.keyframe_insert(data_path="rotation_euler", frame=96)

# --- moteur Cycles GPU (l'or a besoin de vrais rebonds) ---
sc.render.engine = "CYCLES"
try:
    cp = bpy.context.preferences.addons["cycles"].preferences
    cp.compute_device_type = "OPTIX"
    cp.get_devices()
    for d in cp.devices:
        d.use = (d.type == "GPU")
    sc.cycles.device = "GPU"
except Exception as e:
    print("GPU Cycles indisponible, CPU :", e)
sc.cycles.samples = 96
sc.cycles.use_denoising = True
sc.cycles.denoiser = "OPTIX"
sc.render.film_transparent = False

if MODE == "still":
    sc.render.resolution_x = 1280
    sc.render.resolution_y = 800
    sc.render.resolution_percentage = 100
    sc.frame_set(1)
    sc.render.filepath = os.path.join(OUT, "preview.png")
    sc.render.image_settings.file_format = "PNG"
    bpy.ops.render.render(write_still=True)
else:
    sc.render.resolution_x = 1280
    sc.render.resolution_y = 720
    sc.render.resolution_percentage = 100
    sc.render.filepath = os.path.join(OUT, "frames", "hero-gold-")
    sc.render.image_settings.file_format = "PNG"
    bpy.ops.render.render(animation=True)

print("RENDER-OK", MODE)
