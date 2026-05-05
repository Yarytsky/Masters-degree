function handlePhotoUpload(inputId, profileKey, type){
  const input=document.getElementById(inputId);
  if(!input||!input.files||!input.files[0])return;
  const file=input.files[0];
  const reader=new FileReader();
  reader.onload=e=>{
    if(type==='student') STUDENT_PROFILES[profileKey].photo=e.target.result;
    else if(type==='teacher') TEACHER_PROFILES[profileKey].photo=e.target.result;
    toast('Фото завантажено','ok');
    render();
  };
  reader.readAsDataURL(file);
}

function avatarBlock(photo, initials, size=80, editable=false, inputId='', profileKey='', type=''){
  const inner = photo
    ? `<img src="${photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%"/>`
    : `<span style="font-family:var(--ff);font-size:${Math.round(size*0.32)}px;font-weight:600;color:var(--bg)">${initials}</span>`;
  const editBtn = editable ? `
    <label for="${inputId}" style="position:absolute;bottom:0;right:0;width:28px;height:28px;border-radius:50%;background:var(--ink);display:grid;place-items:center;cursor:pointer;border:2px solid var(--sur)">
      <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="12" height="12"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>
    </label>
    <input type="file" id="${inputId}" style="display:none" accept="image/*" onchange="handlePhotoUpload('${inputId}','${profileKey}','${type}')"/>` : '';
  return `<div style="position:relative;width:${size}px;height:${size}px;border-radius:50%;background:var(--ink);display:grid;place-items:center;flex-shrink:0;overflow:${editable?'visible':'hidden'}">
    <div style="width:${size}px;height:${size}px;border-radius:50%;background:var(--ink);display:grid;place-items:center;overflow:hidden">${inner}</div>
    ${editBtn}
  </div>`;
}

function rStudAccount(){
  const cls='11a';const name=ME();
  const key=`${cls}_${name}`;
  const p=STUDENT_PROFILES[key]||{firstName:'',lastName:'',phone:'',momPhone:'',email:'',photo:null,note:''};
  const ini=(p.firstName[0]||'')+(p.lastName[0]||'');
  const editing=S.editingAccount;
  return`<div>
    <div class="ph"><div class="pt">Мій профіль</div><div class="ps">Особиста інформація</div></div>


    <div style="display:flex;align-items:center;gap:20px;margin-bottom:24px;flex-wrap:wrap">
      ${avatarBlock(p.photo,ini,80,true,'photo-inp-s',key,'student')}
      <div>
        <div style="font-family:var(--ff);font-size:1.5rem;font-weight:500">${p.firstName} ${p.lastName}</div>
        <div style="font-size:.85rem;color:var(--ink2)">Клас 11-А · Учень</div>
        ${p.email?`<div style="font-size:.8rem;color:var(--ink3);margin-top:2px">${p.email}</div>`:''}
      </div>
      <button class="btn ${editing?'btn-s':'btn-p'} btn-sm" style="margin-left:auto" onclick="S.editingAccount=!S.editingAccount;render()">
        ${editing?'Скасувати':'Редагувати'}
      </button>
    </div>

    ${editing ? `

    <div class="card">
      <div class="ct">Редагувати дані</div>
      <div class="frow">
        <div class="fg"><label class="fl">Імʼя</label><input class="fi" id="af-fn" value="${p.firstName}"/></div>
        <div class="fg"><label class="fl">Прізвище</label><input class="fi" id="af-ln" value="${p.lastName}"/></div>
      </div>
      <div class="frow">
        <div class="fg"><label class="fl">Мій телефон</label><input class="fi" id="af-ph" type="tel" placeholder="+38 0XX XXX XXXX" value="${p.phone}"/></div>
        <div class="fg"><label class="fl">Телефон мами</label><input class="fi" id="af-mph" type="tel" placeholder="+38 0XX XXX XXXX" value="${p.momPhone}"/></div>
      </div>
      <div class="fg"><label class="fl">Email</label><input class="fi" id="af-em" type="email" placeholder="email@school.ua" value="${p.email}"/></div>
      <div style="display:flex;gap:9px;justify-content:flex-end;margin-top:6px">
        <button class="btn btn-s btn-sm" onclick="S.editingAccount=false;render()">Скасувати</button>
        <button class="btn btn-p btn-sm" onclick="saveStudAccount('${key}')">Зберегти</button>
      </div>
    </div>
    ` : `

    <div class="card">
      <div class="ct">Контактна інформація</div>
      ${[
        {l:'Імʼя та прізвище',v:`${p.firstName} ${p.lastName}`},
        {l:'Мій телефон',     v:p.phone   ||'—'},
        {l:'Телефон мами',    v:p.momPhone||'—'},
        {l:'Email',           v:p.email   ||'—'},
      ].map(r=>`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid var(--line)">
        <span style="font-size:.82rem;color:var(--ink2)">${r.l}</span>
        <span style="font-size:.85rem;font-weight:500">${r.v}</span>
      </div>`).join('')}
    </div>
    `}


    <div class="card" style="margin-top:14px">
      <div class="ct">Мої предмети та вчителі</div>
      ${SUBS.map(s=>{
        const tp=TEACHER_PROFILES[s.id];
        const tini=(tp?.firstName[0]||'')+(tp?.lastName[0]||'');
        return`<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--line);cursor:pointer" onclick="S.teacherInfoSub='${s.id}';openModal('teacherInfo','${s.id}')">
          <div style="width:8px;height:8px;border-radius:50%;background:${s.c};flex-shrink:0"></div>
          <span style="font-size:.86rem;font-weight:600;flex:1">${s.n}</span>
          ${tp?`<div style="display:flex;align-items:center;gap:8px">
            ${avatarBlock(tp.photo,tini,30)}
            <div>
              <div style="font-size:.82rem;font-weight:600">${tp.firstName} ${tp.lastName}</div>
              <div style="font-size:.72rem;color:var(--ink3)">${tp.position}</div>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--ink3)" stroke-width="1.8" width="14" height="14"><path d="M9 18l6-6-6-6"/></svg>
          </div>`:''}
        </div>`;}).join('')}
    </div>
  </div>`;}

function saveStudAccount(key){
  const p=STUDENT_PROFILES[key];
  p.firstName=document.getElementById('af-fn').value.trim();
  p.lastName= document.getElementById('af-ln').value.trim();
  p.phone=    document.getElementById('af-ph').value.trim();
  p.momPhone= document.getElementById('af-mph').value.trim();
  p.email=    document.getElementById('af-em').value.trim();
  S.editingAccount=false;
  toast('Профіль збережено','ok');
  render();
}

function rTeacherAccount(){
  const sid=TEACHER_SUBJECT_ID;
  const p=TEACHER_PROFILES[sid];
  const ini=(p.firstName[0]||'')+(p.lastName[0]||'');
  const editing=S.editingAccount;
  return`<div>
    <div class="ph"><div class="pt">Мій профіль</div><div class="ps">Особиста інформація вчителя</div></div>

    <div style="display:flex;align-items:center;gap:20px;margin-bottom:24px;flex-wrap:wrap">
      ${avatarBlock(p.photo,ini,80,true,'photo-inp-t',sid,'teacher')}
      <div>
        <div style="font-family:var(--ff);font-size:1.5rem;font-weight:500">${p.firstName} ${p.patronymic||''} ${p.lastName}</div>
        <div style="font-size:.85rem;color:var(--ink2)">${p.position}</div>
        <div style="font-size:.8rem;color:var(--ink3);margin-top:2px">${p.email||''}</div>
      </div>
      <button class="btn ${editing?'btn-s':'btn-p'} btn-sm" style="margin-left:auto" onclick="S.editingAccount=!S.editingAccount;render()">
        ${editing?'Скасувати':'Редагувати'}
      </button>
    </div>

    ${editing ? `
    <div class="card">
      <div class="ct">Редагувати дані</div>
      <div class="frow">
        <div class="fg"><label class="fl">Імʼя</label><input class="fi" id="tf-fn" value="${p.firstName}"/></div>
        <div class="fg"><label class="fl">Прізвище</label><input class="fi" id="tf-ln" value="${p.lastName}"/></div>
      </div>
      <div class="frow">
        <div class="fg"><label class="fl">По батькові</label><input class="fi" id="tf-pat" value="${p.patronymic||''}"/></div>
        <div class="fg"><label class="fl">Телефон</label><input class="fi" id="tf-ph" type="tel" value="${p.phone}"/></div>
      </div>
      <div class="frow">
        <div class="fg"><label class="fl">Email</label><input class="fi" id="tf-em" type="email" value="${p.email}"/></div>
        <div class="fg"><label class="fl">Посада</label><input class="fi" id="tf-pos" value="${p.position}"/></div>
      </div>
      <div class="frow">
        <div class="fg"><label class="fl">Кабінет</label><input class="fi" id="tf-cab" value="${p.cabinet||''}"/></div>
        <div class="fg"><label class="fl">Досвід роботи</label><input class="fi" id="tf-exp" value="${p.experience||''}"/></div>
      </div>
      <div style="display:flex;gap:9px;justify-content:flex-end;margin-top:6px">
        <button class="btn btn-s btn-sm" onclick="S.editingAccount=false;render()">Скасувати</button>
        <button class="btn btn-p btn-sm" onclick="saveTeacherAccount('${sid}')">Зберегти</button>
      </div>
    </div>
    ` : `
    <div class="card">
      <div class="ct">Контактна інформація</div>
      ${[
        {l:'Повне імʼя',   v:`${p.firstName} ${p.patronymic||''} ${p.lastName}`.trim()},
        {l:'Посада',       v:p.position||'—'},
        {l:'Телефон',      v:p.phone||'—'},
        {l:'Email',        v:p.email||'—'},
        {l:'Кабінет',      v:p.cabinet||'—'},
        {l:'Досвід роботи',v:p.experience||'—'},
      ].map(r=>`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid var(--line)">
        <span style="font-size:.82rem;color:var(--ink2)">${r.l}</span>
        <span style="font-size:.85rem;font-weight:500">${r.v}</span>
      </div>`).join('')}
    </div>
    `}


    <div class="card" style="margin-top:14px">
      <div class="ct">Мої предмети</div>
      ${SUBS.map(s=>{
        const tp=TEACHER_PROFILES[s.id];
        if(!tp||tp.email!==p.email)return'';
        return`<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--line)">
          <div style="width:8px;height:8px;border-radius:50%;background:${s.c}"></div>
          <span style="font-size:.86rem;font-weight:600">${s.n}</span>
          ${CLS.map(c=>`<span class="b b-gray" style="font-size:.69rem">${c.n}</span>`).join('')}
        </div>`;}).join('')}
    </div>
  </div>`;}

function saveTeacherAccount(sid){
  const p=TEACHER_PROFILES[sid];
  p.firstName=  document.getElementById('tf-fn').value.trim();
  p.lastName=   document.getElementById('tf-ln').value.trim();
  p.patronymic= document.getElementById('tf-pat').value.trim();
  p.phone=      document.getElementById('tf-ph').value.trim();
  p.email=      document.getElementById('tf-em').value.trim();
  p.position=   document.getElementById('tf-pos').value.trim();
  p.cabinet=    document.getElementById('tf-cab').value.trim();
  p.experience= document.getElementById('tf-exp').value.trim();
  S.editingAccount=false;
  toast('Профіль збережено','ok');
  render();
}

function rTeacherInfo(){
  const sid=S.teacherInfoSub;
  const s=getSub(sid);
  const p=TEACHER_PROFILES[sid];
  if(!p||!s)return`<div><button class="bca" onclick="history.back()">← Назад</button></div>`;
  const ini=(p.firstName[0]||'')+(p.lastName[0]||'');
  return`<div>
    <div class="bc"><button class="bca" onclick="go('subjects-s')">Предмети</button><span class="bcs">›</span><span class="bcc">${p.firstName} ${p.lastName}</span></div>
    <div style="display:flex;align-items:center;gap:20px;margin-bottom:24px;flex-wrap:wrap">
      ${avatarBlock(p.photo,ini,72)}
      <div>
        <div style="font-family:var(--ff);font-size:1.4rem;font-weight:500">${p.firstName} ${p.patronymic||''} ${p.lastName}</div>
        <div style="font-size:.88rem;color:var(--blue);font-weight:500">${p.position}</div>
        <div style="display:flex;align-items:center;gap:5px;margin-top:4px"><div style="width:8px;height:8px;border-radius:50%;background:${s.c}"></div><span style="font-size:.8rem;color:var(--ink2)">${s.n}</span></div>
      </div>
    </div>
    <div class="card">
      <div class="ct">Контакти</div>
      ${[
        {l:'Телефон',      v:p.phone||'—'},
        {l:'Email',        v:p.email||'—'},
        {l:'Кабінет',      v:p.cabinet||'—'},
        {l:'Досвід роботи',v:p.experience||'—'},
      ].map(r=>`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid var(--line)">
        <span style="font-size:.82rem;color:var(--ink2)">${r.l}</span>
        <span style="font-size:.85rem;font-weight:500">${r.v}</span>
      </div>`).join('')}
    </div>
  </div>`;}
