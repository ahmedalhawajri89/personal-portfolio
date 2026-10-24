"""Draw the résumé's pages as pictures for the CV viewer.

The viewer (components/CvPanel.jsx) shows the PDF as paper rather than in
the browser's own PDF viewer, which a phone does not show at all. Run this
whenever public/cv/Ahmed-Al-Hawajiri-CV.pdf changes:

    python -I scripts/cv-pages.py

It needs PyMuPDF (pip install pymupdf) and the project's own sharp, which
turns each page into WebP. It prints each page's size; PAGES in
CvPanel.jsx must match it.
"""
import os
import subprocess
import sys

import pymupdf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF = os.path.join(ROOT, 'public', 'cv', 'Ahmed-Al-Hawajiri-CV.pdf')
OUT = os.path.join(ROOT, 'public', 'cv')
WIDTH = 1240  # px: crisp on a retina screen at the width the viewer shows a page

doc = pymupdf.open(PDF)
for n, page in enumerate(doc, 1):
    zoom = WIDTH / page.rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
    png = os.path.join(OUT, f'page-{n}.png')
    webp = os.path.join(OUT, f'page-{n}.webp')
    pix.save(png)
    subprocess.run(
        ['node', '-e', f"require('sharp')(process.argv[1]).webp({{quality:86}}).toFile(process.argv[2]).then(()=>{{}})", png, webp],
        cwd=ROOT, check=True,
    )
    os.remove(png)
    print(f'page-{n}.webp  {pix.width}x{pix.height}')
sys.exit(0)
