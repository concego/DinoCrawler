import { spawnSync } from 'node:child_process';
import process from 'node:process';
const win=process.platform==='win32';
function run(command,args,cwd='.') { const r=spawnSync(command,args,{cwd,stdio:'inherit',shell:win}); if(r.error)throw r.error; if(r.status!==0)process.exit(r.status??1); }
run('npm',['run','build:web']);
run('npx',['cap','sync','android']);
run(win?'gradlew.bat':'./gradlew',['assembleRelease'],'android');
