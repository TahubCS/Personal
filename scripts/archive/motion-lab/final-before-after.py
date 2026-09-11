import os
from PIL import Image, ImageDraw, ImageFont

img_before = Image.open("artifacts/motion-lab/step-2-3/desktop-1440-100.png")
img_after = Image.open("artifacts/motion-lab/step-2-b3/desktop-1440-100.png")
img_wave = Image.open("artifacts/motion-lab/step-2-b3/desktop-1440-74.png")
img_mobile = Image.open("artifacts/motion-lab/step-2-b3/mobile-390-100.png")

sheet_w = 1920
sheet_h = 1080
sheet = Image.new("RGB", (sheet_w, sheet_h), "#111719")
draw = ImageDraw.Draw(sheet)

try:
    font_title = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 22)
    font_sub = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 15)
    font_body = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 14)
    font_spec = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 13)
except:
    font_title = ImageFont.load_default()
    font_sub = ImageFont.load_default()
    font_body = ImageFont.load_default()
    font_spec = ImageFont.load_default()

# Header
draw.text((36, 26), "SYSTEM CORE MOTION LAB: TECHNICAL DRAWING CRAFT ELEVATION (MILESTONE COMPLETE)", font=font_title, fill="#e8bb58")
draw.text((36, 56), "Direct comparison: Initial Flat Wireframe (Step 2 Baseline) vs Final Tactile Engineering Blueprint (Option B)", font=font_sub, fill="#95a2a6")

# Top row: Before vs After (side-by-side)
w_half = 900
h_half = 562

thumb_before = img_before.resize((w_half, h_half), Image.Resampling.LANCZOS)
sheet.paste(thumb_before, (36, 95))
draw.rectangle([35, 94, 936, 658], outline="#c94444", width=2)
draw.text((36, 666), "BEFORE (Step 2 Baseline): Flat plain paper, monochrome white fill, generic floating text, no grid or termini", font=font_body, fill="#e07070")

thumb_after = img_after.resize((w_half, h_half), Image.Resampling.LANCZOS)
sheet.paste(thumb_after, (984, 95))
draw.rectangle([983, 94, 1884, 658], outline="#52b788", width=2)
draw.text((984, 666), "AFTER (Option B Complete): Multi-tier drafting grid, 4 CAD leader callouts with target dots, multi-tone depth, amber core wash", font=font_body, fill="#74c69d")

# Bottom row: Wavefront (left), Mobile (center), Audit Scorecard (right)
# Wavefront
thumb_wave = img_wave.resize((560, 350), Image.Resampling.LANCZOS)
sheet.paste(thumb_wave, (36, 700))
draw.rectangle([35, 699, 596, 1051], outline="#2a383d", width=1)
draw.text((36, 1056), "Wavefront: 1.2px amber leading edge + fwidth AA", font=font_spec, fill="#b5c4c9")

# Mobile
thumb_m = img_mobile.resize((162, 350), Image.Resampling.LANCZOS)
sheet.paste(thumb_m, (636, 700))
draw.rectangle([635, 699, 798, 1051], outline="#2a383d", width=1)
draw.text((636, 1056), "Mobile: 2-tier diagonal framing", font=font_spec, fill="#b5c4c9")

# Audit & Craft Summary box
draw.rectangle([838, 699, 1884, 1051], outline="#3d5259", width=1)
draw.text((856, 715), "FINAL VERIFICATION & CRAFT SCORECARD", font=font_sub, fill="#e8bb58")

audit_lines = [
    ("Automated Suite:", "npm test (6/6 passed) · lab unit tests (8/8 passed) · check & lint clean (0 errors)"),
    ("Accessibility:", "Axe scans passed across Edge & Chrome on 4 viewports (0 violations at 0%, 75%, 100%, reduced)"),
    ("Motion Determinism:", "100% reversible (forward vs reverse scroll yields 0px drift; stopped pose is rock-solid)"),
    ("Choreography Rest:", "52-61% 3D exploded hold; 61-88% diagonal wipe wavefront; 88-100% drafting inspection hold"),
    ("Linework Hierarchy:", "4-tier line inks: primary #1a2226, secondary #425255, subdued #6f8285, amber signal #b87428"),
    ("Surfaces Hierarchy:", "7-tier fills: shell #faf8f3, ceramic #ede8dc, shadow #e8e2d4, copper #efe6d7, core wash #f6e1be"),
    ("CAD Callouts:", "4 ISO 128-30 dogleg leaders with target dots: Front Shroud, Ceramic, Amber Core, Conductor"),
    ("Video Recordings:", "system-core-scroll.webm (Desktop 1440x900) · system-core-mobile.webm (Mobile 390x844)"),
]

y_pos = 744
for label, val in audit_lines:
    draw.text((856, y_pos), label, font=font_spec, fill="#d6e2e6")
    draw.text((1026, y_pos), val, font=font_spec, fill="#8ba0a6" if not "passed" in val and not "webm" in val else "#a7c957")
    y_pos += 21

sheet.save("artifacts/motion-lab/final-drawing-elevation-storyboard.png")
print("Saved artifacts/motion-lab/final-drawing-elevation-storyboard.png")
