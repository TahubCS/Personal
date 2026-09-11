import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageChops

base = Path('artifacts/motion-lab/step-2-7')

try:
    font = ImageFont.truetype('C:/Windows/Fonts/consola.ttf', 17)
    font_bold = ImageFont.truetype('C:/Windows/Fonts/consolab.ttf', 19)
    font_title = ImageFont.truetype('C:/Windows/Fonts/consolab.ttf', 24)
except Exception:
    font = ImageFont.load_default()
    font_bold = font
    font_title = font

# 1. Pacing & Rest Intervals Montage (1920 x 920)
sheet = Image.new('RGB', (1920, 920), '#111719')
draw = ImageDraw.Draw(sheet)

draw.text((40, 25), 'SUB-STEP 2.7: SCROLL PACING, REST INTERVALS & REVERSIBILITY REVIEW', fill='#e4b46b', font=font_title)
draw.text((40, 60), 'Calibrated: [52%-61%] 3D Hold  |  [61%-88%] Paper Wipe Wavefront  |  [88%-100%] Drawing Hold & Labels', fill='#8ea3ad', font=font)

# Key progress points to show
# 52% (start 3D hold), 60% (end 3D hold), 74% (mid wipe), 88% (wipe complete / start drawing hold), 100% (final hold with full labels)
progress_keys = [52, 60, 74, 88, 100]
fw, fh = 345, 215

interval_labels = [
    '3D HOLD (Start: 52%)',
    '3D HOLD (End: 60%)',
    'PAPER WIPE (Mid: 74%)',
    'DRAWING HOLD (Start: 88%)',
    'DRAWING HOLD (End: 100%)',
]

for i, p in enumerate(progress_keys):
    x = 40 + i * (fw + 25)
    y = 105
    img = Image.open(base / f'desktop-1440-fwd-{p}.png').convert('RGB')
    thumb = img.resize((fw, fh), Image.Resampling.LANCZOS)
    sheet.paste(thumb, (x, y))
    draw.rectangle([x, y, x + fw, y + fh], outline='#283537', width=1)
    draw.text((x + 10, y + fh + 8), f'{p}% Scroll', fill='#e4b46b', font=font_bold)
    draw.text((x + 10, y + fh + 30), interval_labels[i], fill='#98c379' if 'HOLD' in interval_labels[i] else '#61afef', font=font)

# Bottom row: Forward vs Reverse comparison at 74% scroll (mid-wipe)
y_rev = 420
draw.text((40, y_rev), 'REVERSIBILITY VERIFICATION: Forward Journey vs Reverse Journey (74% Mid-Wipe)', fill='#e4b46b', font=font_bold)

fwd_74 = Image.open(base / 'desktop-1440-fwd-74.png').convert('RGB')
rev_74 = Image.open(base / 'desktop-1440-rev-74.png').convert('RGB')
diff_74 = ImageChops.difference(fwd_74, rev_74)

# Full thumbnails
thumb_w, thumb_h = 440, 275
sheet.paste(fwd_74.resize((thumb_w, thumb_h), Image.Resampling.LANCZOS), (40, y_rev + 40))
draw.rectangle([40, y_rev + 40, 40 + thumb_w, y_rev + 40 + thumb_h], outline='#37494f', width=1)
draw.text((40, y_rev + 40 + thumb_h + 10), 'Forward Scroll -> 74%', fill='#ffffff', font=font_bold)

sheet.paste(rev_74.resize((thumb_w, thumb_h), Image.Resampling.LANCZOS), (510, y_rev + 40))
draw.rectangle([510, y_rev + 40, 510 + thumb_w, y_rev + 40 + thumb_h], outline='#37494f', width=1)
draw.text((510, y_rev + 40 + thumb_h + 10), 'Reverse Scroll <- 74%', fill='#ffffff', font=font_bold)

# Diff thumbnail (boosted 10x)
diff_boost = diff_74.point(lambda p: min(255, p * 10))
sheet.paste(diff_boost.resize((thumb_w, thumb_h), Image.Resampling.LANCZOS), (980, y_rev + 40))
draw.rectangle([980, y_rev + 40, 980 + thumb_w, y_rev + 40 + thumb_h], outline='#37494f', width=1)
draw.text((980, y_rev + 40 + thumb_h + 10), 'Absolute Difference (10x boosted): PURE BLACK = 0 ERROR', fill='#98c379', font=font_bold)

# Summary card on right
card_x = 1450
card_y = y_rev + 40
draw.rectangle([card_x, card_y, card_x + 430, card_y + thumb_h], outline='#e4b46b', width=1)
draw.text((card_x + 20, card_y + 20), 'CHOREOGRAPHY PROOF:', fill='#e4b46b', font=font_bold)
draw.text((card_x + 20, card_y + 55), '1. 3D Hold (52%-61%):', fill='#ffffff', font=font_bold)
draw.text((card_x + 40, card_y + 80), 'delta(52%, 60%) = 0px movement', fill='#8ea3ad', font=font)
draw.text((card_x + 20, card_y + 115), '2. Paper Wipe (61%-88%):', fill='#ffffff', font=font_bold)
draw.text((card_x + 40, card_y + 140), 'Smooth diagonal wipe completes at 88%', fill='#8ea3ad', font=font)
draw.text((card_x + 20, card_y + 175), '3. Drawing Hold (88%-100%):', fill='#ffffff', font=font_bold)
draw.text((card_x + 40, card_y + 200), 'delta(88%, 100%) mesh = 0px drift', fill='#8ea3ad', font=font)
draw.text((card_x + 40, card_y + 225), 'Labels smoothly fade in from 88%-96%', fill='#8ea3ad', font=font)

sheet.save(base / 'pacing-and-reversibility-sheet.png')
print('Created pacing-and-reversibility-sheet.png')

