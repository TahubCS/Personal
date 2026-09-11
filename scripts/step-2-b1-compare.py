import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

base = Path('artifacts/motion-lab')
dir_before = base / 'step-2-8'
dir_after = base / 'step-2-b1'

try:
    font = ImageFont.truetype('C:/Windows/Fonts/consola.ttf', 16)
    font_bold = ImageFont.truetype('C:/Windows/Fonts/consolab.ttf', 18)
    font_title = ImageFont.truetype('C:/Windows/Fonts/consolab.ttf', 24)
except Exception:
    font = ImageFont.load_default()
    font_bold = font
    font_title = font

sheet = Image.new('RGB', (1920, 1080), '#111719')
draw = ImageDraw.Draw(sheet)

draw.text((40, 25), 'SUB-STEP 2.B1: BLUEPRINT DRAFTING GRID & ARCHITECTURAL DATUM MARKS', fill='#e4b46b', font=font_title)
draw.text((40, 60), 'Elevating technical drawing craft: 16mm sub-grid, 64mm major grid, inner drafting border & corner crosshairs', fill='#8ea3ad', font=font)

# Top row: Before vs After at 100% Desktop
# Before: artifacts/motion-lab/step-2-7/desktop-1440-fwd-100.png
im_before_100 = Image.open(base / 'step-2-7' / 'desktop-1440-fwd-100.png').convert('RGB')
im_after_100 = Image.open(dir_after / 'desktop-1440-100.png').convert('RGB')

fw, fh = 580, 360
sheet.paste(im_before_100.resize((fw, fh), Image.Resampling.LANCZOS), (40, 110))
draw.rectangle([40, 110, 40 + fw, 110 + fh], outline='#37494f', width=1)
draw.text((40, 110 + fh + 10), 'BEFORE (Flat plain paper #f2efe7, no grid texture)', fill='#e06c75', font=font_bold)

sheet.paste(im_after_100.resize((fw, fh), Image.Resampling.LANCZOS), (660, 110))
draw.rectangle([660, 110, 660 + fw, 110 + fh], outline='#e4b46b', width=1)
draw.text((660, 110 + fh + 10), 'AFTER: Sub-step 2.B1 (Multi-tier drafting grid + inner border + corner datums)', fill='#98c379', font=font_bold)

# Mobile 100% after
im_mob_after = Image.open(dir_after / 'mobile-390-100.png').convert('RGB')
mw, mh = 160, 360
sheet.paste(im_mob_after.resize((mw, mh), Image.Resampling.LANCZOS), (1280, 110))
draw.rectangle([1280, 110, 1280 + mw, 110 + mh], outline='#e4b46b', width=1)
draw.text((1280, 110 + mh + 10), 'Mobile 100%', fill='#e4b46b', font=font_bold)

# Mid-wipe at 74%: showing grid unrolling with the diagonal paper wipe
im_after_74 = Image.open(dir_after / 'desktop-1440-74.png').convert('RGB')
sheet.paste(im_after_74.resize((400, 250), Image.Resampling.LANCZOS), (1480, 110))
draw.rectangle([1480, 110, 1480 + 400, 110 + 250], outline='#37494f', width=1)
draw.text((1480, 110 + 250 + 10), 'Mid-Wipe (74%): Grid unrolls with wavefront', fill='#e4b46b', font=font_bold)

# Bottom row: Zoom crops
y_zoom = 540
draw.text((40, y_zoom), 'DETAIL INSPECTION: 250% MAGNIFICATION OF DRAFTING GRID & LINELINE INTERACTION', fill='#e4b46b', font=font_bold)

# Crop around center core on After 100%: x: 700..1050, y: 300..550
crop_a100 = im_after_100.crop((700, 250, 1050, 500))
ca_w, ca_h = 700, 320
sheet.paste(crop_a100.resize((ca_w, ca_h), Image.Resampling.NEAREST), (40, y_zoom + 35))
draw.rectangle([40, y_zoom + 35, 40 + ca_w, y_zoom + 35 + ca_h], outline='#e4b46b', width=2)
draw.text((40, y_zoom + 35 + ca_h + 10), '250% Zoom: Subtle 16px/64px drafting grid provides authentic CAD drafting depth behind components', fill='#ffffff', font=font_bold)

# Crop showing top-left corner datum "+" and inner border: x: 0..200, y: 0..150
crop_datum = im_after_100.crop((0, 0, 180, 130))
cd_w, cd_h = 360, 260
sheet.paste(crop_datum.resize((cd_w, cd_h), Image.Resampling.NEAREST), (780, y_zoom + 35))
draw.rectangle([780, y_zoom + 35, 780 + cd_w, y_zoom + 35 + cd_h], outline='#e4b46b', width=2)
draw.text((780, y_zoom + 35 + cd_h + 10), 'Corner registration "+" and inner border line', fill='#ffffff', font=font_bold)

# Specs card
card_x = 1180
card_y = y_zoom + 35
card_w = 700
card_h = 320
draw.rectangle([card_x, card_y, card_x + card_w, card_y + card_h], outline='#98c379', width=2)
draw.text((card_x + 25, card_y + 20), 'TECHNICAL CRAFT SPECIFICATIONS (Step 2.B1)', fill='#98c379', font=font_bold)

specs = [
    ('Multi-Tier Grid', '16px sub-grid (3.5% ink) / 64px major grid (7.5% ink)'),
    ('Color Tuning', 'var(--ink) rgba(23, 33, 36) on var(--paper) #f2efe7'),
    ('Inner Border', '14px inset, 1px solid rgba(23, 33, 36, 0.07)'),
    ('Datum Crosshairs', '4 corner "+" registration marks (11px mono, 25% opacity)'),
    ('Wavefront Clipping', '100% synchronized via clip-path: var(--paper-clip)'),
    ('Dark Mode Invariance', '0% grid bleeding in 3D dark mode (0%-61% scroll)'),
]

sy = card_y + 65
for label, val in specs:
    draw.text((card_x + 25, sy), label, fill='#ffffff', font=font_bold)
    draw.text((card_x + 210, sy), val, fill='#8ea3ad', font=font)
    sy += 38

sheet.save(dir_after / 'blueprint-grid-review.png')
print('Created blueprint-grid-review.png')

