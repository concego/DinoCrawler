from pathlib import Path
import json, re
root=Path(__file__).resolve().parents[1]
cfg=json.loads((root/'src-tauri/tauri.conf.json').read_text())
assert cfg['identifier'].endswith('.androidpending'), 'Replace placeholder identifier before release'
html=(root/'frontend/index.html').read_text()
assert '/DinoCrawler/' not in html
assert 'serviceWorker.register' not in html
assert 'function finishGame(victory)' in html
assert 'function startGameImpl()' in html
for asset in re.findall(r'''(?:src|href)=["'](audio/[^"']+)["']''',html):
    assert (root/'frontend'/asset).is_file(), f'Missing {asset}'
for asset in re.findall(r'''new Audio\(["']audio/([^"']+)["']\)''',html):
    assert (root/'frontend/audio'/asset).is_file(), f'Missing audio/{asset}'
manifest=json.loads((root/'package.json').read_text())
assert manifest['scripts']['android:aab']=='tauri android build'
print('Static Android preparation checks passed. No Android build or device test performed.')
