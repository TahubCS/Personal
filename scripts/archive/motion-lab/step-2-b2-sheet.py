import os
from PIL import Image, ImageDraw, ImageFont

img_d = Image.open("artifacts/motion-lab/step-2-b2/desktop-1440-100.png")
img_m = Image.open("artifacts/motion-lab/step-2-b2/mobile-390-100.png")
img_t = Image.open("artifacts/motion-lab/step-2-b2/tablet-768-100.png")

# Sheet dimensions
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

# Title
draw.text((36, 28), "SUB-STEP 2.B2: AUTHENTIC CAD LEADER CALLOUTS & TECHNICAL DATUM BLOCK", font=font_title, fill="#e8bb58")
draw.text((36, 58), "ISO 128-30 dogleg leaders, component target termini, amber core accent dot & responsive collapse", font=font_sub, fill="#95a2a6")

# Top row views: Desktop (left), Tablet (center), Mobile (right)
# Scale desktop to fit 900x562
thumb_d = img_d.resize((900, 562), Image.Resampling.LANCZOS)
sheet.paste(thumb_d, (36, 95))
draw.rectangle([35, 94, 936, 658], outline="#2a383d", width=1)
draw.text((36, 666), "DESKTOP (1440x900): 4 CAD Leader Callouts (Front Shroud, Ceramic, Amber Core, Conductor) + Datum Block", font=font_body, fill="#b5c4c9")

# Scale tablet to fit 420x560
thumb_t = img_t.resize((420, 560), Image.Resampling.LANCZOS)
sheet.paste(thumb_t, (960, 95))
draw.rectangle([959, 94, 1381, 656], outline="#2a383d", width=1)
draw.text((960, 666), "TABLET (768x1024): Adaptive Spacing", font=font_body, fill="#b5c4c9")

# Scale mobile to fit 260x562
thumb_m = img_m.resize((260, 562), Image.Resampling.LANCZOS)
sheet.paste(thumb_m, (1410, 95))
draw.rectangle([1409, 94, 1671, 658], outline="#2a383d", width=1)
draw.text((1410, 666), "MOBILE (390x844): Uncluttered 2-Tier", font=font_body, fill="#b5c4c9")

# Bottom row: Detail zoom crops
# Zoom 1: Callout 01 (Front Shroud dot + dogleg) from Desktop (X: 470..670, Y: 600..740)
crop1 = img_d.crop((460, 590, 670, 740))
zoom1 = crop1.resize((450, 310), Image.Resampling.NEAREST)
sheet.paste(zoom1, (36, 715))
draw.rectangle([35, 714, 486, 1026], outline="#e8bb58", width=2)
draw.text((36, 1034), "250% Zoom: Callout 01 (Terminus dot on shroud bevel + 45 deg dogleg)", font=font_sub, fill="#e8bb58")

# Zoom 2: Callout 03 (Amber Core amber dot + elevated dogleg) from Desktop (X: 850..1050, Y: 290..440)
crop2 = img_d.crop((850, 290, 1050, 440))
zoom2 = crop2.resize((450, 310), Image.Resampling.NEAREST)
sheet.paste(zoom2, (510, 715))
draw.rectangle([509, 714, 961, 1026], outline="#e8bb58", width=2)
draw.text((510, 1034), "250% Zoom: Callout 03 (Warm amber dot on emitter + 37px rail clearance)", font=font_sub, fill="#e8bb58")

# Zoom 3: Datum Block detail
crop3 = img_d.crop((1160, 760, 1420, 890))
zoom3 = crop3.resize((380, 190), Image.Resampling.NEAREST)
sheet.paste(zoom3, (990, 715))
draw.rectangle([989, 714, 1371, 906], outline="#2a383d", width=1)
draw.text((990, 916), "Detail: ISO 128-30 Technical Datum Block", font=font_sub, fill="#95a2a6")

# Specification box
draw.rectangle([1400, 714, 1880, 1045], outline="#3d5259", width=1)
specs = [
    "CAD LEADER CALLOUT CRAFT SPECS",
    "",
    "Callout 01: 01 / FRONT SHROUD",
    "  Terminus: 2.5px solid dot on front rim bevel",
    "  Stalk: 45 deg dogleg leading down-left",
    "",
    "Callout 02: 02 / CERAMIC FRAME",
    "  Terminus: 2.5px solid dot on lower spacer pin",
    "  Stalk: 45 deg dogleg leading down-left",
    "",
    "Callout 03: 03 / AMBER CORE",
    "  Terminus: Warm amber dot (#b87428) on core",
    "  Stalk: 120px elevated leader (37px rail margin)",
    "",
    "Callout 04: 04 / CONDUCTOR ARRAY",
    "  Terminus: 2.5px solid dot on copper bus terminal",
    "  Stalk: 45 deg dogleg leading up-right",
    "",
    "Datum Block: SCALE 1:1 . ISO 128-30 . 16MM GRID",
    "Responsive: Mobile collapses to Callout 01 + 04",
]
y_spec = 726
for line in specs:
    draw.text((1416, y_spec), line, font=font_spec, fill="#d6e2e6" if line.startswith("Callout") or line.startswith("CAD") else "#8ba0a6")
    y_spec += 16

sheet.save("artifacts/motion-lab/step-2-b2/cad-callouts-review.png")
print("Sheet generated: artifacts/motion-lab/step-2-b2/cad-callouts-review.png")
