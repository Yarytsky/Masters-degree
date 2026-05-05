function openModal(type,...args){S.modal={type,args};render();}
function closeModal(){S.modal=null;render();}
function rModal(){
  const{type,args}=S.modal;let body='';
  if(type==='calDay'){
    const date=args[0];const lessons=args[1]||[];
    const asgns=ASGN.filter(a=>a.cid==='11a'&&fmt(a.due)===date);
    const lessonRows=lessons.map(l=>{
      const s=getSub(l.sid);
      const attKey='11a_'+(l.lid||'')+'_'+ME();
      const attVal=l.lid?({p:'Присутній',a:'Відсутній',l:'Запізнився',e:'Поважна'}[LESSON_ATT[attKey]||'p']):'';
      return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--line)">'
        +'<div style="width:6px;height:6px;border-radius:50%;background:'+s.c+';flex-shrink:0"></div>'
        +'<div style="flex:1"><div style="font-size:.86rem;font-weight:600">'+s.n+'</div>'
        +'<div style="font-size:.75rem;color:var(--ink2)">'+(l.topic||'За розкладом')+(l.time?' · '+l.time:'')+(l.room&&l.room!=='—'?' · каб.'+l.room:'')+'</div></div>'
        +(attVal?'<span style="font-size:.73rem;font-weight:600;color:var(--ink2)">'+attVal+'</span>':'')
        +'</div>';
    }).join('');
    const asgnRows=asgns.map(a=>{
      const done=isDone(a.id,ME());
      return '<div style="display:flex;align-items:center;gap:9px;padding:8px 0;border-bottom:1px solid var(--line)">'
        +'<span class="b '+tBdg(a.type)+'">'+tL(a.type)+'</span>'
        +'<div style="flex:1"><div style="font-size:.85rem;font-weight:600">'+a.title+'</div>'
        +'<div style="font-size:.73rem;color:var(--ink2)">'+getSub(a.sid).n+'</div></div>'
        +(done?'<span class="b b-green">Здано</span>'
          :'<button class="btn btn-p btn-sm" onclick="closeModal();go(\'asgn-s\',{asId:\''+a.id+'\'})">Здати</button>')
        +'</div>';
    }).join('');
    body='<div class="modal-title">'+date+' <button class="btn-icon" onclick="closeModal()">'+ico('close',15)+'</button></div>'
      +(lessons.length>0
        ?'<div style="margin-bottom:12px"><div style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink3);margin-bottom:6px">Уроки</div>'+lessonRows+'</div>'
        :'<div style="font-size:.83rem;color:var(--ink3);margin-bottom:10px">Уроків немає</div>')
      +(asgns.length>0
        ?'<div><div style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--amber);margin-bottom:6px">Дедлайни</div>'+asgnRows+'</div>'
        :'')
      +'<div style="display:flex;justify-content:flex-end;margin-top:14px"><button class="btn btn-s btn-sm" onclick="closeModal()">Закрити</button></div>';
  }
  if(type==='filePreview'){
    const fname=args[1]||'';
    const ext=(fname.split('.').pop()||'').toLowerCase();
    const icons={pdf:'📄',doc:'📝',docx:'📝',ppt:'📊',pptx:'📊',xlsx:'📈',xls:'📈'};
    body='<div class="modal-title" style="word-break:break-word">'+fname
      +' <button class="btn-icon" onclick="closeModal()">'+ico('close',15)+'</button></div>'
      +'<div style="background:var(--bg2);border-radius:var(--r);padding:32px;text-align:center;margin-bottom:14px">'
      +'<div style="font-size:3rem;margin-bottom:10px">'+(icons[ext]||'📎')+'</div>'
      +'<div style="font-family:var(--ff);font-size:1rem;font-weight:500;margin-bottom:4px">'+fname+'</div>'
      +'<div style="font-size:.8rem;color:var(--ink3)">У реальному застосунку тут відкрився б вбудований переглядач</div>'
      +'</div>'
      +'<div style="display:flex;gap:9px;justify-content:flex-end">'
      +'<button class="btn btn-s btn-sm" onclick="closeModal()">Закрити</button>'
      +'<button class="btn btn-p btn-sm" onclick="toast(\'Завантажується…\',\'ok\');closeModal()">Завантажити</button>'
      +'</div>';
  }
  if(type==='gradeDetail'){
    const e=args[0];
    const tc={control:'var(--red)',test:'var(--blue)',oral:'var(--purple)',hw:'var(--amber)',work:'var(--green)',project:'var(--ink)'};
    body='<div class="modal-title">Деталі оцінки <button class="btn-icon" onclick="closeModal()">'+ico('close',15)+'</button></div>'
      +'<div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">'
      +'<span class="gc '+gC(e.grade)+'" style="width:52px;height:44px;font-size:1.4rem">'+e.grade+'</span>'
      +'<div><div style="font-size:1rem;font-weight:600">'+e.student+'</div>'
      +'<div style="font-size:.8rem;color:var(--ink2)">'+e.date+' · <span style="color:'+(tc[e.type]||'var(--ink)')+';font-weight:600">'+(GRADE_TYPES[e.type]||e.type)+'</span></div>'
      +'</div></div>'
      +'<div style="background:var(--bg2);border-radius:var(--r2);padding:14px;margin-bottom:12px">'
      +'<div style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink3);margin-bottom:5px">Тема</div>'
      +'<div style="font-size:.88rem;font-weight:500">'+e.topic+'</div></div>'
      +'<div style="background:var(--bg2);border-radius:var(--r2);padding:14px">'
      +'<div style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--ink3);margin-bottom:5px">Коментар вчителя</div>'
      +'<div style="font-size:.86rem;color:var(--ink2);line-height:1.65">'+e.comment+'</div></div>'
      +'<div style="display:flex;justify-content:flex-end;margin-top:14px">'
      +'<button class="btn btn-s btn-sm" onclick="closeModal()">Закрити</button></div>';
  }
  if(type==='addGrade'){
    const cid=args[0];const sid=args[1];const preStudent=args[2]||'';
    const c=getCls(cid);const sub=getSub(sid);
    const studentOpts=c.students.map(function(s){return '<option value="'+s+'"'+(s===preStudent?' selected':'')+'>'+s+'</option>';}).join('');
    const typeOpts=Object.entries(GRADE_TYPES).map(function(kv){return '<option value="'+kv[0]+'">'+kv[1]+'</option>';}).join('');
    body='<div class="modal-title" style="margin-bottom:14px">Виставити оцінку — '+sub.n
      +' <button class="btn-icon" onclick="closeModal()">'+ico('close',15)+'</button></div>'
      +'<div class="fg"><label class="fl">Учень</label><select class="fs" id="ag-student"><option value="">— Обрати —</option>'+studentOpts+'</select></div>'
      +'<div class="frow"><div class="fg"><label class="fl">Оцінка (1–12)</label><input class="fi" type="number" id="ag-grade" min="1" max="12" placeholder="12"/></div>'
      +'<div class="fg"><label class="fl">Дата</label><input class="fi" type="text" id="ag-date" placeholder="09.04"/></div></div>'
      +'<div class="frow"><div class="fg"><label class="fl">Тип оцінювання</label><select class="fs" id="ag-type">'+typeOpts+'</select></div>'
      +'<div class="fg"><label class="fl">Тема уроку</label><input class="fi" id="ag-topic" placeholder="Назва теми"/></div></div>'
      +'<div class="fg"><label class="fl">Коментар <span style="color:var(--red)">*</span></label>'
      +'<textarea class="fta" id="ag-comment" rows="3" placeholder="Опишіть за що ця оцінка — обов\'язкове поле…"></textarea>'
      +'<div id="ag-comment-err" style="font-size:.73rem;color:var(--red);margin-top:4px;display:none">Коментар є обов\'язковим</div></div>'
      +'<div style="display:flex;gap:9px;justify-content:flex-end;margin-top:4px">'
      +'<button class="btn btn-s btn-sm" onclick="closeModal()">Скасувати</button>'
      +'<button class="btn btn-p btn-sm" onclick="saveGradeEntry(\''+cid+'\',\''+sid+'\')">Зберегти оцінку</button>'
      +'</div>';
  }
  if(type==='newAnn'){
    const classChecks=CLS.map(function(c){return '<label class="cpill on"><input type="checkbox" id="an-c-'+c.id+'" checked/> '+c.n+'</label>';}).join('');
    body='<div class="modal-title">Нове оголошення <button class="btn-icon" onclick="closeModal()">'+ico('close',15)+'</button></div>'
      +'<div class="fg"><label class="fl">Заголовок</label><input class="fi" id="an-t" placeholder="Заголовок"/></div>'
      +'<div class="fg"><label class="fl">Текст</label><textarea class="fta" id="an-b" rows="3"></textarea></div>'
      +'<div class="frow"><div class="fg"><label class="fl">Пріоритет</label><select class="fs" id="an-p"><option value="low">Інфо</option><option value="med">Увага</option><option value="high">Важливо</option></select></div>'
      +'<div class="fg"><label class="fl">Класи</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:2px">'+classChecks+'</div></div></div>'
      +'<div style="display:flex;gap:9px;justify-content:flex-end"><button class="btn btn-s btn-sm" onclick="closeModal()">Скасувати</button>'
      +'<button class="btn btn-p btn-sm" onclick="saveAnn()">Опублікувати</button></div>';
  }
  if(type==='newTask'){
    body='<div class="modal-title">Нова задача <button class="btn-icon" onclick="closeModal()">'+ico('close',15)+'</button></div>'
      +'<div class="fg"><label class="fl">Опис</label><input class="fi" id="tk-t" placeholder="Що зробити?"/></div>'
      +'<div class="frow"><div class="fg"><label class="fl">Пріоритет</label><select class="fs" id="tk-p"><option value="low">Низький</option><option value="med">Середній</option><option value="high">Високий</option></select></div>'
      +'<div class="fg"><label class="fl">Дедлайн</label><input class="fi" id="tk-d" placeholder="напр. 05.04"/></div></div>'
      +'<div style="display:flex;gap:9px;justify-content:flex-end"><button class="btn btn-s btn-sm" onclick="closeModal()">Скасувати</button>'
      +'<button class="btn btn-p btn-sm" onclick="saveTask()">Додати</button></div>';
  }
  if(type==='newLesson'){
    const cid=args[0];
    const dayOpts=[1,2,3,4,5].map(function(d){return '<option value="'+d+'">'+DAY_N[d]+'</option>';}).join('');
    const subOpts=SUBS.map(function(s){return '<option value="'+s.id+'">'+s.n+'</option>';}).join('');
    const clsOpts=CLS.map(function(c){return '<option value="'+c.id+'"'+(c.id===cid?' selected':'')+'>'+c.n+'</option>';}).join('');
    body='<div class="modal-title">Новий урок <button class="btn-icon" onclick="closeModal()">'+ico('close',15)+'</button></div>'
      +'<div class="frow"><div class="fg"><label class="fl">Предмет</label><select class="fs" id="ls-sid">'+subOpts+'</select></div>'
      +'<div class="fg"><label class="fl">Клас</label><select class="fs" id="ls-cid">'+clsOpts+'</select></div></div>'
      +'<div class="frow"><div class="fg"><label class="fl">День</label><select class="fs" id="ls-day">'+dayOpts+'</select></div>'
      +'<div class="fg"><label class="fl">Час</label><input class="fi" id="ls-time" placeholder="08:30"/></div></div>'
      +'<div class="frow"><div class="fg"><label class="fl">Кабінет</label><input class="fi" id="ls-room" placeholder="201"/></div>'
      +'<div class="fg"><label class="fl">Тема</label><input class="fi" id="ls-topic" placeholder="Тема уроку"/></div></div>'
      +'<div style="display:flex;gap:9px;justify-content:flex-end"><button class="btn btn-s btn-sm" onclick="closeModal()">Скасувати</button>'
      +'<button class="btn btn-p btn-sm" onclick="saveLesson()">Додати</button></div>';
  }
  if(type==='uploadMat'){
    const cid=args[0];const presid=args[1]||'';
    const subOpts=SUBS.map(function(s){return '<option value="'+s.id+'"'+(s.id===presid?' selected':'')+'>'+s.n+'</option>';}).join('');
    const clsOpts=CLS.map(function(c){return '<option value="'+c.id+'"'+(c.id===cid?' selected':'')+'>'+c.n+'</option>';}).join('');
    body='<div class="modal-title">Завантажити матеріал <button class="btn-icon" onclick="closeModal()">'+ico('close',15)+'</button></div>'
      +'<div class="frow"><div class="fg"><label class="fl">Предмет</label><select class="fs" id="m-sid">'+subOpts+'</select></div>'
      +'<div class="fg"><label class="fl">Клас</label><select class="fs" id="m-cid">'+clsOpts+'</select></div></div>'
      +'<div class="fg"><label class="fl">Опис</label><input class="fi" id="m-desc" placeholder="(необов\'язково)"/></div>'
      +'<div class="fg"><label class="fl">Файл</label>'
      +'<div class="fz" onclick="document.getElementById(\'fInpM\').click()">'
      +'<input type="file" id="fInpM" style="display:none" onchange="document.getElementById(\'fname-m\').textContent=this.files[0]&&this.files[0].name||\'\'"/>'
      +'<div style="font-size:.86rem;color:var(--ink2)" id="fname-m">Оберіть файл</div>'
      +'<div style="font-size:.72rem;color:var(--ink3)">PDF, DOCX, PPTX, XLSX</div>'
      +'</div></div>'
      +'<div style="display:flex;gap:9px;justify-content:flex-end"><button class="btn btn-s btn-sm" onclick="closeModal()">Скасувати</button>'
      +'<button class="btn btn-p btn-sm" onclick="saveMat()">Зберегти</button></div>';
  }
  if(type==='addNote'){
    const cid=args[0];const student=args[1];
    body='<div class="modal-title">Нотатка — '+student+' <button class="btn-icon" onclick="closeModal()">'+ico('close',15)+'</button></div>'
      +'<div class="fg"><label class="fl">Тип</label><select class="fs" id="nt-type"><option value="neutral">Нейтральна</option><option value="pos">Позитивна</option><option value="con">Занепокоєння</option></select></div>'
      +'<div class="fg"><label class="fl">Текст</label><textarea class="fta" id="nt-text" rows="3" placeholder="Спостереження…"></textarea></div>'
      +'<div style="display:flex;gap:9px;justify-content:flex-end"><button class="btn btn-s btn-sm" onclick="closeModal()">Скасувати</button>'
      +'<button class="btn btn-p btn-sm" onclick="saveNote(\''+cid+'\',\''+student+'\')">Зберегти</button></div>';
  }
  if(type==='teacherInfo'){
    const sid=args[0];const s=getSub(sid);const p=TEACHER_PROFILES[sid];
    if(!p){body='<div>Не знайдено</div>';}
    else{
      const ini=(p.firstName[0]||'')+(p.lastName[0]||'');
      body='<div class="modal-title" style="margin-bottom:16px">'+p.firstName+' '+p.lastName
        +' <button class="btn-icon" onclick="closeModal()">'+ico('close',15)+'</button></div>'
        +'<div style="display:flex;align-items:center;gap:16px;margin-bottom:18px">'
        +avatarBlock(p.photo,ini,64)
        +'<div><div style="font-size:1rem;font-weight:600">'+p.firstName+' '+(p.patronymic||'')+' '+p.lastName+'</div>'
        +'<div style="font-size:.82rem;color:var(--blue);font-weight:500">'+p.position+'</div>'
        +'<div style="display:flex;align-items:center;gap:5px;margin-top:4px"><div style="width:7px;height:7px;border-radius:50%;background:'+s.c+'"></div><span style="font-size:.78rem;color:var(--ink2)">'+s.n+'</span></div>'
        +'</div></div>'
        +[{l:'Телефон',v:p.phone||'—'},{l:'Email',v:p.email||'—'},{l:'Кабінет',v:p.cabinet||'—'},{l:'Досвід',v:p.experience||'—'}]
          .map(r=>'<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--line)">'
            +'<span style="font-size:.81rem;color:var(--ink2)">'+r.l+'</span>'
            +'<span style="font-size:.84rem;font-weight:500">'+r.v+'</span></div>').join('')
        +'<div style="display:flex;justify-content:flex-end;margin-top:14px">'
        +'<button class="btn btn-s btn-sm" onclick="closeModal()">Закрити</button></div>';
    }
  }
  return '<div class="modal-bg" onclick="if(event.target===this)closeModal()"><div class="modal">'+body+'</div></div>';
}

function saveGradeEntry(cid,sid){
  const student=document.getElementById('ag-student').value;
  const grade=document.getElementById('ag-grade').value;
  const date=document.getElementById('ag-date').value;
  const type=document.getElementById('ag-type').value;
  const topic=document.getElementById('ag-topic').value;
  const comment=document.getElementById('ag-comment').value.trim();
  const errEl=document.getElementById('ag-comment-err');
  if(!student){alert('Оберіть учня');return;}
  if(!grade||+grade<1||+grade>12){alert('Введіть оцінку від 1 до 12');return;}
  if(!comment){errEl.style.display='block';document.getElementById('ag-comment').style.borderColor='var(--red)';document.getElementById('ag-comment').focus();return;}
  errEl.style.display='none';
  const key=`${cid}_${sid}`;
  if(!GRADE_LOG[key])GRADE_LOG[key]=[];
  GRADE_LOG[key].push({id:'g'+Date.now(),student,date:date||'—',grade,type,topic:topic||'—',comment});
  rebuildGrades();
  closeModal();
  toast(`Оцінку ${grade} виставлено для ${student.split(' ')[0]}`,'ok');
}
function saveAnn(){const t=document.getElementById('an-t').value;const b=document.getElementById('an-b').value;const p=document.getElementById('an-p').value;const cls=CLS.filter(c=>document.getElementById('an-c-'+c.id)?.checked).map(c=>c.id);if(!t){alert('Вкажіть заголовок');return;}ANNOUNCEMENTS.unshift({id:'an'+Date.now(),title:t,body:b,priority:p,classes:cls,date:'31 бер'});closeModal();toast('Оголошення опубліковано','ok');}
function saveTask(){const t=document.getElementById('tk-t').value;const p=document.getElementById('tk-p').value;const d=document.getElementById('tk-d').value;if(!t){alert('Вкажіть опис');return;}TASKS.unshift({id:'t'+Date.now(),text:t,priority:p,due:d,done:false});closeModal();toast('Задачу додано','ok');}
function saveLesson(){const sid=document.getElementById('ls-sid').value;const cid=document.getElementById('ls-cid').value;const day=+document.getElementById('ls-day').value;const time=document.getElementById('ls-time').value;const room=document.getElementById('ls-room').value;const topic=document.getElementById('ls-topic').value;if(!time||!topic){alert('Заповніть час та тему');return;}if(!LESSONS[cid])LESSONS[cid]=[];LESSONS[cid].push({id:'l'+Date.now(),sid,day,time,room:room||'—',topic,objectives:'',materials:'',activities:'',homework:'',tags:[]});closeModal();toast('Урок додано','ok');}
function saveMat(){const sid=document.getElementById('m-sid').value;const cid=document.getElementById('m-cid').value;const fname=document.getElementById('fname-m').textContent;const desc=document.getElementById('m-desc').value;if(!fname||fname==='Оберіть файл'){alert('Оберіть файл');return;}const ext=fname.split('.').pop().toLowerCase();const key=`${cid}_${sid}`;if(!MATERIALS[key])MATERIALS[key]=[];MATERIALS[key].push({id:'m'+Date.now(),n:fname,type:ext,size:'—',date:'31 бер',desc});closeModal();toast('Матеріал завантажено','ok');}
function saveNote(cid,student){const text=document.getElementById('nt-text').value;const type=document.getElementById('nt-type').value;if(!text){alert('Вкажіть текст');return;}if(!STUDENT_NOTES[`${cid}_${student}`])STUDENT_NOTES[`${cid}_${student}`]=[];STUDENT_NOTES[`${cid}_${student}`].unshift({id:'n'+Date.now(),text,type,date:'31 бер'});closeModal();}
