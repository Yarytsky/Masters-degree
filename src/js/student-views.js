function rStudProfile(){const s=S.stuName;const cid=S.stuCid;const c=getCls(cid);const vs=SUBS.map(sub=>+(GRADES[`${cid}_${s}_${sub.id}`]||0)).filter(Boolean);const avg=vs.length?+(vs.reduce((a,b)=>a+b,0)/vs.length).toFixed(1):0;const att=attStats(cid,s);const notes=STUDENT_NOTES[`${cid}_${s}`]||[];const ini=s.split(' ').map(x=>x[0]).join('').slice(0,2);const sp=STUDENT_PROFILES[`${cid}_${s}`];return`<div>
  <div class="bc"><button class="bca" onclick="go('class',{tcid:cid})">Клас ${c.n}</button><span class="bcs">›</span><span class="bcc">${s}</span></div>
  <div style="display:flex;align-items:center;gap:16px;margin-bottom:18px;flex-wrap:wrap">
    \${avatarBlock(sp?sp.photo:null,ini,60)}
    <div>
      <div class="pt" style="font-size:1.15rem">\${sp?(sp.firstName+' '+sp.lastName).trim():s}</div>
      <div class="ps">Клас \${c.n} · Ср.бал: \${avg} · Відвід.: \${att.pct}%</div>
      ${sp&&sp.email?'<div style="font-size:.77rem;color:var(--ink3)">'+(sp.email)+'</div>':''}
    </div>
  </div>
  <div class="card" style="margin-bottom:12px"><div class="ct">Особиста інформація</div>
    \${[
      {l:'Телефон учня',v:sp?.phone||'—'},
      {l:'Телефон мами',v:sp?.momPhone||'—'},
      {l:'Email',       v:sp?.email||'—'},
    ].map(function(r){return '<div style="display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--line)"><span style="font-size:.81rem;color:var(--ink2)">'+r.l+'</span><span style="font-size:.84rem;font-weight:500">'+r.v+'</span></div>';}).join('')}
    ${sp&&sp.note?'<div style="margin-top:8px;font-size:.81rem;color:var(--amber);padding:7px 10px;background:var(--abg);border-radius:var(--r2)">Примітка: '+(sp.note)+'</div>':''}
  </div>
  <div class="g2" style="align-items:start">
    <div>
      <div class="card" style="margin-bottom:10px"><div class="ct">Оцінки</div>${SUBS.map(sub=>{const g=GRADES[`${cid}_${s}_${sub.id}`]||'';return`<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--line)"><div style="display:flex;align-items:center;gap:6px"><div style="width:6px;height:6px;border-radius:50%;background:${sub.c}"></div><span style="font-size:.83rem">${sub.n}</span></div><span class="gc ${gC(g)}" onclick="editGrade('${cid}','${s}','${sub.id}')" title="Змінити">${g||'—'}</span></div>`;}).join('')}</div>
      <div class="card"><div class="ct">Відвідуваність</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;text-align:center;margin-bottom:10px"><div style="background:var(--gbg);border-radius:6px;padding:8px"><div style="font-family:var(--ff);font-size:1.3rem;font-weight:500;color:var(--green)">${att.p}</div><div style="font-size:.65rem;color:var(--ink3)">Присут.</div></div><div style="background:var(--rbg);border-radius:6px;padding:8px"><div style="font-family:var(--ff);font-size:1.3rem;font-weight:500;color:var(--red)">${att.a}</div><div style="font-size:.65rem;color:var(--ink3)">Відсут.</div></div><div style="background:var(--abg);border-radius:6px;padding:8px"><div style="font-family:var(--ff);font-size:1.3rem;font-weight:500;color:var(--amber)">${att.l}</div><div style="font-size:.65rem;color:var(--ink3)">Запізн.</div></div><div style="background:var(--pbg);border-radius:6px;padding:8px"><div style="font-family:var(--ff);font-size:1.3rem;font-weight:500;color:var(--purple)">${att.e}</div><div style="font-size:.65rem;color:var(--ink3)">Поважна</div></div></div><div class="prog-bar"><div class="prog-fill" style="width:${att.pct}%;background:${att.pct>=80?'var(--green)':att.pct>=60?'var(--amber)':'var(--red)'}"></div></div><div style="text-align:right;font-size:.71rem;color:var(--ink3);margin-top:3px">${att.pct}%</div></div>
    </div>
    <div>
      <div class="card" style="margin-bottom:10px"><div class="ct" style="display:flex;align-items:center;justify-content:space-between">Нотатки <button class="btn btn-s btn-sm" onclick="openModal('addNote','${cid}','${s}')">${ico('plus',11)} Додати</button></div>${notes.length===0?`<div style="font-size:.81rem;color:var(--ink3)">Нотаток немає</div>`:notes.map(n=>`<div class="note-it ${n.type}"><div style="font-size:.82rem;line-height:1.55;margin-bottom:3px">${n.text}</div><div style="display:flex;justify-content:space-between"><span style="font-size:.69rem;color:var(--ink3)">${n.date}</span><button class="btn-icon del" onclick="STUDENT_NOTES['${cid}_${s}']=STUDENT_NOTES['${cid}_${s}'].filter(x=>x.id!=='${n.id}');render()">${ico('trash',11)}</button></div></div>`).join('')}</div>
      <div class="card"><div class="ct">Завдання</div>${ASGN.filter(a=>a.cid===cid).map(a=>{const done=isDone(a.id,s);const sm=SUBS_DATA[a.id+'_'+s];return`<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--line)"><div><div style="font-size:.83rem;font-weight:500">${a.title}</div><div style="font-size:.71rem;color:var(--ink3)">${getSub(a.sid)?.n}</div></div>${done?`<span class="b b-green">${sm?.pct}%</span>`:`<span class="b b-red">Не здано</span>`}</div>`;}).join('')}${ASGN.filter(a=>a.cid===cid).length===0?`<div style="font-size:.81rem;color:var(--ink3)">Завдань немає</div>`:''}</div>
    </div>
  </div>
</div>`;}

function rTeacherRes(){const a=getAsgn(S.taid);const c=getCls(a.cid);const done=c.students.filter(s=>isDone(a.id,s));const avgP=done.length?Math.round(done.reduce((sm,s)=>sm+(SUBS_DATA[a.id+'_'+s]?.pct||0),0)/done.length):0;return`<div>
  <div class="bc"><button class="bca" onclick="go('class',{tcid:a.cid,ttab:'assignments'})">← Завдання</button><span class="bcs">›</span><span class="bcc">Результати</span></div>
  <div class="ph"><div class="pt" style="font-size:1.2rem">${a.title}</div><div class="ps">${c.n} · до ${fmt(a.due)}</div></div>
  <div class="sg sg3" style="margin-bottom:16px"><div class="stat"><div class="statv" style="color:var(--blue)">${done.length}/${c.students.length}</div><div class="statl">Здали</div></div><div class="stat"><div class="statv" style="color:${avgP>=75?'var(--green)':avgP>=60?'var(--amber)':'var(--red)'}">${avgP}%</div><div class="statl">Ср. результат</div></div><div class="stat"><div class="statv" style="color:var(--red)">${c.students.length-done.length}</div><div class="statl">Не здали</div></div></div>
  <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Учень</th><th>Статус</th><th>Результат</th><th class="hide-mob">Час</th></tr></thead><tbody>${c.students.map(s=>{const sm=SUBS_DATA[a.id+'_'+s];return`<tr><td style="font-weight:600">${s}</td><td>${sm?`<span class="b b-green">Здано</span>`:`<span class="b b-red">Не здано</span>`}</td><td>${sm?`<span style="font-weight:700;color:${sm.pct>=75?'var(--green)':sm.pct>=60?'var(--amber)':'var(--red)'}">${sm.pct}%</span> <span style="font-size:.73rem;color:var(--ink2)">(${sm.sc}/${sm.tot})</span>`:'—'}</td><td class="hide-mob" style="font-size:.79rem;color:var(--ink2)">${sm?sm.at:'—'}</td></tr>`;}).join('')}</tbody></table></div>
</div>`;}


/* ─── HOME ─── */
function rStudHome(){
  const all=ASGN.filter(a=>a.cid==='11a');
  const pnd=all.filter(a=>!isDone(a.id,ME()));
  const dn=all.length-pnd.length;
  const todayLessons=(LESSON_DATES['11a']||[]).filter(l=>l.date==='31.03');
  const myEntries=Object.values(GRADE_LOG).flat().filter(e=>e.student===ME());
  const recent=myEntries.slice(-3).reverse();
  return`<div>
    <div class="ph"><div class="pt">Доброго дня, Юрію</div><div class="ps">11-А · 31 березня 2026</div></div>
    <div class="sg sg4">
      <div class="stat"><div class="statv" style="color:var(--blue)">${all.length}</div><div class="statl">Завдань</div></div>
      <div class="stat"><div class="statv" style="color:var(--red)">${pnd.length}</div><div class="statl">Не здано</div></div>
      <div class="stat"><div class="statv" style="color:var(--green)">${dn}</div><div class="statl">Здано</div></div>
      <div class="stat"><div class="statv" style="color:var(--amber)">${todayLessons.length}</div><div class="statl">Уроків сьогодні</div></div>
    </div>
    <div class="g2" style="align-items:start;gap:16px">
      <div>
        <div class="card" style="margin-bottom:14px">
          <div class="ct" style="display:flex;align-items:center;justify-content:space-between">
            Квітень 2026
            <button class="btn btn-s btn-sm" onclick="go('sched-s')">Повний розклад</button>
          </div>
          ${rCal(2026,3)}
          <div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap">
            ${SUBS.map(s=>`<div style="display:flex;align-items:center;gap:4px;font-size:.69rem;color:var(--ink2)">
              <div style="width:6px;height:6px;border-radius:50%;background:${s.c}"></div>${s.n.split(' ')[0]}
            </div>`).join('')}
            <div style="display:flex;align-items:center;gap:4px;font-size:.69rem;color:var(--amber)">
              <div style="width:6px;height:6px;border-radius:50%;background:var(--amber)"></div>Дедлайн
            </div>
          </div>
        </div>

        ${todayLessons.length>0?`<div class="card">
          <div class="ct">Уроки сьогодні</div>
          ${todayLessons.map(l=>{const s=getSub(l.sid);return`<div class="sch-it">
            <div class="sch-time">${l.time}</div>
            <div class="sch-bar" style="background:${s.c}"></div>
            <div><div class="sch-n">${s.n}</div><div class="sch-m">${l.topic} · каб.${l.room}</div></div>
          </div>`;}).join('')}
        </div>`:''}
      </div>
      <div>

        <div class="sec" style="margin-bottom:8px">Актуальні завдання</div>
        ${pnd.length===0
          ?`<div class="alert a-ok" style="margin-bottom:12px">Всі завдання виконані!</div>`
          :pnd.map(a=>{const sub=getSub(a.sid);const d=days(a.due);return`
          <div class="ri cl" onclick="go('asgn-s',{asId:'${a.id}'})">
            <div class="ri-ic" style="background:${sub.cb}">${ico('file',13)}</div>
            <div class="ri-inf"><div class="ri-t">${a.title}</div><div class="ri-m">${sub.n} · до ${fmt(a.due)} · ${a.tmin}хв</div></div>
            <div class="ri-r"><span class="b ${d<=2?'b-red':d<=5?'b-amber':'b-green'}">${d<=0?'Сьогодні':d===1?'Завтра':d+' дн.'}</span></div>
          </div>`;}).join('')}

        ${recent.length>0?`<div class="hr"></div>
        <div class="sec" style="margin-bottom:8px">Останні оцінки</div>
        ${recent.map(e=>{const s=getSub(e.student);const typeC={control:'var(--red)',test:'var(--blue)',oral:'var(--purple)',hw:'var(--amber)',work:'var(--green)',project:'var(--ink)'};
          const sub=SUBS.find(sub=>GRADE_LOG[`11a_${sub.id}`]?.includes(e))||null;
          return`<div class="ri cl" onclick="go('grades-s')">
            <span class="gc ${gC(e.grade)}" style="flex-shrink:0">${e.grade}</span>
            <div class="ri-inf">
              <div class="ri-t">${e.topic}</div>
              <div class="ri-m">${GRADE_TYPES[e.type]} · ${e.date}</div>
            </div>
            <div class="ri-r"><span class="b b-gray" style="font-size:.68rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:110px">${e.comment.substring(0,40)}${e.comment.length>40?'…':''}</span></div>
          </div>`;}).join('')}`:''}
      </div>
    </div>
  </div>`;}

/* ─── CALENDAR ─── */
function rCal(yr,mo){
  const fd=new Date(yr,mo,1);const ld=new Date(yr,mo+1,0).getDate();const off=(fd.getDay()+6)%7;
  const today=new Date('2026-03-31');
  const adates=new Set(ASGN.filter(a=>a.cid==='11a').map(a=>{const d=new Date(a.due);return d.getFullYear()===yr&&d.getMonth()===mo?d.getDate():null;}).filter(Boolean));
  const lessonDayMap={};
  (LESSON_DATES['11a']||[]).forEach(l=>{
    const parts=l.date.split('.');
    if(+parts[1]-1===mo&&+parts[2]===yr){
      const day=+parts[0];
      if(!lessonDayMap[day])lessonDayMap[day]=[];
      lessonDayMap[day].push(l);
    }
  });
  const ds=[];for(let i=0;i<off;i++)ds.push(0);for(let d=1;d<=ld;d++)ds.push(d);while(ds.length%7)ds.push(0);
  return`<div>
    <div class="cal-hd">${DAY_S.slice(1).map(d=>`<div class="cal-dw">${d}</div>`).join('')}</div>
    <div class="cal-gr">${ds.map(day=>{
      if(!day)return`<div class="cal-d om"><div class="cal-dn" style="visibility:hidden">0</div></div>`;
      const date=new Date(yr,mo,day);const dow=date.getDay()===0?7:date.getDay();
      const schSubs=SUBS.filter(s=>s.sch.includes(dow));
      const realLessons=lessonDayMap[day]||[];
      const isTd=date.toDateString()===today.toDateString();
      const hasA=adates.has(day);const isWE=dow>=6;
      const displaySubs=realLessons.length>0?[...new Set(realLessons.map(l=>l.sid))].map(getSub).filter(Boolean):schSubs.filter(()=>!isWE);
      const hasLesson=displaySubs.length>0;
      return`<div class="cal-d${isTd?' today':''}${hasLesson?' hc':''}" ${hasLesson?`onclick="showCalDay(${yr},${mo},${day})"`:''}  title="${hasLesson?displaySubs.map(s=>s.n).join(', '):''}">
        <div class="cal-dn">${day}</div>
        <div class="cal-dots">
          ${displaySubs.map(s=>`<div class="cdot" style="background:${s.c}"></div>`).join('')}
          ${hasA?`<div class="cdot" style="background:var(--amber)"></div>`:''}
        </div>
      </div>`;}).join('')}
    </div>
  </div>`;}

function showCalDay(yr,mo,day){
  const date=`${String(day).padStart(2,'0')}.${String(mo+1).padStart(2,'0')}`;
  const lessons=(LESSON_DATES['11a']||[]).filter(l=>l.date===date);
  if(!lessons.length){
    const d=new Date(yr,mo,day);const dow=d.getDay()===0?7:d.getDay();
    const schSubs=SUBS.filter(s=>s.sch.includes(dow));
    S.modal={type:'calDay',args:[date,schSubs.map(s=>({sid:s.id,time:'',topic:'За розкладом',room:'—'})),]};
  } else {
    S.modal={type:'calDay',args:[date,lessons]};
  }
  render();
}

/* ─── FULL SCHEDULE ─── */
function rStudSched(){
  const ls=LESSON_DATES['11a']||[];
  const byDate={};
  ls.forEach(l=>{if(!byDate[l.date])byDate[l.date]=[];byDate[l.date].push(l);});
  const sortedDates=Object.keys(byDate).sort((a,b)=>{const p=d=>d.split('.').reverse().join('');return p(a).localeCompare(p(b));});
  const weekly=LESSONS['11a']||[];
  const byDay={};weekly.forEach(l=>{if(!byDay[l.day])byDay[l.day]=[];byDay[l.day].push(l);});
  const tab=S.schedTab||'weekly';
  return`<div>
    <div class="ph"><div class="pt">Розклад</div><div class="ps">Клас 11-А</div></div>
    <div class="tgl">
      <button class="tglb${tab==='weekly'?' act':''}" onclick="S.schedTab='weekly';render()">Тижневий</button>
      <button class="tglb${tab==='calendar'?' act':''}" onclick="S.schedTab='calendar';render()">Календар</button>
      <button class="tglb${tab==='lessons'?' act':''}" onclick="S.schedTab='lessons';render()">Всі заняття</button>
    </div>

    ${tab==='weekly'?`

      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
        ${SUBS.map(s=>`<div style="display:flex;align-items:center;gap:6px;padding:5px 11px;border-radius:20px;border:1.5px solid ${s.c}22;background:${s.cb}">
          <div style="width:8px;height:8px;border-radius:50%;background:${s.c}"></div>
          <span style="font-size:.78rem;font-weight:600;color:${s.c}">${s.n}</span>
          <span style="font-size:.72rem;color:var(--ink3)">${s.sch.map(d=>DAY_S[d]).join(', ')}</span>
        </div>`).join('')}
      </div>
      ${[1,2,3,4,5].map(day=>{
        const dls=(byDay[day]||[]).sort((a,b)=>a.time.localeCompare(b.time));
        if(!dls.length)return'';
        return`<div class="sch-day">${DAY_N[day]}</div>
        ${dls.map(l=>{const s=getSub(l.sid);return`
        <div class="sch-it" style="cursor:pointer" onclick="go('subject-s',{subId:'${l.sid}'})">
          <div class="sch-time">${l.time}</div>
          <div class="sch-bar" style="background:${s.c}"></div>
          <div style="flex:1">
            <div class="sch-n">${s.n}</div>
            <div class="sch-m">${l.topic} · каб.${l.room}</div>
          </div>
          <span style="font-size:.72rem;color:var(--ink3)">${s.t}</span>
        </div>`;}).join('')}`;}).join('')}
    `:tab==='calendar'?`

      <div class="card">
        <div class="ct">Квітень 2026</div>
        ${rCal(2026,3)}
        <div style="margin-top:12px">
          <div style="font-size:.75rem;color:var(--ink3);margin-bottom:8px">Натисніть на день щоб побачити уроки</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${SUBS.map(s=>`<div style="display:flex;align-items:center;gap:4px;font-size:.72rem"><div style="width:8px;height:8px;border-radius:50%;background:${s.c}"></div>${s.n.split(' ')[0]}</div>`).join('')}
            <div style="display:flex;align-items:center;gap:4px;font-size:.72rem"><div style="width:8px;height:8px;border-radius:50%;background:var(--amber)"></div>Дедлайн</div>
          </div>
        </div>
      </div>
    `:`

      ${sortedDates.map(d=>{
        const dls=byDate[d].sort((a,b)=>a.time.localeCompare(b.time));
        return`<div class="sch-day">${d}</div>
        ${dls.map(l=>{const s=getSub(l.sid);const myAtt=LESSON_ATT[`11a_${l.lid}_${ME()}`]||'p';const attLabel={p:'Присутній',a:'Відсутній',l:'Запізнився',e:'Поважна'}[myAtt];const attC={p:'var(--green)',a:'var(--red)',l:'var(--amber)',e:'var(--purple)'}[myAtt];return`
        <div class="sch-it">
          <div class="sch-time">${l.time}</div>
          <div class="sch-bar" style="background:${s.c}"></div>
          <div style="flex:1">
            <div class="sch-n">${s.n}</div>
            <div class="sch-m">${l.topic} · каб.${l.room}</div>
          </div>
          <span style="font-size:.73rem;font-weight:600;color:${attC}">${attLabel}</span>
        </div>`;}).join('')}`;}).join('')}
    `}
  </div>`;}

/* ─── SUBJECTS ─── */
function rStudSubjects(){
  return`<div>
    <div class="ph"><div class="pt">Предмети</div><div class="ps">Клас 11-А · ${SUBS.length} предметів</div></div>
    <div class="scgrid">
      ${SUBS.map(s=>{
        const aa=ASGN.filter(a=>a.sid===s.id&&a.cid==='11a');
        const pnd=aa.filter(a=>!isDone(a.id,ME()));
        const mats=(MATERIALS[`11a_${s.id}`]||[]).length;
        const myGrades=(GRADE_LOG[`11a_${s.id}`]||[]).filter(e=>e.student===ME());
        const avg=myGrades.length?+(myGrades.map(e=>+e.grade).reduce((a,b)=>a+b,0)/myGrades.length).toFixed(1):null;
        return`<div class="sc" onclick="go('subject-s',{subId:'${s.id}'})">
          <div class="sc-bar" style="background:${s.c}"></div>
          <div style="font-size:.78rem;color:var(--ink3);margin-bottom:4px">${s.t}</div>
          <div class="sc-n">${s.n}</div>
          <div style="display:flex;align-items:center;gap:6px;margin:8px 0 10px">
            ${avg!==null?`<span class="gc ${gC(String(avg))}" style="width:34px;height:26px;font-size:.82rem">${avg}</span><span style="font-size:.72rem;color:var(--ink3)">${myGrades.length} оцінок</span>`:'<span style="font-size:.72rem;color:var(--ink3)">Ще немає оцінок</span>'}
          </div>
          <div class="sc-foot">
            ${pnd.length>0?`<span class="b b-red">${pnd.length} не здано</span>`:''}
            ${mats>0?`<span class="b b-gray">${mats} матер.</span>`:''}
          </div>
        </div>`;}).join('')}
    </div>
  </div>`;}

/* ─── SUBJECT DETAIL ─── */
function rStudSubject(){
  const s=getSub(S.subId);
  const aa=ASGN.filter(a=>a.sid===S.subId&&a.cid==='11a');
  const pnd=aa.filter(a=>!isDone(a.id,ME()));
  const dn=aa.filter(a=>isDone(a.id,ME()));
  const mats=MATERIALS[`11a_${S.subId}`]||[];
  const myGrades=(GRADE_LOG[`11a_${S.subId}`]||[]).filter(e=>e.student===ME());
  const tab=S.subTab||'work';
  return`<div>
    <div class="bc"><button class="bca" onclick="go('subjects-s')">Предмети</button><span class="bcs">›</span><span class="bcc">${s.n}</span></div>
    <div class="ph" style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
      <div style="width:46px;height:46px;border-radius:10px;background:${s.cb};display:grid;place-items:center;flex-shrink:0;border:2px solid ${s.c}22">${ico('book',18)}</div>
      <div style="flex:1">
        <div class="pt" style="font-size:1.25rem">${s.n}</div>
        <div class="ps">${s.sch.map(d=>DAY_S[d]).join(', ')}</div>
      </div>

      ${(()=>{const tp=TEACHER_PROFILES[S.subId];const tini=(tp?.firstName[0]||'')+(tp?.lastName[0]||'');return tp?`<div style="display:flex;align-items:center;gap:9px;padding:8px 12px;border-radius:var(--r);border:1px solid var(--line);background:var(--sur);cursor:pointer;box-shadow:var(--sh);transition:all .15s" onclick="S.teacherInfoSub='${S.subId}';openModal('teacherInfo','${S.subId}')">
        ${avatarBlock(tp.photo,tini,32)}
        <div><div style="font-size:.83rem;font-weight:600">${tp.firstName} ${tp.lastName}</div><div style="font-size:.71rem;color:var(--ink3)">${tp.position}</div></div>
        ${ico('chevronR',14)}
      </div>`:''})()}
    </div>
    <div class="tabs">
      <button class="tab${tab==='work'?' act':''}" onclick="S.subTab='work';render()">Завдання</button>
      <button class="tab${tab==='grades'?' act':''}" onclick="S.subTab='grades';render()">Мої оцінки (${myGrades.length})</button>
      <button class="tab${tab==='mats'?' act':''}" onclick="S.subTab='mats';render()">Матеріали (${mats.length})</button>
    </div>

    ${tab==='work'?`
      ${pnd.length>0?pnd.map(a=>{const d=days(a.due);return`
      <div class="ri cl" onclick="go('asgn-s',{asId:'${a.id}'})">
        <div class="ri-ic" style="background:${tBg(a.type)}">${ico('file',13)}</div>
        <div class="ri-inf"><div class="ri-t">${a.title}</div><div class="ri-m">До ${fmt(a.due)} · ${a.tmin}хв · ${a.qs.length}пит.</div></div>
        <div class="ri-r">
          <span class="b ${d<=2?'b-red':d<=5?'b-amber':'b-green'}">${d<=0?'Сьогодні':d===1?'Завтра':d+' дн.'}</span>
          <span class="b ${tBdg(a.type)}">${tL(a.type)}</span>
          <button class="btn btn-p btn-sm">Почати</button>
        </div>
      </div>`;}).join(''):`<div class="alert a-ok">Всі виконані.</div>`}
      ${dn.length>0?`<div class="hr"></div>${dn.map(a=>{const sm=SUBS_DATA[a.id+'_'+ME()];return`
      <div class="ri" style="opacity:.6">
        <div class="ri-ic" style="background:var(--gbg)">${ico('check',13)}</div>
        <div class="ri-inf"><div class="ri-t">${a.title}</div><div class="ri-m">${sm?'Здано '+sm.at:''}</div></div>
        <div class="ri-r">${sm?`<span class="b b-green">${sm.pct}%</span>`:''}</div>
      </div>`;}).join('')}`:''}
    `:tab==='grades'?`
      ${myGrades.length===0
        ?`<div class="empty"><div class="empty-t">Оцінок ще немає</div><div class="empty-s">Оцінки з'являться після контрольних та опитувань</div></div>`
        :`<div class="card" style="margin-bottom:14px">
          <div style="display:flex;gap:14px;flex-wrap:wrap">
            ${(()=>{const vals=myGrades.map(e=>+e.grade);const avg=+(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1);return`
              <div style="text-align:center"><div style="font-family:var(--ff);font-size:2rem;font-weight:500;color:var(--blue)">${avg}</div><div style="font-size:.72rem;color:var(--ink3)">Середній бал</div></div>
              <div style="text-align:center"><div style="font-family:var(--ff);font-size:2rem;font-weight:500;color:var(--green)">${vals.filter(v=>v>=10).length}</div><div style="font-size:.72rem;color:var(--ink3)">Відмінних</div></div>
              <div style="text-align:center"><div style="font-family:var(--ff);font-size:2rem;font-weight:500;color:var(--red)">${vals.filter(v=>v<7).length}</div><div style="font-size:.72rem;color:var(--ink3)">Нижче 7</div></div>`;})()}
          </div>
        </div>
        ${myGrades.slice().reverse().map(e=>{
          const typeC={control:'var(--red)',test:'var(--blue)',oral:'var(--purple)',hw:'var(--amber)',work:'var(--green)',project:'var(--ink)'};
          return`<div class="card" style="margin-bottom:10px;padding:14px 16px;border-left:3px solid ${typeC[e.type]||'var(--ink4)'}">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
              <span class="gc ${gC(e.grade)}" style="width:44px;height:36px;font-size:1.1rem;flex-shrink:0">${e.grade}</span>
              <div style="flex:1">
                <div style="font-size:.88rem;font-weight:600;margin-bottom:2px">${e.topic}</div>
                <div style="font-size:.75rem;display:flex;gap:8px;flex-wrap:wrap">
                  <span style="color:${typeC[e.type]};font-weight:600">${GRADE_TYPES[e.type]}</span>
                  <span style="color:var(--ink3)">${e.date}</span>
                </div>
              </div>
            </div>
            <div style="background:var(--bg2);border-radius:var(--r2);padding:10px 12px">
              <div style="font-size:.67rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink3);margin-bottom:4px">Коментар вчителя</div>
              <div style="font-size:.83rem;color:var(--ink2);line-height:1.6">${e.comment}</div>
            </div>
          </div>`;}).join('')}`}
    `:mats.length===0
      ?`<div class="empty"><div class="empty-t">Немає матеріалів</div><div class="empty-s">Вчитель ще не завантажив файли</div></div>`
      :mats.map(m=>rMatCard(m)).join('')}
  </div>`;}

function rMatCard(m){
  const extColor={pdf:'b-red',ppt:'b-amber',pptx:'b-amber',doc:'b-blue',docx:'b-blue',xlsx:'b-green',xls:'b-green'};
  const extIcon={pdf:'📄',ppt:'📊',pptx:'📊',doc:'📝',docx:'📝',xlsx:'📈',xls:'📈'};
  const isViewable=['pdf'].includes(m.type?.toLowerCase());
  return`<div class="ri">
    <div class="ri-ic" style="background:var(--bg2);font-size:1.1rem">${extIcon[m.type?.toLowerCase()]||'📎'}</div>
    <div class="ri-inf">
      <div class="ri-t">${m.n}</div>
      <div class="ri-m">${m.size} · завантажено ${m.date}${m.desc?' · '+m.desc:''}</div>
    </div>
    <div class="ri-r">
      <span class="b ${extColor[m.type?.toLowerCase()]||'b-gray'}">${(m.type||'').toUpperCase()}</span>
      ${isViewable?`<button class="btn btn-blue btn-sm" onclick="openFile('${m.id}','${m.n}')">Переглянути</button>`:''}
      <button class="btn btn-s btn-sm" onclick="downloadFile('${m.id}','${m.n}')">Завантажити</button>
    </div>
  </div>`;}

function openFile(id,name){
  toast(`Відкриваю «${name}»…`,'info',2000);
  S.modal={type:'filePreview',args:[id,name]};render();
}
function downloadFile(id,name){
  toast(`Файл «${name}» завантажується…`,'ok',2200);
}

/* ─── GRADES (full page) ─── */
function rStudGrades(){
  const cls='11a';
  const subData=SUBS.map(s=>{
    const entries=(GRADE_LOG[`${cls}_${s.id}`]||[]).filter(e=>e.student===ME());
    const vals=entries.map(e=>+e.grade).filter(Boolean);
    const avg=vals.length?+(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1):null;
    return {sub:s, entries, vals, avg};
  });
  const subAvgs=subData.map(d=>d.avg).filter(v=>v!==null);
  const overall=subAvgs.length?+(subAvgs.reduce((a,b)=>a+b,0)/subAvgs.length).toFixed(1):null;

  const allMyEntries=Object.entries(GRADE_LOG)
    .filter(([k])=>k.startsWith(cls))
    .flatMap(([k,entries])=>{
      const sid=k.replace(`${cls}_`,'');
      return entries.filter(e=>e.student===ME()).map(e=>({...e,sid}));
    })
    .sort((a,b)=>{const p=d=>d.split('.').reverse().join('');return p(b.date).localeCompare(p(a.date));});

  const typeC={control:'var(--red)',test:'var(--blue)',oral:'var(--purple)',hw:'var(--amber)',work:'var(--green)',project:'var(--ink)'};
  const selSub=S.gradeStudSub||'all';
  const filtered=selSub==='all'?allMyEntries:allMyEntries.filter(e=>e.sid===selSub);

  return`<div>
    <div class="ph"><div class="pt">Мої оцінки</div><div class="ps">Клас 11-А · ${allMyEntries.length} записів</div></div>


    <div style="margin-bottom:20px">
      <div class="sec" style="margin-bottom:10px">Середній бал по предметах</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;margin-bottom:12px">
        ${subData.map(({sub:s,vals,avg})=>`
        <div style="background:var(--sur);border:1.5px solid ${selSub===s.id?s.c:s.c+'33'};border-radius:var(--r);padding:14px 16px;cursor:pointer;transition:all .2s;box-shadow:${selSub===s.id?'0 4px 16px '+s.c+'33':'var(--sh)'}" onclick="S.gradeStudSub=S.gradeStudSub==='${s.id}'?'all':'${s.id}';render()">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
            <div style="width:8px;height:8px;border-radius:50%;background:${s.c};flex-shrink:0"></div>
            <span style="font-size:.78rem;font-weight:600;color:${s.c}">${s.n}</span>
          </div>
          <div style="font-family:var(--ff);font-size:2rem;font-weight:500;line-height:1;color:${avg!==null?(+avg>=10?'var(--green)':+avg>=7?'var(--blue)':+avg>=4?'var(--amber)':'var(--red)'):'var(--ink4)'}">
            ${avg!==null?avg:'—'}
          </div>
          <div style="font-size:.7rem;color:var(--ink3);margin-top:4px">${vals.length} оцінок</div>
          ${avg!==null?`<div style="margin-top:6px;height:3px;background:var(--bg3);border-radius:2px;overflow:hidden"><div style="height:100%;border-radius:2px;background:${s.c};width:${Math.round(+avg/12*100)}%;transition:width .6s"></div></div>`:''}
        </div>`).join('')}

        <div style="background:${selSub==='all'?'var(--ink)':'var(--sur)'};border:1.5px solid ${selSub==='all'?'var(--ink)':'var(--line)'};border-radius:var(--r);padding:14px 16px;cursor:pointer;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:4px;transition:all .2s" onclick="S.gradeStudSub='all';render()">
          <div style="font-family:var(--ff);font-size:2rem;font-weight:500;color:${selSub==='all'?'var(--bg)':'var(--ink)'}">
            ${overall!==null?overall:'—'}
          </div>
          <div style="font-size:.72rem;color:${selSub==='all'?'rgba(255,255,255,.6)':'var(--ink3)'};font-weight:600">Загальний</div>
        </div>
      </div>
    </div>


    ${selSub!=='all'?`<div class="alert a-info" style="margin-bottom:12px">Фільтр: ${getSub(selSub)?.n} · ${filtered.length} записів</div>`:''}


    <div class="sec" style="margin-bottom:10px">${selSub==='all'?'Всі оцінки':'Оцінки — '+getSub(selSub)?.n}</div>
    ${filtered.length===0
      ?`<div class="empty"><div class="empty-t">Оцінок ще немає</div><div class="empty-s">Вчитель ще не виставив оцінки</div></div>`
      :filtered.map(e=>{const s=getSub(e.sid);return`
      <div class="card" style="margin-bottom:9px;padding:14px 16px;border-left:4px solid ${typeC[e.type]||'var(--ink4)'}">
        <div style="display:flex;align-items:flex-start;gap:12px">
          <span class="gc ${gC(e.grade)}" style="width:44px;height:36px;font-size:1.1rem;flex-shrink:0">${e.grade}</span>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:6px">
              <span style="font-size:.87rem;font-weight:700">${e.topic}</span>
              ${selSub==='all'?`<span style="display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:20px;font-size:.7rem;font-weight:600;background:${s?.cb||'var(--bg3)'};color:${s?.c||'var(--ink2)'}"><div style="width:5px;height:5px;border-radius:50%;background:${s?.c}"></div>${s?.n||''}</span>`:''}
              <span class="b b-gray" style="font-size:.68rem">${GRADE_TYPES[e.type]}</span>
              <span style="font-size:.71rem;color:var(--ink3);margin-left:auto">${e.date}</span>
            </div>
            <div style="background:var(--bg2);border-radius:var(--r2);padding:9px 12px">
              <div style="font-size:.63rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink3);margin-bottom:3px">Коментар вчителя</div>
              <div style="font-size:.83rem;color:var(--ink2);line-height:1.6">${e.comment}</div>
            </div>
          </div>
        </div>
      </div>`;}).join('')}
  </div>`;}

/* ─── ASSIGNMENT ─── */
function rStudAsgn(){
  const a=getAsgn(S.asId);if(!a)return'';
  const s=getSub(a.sid);
  if(S.qDone)return rStudResult();
  const hasFile=a.file&&a.file.length>0;
  return`<div>
    <div class="bc">
      <button class="bca" onclick="go('subject-s',{subId:'${a.sid}'})">${s.n}</button>
      <span class="bcs">›</span><span class="bcc">${a.title}</span>
    </div>
    <div class="ph" style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">
      <div><div class="pt" style="font-size:1.2rem">${a.title}</div><div class="ps">${s.n} · ${a.tmin}хв · ${a.qs.length}пит.</div></div>
      <span class="b ${tBdg(a.type)}">${tL(a.type)}</span>
    </div>
    ${hasFile?`<div class="ri" style="margin-bottom:14px;background:var(--abg);border-color:#F0D090">
      ${ico('file',14)}
      <div class="ri-inf"><div class="ri-t">${a.file}</div><div class="ri-m" style="color:var(--amber)">Файл завдання — натисніть щоб переглянути</div></div>
      <div class="ri-r">
        <button class="btn btn-blue btn-sm" onclick="toast('Відкриваю файл…','info')">Відкрити файл</button>
        <button class="btn btn-s btn-sm" onclick="toast('Завантажується…','ok')">Завантажити</button>
      </div>
    </div>`:''}
    <div class="alert a-info">Оберіть відповіді та натисніть «Здати».</div>
    ${a.qs.map((q,qi)=>`
    <div class="card" style="margin-bottom:10px">
      <div style="font-size:.63rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--ink3);margin-bottom:7px">Питання ${qi+1} з ${a.qs.length}</div>
      <div style="font-size:.92rem;font-weight:600;line-height:1.5;margin-bottom:11px">${q.txt}</div>
      ${q.type==='choice'?q.opts.map((o,oi)=>`
      <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border:1.5px solid ${S.qa[q.id]===oi?'var(--blue)':'var(--line)'};border-radius:var(--r2);cursor:pointer;margin-bottom:6px;background:${S.qa[q.id]===oi?'var(--bbg)':'transparent'};transition:all .15s" onclick="S.qa[${q.id}]=${oi};render()">
        <div style="width:23px;height:23px;border-radius:50%;border:1.5px solid ${S.qa[q.id]===oi?'var(--blue)':'var(--line)'};background:${S.qa[q.id]===oi?'var(--blue)':'transparent'};display:grid;place-items:center;font-size:.71rem;font-weight:700;color:${S.qa[q.id]===oi?'#fff':'var(--ink3)'};flex-shrink:0">${String.fromCharCode(65+oi)}</div>
        <span style="font-size:.84rem;padding-top:2px">${o}</span>
      </div>`).join(''):`<textarea class="fta" placeholder="Ваша відповідь…" oninput="S.qa[${q.id}]=this.value">${S.qa[q.id]||''}</textarea>`}
    </div>`).join('')}
    <div style="display:flex;gap:9px;justify-content:flex-end;margin-top:6px">
      <button class="btn btn-s" onclick="go('subject-s',{subId:'${a.sid}'})">Скасувати</button>
      <button class="btn btn-p btn-lg" onclick="submitQ('${a.id}')">Здати роботу</button>
    </div>
  </div>`;}

function submitQ(aid){
  const a=getAsgn(aid);let sc=0;
  a.qs.forEach(q=>{if(q.type==='choice'&&S.qa[q.id]===q.ok)sc++;});
  const ch=a.qs.filter(q=>q.type==='choice').length;
  const pct=ch>0?Math.round(sc/ch*100):0;
  SUBS_DATA[aid+'_'+ME()]={ans:a.qs.map(q=>S.qa[q.id]??-1),sc,tot:a.qs.length,pct,at:'31 бер'};
  S.qDone=true;S.qRes={sc,tot:a.qs.length,pct,aid};render();
  toast(`Роботу здано — ${pct}%`,'ok');
}

/* ─── RESULT ─── */
function rStudResult(){
  const{sc,tot,pct,aid}=S.qRes;const a=getAsgn(aid);
  const g=pct>=90?{l:'Відмінно',c:'var(--green)'}:pct>=75?{l:'Добре',c:'var(--blue)'}:pct>=60?{l:'Задовільно',c:'var(--amber)'}:{l:'Повторити',c:'var(--red)'};
  return`<div style="max-width:480px;margin:0 auto;padding:16px 0">
    <div style="text-align:center;margin-bottom:24px">
      <div style="font-family:var(--ff);font-size:3.2rem;font-weight:500;line-height:1;color:${g.c};margin-bottom:6px">${pct}%</div>
      <div style="font-size:.92rem;font-weight:600;color:${g.c};margin-bottom:4px">${g.l}</div>
      <div style="font-size:.82rem;color:var(--ink2)">${sc} правильних з ${tot}</div>
    </div>
    ${a.qs.map((q,i)=>{const ans=S.qa[q.id];const ok=q.type==='choice'&&ans===q.ok;return`
    <div class="card" style="margin-bottom:7px;padding:11px 14px;border-left:3px solid ${q.type==='choice'?(ok?'var(--green)':'var(--red)'):'var(--blue)'}">
      <div style="font-size:.64rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:${q.type==='choice'?(ok?'var(--green)':'var(--red)'):'var(--blue)'};margin-bottom:3px">${q.type==='choice'?(ok?'Правильно':'Неправильно'):'Відкрите питання'}</div>
      <div style="font-size:.82rem;font-weight:600;margin-bottom:${q.type==='choice'?'3px':'0'}">${q.txt}</div>
      ${q.type==='choice'?`<div style="font-size:.74rem;color:var(--ink2)">Ваша: ${q.opts[ans]??'—'}${!ok?` · Правильна: ${q.opts[q.ok]}`:''}</div>`:''}
    </div>`;}).join('')}
    <div style="display:flex;gap:9px;justify-content:center;margin-top:16px">
      <button class="btn btn-s" onclick="go('subjects-s')">До предметів</button>
      <button class="btn btn-p" onclick="go('home-s')">Головна</button>
    </div>
  </div>`;}

/* ─── STUDENT ANALYTICS ─── */
function rStudAnalytics(){
  const cls='11a';
  const selSub=S.analyticsSub||'all';

  function subStats(sid){
    const entries=(GRADE_LOG[`${cls}_${sid}`]||[]).filter(e=>e.student===ME());
    const vals=entries.map(e=>+e.grade).filter(Boolean);
    const avg=vals.length?+(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1):null;
    const asgns=ASGN.filter(a=>a.sid===sid&&a.cid===cls);
    const submitted=asgns.filter(a=>isDone(a.id,ME())).length;
    const notSubmPct=asgns.length?Math.round((1-submitted/asgns.length)*100):0;
    const ls=(LESSON_DATES[cls]||[]).filter(l=>l.sid===sid);
    const present=ls.filter(l=>(LESSON_ATT[`${cls}_${l.lid}_${ME()}`]||'p')==='p').length;
    const absent =ls.filter(l=>LESSON_ATT[`${cls}_${l.lid}_${ME()}`]==='a').length;
    const late   =ls.filter(l=>LESSON_ATT[`${cls}_${l.lid}_${ME()}`]==='l').length;
    const attPct =ls.length?Math.round(present/ls.length*100):100;
    return {avg,vals,entries,asgns,submitted,notSubmPct,ls,present,absent,late,attPct};
  }

  const allSubStats=SUBS.map(s=>({...subStats(s.id),sub:s}));
  const subAvgs=allSubStats.map(d=>d.avg).filter(v=>v!==null);
  const overallAvg=subAvgs.length?+(subAvgs.reduce((a,b)=>a+b,0)/subAvgs.length).toFixed(1):null;
  const allLessons=LESSON_DATES[cls]||[];
  const totalPresent=allLessons.filter(l=>(LESSON_ATT[`${cls}_${l.lid}_${ME()}`]||'p')==='p').length;
  const totalAbsent =allLessons.filter(l=>LESSON_ATT[`${cls}_${l.lid}_${ME()}`]==='a').length;
  const totalLate   =allLessons.filter(l=>LESSON_ATT[`${cls}_${l.lid}_${ME()}`]==='l').length;
  const totalAttPct =allLessons.length?Math.round(totalPresent/allLessons.length*100):100;
  const allAsgns=ASGN.filter(a=>a.cid===cls);
  const submitted=allAsgns.filter(a=>isDone(a.id,ME())).length;
  const notSubmPct=allAsgns.length?Math.round((1-submitted/allAsgns.length)*100):0;

  const cur=selSub==='all'
    ?{avg:overallAvg,attPct:totalAttPct,absent:totalAbsent,late:totalLate,notSubmPct,asgnsTotal:allAsgns.length,submitted}
    :(()=>{const d=allSubStats.find(d=>d.sub.id===selSub);return{avg:d.avg,attPct:d.attPct,absent:d.absent,late:d.late,notSubmPct:d.notSubmPct,asgnsTotal:d.asgns.length,submitted:d.submitted};})();

  function ring(pct,col,label,sub=''){
    const r=42;const circ=2*Math.PI*r;const off=circ*(1-pct/100);
    return `<div style="text-align:center">
      <div style="position:relative;width:100px;height:100px;margin:0 auto 8px">
        <svg width="100" height="100" viewBox="0 0 100 100" style="transform:rotate(-90deg)">
          <circle cx="50" cy="50" r="${r}" fill="none" stroke="var(--bg3)" stroke-width="8"/>
          <circle cx="50" cy="50" r="${r}" fill="none" stroke="${col}" stroke-width="8"
            stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"
            stroke-linecap="round" style="transition:stroke-dashoffset .8s ease"/>
        </svg>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
          <div style="font-family:var(--ff);font-size:1.25rem;font-weight:600;color:${col};line-height:1">${pct}%</div>
        </div>
      </div>
      <div style="font-size:.8rem;font-weight:600;color:var(--ink)">${label}</div>
      ${sub?`<div style="font-size:.72rem;color:var(--ink3);margin-top:2px">${sub}</div>`:''}
    </div>`;
  }

  return`<div>
    <div class="ph"><div class="pt">Аналітика</div><div class="ps">Навчальний прогрес · Клас 11-А</div></div>


    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:20px">
      <button style="padding:7px 14px;border-radius:var(--r2);border:1.5px solid ${selSub==='all'?'var(--ink)':'var(--line)'};background:${selSub==='all'?'var(--ink)':'var(--sur)'};color:${selSub==='all'?'var(--bg)':'var(--ink2)'};font-size:.81rem;font-weight:600;cursor:pointer;transition:all .15s" onclick="S.analyticsSub='all';render()">Загальне</button>
      ${SUBS.map(s=>`<button style="padding:7px 14px;border-radius:var(--r2);border:1.5px solid ${selSub===s.id?s.c:s.c+'44'};background:${selSub===s.id?s.cb:'var(--sur)'};color:${selSub===s.id?s.c:'var(--ink2)'};font-size:.81rem;font-weight:600;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:6px" onclick="S.analyticsSub='${s.id}';render()"><div style="width:7px;height:7px;border-radius:50%;background:${s.c};flex-shrink:0"></div>${s.n}</button>`).join('')}
    </div>


    <div class="sg sg4" style="margin-bottom:18px">

      <div class="card" style="text-align:center;padding:18px 12px">
        <div style="font-family:var(--ff);font-size:2.6rem;font-weight:500;line-height:1;color:${cur.avg?(+cur.avg>=10?'var(--green)':+cur.avg>=7?'var(--blue)':+cur.avg>=4?'var(--amber)':'var(--red)'):'var(--ink3)'}">
          ${cur.avg||'—'}
        </div>
        <div style="font-size:.78rem;font-weight:600;color:var(--ink);margin-top:6px">Середній бал</div>
        <div style="font-size:.71rem;color:var(--ink3);margin-top:2px">${selSub==='all'?'по всіх предметах':(getSub(selSub)?.n||'')}</div>
        <div style="height:4px;background:var(--bg3);border-radius:2px;overflow:hidden;margin-top:10px">
          <div style="height:100%;border-radius:2px;background:${cur.avg?(+cur.avg>=10?'var(--green)':+cur.avg>=7?'var(--blue)':+cur.avg>=4?'var(--amber)':'var(--red)'):'var(--bg3)'};width:${cur.avg?Math.round(+cur.avg/12*100):0}%;transition:width .8s"></div>
        </div>
      </div>


      <div class="card" style="text-align:center;padding:18px 12px">
        <div style="font-family:var(--ff);font-size:2.6rem;font-weight:500;line-height:1;color:${cur.attPct>=90?'var(--green)':cur.attPct>=75?'var(--amber)':'var(--red)'}">
          ${cur.attPct}%
        </div>
        <div style="font-size:.78rem;font-weight:600;color:var(--ink);margin-top:6px">Відвідуваність</div>
        <div style="font-size:.71rem;color:var(--ink3);margin-top:2px">присутній / всього уроків</div>
        <div style="height:4px;background:var(--bg3);border-radius:2px;overflow:hidden;margin-top:10px">
          <div style="height:100%;border-radius:2px;background:${cur.attPct>=90?'var(--green)':cur.attPct>=75?'var(--amber)':'var(--red)'};width:${cur.attPct}%;transition:width .8s"></div>
        </div>
      </div>


      <div class="card" style="text-align:center;padding:18px 12px">
        <div style="font-family:var(--ff);font-size:2.6rem;font-weight:500;line-height:1;color:${cur.late>3?'var(--red)':cur.late>0?'var(--amber)':'var(--green)'}">
          ${cur.late}
        </div>
        <div style="font-size:.78rem;font-weight:600;color:var(--ink);margin-top:6px">Запізнень</div>
        <div style="font-size:.71rem;color:var(--ink3);margin-top:2px">${cur.absent} пропусків</div>
        <div style="display:flex;gap:5px;justify-content:center;margin-top:10px">
          <span class="b ${cur.absent===0?'b-green':'b-red'}" style="font-size:.68rem">${cur.absent} відс.</span>
          <span class="b ${cur.late===0?'b-green':'b-amber'}" style="font-size:.68rem">${cur.late} запізн.</span>
        </div>
      </div>


      <div class="card" style="text-align:center;padding:18px 12px">
        <div style="font-family:var(--ff);font-size:2.6rem;font-weight:500;line-height:1;color:${cur.notSubmPct===0?'var(--green)':cur.notSubmPct<30?'var(--amber)':'var(--red)'}">
          ${cur.notSubmPct}%
        </div>
        <div style="font-size:.78rem;font-weight:600;color:var(--ink);margin-top:6px">Не здано робіт</div>
        <div style="font-size:.71rem;color:var(--ink3);margin-top:2px">${cur.submitted} з ${cur.asgnsTotal} зданих</div>
        <div style="height:4px;background:var(--bg3);border-radius:2px;overflow:hidden;margin-top:10px">
          <div style="height:100%;border-radius:2px;background:${cur.notSubmPct===0?'var(--green)':cur.notSubmPct<30?'var(--amber)':'var(--red)'};width:${cur.notSubmPct}%;transition:width .8s"></div>
        </div>
      </div>
    </div>

    ${selSub==='all'?`

    <div class="card" style="margin-bottom:14px">
      <div class="ct">Деталі по предметах</div>
      <div style="overflow-x:auto">
        <table class="tbl" style="min-width:500px">
          <thead><tr>
            <th>Предмет</th>
            <th style="text-align:center">Ср. бал</th>
            <th style="text-align:center">Відвід.</th>
            <th style="text-align:center">Запізн.</th>
            <th style="text-align:center">Пропуски</th>
            <th style="text-align:center">Не здано</th>
            <th style="text-align:center">Оцінок</th>
          </tr></thead>
          <tbody>
            ${allSubStats.map(({sub:s,avg,attPct,late,absent,notSubmPct,vals,asgns})=>`
            <tr style="cursor:pointer" onclick="S.analyticsSub='${s.id}';render()">
              <td><div style="display:flex;align-items:center;gap:7px">
                <div style="width:8px;height:8px;border-radius:50%;background:${s.c};flex-shrink:0"></div>
                <span style="font-weight:600">${s.n}</span>
              </div></td>
              <td style="text-align:center"><span class="gc ${avg?gC(String(avg)):'gN'}" style="width:36px;height:28px">${avg||'—'}</span></td>
              <td style="text-align:center"><span class="b ${attPct>=90?'b-green':attPct>=75?'b-amber':'b-red'}" style="font-size:.71rem">${attPct}%</span></td>
              <td style="text-align:center"><span style="font-size:.85rem;font-weight:600;color:${late>2?'var(--amber)':'var(--ink2)'}">${late}</span></td>
              <td style="text-align:center"><span style="font-size:.85rem;font-weight:600;color:${absent>1?'var(--red)':'var(--ink2)'}">${absent}</span></td>
              <td style="text-align:center">${asgns.length>0?`<span class="b ${notSubmPct===0?'b-green':notSubmPct<50?'b-amber':'b-red'}" style="font-size:.71rem">${notSubmPct}%</span>`:'<span style="font-size:.75rem;color:var(--ink3)">—</span>'}</td>
              <td style="text-align:center"><span style="font-size:.82rem;color:var(--ink2)">${vals.length}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>


    <div class="card">
      <div class="ct">Середній бал по предметах</div>
      <div class="cwrap"><canvas id="ch-s-subj"></canvas></div>
    </div>

    `:`

    ${(()=>{
      const d=allSubStats.find(d=>d.sub.id===selSub);
      const s=d.sub;
      const typeC={control:'var(--red)',test:'var(--blue)',oral:'var(--purple)',hw:'var(--amber)',work:'var(--green)',project:'var(--ink)'};
      return`

      <div class="card" style="margin-bottom:14px">
        <div class="ct" style="display:flex;align-items:center;gap:8px">
          <div style="width:8px;height:8px;border-radius:50%;background:${s.c}"></div>
          ${s.n} — деталі
        </div>
        ${d.entries.length===0
          ?`<div class="empty" style="padding:24px"><div class="empty-t">Оцінок ще немає</div></div>`
          :`

          <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:14px">
            ${d.entries.slice().reverse().map(e=>`
            <div style="display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer" onclick="showGradeDetail('${e.id}')" title="${e.comment}">
              <span class="gc ${gC(e.grade)}" style="width:36px;height:30px;font-size:.82rem">${e.grade}</span>
              <div style="width:6px;height:6px;border-radius:50%;background:${typeC[e.type]||'var(--ink3)'}"></div>
              <div style="font-size:.6rem;color:var(--ink3);text-align:center">${e.date}</div>
            </div>`).join('')}
          </div>

          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;font-size:.72rem;color:var(--ink3)">
            ${Object.entries(GRADE_TYPES).map(([k,v])=>`<div style="display:flex;align-items:center;gap:4px"><div style="width:6px;height:6px;border-radius:50%;background:${typeC[k]}"></div>${v}</div>`).join('')}
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px">
            ${Object.entries(GRADE_TYPES).map(([k,v])=>{
              const typeEntries=d.entries.filter(e=>e.type===k);
              const typeVals=typeEntries.map(e=>+e.grade).filter(Boolean);
              const typeAvg=typeVals.length?+(typeVals.reduce((a,b)=>a+b,0)/typeVals.length).toFixed(1):null;
              if(!typeEntries.length)return'';
              return`<div style="background:var(--bg2);border-radius:var(--r2);padding:10px 12px;border-left:3px solid ${typeC[k]||'var(--ink4)'}">
                <div style="font-size:.7rem;color:var(--ink3);margin-bottom:4px">${v}</div>
                <div style="font-family:var(--ff);font-size:1.3rem;font-weight:500;color:${typeAvg?(+typeAvg>=9?'var(--green)':+typeAvg>=7?'var(--amber)':'var(--red)'):'var(--ink3)'}">${typeAvg||'—'}</div>
                <div style="font-size:.69rem;color:var(--ink3)">${typeEntries.length} запис.${typeEntries.length!==1?'ів':''}</div>
              </div>`;
            }).join('')}
          </div>`}
      </div>


      <div class="card">
        <div class="ct">Відвідуваність — ${s.n}</div>
        ${d.ls.length===0
          ?`<div style="font-size:.83rem;color:var(--ink3)">Занять ще немає</div>`
          :`
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;text-align:center">
            <div style="background:var(--gbg);border-radius:var(--r2);padding:12px 6px">
              <div style="font-family:var(--ff);font-size:1.5rem;font-weight:500;color:var(--green)">${d.present}</div>
              <div style="font-size:.7rem;color:var(--ink3)">Присутніх</div>
            </div>
            <div style="background:var(--rbg);border-radius:var(--r2);padding:12px 6px">
              <div style="font-family:var(--ff);font-size:1.5rem;font-weight:500;color:var(--red)">${d.absent}</div>
              <div style="font-size:.7rem;color:var(--ink3)">Пропусків</div>
            </div>
            <div style="background:var(--abg);border-radius:var(--r2);padding:12px 6px">
              <div style="font-family:var(--ff);font-size:1.5rem;font-weight:500;color:var(--amber)">${d.late}</div>
              <div style="font-size:.7rem;color:var(--ink3)">Запізнень</div>
            </div>
            <div style="background:var(--bbg);border-radius:var(--r2);padding:12px 6px">
              <div style="font-family:var(--ff);font-size:1.5rem;font-weight:500;color:var(--blue)">${d.ls.length}</div>
              <div style="font-size:.7rem;color:var(--ink3)">Всього уроків</div>
            </div>
          </div>

          <div style="display:flex;gap:5px;flex-wrap:wrap">
            ${d.ls.map(l=>{
              const v=LESSON_ATT[cls+'_'+l.lid+'_'+ME()]||'p';
              const vc={p:'var(--green)',a:'var(--red)',l:'var(--amber)',e:'var(--purple)'}[v];
              const vl={p:'Присутній',a:'Відсутній',l:'Запізнився',e:'Поважна причина'}[v];
              return`<div title="${l.date} · ${l.topic} · ${vl}" style="cursor:default">
                <div style="width:28px;height:28px;border-radius:6px;background:${vc}22;border:1.5px solid ${vc};display:flex;align-items:center;justify-content:center">
                  <div style="font-size:.65rem;font-weight:700;color:${vc}">${{p:'П',a:'В',l:'З',e:'П*'}[v]}</div>
                </div>
                <div style="font-size:.58rem;color:var(--ink3);text-align:center;margin-top:2px">${l.date.substring(0,5)}</div>
              </div>`;
            }).join('')}
          </div>`}
      </div>
      `;
    })()}
    `}
  </div>`;}
