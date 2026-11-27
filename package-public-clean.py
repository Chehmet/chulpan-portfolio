from pathlib import Path
import re
from zipfile import ZIP_DEFLATED, ZipFile


project = Path(__file__).resolve().parent
source = project / 'docs'
archive = project.parent / 'chulpan-portfolio-public-clean.zip'
files = {
    '.nojekyll', 'README.md', 'index.html', 'publications-data.json',
    'publications/index.html', 'editor/index.html', 'assets/style.css',
    'assets/app.js', 'assets/content.js', 'assets/contours.webp',
    'assets/cert-studcamp-itmo.webp', 'assets/cert-studcamp-nsu.webp', 'assets/cert-studcamp-mipt.webp',
    'assets/pages-storage.js', 'assets/publication-editor.js',
}
private_terms = re.compile(r'global talent|tech nation|\bvisa\b|visagroups|визов|иммиграц|чеклист|research-desk', re.IGNORECASE)

actual = {path.relative_to(source).as_posix() for path in source.rglob('*') if path.is_file()}
if actual != files:
    raise ValueError(f'Unexpected docs files: {sorted(actual - files)}. Missing: {sorted(files - actual)}')

for name in files:
    if not (source / name).is_file():
        raise ValueError(f'Missing {name}')
    if not name.endswith('.webp'):
        text = (source / name).read_text(encoding='utf8')
        match = private_terms.search(text)
        if match:
            raise ValueError(f'Unexpected private reference {match.group(0)!r} in {name}')

with ZipFile(archive, 'w', ZIP_DEFLATED, compresslevel=9) as published:
    for name in sorted(files):
        published.write(source / name, name)

with ZipFile(archive) as published:
    assert published.testzip() is None
    assert set(published.namelist()) == files
    assert all(published.read(name) == (source / name).read_bytes() for name in files)

print(f'{archive.name}: {len(files)} public files, {archive.stat().st_size} bytes')
