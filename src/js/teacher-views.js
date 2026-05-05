function rReports(){
  return`<div>
    <div class="ph ph-row"><div><div class="pt">Звіти</div><div class="ps">Аналіз успішності та відвідуваності по класах</div></div></div>
    ${CLS.map(c=>{
      const aa=asgnCls(c.id);
      const attPct=Math.round(c.students.reduce((s,st)=>s+attStats(c.id,st).pct,0)/c.students.length);
      const stuStats=c.students.map(s=>{
        const subAvgs=SUBS.map(sub=>{
          const entries=(GRADE_LOG[`${c.id}_${sub.id}`]||[]).filter(e=>e.student===s);
          const vals=entries.map(e=>+e.grade).filter(Boolean);
          return vals.length?+(vals.reduce((a,b)=>a+b,0)/vals.length):null;
        }).filter(v=>v!==null);
        const avg=subAvgs.length?+(subAvgs.reduce((a,b)=>a+b,0)/subAvgs.length).toFixed(1):0;
        return {name:s,avg};
      });
      const withGrades=stuStats.filter(s=>s.avg>0);
      const classAvgVal=withGrades.length?+(withGrades.map(s=>s.avg).reduce((a,b)=>a+b,0)/withGrades.length).toFixed(1):0;
      const top=[...stuStats].sort((a,b)=>b.avg-a.avg).slice(0,3);
      const concern=stuStats.filter(s=>s.avg>0&&s.avg<9).sort((a,b)=>a.avg-b.avg);
      const subClassAvgs=SUBS.map(sub=>{
        const vals=c.students.flatMap(s=>{
          const entries=(GRADE_LOG[`${c.id}_${sub.id}`]||[]).filter(e=>e.student===s);
          return entries.map(e=>+e.grade).filter(Boolean);
        });
        return {sub,avg:vals.length?+(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1):null};
      });
      return`<div class="report-card">
        <div class="report-hd">
          <div><div style="font-family:var(--ff);font-size:1rem;font-weight:500">Клас ${c.n}</div>
          <div style="font-size:.72rem;color:var(--ink2)">${c.students.length} учнів · ${aa.length} завдань</div></div>
          <button class="btn btn-s btn-sm" onclick="exportReport('${c.id}')">Експорт CSV</button>
        </div>
        <div style="padding:14px 16px">
          <div class="sg sg4" style="margin-bottom:14px">
            <div style="text-align:center"><div style="font-family:var(--ff);font-size:1.5rem;font-weight:500;color:var(--blue)">${classAvgVal||'—'}</div><div style="font-size:.68rem;color:var(--ink3)">Ср. бал класу</div></div>
            <div style="text-align:center"><div style="font-family:var(--ff);font-size:1.5rem;font-weight:500;color:${attPct>=80?'var(--green)':'var(--amber)'}">${attPct}%</div><div style="font-size:.68rem;color:var(--ink3)">Відвідуваність</div></div>
            <div style="text-align:center"><div style="font-family:var(--ff);font-size:1.5rem;font-weight:500;color:var(--green)">${top[0]?.avg||'—'}</div><div style="font-size:.68rem;color:var(--ink3)">Найвищий бал</div></div>
            <div style="text-align:center"><div style="font-family:var(--ff);font-size:1.5rem;font-weight:500;color:${concern.length>0?'var(--red)':'var(--green)'}">${concern.length}</div><div style="font-size:.68rem;color:var(--ink3)">Нижче 9 балів</div></div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;padding:10px 12px;background:var(--bg2);border-radius:var(--r2)">
            <span style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--ink3);margin-right:4px;align-self:center">По предметах:</span>
            ${subClassAvgs.map(({sub:s,avg})=>`<div style="display:flex;align-items:center;gap:5px;padding:4px 9px;border-radius:20px;background:${s.cb};border:1px solid ${s.c}33">
              <div style="width:6px;height:6px;border-radius:50%;background:${s.c}"></div>
              <span style="font-size:.75rem;font-weight:600;color:${s.c}">${s.n.split(' ')[0]}</span>
              <span style="font-size:.77rem;font-weight:700;color:${avg?(+avg>=9?'var(--green)':+avg>=7?'var(--amber)':'var(--red)'):'var(--ink3)'}">${avg||'—'}</span>
            </div>`).join('')}
          </div>
          <div class="g2">
            <div>
              <div style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink3);margin-bottom:6px">Топ учні</div>
              ${top.map((s,i)=>`<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--line)">
                <span style="font-size:.75rem;font-weight:700;color:var(--ink3);width:16px">${i+1}</span>
                <span style="font-size:.82rem;flex:1">${s.name.split(' ')[0]} ${s.name.split(' ')[1]?s.name.split(' ')[1][0]+'.':''}</span>
                <span class="gc ${gC(String(s.avg))}">${s.avg}</span>
              </div>`).join('')}
            </div>
            <div>
              <div style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${concern.length>0?'var(--red)':'var(--ink3)'};margin-bottom:6px">Потребують уваги (< 9)</div>
              ${concern.length===0
                ?`<div style="font-size:.8rem;color:var(--green);padding:6px 0">Всі учні вище 9 балів</div>`
                :concern.map(s=>{
                  const weakSubs=SUBS.filter(sub=>{
                    const entries=(GRADE_LOG[`${c.id}_${sub.id}`]||[]).filter(e=>e.student===s.name);
                    const vals=entries.map(e=>+e.grade).filter(Boolean);
                    const avg=vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:null;
                    return avg!==null&&avg<9;
                  });
                  return `<div style="padding:6px 0;border-bottom:1px solid var(--line)">
                    <div style="display:flex;align-items:center;gap:7px;margin-bottom:3px">
                      <span style="font-size:.82rem;font-weight:600;flex:1">${s.name.split(' ')[0]} ${s.name.split(' ')[1]||''}</span>
                      <span class="gc ${gC(String(s.avg))}">${s.avg}</span>
                    </div>
                    ${weakSubs.length>0?`<div style="display:flex;gap:4px;flex-wrap:wrap">${weakSubs.map(sub=>`<span style="font-size:.67rem;padding:1px 6px;border-radius:10px;background:${sub.cb};color:${sub.c};font-weight:600">${sub.n.split(' ')[0]}</span>`).join('')}</div>`:''}
                  </div>`;
                }).join('')}
            </div>
          </div>
        </div>
      </div>`;
    }).join('')}
  </div>`;}

function exportReport(cid){const c=getCls(cid);let csv='Учень,'+SUBS.map(s=>s.n).join(',')+',Ср.бал,Відвід%\n';c.students.forEach(s=>{const gs=SUBS.map(sub=>GRADES[`${cid}_${s}_${sub.id}`]||'');const vals=gs.map(Number).filter(Boolean);const avg=vals.length?+(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1):0;const att=attStats(cid,s).pct;csv+=`${s},${gs.join(',')},${avg},${att}%\n`;});const a=document.createElement('a');a.href='data:text/csv;charset=utf-8,\uFEFF'+encodeURIComponent(csv);a.download=`report_${cid}.csv`;a.click();}

function rAnnouncements(){return`<div>
  <div class="ph ph-row"><div><div class="pt">Оголошення</div></div><button class="btn btn-p btn-sm" onclick="openModal('newAnn')">${ico('plus',13)} Нове</button></div>
  ${ANNOUNCEMENTS.map(a=>`<div class="ann-it"><div class="ann-top"><span class="b ${a.priority==='high'?'b-red':a.priority==='med'?'b-amber':'b-gray'}" style="flex-shrink:0">${a.priority==='high'?'Важливо':a.priority==='med'?'Увага':'Інфо'}</span><span class="ann-title">${a.title}</span><span style="font-size:.71rem;color:var(--ink3);white-space:nowrap">${a.date}</span><button class="btn-icon del" onclick="ANNOUNCEMENTS=ANNOUNCEMENTS.filter(x=>x.id!=='${a.id}');render()">${ico('trash',12)}</button></div><div class="ann-body">${a.body}</div><div style="margin-top:7px;display:flex;gap:5px;flex-wrap:wrap">${a.classes.map(c=>`<span class="b b-blue">${getCls(c)?.n||c}</span>`).join('')}</div></div>`).join('')}
</div>`;}

function rTasks(){const pnd=TASKS.filter(t=>!t.done);const dn=TASKS.filter(t=>t.done);return`<div>
  <div class="ph ph-row"><div><div class="pt">Мої задачі</div><div class="ps">${pnd.length} очікують</div></div><button class="btn btn-p btn-sm" onclick="openModal('newTask')">${ico('plus',13)} Додати</button></div>
  <div class="card" style="margin-bottom:12px"><div class="ct">Очікують</div>
    ${pnd.length===0?`<div style="font-size:.82rem;color:var(--ink3)">Все виконано!</div>`:pnd.map(t=>`<div style="display:flex;align-items:center;gap:9px;padding:9px 0;border-bottom:1px solid var(--line)"><div style="width:6px;height:6px;border-radius:50%;flex-shrink:0;background:${t.priority==='high'?'var(--red)':t.priority==='med'?'var(--amber)':'var(--green)'}"></div><div style="flex:1"><div style="font-size:.84rem;font-weight:500">${t.text}</div>${t.due?`<div style="font-size:.7rem;color:var(--ink3)">до ${t.due}</div>`:''}</div><button class="btn btn-green btn-sm" onclick="TASKS.find(x=>x.id==='${t.id}').done=true;render()">Готово</button><button class="btn-icon del" onclick="TASKS=TASKS.filter(x=>x.id!=='${t.id}');render()">${ico('trash',12)}</button></div>`).join('')}
  </div>
  ${dn.length>0?`<div class="card"><div class="ct" style="color:var(--ink2)">Виконані</div>${dn.map(t=>`<div style="display:flex;align-items:center;gap:9px;padding:7px 0;border-bottom:1px solid var(--line);opacity:.5"><span style="font-size:.83rem;text-decoration:line-through;flex:1">${t.text}</span><button class="btn-icon del" onclick="TASKS=TASKS.filter(x=>x.id!=='${t.id}');render()">${ico('trash',12)}</button></div>`).join('')}</div>`:''}</div>`;}

function rLessonPlanner(){
  const all=Object.values(LESSONS).flat();
  const byDay={};all.forEach(l=>{if(!byDay[l.day])byDay[l.day]=[];byDay[l.day].push(l);});
  return`<div>
    <div class="ph ph-row"><div><div class="pt">Плани уроків</div><div class="ps">${all.length} уроків на тижні</div></div><button class="btn btn-p btn-sm" onclick="openModal('newLesson',null)">${ico('plus',13)} Урок</button></div>
    ${[1,2,3,4,5].map(day=>{const dls=(byDay[day]||[]).sort((a,b)=>a.time.localeCompare(b.time));return`<div class="sch-day">${DAY_N[day]}<span style="font-size:.73rem;color:var(--ink3);font-family:var(--fb);font-weight:400">${dls.length} уроків</span></div>
    ${dls.length===0?`<div style="font-size:.78rem;color:var(--ink3);padding:3px 0 10px">Уроків немає</div>`:dls.map(l=>{const s=getSub(l.sid);const cid=Object.keys(LESSONS).find(k=>LESSONS[k].some(x=>x.id===l.id))||'';return`<div class="ri" style="margin-bottom:6px"><div class="ri-ic" style="background:${s.cb}">${ico('lesson',14)}</div><div class="ri-inf" style="cursor:pointer" onclick="go('lesson-detail',{lessonId:'${l.id}',lessonCid:'${cid}'})"><div class="ri-t">${s.n} · ${l.time} · каб.${l.room}</div><div class="ri-m">${l.topic}</div></div><div class="ri-r">${(l.tags||[]).map(t=>`<div class="lp-tag">${t}</div>`).join('')}<button class="btn-icon del" onclick="if(confirm('Видалити?')){if(LESSONS['${cid}'])LESSONS['${cid}']=LESSONS['${cid}'].filter(x=>x.id!=='${l.id}');render()}">${ico('trash',13)}</button></div></div>`;}).join('')}`;}).join('')}
  </div>`;}

function rLessonDetail(){
  const cid=S.lessonCid||Object.keys(LESSONS).find(k=>(LESSONS[k]||[]).some(l=>l.id===S.lessonId));
  const lesson=(LESSONS[cid]||[]).find(l=>l.id===S.lessonId);
  if(!lesson)return`<div><button class="bca" onclick="go('lesson-planner')">← Назад</button><div style="padding:20px;color:var(--ink3)">Урок не знайдено</div></div>`;
  const s=getSub(lesson.sid);
  const isEdit=S.lessonEdit;
  return`<div>
    <div class="bc"><button class="bca" onclick="go('lesson-planner')">Плани уроків</button><span class="bcs">›</span><span class="bcc">${lesson.topic}</span></div>
    <div class="ph ph-row">
      <div style="display:flex;align-items:center;gap:12px"><div style="width:42px;height:42px;border-radius:10px;background:${s.cb};display:grid;place-items:center;flex-shrink:0">${ico('lesson',17)}</div><div><div class="pt" style="font-size:1.25rem">${lesson.topic}</div><div class="ps">${s.n} · ${DAY_N[lesson.day]} · ${lesson.time} · каб.${lesson.room}</div></div></div>
      <button class="btn btn-s btn-sm" onclick="S.lessonEdit=!S.lessonEdit;render()">${ico('edit',13)} ${isEdit?'Скасувати':'Редагувати'}</button>
    </div>
    ${isEdit?rLessonEditForm(lesson,cid):`<div class="g2" style="align-items:start">
      <div>
        <div class="card" style="margin-bottom:10px"><div class="ct">Цілі</div><div style="font-size:.84rem;color:var(--ink2);line-height:1.7">${lesson.objectives||'Не вказано'}</div></div>
        <div class="card" style="margin-bottom:10px"><div class="ct">Матеріали</div><div style="font-size:.84rem;color:var(--ink2);line-height:1.7">${lesson.materials||'Не вказано'}</div></div>
        <div class="card"><div class="ct">Домашнє завдання</div><div style="font-size:.84rem;color:var(--ink2)">${lesson.homework||'Не задано'}</div></div>
      </div>
      <div>
        <div class="card" style="margin-bottom:10px"><div class="ct">Хід уроку</div><div style="font-size:.84rem;color:var(--ink2);line-height:1.8;white-space:pre-line">${lesson.activities||'Не описано'}</div></div>
        <div class="card"><div class="ct">Теги</div><div style="display:flex;gap:4px;flex-wrap:wrap">${(lesson.tags||[]).map(t=>`<div class="lp-tag">${t}</div>`).join('')||'Немає'}</div></div>
      </div>
    </div>`}
  </div>`;}
function rLessonEditForm(l,cid){return`<div class="card"><div class="ct">Редагувати план</div><div class="fg"><label class="fl">Тема</label><input class="fi" id="le-topic" value="${l.topic}"/></div><div class="frow"><div class="fg"><label class="fl">День</label><select class="fs" id="le-day">${[1,2,3,4,5].map(d=>`<option value="${d}"${l.day===d?' selected':''}>${DAY_N[d]}</option>`).join('')}</select></div><div class="fg"><label class="fl">Час</label><input class="fi" id="le-time" value="${l.time}"/></div></div><div class="frow"><div class="fg"><label class="fl">Кабінет</label><input class="fi" id="le-room" value="${l.room}"/></div><div class="fg"><label class="fl">Предмет</label><select class="fs" id="le-sid">${SUBS.map(s=>`<option value="${s.id}"${l.sid===s.id?' selected':''}>${s.n}</option>`).join('')}</select></div></div><div class="fg"><label class="fl">Цілі</label><textarea class="fta" id="le-obj">${l.objectives||''}</textarea></div><div class="fg"><label class="fl">Матеріали</label><textarea class="fta" id="le-mat">${l.materials||''}</textarea></div><div class="fg"><label class="fl">Хід уроку</label><textarea class="fta" id="le-act" rows="4">${l.activities||''}</textarea></div><div class="fg"><label class="fl">Домашнє завдання</label><input class="fi" id="le-hw" value="${l.homework||''}"/></div><div class="fg"><label class="fl">Теги (через кому)</label><input class="fi" id="le-tags" value="${(l.tags||[]).join(', ')}"/></div><div style="display:flex;gap:10px;justify-content:flex-end"><button class="btn btn-s btn-sm" onclick="S.lessonEdit=false;render()">Скасувати</button><button class="btn btn-p btn-sm" onclick="saveLessonEdit('${l.id}','${cid}')">Зберегти</button></div></div>`;}
function saveLessonEdit(lid,cid){const l=(LESSONS[cid]||[]).find(x=>x.id===lid);if(!l)return;l.topic=document.getElementById('le-topic').value;l.day=+document.getElementById('le-day').value;l.time=document.getElementById('le-time').value;l.room=document.getElementById('le-room').value;l.sid=document.getElementById('le-sid').value;l.objectives=document.getElementById('le-obj').value;l.materials=document.getElementById('le-mat').value;l.activities=document.getElementById('le-act').value;l.homework=document.getElementById('le-hw').value;l.tags=document.getElementById('le-tags').value.split(',').map(t=>t.trim()).filter(Boolean);S.lessonEdit=false;render();}

function rQuickAttend(){const date=ATT_DATES[0];const modes=[{k:'p',l:'Присутній',cl:'qa-p'},{k:'a',l:'Відсутній',cl:'qa-a'},{k:'l',l:'Запізнився',cl:'qa-l'},{k:'e',l:'Поважна',cl:'qa-e'}];return`<div>
  <div class="ph ph-row"><div><div class="pt">Відвідуваність</div><div class="ps">${date}</div></div></div>
  <div class="g2" style="align-items:start">
    <div>
      <div class="card" style="margin-bottom:12px"><div class="ct">Режим відмітки</div><div style="display:flex;gap:7px;flex-wrap:wrap">${modes.map(m=>`<button class="qa-btn ${m.cl}${S.attMode===m.k?' sel':''}" onclick="S.attMode='${m.k}';render()">${m.l}</button>`).join('')}</div></div>
      ${CLS.map(c=>`<div class="card" style="margin-bottom:10px"><div class="ct" style="display:flex;align-items:center;justify-content:space-between">${c.n}<div style="display:flex;gap:5px"><button class="btn btn-s btn-sm" onclick="getCls('${c.id}').students.forEach(s=>{ATTENDANCE['${c.id}_'+s+'_${date}']='p'});render()">Всі присутні</button><button class="btn btn-s btn-sm" onclick="go('class',{tcid:'${c.id}',ttab:'attendance'})">Журнал</button></div></div><div style="display:flex;flex-wrap:wrap;gap:5px">${c.students.map(s=>{const v=ATTENDANCE[`${c.id}_${s}_${date}`]||'n';return`<div style="cursor:pointer;padding:5px 8px;border-radius:6px;border:1.5px solid ${v==='p'?'var(--green)':v==='a'?'var(--red)':v==='l'?'var(--amber)':v==='e'?'var(--purple)':'var(--line)'};background:${v==='p'?'var(--gbg)':v==='a'?'var(--rbg)':v==='l'?'var(--abg)':v==='e'?'var(--pbg)':'var(--bg2)'};font-size:.75rem;font-weight:600;color:${v==='p'?'var(--green)':v==='a'?'var(--red)':v==='l'?'var(--amber)':v==='e'?'var(--purple)':'var(--ink3)'}" onclick="ATTENDANCE['${c.id}_${s}_${date}']=S.attMode;render()" title="${s}">${s.split(' ')[0].substring(0,7)}</div>`;}).join('')}</div></div>`).join('')}
    </div>
    <div class="card"><div class="ct">Підсумок</div>${CLS.map(c=>{const p=c.students.filter(s=>ATTENDANCE[`${c.id}_${s}_${date}`]==='p').length;const a=c.students.filter(s=>ATTENDANCE[`${c.id}_${s}_${date}`]==='a').length;const l=c.students.filter(s=>ATTENDANCE[`${c.id}_${s}_${date}`]==='l').length;const e=c.students.filter(s=>ATTENDANCE[`${c.id}_${s}_${date}`]==='e').length;return`<div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid var(--line)"><div style="font-weight:600;font-size:.85rem;margin-bottom:7px">${c.n}</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px;text-align:center"><div style="background:var(--gbg);border-radius:5px;padding:7px 3px"><div style="font-weight:700;color:var(--green)">${p}</div><div style="font-size:.63rem;color:var(--ink3)">Присутні</div></div><div style="background:var(--rbg);border-radius:5px;padding:7px 3px"><div style="font-weight:700;color:var(--red)">${a}</div><div style="font-size:.63rem;color:var(--ink3)">Відсутні</div></div><div style="background:var(--abg);border-radius:5px;padding:7px 3px"><div style="font-weight:700;color:var(--amber)">${l}</div><div style="font-size:.63rem;color:var(--ink3)">Запізн.</div></div><div style="background:var(--pbg);border-radius:5px;padding:7px 3px"><div style="font-weight:700;color:var(--purple)">${e}</div><div style="font-size:.63rem;color:var(--ink3)">Поважна</div></div></div></div>`;}).join('')}</div>
  </div>
</div>`;}
