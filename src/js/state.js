let S={
  screen:'login',role:null,user:null,view:'dashboard',
  tcid:null,ttab:'students',taid:null,
  subId:null,asId:null,subTab:null,stuName:null,stuCid:null,
  lessonId:null,lessonCid:null,lessonEdit:false,
  qa:{},qDone:false,qRes:null,
  aiCheckText:'',aiCheckResult:null,aiChecking:false,aiChecks:[...AI_CHECKS],aiStages:[],aiInputMode:'paste',aiSelectedWorkId:null,aiSelectedClass:'11a',aiSimilarResults:null,
  B:{open:false,cid:null,sid:'math',type:'test',title:'',due:'',tmin:30,mode:'upload',topic:'',subtopic:'',book:'',qcnt:5,qtypes:['choice'],diff:'medium',gen:[],loading:false,file:null,step:'form'},
  modal:null,charts:{},
  attMode:'p',
  menuOpen:false,
};

const getSub=id=>SUBS.find(s=>s.id===id);
const getCls=id=>CLS.find(c=>c.id===id);
const getAsgn=id=>ASGN.find(a=>a.id===id);
const asgnCls=cid=>ASGN.filter(a=>a.cid===cid);
const isDone=(aid,n)=>!!SUBS_DATA[aid+'_'+n];
const ME=()=>'Ярицький Юрій';
const fmt=d=>{if(!d)return'';const dt=new Date(d);return`${dt.getDate()}.${String(dt.getMonth()+1).padStart(2,'0')}.${dt.getFullYear()}`};
const days=d=>Math.ceil((new Date(d)-new Date('2026-03-31'))/86400000);
const tL=t=>t==='test'?'Тест':'Контрольна';
const tBdg=t=>t==='test'?'b-blue':'b-ink';
const tBg=t=>t==='test'?'var(--bbg)':'var(--bg3)';
function gC(g){const n=+g;if(!n)return'gN';if(n>=10)return'gA';if(n>=7)return'gB';if(n>=4)return'gC';return'gD';}
function attStats(cid,s){const p=ATT_DATES.filter(d=>ATTENDANCE[`${cid}_${s}_${d}`]==='p').length;const a=ATT_DATES.filter(d=>ATTENDANCE[`${cid}_${s}_${d}`]==='a').length;const l=ATT_DATES.filter(d=>ATTENDANCE[`${cid}_${s}_${d}`]==='l').length;const e=ATT_DATES.filter(d=>ATTENDANCE[`${cid}_${s}_${d}`]==='e').length;return{p,a,l,e,pct:Math.round(p/ATT_DATES.length*100)};}
function clsAvg(cid){const vals=[];getCls(cid)?.students.forEach(s=>SUBS.forEach(sub=>{const g=+(GRADES[`${cid}_${s}_${sub.id}`]||0);if(g)vals.push(g);}));return vals.length?+(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1):0;}
function destroyCharts(){Object.values(S.charts).forEach(c=>{try{c.destroy();}catch(e){}});S.charts={};}

function go(view,p={}){destroyCharts();S.view=view;Object.assign(S,p);S.modal=null;S.menuOpen=false;render();}
function logout(){S.screen='login';S.role=null;destroyCharts();render();}
function toggleMenu(){S.menuOpen=!S.menuOpen;const side=document.querySelector('.side');const overlay=document.querySelector('.side-overlay');const ham=document.querySelector('.hamburger');if(side)side.classList.toggle('open',S.menuOpen);if(overlay)overlay.style.display=S.menuOpen?'block':'none';if(ham)ham.classList.toggle('open',S.menuOpen);}
function closeMenu(){S.menuOpen=false;const side=document.querySelector('.side');const overlay=document.querySelector('.side-overlay');const ham=document.querySelector('.hamburger');if(side)side.classList.remove('open');if(overlay)overlay.style.display='none';if(ham)ham.classList.remove('open');}
