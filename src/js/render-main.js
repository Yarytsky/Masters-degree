function render(){
  destroyCharts();
  const app=document.getElementById('app');
  if(S.screen==='login'){app.innerHTML=rLogin();return;}
  const main=S.B.open?rBuilder():rMain();
  app.innerHTML=
    '<div class="topbar">'
    +'<button class="hamburger'+(S.menuOpen?' open':'')+'" onclick="toggleMenu()"><span></span><span></span><span></span></button>'
    +'<div class="topbar-logo">Osvita</div>'
    +'<div class="savatar">'+S.user.ini+'</div>'
    +'</div>'
    +'<div class="side-overlay" style="display:none" onclick="closeMenu()"></div>'
    +'<div class="shell">'+rSide()+'<div class="content penter">'+main+'</div></div>'
    +(S.modal?rModal():'');
  setTimeout(initCharts,60);
}
function rLogin(){return`<div class="loginbg"><div class="loginbox">
  <div class="login-mark">${ico('book',22)}</div>
  <div class="login-title">Osvita</div>
  <div class="login-sub">Освітня платформа</div>
  <div class="login-hint"><b>Студент:</b> student &nbsp; <b>Вчитель:</b> Teacher</div>
  <div class="login-err" id="lerr"></div>
  <div class="fg"><label class="fl">Логін</label><input class="fi" id="lu" placeholder="Введіть логін" onkeydown="if(event.key==='Enter')login()"/></div>
  <div class="fg"><label class="fl">Пароль</label><input class="fi" type="password" placeholder="••••••••" onkeydown="if(event.key==='Enter')login()"/></div>
  <button class="btn btn-p btn-full btn-lg" style="margin-top:4px" onclick="login()">Увійти</button>
</div></div>`;}

function rSide(){
  const isSt=S.role==='student';
  const tItems=[
    {sep:'Головна'},{v:'dashboard',l:'Панель',k:'home'},
    {v:'announcements',l:'Оголошення',k:'bell',dot:true},{v:'tasks',l:'Завдання',k:'task'},
    {sep:'Класи'},
    ...CLS.map(c=>({v:'class',cls:c.id,l:c.n,k:'users'})),
    {sep:'Інструменти'},
    {v:'lesson-planner',l:'Плани уроків',k:'lesson'},
    {v:'quick-attend',l:'Відвідуваність',k:'attend'},
    {v:'ai-checker',l:'Перевірка на AI',k:'ai'},
    {v:'reports',l:'Звіти',k:'report'},
  ];
  const sItems=[
    {v:'home-s',l:'Головна',k:'home'},{v:'sched-s',l:'Розклад',k:'cal'},
    {v:'subjects-s',l:'Предмети',k:'book'},{v:'grades-s',l:'Оцінки',k:'grade'},
    {v:'analytics-s',l:'Аналітика',k:'chart'},
  ];
  const items=isSt?sItems:tItems;
  const ri=i=>{
    if(i.sep)return`<div class="slabel">${i.sep}</div>`;
    const isAct=i.cls?S.view==='class'&&S.tcid===i.cls:S.view===i.v;
    const oc=i.cls?`go('class',{tcid:'${i.cls}',ttab:'students'})`:`go('${i.v}')`;
    return`<button class="si${isAct?' act':''}" onclick="${oc}">${ico(i.k)} ${i.l}${i.dot?`<span class="bdot"></span>`:''}</button>`;
  };
  const profileView=isSt?'account-s':'account-t';
  const isProfileAct=S.view===profileView;
  return`<div class="side">
    <div class="slogo"><div class="slogo-mark">${ico('book',13)}</div><div><div class="slogo-txt">Osvita</div><div class="slogo-sub">${isSt?'Студент':'Вчитель'}</div></div></div>
    <div class="snav">${items.map(ri).join('')}</div>
    <div class="sfoot">
      <button class="suser${isProfileAct?' act':''}" onclick="go('${profileView}')" style="width:100%;text-align:left;background:${isProfileAct?'var(--bg2)':'transparent'};border-radius:var(--r2);padding:8px;cursor:pointer;border:none;display:flex;align-items:center;gap:10px">
        <div class="savatar">${S.user.ini}</div>
        <div style="flex:1;min-width:0">
          <div class="suname">${S.user.name}</div>
          <div class="surole" style="font-size:.7rem;color:var(--ink3)">${isSt?'11-А · Учень':'Викладач'}</div>
        </div>
        ${ico('user',13)}
      </button>
      <button class="slogout" onclick="logout()">${ico('logout')} Вийти</button>
    </div>
  </div>`;}

function rMain(){
  if(S.role==='student'){
    const m={
      'home-s':rStudHome,'sched-s':rStudSched,'subjects-s':rStudSubjects,
      'subject-s':rStudSubject,'asgn-s':rStudAsgn,'result-s':rStudResult,
      'grades-s':rStudGrades,'analytics-s':rStudAnalytics,
      'account-s':rStudAccount,
    };
    return(m[S.view]||(() => ''))()||'';
  } else {
    const m={
      'dashboard':rDashboard,'announcements':rAnnouncements,'tasks':rTasks,
      'class':rClass,'student-profile':rStudProfile,
      'lesson-planner':rLessonPlanner,'lesson-detail':rLessonDetail,
      'quick-attend':rQuickAttend,'ai-checker':rAIChecker,
      'reports':rReports,'tres':rTeacherRes,
      'account-t':rTeacherAccount,'teacher-info':rTeacherInfo,
    };
    return(m[S.view]||(() => ''))()||'';
  }
}

function rDashboard(){
  const allStu=CLS.reduce((a,c)=>a+c.students.length,0);
  const overallAvg=+(CLS.map(c=>clsAvg(c.id)).reduce((a,b)=>a+b,0)/CLS.length).toFixed(1);
  const pendT=TASKS.filter(t=>!t.done).length;
  const today=(LESSONS['11a']||[]).filter(l=>l.day===1);
  return`<div>
    <div class="ph ph-row"><div><div class="pt">Панель вчителя</div><div class="ps">31 березня 2026 · Понеділок</div></div></div>
    <div class="sg sg5">
      <div class="stat"><div class="statv" style="color:var(--blue)">${allStu}</div><div class="statl">Учнів</div></div>
      <div class="stat"><div class="statv" style="color:var(--ink)">${CLS.length}</div><div class="statl">Класів</div></div>
      <div class="stat"><div class="statv" style="color:var(--green)">${overallAvg}</div><div class="statl">Ср. бал</div></div>
      <div class="stat"><div class="statv" style="color:var(--amber)">${ASGN.length}</div><div class="statl">Завдань</div></div>
      <div class="stat"><div class="statv" style="color:${pendT>0?'var(--red)':'var(--green)'}">${pendT}</div><div class="statl">Мої задачі</div></div>
    </div>
    <div class="g2" style="align-items:start;margin-bottom:14px">
      <div>
        <div class="card" style="margin-bottom:12px">
          <div class="ct">Уроки сьогодні — 11-А</div>
          ${today.length===0?`<div style="font-size:.82rem;color:var(--ink3)">Уроків немає</div>`:today.map(l=>{const s=getSub(l.sid);return`<div class="sch-it" style="cursor:pointer" onclick="go('lesson-detail',{lessonId:'${l.id}',lessonCid:'11a'})"><div class="sch-time">${l.time}</div><div class="sch-bar" style="background:${s.c}"></div><div><div class="sch-n">${s.n}</div><div class="sch-m">${l.topic}</div></div></div>`;}).join('')}
        </div>
        <div class="card">
          <div class="ct">Статус класів</div>
          ${CLS.map(c=>{const avg=clsAvg(c.id);const ap=Math.round(ATT_DATES.reduce((a,d)=>a+c.students.filter(s=>ATTENDANCE[`${c.id}_${s}_${d}`]==='p').length,0)/(ATT_DATES.length*c.students.length)*100);return`<div style="display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--line)"><div><div style="font-size:.85rem;font-weight:600">${c.n}</div><div style="font-size:.72rem;color:var(--ink3)">${c.students.length} учнів</div></div><div style="display:flex;gap:8px;align-items:center"><div style="text-align:center"><div style="font-family:var(--ff);font-size:.95rem;font-weight:500;color:var(--blue)">${avg}</div><div style="font-size:.62rem;color:var(--ink3)">бал</div></div><div style="text-align:center"><div style="font-family:var(--ff);font-size:.95rem;font-weight:500;color:${ap>=80?'var(--green)':'var(--amber)'}">${ap}%</div><div style="font-size:.62rem;color:var(--ink3)">відвід.</div></div><button class="btn btn-s btn-sm" onclick="go('class',{tcid:'${c.id}',ttab:'students'})">Відкрити</button></div></div>`;}).join('')}
        </div>
      </div>
      <div>
        <div class="card" style="margin-bottom:12px">
          <div class="ct" style="display:flex;justify-content:space-between;align-items:center">Мої задачі <button class="btn btn-s btn-sm" onclick="go('tasks')">Всі</button></div>
          ${TASKS.filter(t=>!t.done).slice(0,4).map(t=>`<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--line)"><div style="width:5px;height:5px;border-radius:50%;flex-shrink:0;background:${t.priority==='high'?'var(--red)':t.priority==='med'?'var(--amber)':'var(--green)'}"></div><span style="font-size:.83rem;flex:1">${t.text}</span>${t.due?`<span style="font-size:.7rem;color:var(--ink3)">${t.due}</span>`:''}<button class="btn-icon" onclick="TASKS.find(x=>x.id==='${t.id}').done=true;render()">${ico('check',12)}</button></div>`).join('')}
          ${TASKS.filter(t=>!t.done).length===0?`<div style="font-size:.82rem;color:var(--ink3)">Все виконано</div>`:''}
        </div>
        <div class="card">
          <div class="ct" style="display:flex;justify-content:space-between;align-items:center">Оголошення <button class="btn btn-s btn-sm" onclick="go('announcements')">Всі</button></div>
          ${ANNOUNCEMENTS.slice(0,2).map(a=>`<div class="ann-it" style="margin-bottom:7px"><div class="ann-top"><span class="b ${a.priority==='high'?'b-red':a.priority==='med'?'b-amber':'b-gray'}" style="flex-shrink:0">${a.priority==='high'?'Важливо':a.priority==='med'?'Увага':'Інфо'}</span><span class="ann-title">${a.title}</span></div><div class="ann-body" style="-webkit-line-clamp:2;display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden">${a.body}</div></div>`).join('')}
        </div>
      </div>
    </div>
    <div class="card"><div class="ct">Успішність по класах</div><div class="cwrap"><canvas id="ch-cls"></canvas></div></div>
  </div>`;}

const AI_PHRASES_HIGH=['важливо зазначити','слід підкреслити','варто відзначити','у сучасному світі','таким чином','у висновку','слід наголосити','можна стверджувати','у даному контексті','необхідно враховувати','відіграє ключову роль','є невід\'ємною частиною','становить теоретичну основу','охоплює широкий спектр','неможливо переоцінити','без сумніву','не викликає сумнівів','на сьогоднішній день','представляє собою','характеризується наступними','ключовою особливістю','фундаментальне поняття','відіграє важливу роль','у різних галузях','it is important to note','it should be noted','in conclusion','furthermore','moreover','consequently','in todays world','it is worth noting','this demonstrates','plays a crucial role','in summary'];
const AI_PHRASES_MED=['насамперед','перш за все','у першу чергу','зокрема','загалом можна сказати','відповідно','внаслідок цього','слід зазначити','варто підкреслити','широкий спектр','має важливе значення','стає невід\'ємною','грає важливу роль','характеризуються','представляють собою','additionally','specifically','particularly','as a result','therefore','overall','indeed','notably'];
const PERSONAL_HIGH=['я ','мені ','мій ','моя ','моє ','мої ','мене','для мене','зі мною','думаю','вважаю','здається мені','чесно кажучи','особисто я','на мою думку','пам\'ятаю','помітив','зрозумів','бачу','знаю','розумію','i think','i believe','i feel','i remember','my opinion','for me','i was','i felt'];
const PERSONAL_MED=['круто','цікаво','нудно','важко','легко','подобається','не подобається','спершу','якось','насправді','ну ','ось ','от так','наче','мовляв','відчуваю','сподіваюсь','хочеться','боюсь','радію','sucks','awesome','cool','weird','kinda','honestly','actually','probably'];
const HEDGES=['можливо','певно','здається','мабуть','схоже','наче','ніби','неначе','напевно','очевидно'];
const FILLER=['взагалі','загалом','просто','навіть','саме','же','ж','до речі','тобто','зокрема'];

function textStats(t){
  const chars=t.length;
  const words=t.trim().split(/\s+/).filter(Boolean);
  const wordCount=words.length;
  const sentences=t.split(/(?<=[.!?…])\s+/).filter(s=>s.trim().length>3);
  const sentCount=sentences.length;
  const avgWordLen=wordCount?+(words.reduce((a,w)=>a+w.length,0)/wordCount).toFixed(1):0;
  const avgSentLen=sentCount?+(wordCount/sentCount).toFixed(1):0;
  const lemmas=words.map(w=>w.toLowerCase().replace(/[^\wа-яіїєґ']/gi,'').replace(/[аеєиіїоуюяь]+$/u,''));
  const lemmaSet=new Set(lemmas.filter(Boolean));
  const lexDiv=wordCount?Math.round(lemmaSet.size/wordCount*100):0;
  const sentLengths=sentences.map(s=>s.trim().split(/\s+/).filter(Boolean).length);
  const meanLen=sentLengths.length?sentLengths.reduce((a,b)=>a+b,0)/sentLengths.length:0;
  const variance=sentLengths.length?sentLengths.reduce((a,l)=>a+Math.pow(l-meanLen,2),0)/sentLengths.length:0;
  const stdDev=Math.sqrt(variance);
  const burstiness=meanLen?+(stdDev/meanLen).toFixed(3):0;
  const paragraphs=t.split(/\n\s*\n/).filter(p=>p.trim().length>0).length;
  const longWords=words.filter(w=>w.length>=7).length;
  const longWordRatio=wordCount?Math.round(longWords/wordCount*100):0;
  const punctCount=(t.match(/[,.!?;:—…\-]/g)||[]).length;
  const punctDensity=wordCount?+(punctCount/wordCount).toFixed(2):0;
  const exclQuest=(t.match(/[!?]/g)||[]).length;
  return{chars,wordCount,sentCount,avgWordLen,avgSentLen,uniqueWords:lemmaSet.size,lexDiv,burstiness,stdDev:+stdDev.toFixed(1),paragraphs,longWordRatio,punctDensity,exclQuest,lemmas,sentences,sentLengths,words};
}
