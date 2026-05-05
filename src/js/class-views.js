function rClass(){const c=getCls(S.tcid);const aa=asgnCls(S.tcid);const tab=S.ttab||'students';
const tabs=[{k:'students',l:'Учні'},{k:'assignments',l:'Завдання'},{k:'grades',l:'Журнал'},{k:'attendance',l:'Відвідуваність'},{k:'materials',l:'Матеріали'},{k:'schedule',l:'Розклад'},{k:'analytics',l:'Аналітика'}];
return`<div>
  <div class="bc"><button class="bca" onclick="go('classes')">Класи</button><span class="bcs">›</span><span class="bcc">${c.n}</span></div>
  <div class="ph ph-row">
    <div><div class="pt" style="font-size:1.3rem">${c.n}</div><div class="ps">${c.students.length} учнів · ${clsAvg(c.id)} ср. бал</div></div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      ${tab==='assignments'?`<button class="btn btn-p btn-sm" onclick="openB('${c.id}')">${ico('plus',12)} Завдання</button>`:''}
      ${tab==='materials'?`<button class="btn btn-p btn-sm" onclick="openModal('uploadMat','${c.id}')">${ico('plus',12)} Матеріал</button>`:''}
      ${tab==='schedule'?`<button class="btn btn-p btn-sm" onclick="openModal('newLesson','${c.id}')">${ico('plus',12)} Урок</button>`:''}
    </div>
  </div>
  <div class="tabs">${tabs.map(t=>`<button class="tab${tab===t.k?' act':''}" onclick="S.ttab='${t.k}';render()">${t.l}</button>`).join('')}</div>
  ${tab==='students'?rStudTab(c):''}${tab==='assignments'?rAsgnTab(aa,c):''}${tab==='grades'?rGradeJournal(c):''}${tab==='attendance'?rAttTab(c):''}${tab==='materials'?rMatsTab(c):''}${tab==='schedule'?rSchTab(c):''}${tab==='analytics'?rClsAnalytics(c):''}
</div>`;}

function rStudTab(c){return`<div class="tbl-wrap"><table class="tbl"><thead><tr><th>#</th><th>Учень</th><th>Ср. бал</th><th class="hide-mob">Відвідуваність</th><th class="hide-mob">Завдань</th><th></th></tr></thead><tbody>${c.students.map((s,i)=>{const vs=SUBS.map(sub=>+(GRADES[`${c.id}_${s}_${sub.id}`]||0)).filter(Boolean);const avg=vs.length?+(vs.reduce((a,b)=>a+b,0)/vs.length).toFixed(1):0;const att=attStats(c.id,s);const dn=ASGN.filter(a=>a.cid===c.id&&isDone(a.id,s)).length;const tot=asgnCls(c.id).length;const notes=(STUDENT_NOTES[`${c.id}_${s}`]||[]).length;return`<tr><td style="color:var(--ink3);font-size:.73rem">${i+1}</td><td><div style="font-weight:600">${s}</div>${notes>0?`<div style="font-size:.68rem;color:var(--amber)">${notes} нот.</div>`:''}</td><td><span class="gc ${gC(String(avg))}">${avg||'—'}</span></td><td class="hide-mob"><span class="b ${att.pct>=80?'b-green':att.pct>=60?'b-amber':'b-red'}">${att.pct}%</span></td><td class="hide-mob"><span class="b b-gray">${dn}/${tot}</span></td><td><button class="btn btn-s btn-sm" onclick="go('student-profile',{stuName:'${s}',stuCid:'${c.id}'})">Профіль</button></td></tr>`;}).join('')}</tbody></table></div>`;}

function rAsgnTab(aa,c){if(!aa.length)return`<div class="empty"><div class="empty-t">Немає завдань</div></div>`;return aa.map(a=>{const s=getSub(a.sid);const sub=c.students.filter(st=>isDone(a.id,st)).length;const avgP=sub>0?Math.round(c.students.filter(st=>isDone(a.id,st)).reduce((sm,st)=>sm+(SUBS_DATA[a.id+'_'+st]?.pct||0),0)/sub):0;return`<div class="ri"><div class="ri-ic" style="background:${tBg(a.type)}">${ico('file',14)}</div><div class="ri-inf"><div class="ri-t">${a.title}</div><div class="ri-m">${s.n} · до ${fmt(a.due)} · ${a.tmin}хв · ${a.qs.length}пит.${a.src==='ai'?' · AI':''}</div></div><div class="ri-r"><span class="b b-gray">${sub}/${c.students.length}</span>${sub>0?`<span class="b ${avgP>=75?'b-green':avgP>=60?'b-amber':'b-red'}">${avgP}%</span>`:''}<span class="b ${tBdg(a.type)}">${tL(a.type)}</span><button class="btn btn-s btn-sm" onclick="go('tres',{taid:'${a.id}'})">Рез.</button><button class="btn-icon del" onclick="if(confirm('Видалити?')){ASGN=ASGN.filter(x=>x.id!=='${a.id}');render()}">${ico('trash',12)}</button></div></div>`;}).join('');}

function rGradeJournal(c){
  const selSub=S.gradeSub||(SUBS[0].id);
  const sub=getSub(selSub);
  const entries=(GRADE_LOG[`${c.id}_${selSub}`]||[]);
  const allDates=[...new Set(entries.map(e=>e.date))].sort((a,b)=>{
    const pd=d=>d.split('.').reverse().join('');return pd(a).localeCompare(pd(b));
  });
  function studentAvg(name){
    const vs=entries.filter(e=>e.student===name).map(e=>+e.grade).filter(Boolean);
    return vs.length?+(vs.reduce((a,b)=>a+b,0)/vs.length).toFixed(1):null;
  }
  const typeColors={control:'var(--red)',test:'var(--blue)',oral:'var(--purple)',hw:'var(--amber)',work:'var(--green)',project:'var(--ink)'};
  const typeBg={control:'var(--rbg)',test:'var(--bbg)',oral:'var(--pbg)',hw:'var(--abg)',work:'var(--gbg)',project:'var(--bg3)'};
  return`<div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap">
      <div style="display:flex;gap:5px;flex-wrap:wrap;flex:1">
        ${SUBS.map(s=>`<button class="btn ${selSub===s.id?'btn-p':'btn-s'} btn-sm" onclick="S.gradeSub='${s.id}';render()" style="${selSub===s.id?'':''}border-left:3px solid ${s.c}">${s.n.split(' ')[0]}</button>`).join('')}
      </div>
      <div style="display:flex;gap:7px">
        <button class="btn btn-blue btn-sm" onclick="openModal('addGrade','${c.id}','${selSub}')">+ Виставити оцінку</button>
        <button class="btn btn-s btn-sm" onclick="exportGradeLog('${c.id}','${selSub}')">CSV</button>
      </div>
    </div>


    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;font-size:.74rem">
      ${Object.entries(GRADE_TYPES).map(([k,v])=>`<div style="display:flex;align-items:center;gap:4px"><div style="width:8px;height:8px;border-radius:50%;background:${typeColors[k]}"></div><span style="color:var(--ink2)">${v}</span></div>`).join('')}
    </div>

    ${allDates.length===0?`<div class="empty"><div class="empty-t">Оцінок немає</div><div class="empty-s">Натисніть «Виставити оцінку» щоб додати запис</div></div>`:`

    <div class="tbl-wrap" style="margin-bottom:16px">
      <table style="border-collapse:collapse;min-width:100%;background:var(--sur)">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px 12px;font-size:.63rem;font-weight:700;text-transform:uppercase;color:var(--ink3);border-bottom:1px solid var(--line);background:var(--bg2);position:sticky;left:0;min-width:150px">Учень</th>
            ${allDates.map(d=>{
              const dayEntries=entries.filter(e=>e.date===d);
              const topics=[...new Set(dayEntries.map(e=>e.topic))].join(', ');
              const types=[...new Set(dayEntries.map(e=>e.type))];
              return`<th style="padding:6px 8px;font-size:.63rem;font-weight:700;color:var(--ink3);border-bottom:1px solid var(--line);background:var(--bg2);min-width:80px;text-align:center" title="${topics}">
                <div style="font-size:.7rem;font-weight:700;color:var(--ink)">${d}</div>
                <div style="font-size:.64rem;color:var(--ink3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:80px">${topics||''}</div>
                <div style="display:flex;gap:2px;justify-content:center;margin-top:3px">${types.map(t=>`<div style="width:6px;height:6px;border-radius:50%;background:${typeColors[t]||'var(--ink3)'}"></div>`).join('')}</div>
              </th>`;}).join('')}
            <th style="padding:8px;font-size:.63rem;font-weight:700;text-transform:uppercase;color:var(--ink3);border-bottom:1px solid var(--line);background:var(--bg2);min-width:64px;text-align:center">Ср.</th>
          </tr>
        </thead>
        <tbody>
          ${c.students.map(student=>{
            const avg=studentAvg(student);
            return`<tr>
              <td style="font-weight:600;font-size:.83rem;padding:7px 12px;border-bottom:1px solid var(--line);position:sticky;left:0;background:var(--sur)">${student}</td>
              ${allDates.map(d=>{
                const cell=entries.filter(e=>e.student===student&&e.date===d);
                if(!cell.length)return`<td style="text-align:center;padding:5px 6px;border-bottom:1px solid var(--line)"><span style="color:var(--ink4);font-size:.75rem">—</span></td>`;
                return`<td style="text-align:center;padding:4px 4px;border-bottom:1px solid var(--line)">
                  ${cell.map(e=>`<span class="gc ${gC(e.grade)}"
                    style="cursor:pointer;display:inline-flex;margin:1px;position:relative"
                    onclick="showGradeDetail('${e.id}')"
                    title="${e.comment}">${e.grade}</span>`).join('')}
                </td>`;}).join('')}
              <td style="text-align:center;padding:5px 6px;border-bottom:1px solid var(--line)">
                ${avg!==null?`<span class="gc ${gC(String(avg))}" style="font-weight:700">${avg}</span>`:`<span style="color:var(--ink4);font-size:.75rem">—</span>`}
              </td>
            </tr>`;}).join('')}
        </tbody>
      </table>
    </div>


    <div class="ct" style="margin-bottom:10px">Всі записи — ${sub.n}</div>
    ${entries.slice().reverse().map(e=>`
    <div class="ri" style="margin-bottom:6px;align-items:flex-start">
      <div style="flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:4px;padding:4px 0">
        <span class="gc ${gC(e.grade)}" style="flex-shrink:0">${e.grade}</span>
        <div style="width:8px;height:8px;border-radius:50%;background:${typeColors[e.type]||'var(--ink3)'}"></div>
      </div>
      <div class="ri-inf">
        <div style="font-size:.86rem;font-weight:600;margin-bottom:2px">${e.student}</div>
        <div style="font-size:.78rem;color:var(--blue);font-weight:500;margin-bottom:3px">${GRADE_TYPES[e.type]||e.type} · ${e.date} · ${e.topic}</div>
        <div style="font-size:.81rem;color:var(--ink2);line-height:1.55">${e.comment}</div>
      </div>
      <div class="ri-r" style="flex-shrink:0">
        <button class="btn-icon del" onclick="if(confirm('Видалити цей запис?')){const k='${c.id}_${selSub}';GRADE_LOG[k]=GRADE_LOG[k].filter(x=>x.id!=='${e.id}');rebuildGrades();render()}">${ico('trash',12)}</button>
      </div>
    </div>`).join('')}
    `}
  </div>`;}

function rebuildGrades(){
  CLS.forEach(c=>SUBS.forEach(sub=>{
    c.students.forEach(s=>{
      const entries=(GRADE_LOG[`${c.id}_${sub.id}`]||[]).filter(e=>e.student===s);
      const vals=entries.map(e=>+e.grade).filter(Boolean);
      GRADES[`${c.id}_${s}_${sub.id}`]=vals.length?String(+(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1)):'';
    });
  }));
}

function showGradeDetail(gid){
  const entry=Object.values(GRADE_LOG).flat().find(e=>e.id===gid);
  if(!entry)return;
  const typeColors={control:'var(--red)',test:'var(--blue)',oral:'var(--purple)',hw:'var(--amber)',work:'var(--green)',project:'var(--ink)'};
  S.modal={type:'gradeDetail',args:[entry,typeColors]};render();
}

function exportGradeLog(cid,sid){
  const entries=GRADE_LOG[`${cid}_${sid}`]||[];
  let csv='Учень,Дата,Тип,Тема,Оцінка,Коментар\n';
  entries.forEach(e=>{csv+=`"${e.student}","${e.date}","${GRADE_TYPES[e.type]}","${e.topic}","${e.grade}","${e.comment}"\n`;});
  const a=document.createElement('a');a.href='data:text/csv;charset=utf-8,\uFEFF'+encodeURIComponent(csv);a.download=`grades_${cid}_${sid}.csv`;a.click();
  toast('CSV завантажено','ok');
}
function editGrade(cid,student,subId){openModal('addGrade',cid,subId,student);}
function exportGrades(cid){
  const c=getCls(cid);let csv='Учень,'+SUBS.map(s=>s.n).join(',')+',Ср.бал\n';
  c.students.forEach(s=>{const gs=SUBS.map(sub=>GRADES[`${cid}_${s}_${sub.id}`]||'');const vs=gs.map(Number).filter(Boolean);const avg=vs.length?+(vs.reduce((a,b)=>a+b,0)/vs.length).toFixed(1):0;csv+=`${s},${gs.join(',')},${avg}\n`;});
  const a=document.createElement('a');a.href='data:text/csv;charset=utf-8,\uFEFF'+encodeURIComponent(csv);a.download=`grades_${cid}.csv`;a.click();
}

function rAttTab(c){
  const lessons=(LESSON_DATES[c.id]||[]);
  const attKeys={p:'П',a:'В',l:'З',e:'П*',n:'—'};
  const attNext={p:'a',a:'l',l:'e',e:'p',n:'p'};
  const attColors={p:'var(--green)',a:'var(--red)',l:'var(--amber)',e:'var(--purple)',n:'var(--ink4)'};
  const attBg={p:'var(--gbg)',a:'var(--rbg)',l:'var(--abg)',e:'var(--pbg)',n:'var(--bg2)'};
  const attBdr={p:'#A8E6C0',a:'#F5C0C0',l:'#F0D090',e:'#C4A8E6',n:'var(--line)'};

  const byDate={};
  lessons.forEach(l=>{if(!byDate[l.date])byDate[l.date]=[];byDate[l.date].push(l);});
  const sortedDates=Object.keys(byDate).sort((a,b)=>{const pd=d=>d.split('.').reverse().join('');return pd(a).localeCompare(pd(b));});

  function stuStats(student){
    let p=0,a=0,l=0,e=0;
    lessons.forEach(ls=>{const v=LESSON_ATT[`${c.id}_${ls.lid}_${student}`]||'p';if(v==='p')p++;else if(v==='a')a++;else if(v==='l')l++;else if(v==='e')e++;});
    const total=lessons.length||1;
    return{p,a,l,e,pct:Math.round(p/total*100)};
  }

  return`<div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap">
      <div style="display:flex;gap:7px;flex-wrap:wrap;font-size:.75rem">
        <span class="b b-green">П — присутній</span>
        <span class="b b-red">В — відсутній</span>
        <span class="b b-amber">З — запізнився</span>
        <span class="b b-purple">П* — поважна причина</span>
      </div>
      <button class="btn btn-s btn-sm" style="margin-left:auto" onclick="exportLessonAtt('${c.id}')">CSV</button>
    </div>
    <div style="font-size:.75rem;color:var(--ink3);margin-bottom:10px">Клік на клітинку — зміна статусу · ${lessons.length} занять</div>

    <div class="att-wrap">
      <table class="att-tbl" style="min-width:${140+lessons.length*52}px">
        <thead>

          <tr>
            <th style="text-align:left;min-width:150px">Учень / Дата</th>
            ${sortedDates.map(d=>{const cnt=byDate[d].length;return`<th colspan="${cnt}" style="text-align:center;padding:5px 8px;background:var(--bg2);border-left:1px solid var(--line2)">
              <div style="font-size:.72rem;font-weight:700;color:var(--ink)">${d}</div>
            </th>`;}).join('')}
            <th rowspan="2" style="text-align:center;min-width:40px;background:var(--bg2)">%</th>
            <th rowspan="2" style="text-align:center;min-width:30px;background:var(--bg2);color:var(--green)" title="Присутніх">П</th>
            <th rowspan="2" style="text-align:center;min-width:30px;background:var(--bg2);color:var(--red)" title="Відсутніх">В</th>
          </tr>

          <tr>
            <th style="text-align:left;background:var(--bg2);padding:4px 12px;font-size:.62rem;color:var(--ink3)">Предмет →</th>
            ${sortedDates.map(d=>byDate[d].map(l=>{const s=getSub(l.sid);return`<th style="text-align:center;padding:4px 6px;background:var(--bg2);min-width:48px;border-left:${byDate[d][0]===l?'1px solid var(--line2)':'none'}">
              <div style="width:6px;height:6px;border-radius:50%;background:${s.c};margin:0 auto 2px"></div>
              <div style="font-size:.6rem;color:var(--ink3);white-space:nowrap">${s.n.split(' ')[0]}</div>
              <div style="font-size:.59rem;color:var(--ink4)">${l.time}</div>
            </th>`;}).join('')).join('')}
          </tr>
        </thead>
        <tbody>
          ${c.students.map(student=>{
            const stats=stuStats(student);
            return`<tr>
              <td style="font-weight:600;font-size:.83rem">${student}</td>
              ${sortedDates.map(d=>byDate[d].map(l=>{
                const key=`${c.id}_${l.lid}_${student}`;
                const v=LESSON_ATT[key]||'p';
                const nxt={p:'a',a:'l',l:'e',e:'p'};
                return`<td style="border-left:${byDate[d][0]===l?'1px solid var(--line2)':'none'}">
                  <div class="ac" style="background:${attBg[v]};border-color:${attBdr[v]};color:${attColors[v]}"
                    onclick="LESSON_ATT['${key}']='${nxt[v]||'p'}';syncAttendance('${c.id}');render()"
                    title="${getSub(l.sid).n} · ${l.topic}">
                    ${attKeys[v]||'—'}
                  </div>
                </td>`;}).join('')).join('')}
              <td style="text-align:center"><span class="b ${stats.pct>=80?'b-green':stats.pct>=60?'b-amber':'b-red'}" style="font-size:.68rem">${stats.pct}%</span></td>
              <td style="text-align:center;font-size:.8rem;font-weight:600;color:var(--green)">${stats.p}</td>
              <td style="text-align:center;font-size:.8rem;font-weight:600;color:var(--red)">${stats.a}</td>
            </tr>`;}).join('')}
        </tbody>

        <tfoot>
          <tr style="background:var(--bg2)">
            <td style="font-size:.7rem;font-weight:700;color:var(--ink3);padding:5px 12px;text-align:left">Всього присутніх</td>
            ${sortedDates.map(d=>byDate[d].map(l=>{
              const present=c.students.filter(s=>(LESSON_ATT[`${c.id}_${l.lid}_${s}`]||'p')==='p').length;
              const total=c.students.length;
              return`<td style="text-align:center;padding:4px;border-left:${byDate[d][0]===l?'1px solid var(--line2)':'none'}"><span style="font-size:.7rem;font-weight:700;color:${present/total>=.8?'var(--green)':'var(--red)'}">${present}/${total}</span></td>`;}).join('')).join('')}
            <td colspan="3"></td>
          </tr>

          <tr style="background:var(--bg)">
            <td style="font-size:.68rem;color:var(--ink3);padding:4px 12px;text-align:left">Тема заняття</td>
            ${sortedDates.map(d=>byDate[d].map(l=>`<td style="padding:4px 3px;border-left:${byDate[d][0]===l?'1px solid var(--line2)':'none'}"><div style="font-size:.6rem;color:var(--ink3);writing-mode:vertical-rl;transform:rotate(180deg);height:60px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis" title="${l.topic}">${l.topic}</div></td>`).join('')).join('')}
            <td colspan="3"></td>
          </tr>
        </tfoot>
      </table>
    </div>


    <div style="margin-top:14px">
      <div class="ct">Підсумок по заняттях</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px">
        ${sortedDates.map(d=>byDate[d].map(l=>{
          const s=getSub(l.sid);
          const present=c.students.filter(st=>(LESSON_ATT[`${c.id}_${l.lid}_${st}`]||'p')==='p').length;
          const absent=c.students.filter(st=>LESSON_ATT[`${c.id}_${l.lid}_${st}`]==='a');
          return`<div class="card card-sm" style="padding:12px 14px;border-left:3px solid ${s.c}">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px">
              <div style="width:7px;height:7px;border-radius:50%;background:${s.c}"></div>
              <span style="font-size:.8rem;font-weight:600">${s.n}</span>
              <span style="font-size:.74rem;color:var(--ink3);margin-left:auto">${d} · ${l.time}</span>
            </div>
            <div style="font-size:.78rem;color:var(--ink2);margin-bottom:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${l.topic}</div>
            <div style="display:flex;gap:8px;align-items:center">
              <span class="b ${present/c.students.length>=.8?'b-green':'b-amber'}" style="font-size:.68rem">${present}/${c.students.length} присутні</span>
              ${absent.length>0?`<span style="font-size:.68rem;color:var(--red)">Відсутні: ${absent.slice(0,2).map(s=>s.split(' ')[0]).join(', ')}${absent.length>2?'…':''}</span>`:''}
            </div>
          </div>`;}).join('')).join('')}
      </div>
    </div>
  </div>`;}

function syncAttendance(cid){
  const c=getCls(cid);
  ATT_DATES.forEach(d=>{
    const ls=(LESSON_DATES[cid]||[]).filter(l=>l.date===d);
    c.students.forEach(s=>{
      if(!ls.length)return;
      const vals=ls.map(l=>LESSON_ATT[`${cid}_${l.lid}_${s}`]||'p');
      ATTENDANCE[`${cid}_${s}_${d}`]=vals.includes('a')?'a':vals.includes('l')?'l':'p';
    });
  });
}

function exportLessonAtt(cid){
  const c=getCls(cid);const ls=LESSON_DATES[cid]||[];
  let csv='Учень,'+ls.map(l=>`"${l.date} ${getSub(l.sid).n} ${l.topic}"`).join(',')+',Відвід.%\n';
  c.students.forEach(s=>{
    const vals=ls.map(l=>LESSON_ATT[`${cid}_${l.lid}_${s}`]||'p');
    const pct=Math.round(vals.filter(v=>v==='p').length/vals.length*100);
    csv+=`"${s}",${vals.join(',')},${pct}%\n`;
  });
  const a=document.createElement('a');a.href='data:text/csv;charset=utf-8,\uFEFF'+encodeURIComponent(csv);a.download=`attendance_lessons_${cid}.csv`;a.click();
  toast('CSV завантажено','ok');
}
function exportAtt(cid){exportLessonAtt(cid);}
function exportAtt(cid){const c=getCls(cid);let csv='Учень,'+ATT_DATES.join(',')+',Відвід.%\n';c.students.forEach(s=>{const vs=ATT_DATES.map(d=>ATTENDANCE[`${cid}_${s}_${d}`]||'n');const pct=Math.round(vs.filter(v=>v==='p').length/vs.length*100);csv+=`${s},${vs.join(',')},${pct}%\n`;});const a=document.createElement('a');a.href='data:text/csv;charset=utf-8,\uFEFF'+encodeURIComponent(csv);a.download=`att_${cid}.csv`;a.click();}

function rMatsTab(c){return`<div>${SUBS.map(s=>{const mats=MATERIALS[`${c.id}_${s.id}`]||[];return`<div style="margin-bottom:16px"><div style="display:flex;align-items:center;gap:7px;margin-bottom:7px"><div style="width:7px;height:7px;border-radius:50%;background:${s.c}"></div><div class="sec" style="margin:0">${s.n}</div><span class="b b-gray">${mats.length}</span><button class="btn btn-s btn-sm" style="margin-left:8px" onclick="openModal('uploadMat','${c.id}','${s.id}')">${ico('plus',11)} Додати</button></div>${mats.length===0?`<div style="font-size:.78rem;color:var(--ink3)">Немає</div>`:mats.map(m=>`<div class="ri"><div class="ri-ic" style="background:var(--bg2)">${ico('file',14)}</div><div class="ri-inf"><div class="ri-t">${m.n}</div><div class="ri-m">${m.size} · ${m.date}${m.desc?' · '+m.desc:''}</div></div><div class="ri-r"><span class="b ${m.type==='pdf'?'b-red':m.type==='ppt'?'b-amber':'b-blue'}">${m.type.toUpperCase()}</span><button class="btn btn-s btn-sm">Завант.</button><button class="btn-icon del" onclick="Object.keys(MATERIALS).forEach(k=>{MATERIALS[k]=MATERIALS[k].filter(x=>x.id!=='${m.id}')});render()">${ico('trash',12)}</button></div></div>`).join('')}</div>`;}).join('')}</div>`;}

function rSchTab(c){const ls=LESSONS[c.id]||[];const byDay={};ls.forEach(l=>{if(!byDay[l.day])byDay[l.day]=[];byDay[l.day].push(l);});return`<div>${[1,2,3,4,5].map(day=>{const dls=(byDay[day]||[]).sort((a,b)=>a.time.localeCompare(b.time));return`<div class="sch-day">${DAY_N[day]}</div>${dls.length===0?`<div style="font-size:.78rem;color:var(--ink3);padding:2px 0 8px">Немає</div>`:dls.map(l=>{const s=getSub(l.sid);return`<div class="sch-it"><div class="sch-time">${l.time}</div><div class="sch-bar" style="background:${s.c}"></div><div style="flex:1"><div class="sch-n">${s.n}</div><div class="sch-m">${l.topic} · каб.${l.room}</div></div><button class="btn btn-s btn-sm" onclick="go('lesson-detail',{lessonId:'${l.id}',lessonCid:'${c.id}'})">План</button><button class="btn-icon del" onclick="if(confirm('Видалити?')){LESSONS['${c.id}']=LESSONS['${c.id}'].filter(x=>x.id!=='${l.id}');render()}">${ico('trash',12)}</button></div>`;}).join('')}`;}).join('')}</div>`;}

function rClsAnalytics(c){const avg=clsAvg(c.id);const attPct=Math.round(c.students.reduce((s,st)=>s+attStats(c.id,st).pct,0)/c.students.length);const top=c.students.map(s=>{const vs=SUBS.map(sub=>+(GRADES[`${c.id}_${s}_${sub.id}`]||0)).filter(Boolean);return{n:s,avg:vs.length?+(vs.reduce((a,b)=>a+b,0)/vs.length).toFixed(1):0};}).sort((a,b)=>b.avg-a.avg);return`<div><div class="sg sg3" style="margin-bottom:14px"><div class="stat"><div class="statv" style="color:var(--blue)">${avg}</div><div class="statl">Ср. бал</div></div><div class="stat"><div class="statv" style="color:var(--green)">${attPct}%</div><div class="statl">Відвідуваність</div></div><div class="stat"><div class="statv" style="color:var(--amber)">${top[0]?.avg||0}</div><div class="statl">Найвищий</div></div></div><div class="g2"><div class="card"><div class="ct">Рейтинг учнів</div><div class="cwrap"><canvas id="ch-perf"></canvas></div></div><div class="card"><div class="ct">Топ-5</div>${top.slice(0,5).map((s,i)=>`<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--line)"><span style="font-size:.78rem;font-weight:700;color:var(--ink3);width:18px">${i+1}</span><span style="font-size:.83rem;flex:1">${s.n}</span><span class="gc ${gC(String(s.avg))}">${s.avg}</span></div>`).join('')}<div class="ct" style="margin-top:14px">По предметах</div><div class="cwrap" style="height:160px"><canvas id="ch-subavg"></canvas></div></div></div></div>`;}
