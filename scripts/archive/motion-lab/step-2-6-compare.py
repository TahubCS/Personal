import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

base = Path('artifacts/motion-lab')
dir_2_5 = base / 'step-2-5'
dir_2_6 = base / 'step-2-6'

try:
    font = ImageFont.truetype('C:/Windows/Fonts/consola.ttf', 17)
    font_bold = ImageFont.truetype('C:/Windows/Fonts/consolab.ttf', 19)
    font_title = ImageFont.truetype('C:/Windows/Fonts/consolab.ttf', 24)
except Exception:
    font = ImageFont.load_default()
    font_bold = font
    font_title = font

# 1. Detailed side-by-side comparison: Step 2.5 vs Step 2.6 at 76% scroll
im_2_5 = Image.open(dir_2_5 / 'desktop-1440-76.png').convert('RGB')
im_2_6 = Image.open(dir_2_6 / 'desktop-1440-76.png').convert('RGB')

# Center around diff bbox: (742, 474, 869, 619) -> center is (805, 546)
crop_w, crop_h = 200, 240
cx, cy = 805, 546
crop_box = (cx - crop_w // 2, cy - crop_h // 2, cx + crop_w // 2, cy + crop_h // 2)

crop_2_5 = im_2_5.crop(crop_box)
crop_2_6 = im_2_6.crop(crop_box)

zoom_scale = 2.8
zoom_w = int(crop_w * zoom_scale)  # 560
zoom_h = int(crop_h * zoom_scale)  # 672

zoom_2_5 = crop_2_5.resize((zoom_w, zoom_h), Image.Resampling.NEAREST)
zoom_2_6 = crop_2_6.resize((zoom_w, zoom_h), Image.Resampling.NEAREST)

# Canvas: 1920 x 940
comp = Image.new('RGB', (1920, 940), '#111719')
cdraw = ImageDraw.Draw(comp)

cdraw.text((40, 25), 'SUB-STEP 2.5 vs 2.6: LEADING-EDGE DRAFTING ACCENT & SUB-PIXEL ANTI-ALIASING', fill='#e4b46b', font=font_title)
cdraw.text((40, 60), 'Comparison at 76% Scroll Progress (Desktop 1440x900) - 280% Pixel Magnification', fill='#8ea3ad', font=font)

# Overview full frame thumbnail
overview_w, overview_h = 480, 300
overview = im_2_6.resize((overview_w, overview_h), Image.Resampling.LANCZOS)
comp.paste(overview, (40, 110))
cdraw.rectangle([40, 110, 40 + overview_w, 110 + overview_h], outline='#37494f', width=1)

# Draw box on overview showing crop region
box_left = 40 + int(crop_box[0] * (overview_w / 1440))
box_top = 110 + int(crop_box[1] * (overview_h / 900))
box_right = 40 + int(crop_box[2] * (overview_w / 1440))
box_bottom = 110 + int(crop_box[3] * (overview_h / 900))
cdraw.rectangle([box_left, box_top, box_right, box_bottom], outline='#e4b46b', width=2)
cdraw.text((40, 425), 'Full Stage (76% Progress)', fill='#e4b46b', font=font_bold)
cdraw.text((40, 450), 'Yellow box indicates 280% magnification area', fill='#8ea3ad', font=font)

# Feature highlights below overview
info_y = 515
cdraw.text((40, info_y), 'KEY ENHANCEMENTS IN SUB-STEP 2.6:', fill='#e4b46b', font=font_bold)
cdraw.text((40, info_y + 30), '1. Sub-pixel Anti-Aliasing (fwidth):', fill='#ffffff', font=font_bold)
cdraw.text((60, info_y + 55), 'Eliminated jagged staircase raster stepping along the cut line', fill='#8ea3ad', font=font)
cdraw.text((60, info_y + 78), 'Uses smoothstep across 1.5px sub-pixel window', fill='#8ea3ad', font=font)
cdraw.text((40, info_y + 115), '2. Warm Amber Leading-Edge Drafting Rule:', fill='#ffffff', font=font_bold)
cdraw.text((60, info_y + 140), '1.2px accent stroke (#b87428) along wavefront gives tactile rule', fill='#8ea3ad', font=font)
cdraw.text((60, info_y + 163), 'Ties visually to System Core illuminated amber crystal inlay', fill='#8ea3ad', font=font)
cdraw.text((40, info_y + 200), '3. Reversibility & Clean End-States:', fill='#ffffff', font=font_bold)
cdraw.text((60, info_y + 225), 'Leading-edge accent only active when 0.005 < uPaper < 0.995', fill='#8ea3ad', font=font)
cdraw.text((60, info_y + 248), 'Guarantees pure 3D at start (0%) and pure clean ink at 100%', fill='#8ea3ad', font=font)

# Side-by-side zoom crops
# Step 2.5 Zoom
x_2_5 = 620
y_zoom = 110
comp.paste(zoom_2_5, (x_2_5, y_zoom))
cdraw.rectangle([x_2_5, y_zoom, x_2_5 + zoom_w, y_zoom + zoom_h], outline='#37494f', width=2)
cdraw.text((x_2_5, y_zoom + zoom_h + 12), 'BEFORE: Step 2.5 (Aliased Cut)', fill='#e06c75', font=font_bold)
cdraw.text((x_2_5, y_zoom + zoom_h + 38), 'Raw step(proj, uPaper) causes aliasing on high-contrast edges', fill='#8ea3ad', font=font)

# Step 2.6 Zoom
x_2_6 = 1260
comp.paste(zoom_2_6, (x_2_6, y_zoom))
cdraw.rectangle([x_2_6, y_zoom, x_2_6 + zoom_w, y_zoom + zoom_h], outline='#e4b46b', width=2)
cdraw.text((x_2_6, y_zoom + zoom_h + 12), 'AFTER: Step 2.6 (Anti-Aliased + Amber Lead)', fill='#98c379', font=font_bold)
cdraw.text((x_2_6, y_zoom + zoom_h + 38), 'Smooth sub-pixel edge with 1.2px warm amber drafting rule', fill='#8ea3ad', font=font)

comp.save(dir_2_6 / 'substep-2-5-vs-2-6-detail.png')
print('Created substep-2-5-vs-2-6-detail.png')

# 2. Storyboard overview sheet
sheet = Image.new('RGB', (1920, 840), '#111719')
sdraw = ImageDraw.Draw(sheet)
sdraw.text((40, 25), 'SUB-STEP 2.6: ANTI-ALIASING & LEADING-EDGE DRAFTING ACCENT OVERVIEW', fill='#e4b46b', font=font_title)
sdraw.text((40, 60), 'Progress progression: 60% -> 68% -> 76% -> 84% -> 92% on Desktop (top) and Mobile (bottom)', fill='#8ea3ad', font=font)

desktop_steps = [60, 68, 76, 84, 92]
frame_w = 345
frame_h = 215

for i, p in enumerate(desktop_steps):
    x = 40 + i * (frame_w + 25)
    y = 105
    img = Image.open(dir_2_6 / f'desktop-1440-{p}.png').convert('RGB')
    thumb = img.resize((frame_w, frame_h), Image.Resampling.LANCZOS)
    sheet.paste(thumb, (x, y))
    sdraw.rectangle([x, y, x + frame_w, y + frame_h], outline='#283537', width=1)
    sdraw.text((x + 10, y + frame_h + 8), f'Desktop {p}% Scroll', fill='#e4b46b', font=font)

mob_w = 150
mob_h = 325
for i, p in enumerate(desktop_steps):
    x = 40 + i * (frame_w + 25) + 95
    y = 370
    img = Image.open(dir_2_6 / f'mobile-390-{p}.png').convert('RGB')
    thumb = img.resize((mob_w, mob_h), Image.Resampling.LANCZOS)
    sheet.paste(thumb, (x, y))
    sdraw.rectangle([x, y, x + mob_w, y + mob_h], outline='#283537', width=1)
    sdraw.text((x + 20, y + mob_h + 8), f'Mobile {p}%', fill='#e4b46b', font=font)

sheet.save(dir_2_6 / 'accent-transition-sheet.png')
print('Created accent-transition-sheet.png')

