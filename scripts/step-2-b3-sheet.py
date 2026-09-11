import os
from PIL import Image, ImageDraw, ImageFont

img_d100 = Image.open("artifacts/motion-lab/step-2-b3/desktop-1440-100.png")
img_d74 = Image.open("artifacts/motion-lab/step-2-b3/desktop-1440-74.png")
img_m100 = Image.open("artifacts/motion-lab/step-2-b3/mobile-390-100.png")

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
draw.text((36, 28), "SUB-STEP 2.B3: MULTI-TONE DRAFTING SURFACES & LUMINOUS AMBER CORE WASH", font=font_title, fill="#e8bb58")
draw.text((36, 58), "Eliminated flat monochrome paper fills; established 7-tier architectural surface depth & illuminated core presence", font=font_sub, fill="#95a2a6")

# Top row: 100% Drawing (left) & 74% Wavefront Wipe (right)
thumb_100 = img_d100.resize((920, 575), Image.Resampling.LANCZOS)
sheet.paste(thumb_100, (36, 95))
draw.rectangle([35, 94, 956, 671], outline="#2a383d", width=1)
draw.text((36, 679), "DESKTOP 100% DRAWING: Multi-Tone Drafting Surfaces (Foreground White, Ceramic, Amber Core Wash, Rear Depth)", font=font_body, fill="#b5c4c9")

thumb_74 = img_d74.resize((920, 575), Image.Resampling.LANCZOS)
sheet.paste(thumb_74, (966, 95))
draw.rectangle([965, 94, 1886, 671], outline="#2a383d", width=1)
draw.text((966, 679), "DESKTOP 74% WAVEFRONT: Dynamic diagonal split between dark PBR shadows and multi-tone drafting linework", font=font_body, fill="#b5c4c9")

# Bottom row: 300% Zoom crops
# Zoom 1: Amber Core Wash & Emitter Bars (X: 920..1060, Y: 380..520)
crop1 = img_d100.crop((920, 380, 1060, 520))
zoom1 = crop1.resize((380, 310), Image.Resampling.NEAREST)
sheet.paste(zoom1, (36, 715))
draw.rectangle([35, 714, 416, 1026], outline="#e8bb58", width=2)
draw.text((36, 1034), "300% Zoom: Luminous Amber Core Wash (#f6e1be) & Signal Inks", font=font_sub, fill="#e8bb58")

# Zoom 2: Front Shell vs Ceramic Frame (X: 520..740, Y: 460..680)
crop2 = img_d100.crop((520, 460, 740, 680))
zoom2 = crop2.resize((450, 310), Image.Resampling.NEAREST)
sheet.paste(zoom2, (446, 715))
draw.rectangle([445, 714, 896, 1026], outline="#e8bb58", width=2)
draw.text((446, 1034), "300% Zoom: Foreground Shell (#faf8f3) vs Ceramic Frame (#ede8dc)", font=font_sub, fill="#e8bb58")

# Zoom 3: Rear Chassis & Stepped Depth (X: 1140..1380, Y: 220..460)
crop3 = img_d100.crop((1140, 220, 1380, 460))
zoom3 = crop3.resize((450, 310), Image.Resampling.NEAREST)
sheet.paste(zoom3, (926, 715))
draw.rectangle([925, 714, 1376, 1026], outline="#2a383d", width=1)
draw.text((926, 1034), "300% Zoom: Rear Chassis Shading (#e8e2d4) & Copper Routes (#efe6d7)", font=font_sub, fill="#95a2a6")

# Specification box
draw.rectangle([1406, 714, 1886, 1045], outline="#3d5259", width=1)
specs = [
    "DRAFTING SURFACE COLOR PALETTE",
    "",
    "Background Paper:  #f2efe7 (0.949, 0.937, 0.906)",
    "Front Outer Shell: #faf8f3 (0.980, 0.973, 0.953)",
    "Ceramic Frame:     #ede8dc (0.929, 0.910, 0.863)",
    "Core Housing:      #e8e2d4 (0.910, 0.886, 0.831)",
    "Structural Truss:  #e2ded2 (0.886, 0.871, 0.824)",
    "Copper Routes:     #efe6d7 (0.937, 0.902, 0.843)",
    "Aperture Inlay:    #f7ebd8 (0.969, 0.922, 0.847)",
    "Amber Core Emitter:#f6e1be (0.965, 0.882, 0.745)",
    "",
    "Dark Mode (0-61%): 100% original PBR lighting",
    "Wavefront (61-88%):1.5px smoothstep antialiasing",
]
y_spec = 726
for line in specs:
    draw.text((1420, y_spec), line, font=font_spec, fill="#e8bb58" if "Amber Core" in line or "DRAFTING" in line else "#d6e2e6" if "#" in line else "#8ba0a6")
    y_spec += 16

sheet.save("artifacts/motion-lab/step-2-b3/multitone-surfaces-review.png")
print("Review sheet saved: artifacts/motion-lab/step-2-b3/multitone-surfaces-review.png")
