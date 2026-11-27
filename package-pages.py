from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile


project = Path(__file__).resolve().parent
variants = {
    'portfolio': (
        'chulpan-portfolio-github-pages.zip',
        {'publications/index.html', 'editor/index.html', 'publications-data.json'},
    ),
    'uk-global-talent': (
        'chulpan-uk-global-talent-github-pages.zip',
        {'checklist/index.html'},
    ),
}

for variant, (name, routes) in variants.items():
    source = project / 'dist' / 'github-pages' / variant
    files = {path.relative_to(source).as_posix(): path for path in source.rglob('*') if path.is_file()}
    required = routes | {'index.html', '.nojekyll', 'README.md', 'assets/style.css'}
    if not required <= files.keys():
        raise ValueError(f'Missing files for {variant}: {required - files.keys()}')

    target = project.parent / name
    with ZipFile(target, 'w', compression=ZIP_DEFLATED, compresslevel=9) as archive:
        for relative, file in sorted(files.items()):
            archive.write(file, relative)

    with ZipFile(target) as archive:
        if archive.testzip() or set(archive.namelist()) != files.keys():
            raise ValueError(f'Invalid archive for {variant}')
        for relative, file in files.items():
            if archive.read(relative) != file.read_bytes():
                raise ValueError(f'File contents did not match for {variant}/{relative}')

    print(f'{name}: {len(files)} files, {target.stat().st_size} bytes')
