function openB(cid){Object.assign(S.B,{open:true,cid,step:'form',gen:[],loading:false,genError:null,_fallback:false,file:null,title:'',topic:'',subtopic:'',book:'',qcnt:5,due:'',tmin:30,sid:'math',type:'test',mode:'ai',diff:'medium',gradeLevel:11,qtypes:['choice']});render();}
function closeB(){S.B.open=false;go('class',{tcid:S.B.cid});}
function rBuilder(){
  const b=S.B;
  const c=getCls(b.cid);
  if(b.step==='preview')return rBuilderPrev();
  return`<div>
    <div class="bc">
      <button class="bca" onclick="closeB()">Клас ${c.n}</button>
      <span class="bcs">›</span>
      <span class="bcc">Нове завдання</span>
    </div>
    <div class="ph"><div class="pt">Нове завдання</div><div class="ps">Створіть тест або контрольну вручну, або згенеруйте через AI</div></div>

    <div class="card" style="margin-bottom:12px">
      <div class="ct">Загальна інформація</div>
      <div class="fg">
        <label class="fl">Назва завдання</label>
        <input class="fi" placeholder="Напр.: Тест з квадратних рівнянь" value="${b.title}" oninput="S.B.title=this.value"/>
      </div>
      <div class="frow">
        <div class="fg">
          <label class="fl">Предмет</label>
          <select class="fs" onchange="S.B.sid=this.value">
            ${SUBS.map(s=>`<option value="${s.id}"${b.sid===s.id?' selected':''}>${s.n}</option>`).join('')}
          </select>
        </div>
        <div class="fg">
          <label class="fl">Тип</label>
          <select class="fs" onchange="S.B.type=this.value">
            <option value="test"${b.type==='test'?' selected':''}>Тест</option>
            <option value="control"${b.type==='control'?' selected':''}>Контрольна</option>
            <option value="hw"${b.type==='hw'?' selected':''}>Домашня</option>
          </select>
        </div>
      </div>
      <div class="frow">
        <div class="fg">
          <label class="fl">Дедлайн</label>
          <input class="fi" type="date" value="${b.due}" min="2026-04-01" oninput="S.B.due=this.value"/>
        </div>
        <div class="fg">
          <label class="fl">Час на виконання (хв)</label>
          <input class="fi" type="number" value="${b.tmin}" min="5" max="180" oninput="S.B.tmin=+this.value"/>
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom:12px">
      <div class="ct">Питання</div>
      <div class="tgl" style="margin-bottom:12px">
        <button class="tglb${b.mode==='upload'?' act':''}" onclick="S.B.mode='upload';S.B.gen=[];render()">${ico('file',12)} Завантажити файл</button>
        <button class="tglb${b.mode==='ai'?' act':''}" onclick="S.B.mode='ai';render()">${ico('ai',12)} Згенерувати з AI</button>
        <button class="tglb${b.mode==='manual'?' act':''}" onclick="S.B.mode='manual';if(!b.gen.length)S.B.gen=[{id:1,text:'',type:'choice',options:['','','',''],correct:0}];render()">${ico('edit',12)} Створити вручну</button>
      </div>

      ${b.mode==='upload'?rUploadMode(b):b.mode==='manual'?rManualMode(b):rAIMode(b)}
    </div>

    <div style="display:flex;gap:9px;justify-content:flex-end;flex-wrap:wrap">
      <button class="btn btn-s btn-sm" onclick="closeB()">Скасувати</button>
      ${b.gen.length>0?`<button class="btn btn-s btn-sm" onclick="S.B.step='preview';render()">${ico('eye',12)} Переглянути (${b.gen.length})</button>`:''}
      <button class="btn btn-p btn-sm" onclick="saveA()">${ico('check',12)} Зберегти завдання</button>
    </div>
  </div>`;
}

function rUploadMode(b){
  return`<div class="fz" onclick="document.getElementById('fBInp').click()" style="padding:32px 22px">
    <input type="file" id="fBInp" style="display:none" accept=".pdf,.doc,.docx" onchange="S.B.file=this.files[0]?.name;render()"/>
    <div style="font-size:2.4rem;margin-bottom:10px;opacity:.4">${ico('file',38)}</div>
    <div style="font-size:.95rem;font-weight:600;margin-bottom:5px">Перетягніть або оберіть файл</div>
    <div style="font-size:.76rem;color:var(--ink3)">PDF, DOC, DOCX · до 5 МБ</div>
    ${b.file?`<div style="margin-top:14px;padding:8px 12px;background:var(--gbg);border-radius:var(--r2);font-size:.78rem;color:var(--green);font-weight:600;display:inline-block">✓ ${b.file}</div>`:''}
  </div>`;
}

function rManualMode(b){
  return`<div>
    ${b.gen.map((q,i)=>`
      <div style="background:var(--bg2);border-radius:var(--r2);padding:14px;margin-bottom:10px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:9px">
          <div style="font-size:.71rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--ink3)">Питання ${i+1}</div>
          <div style="display:flex;gap:6px;align-items:center">
            <select class="fs" style="height:30px;font-size:.78rem;padding:3px 8px" onchange="S.B.gen[${i}].type=this.value;if(this.value==='open')S.B.gen[${i}].options=undefined;else if(!S.B.gen[${i}].options)S.B.gen[${i}].options=['','','',''];render()">
              <option value="choice"${q.type==='choice'?' selected':''}>Тест</option>
              <option value="open"${q.type==='open'?' selected':''}>Відкрите</option>
            </select>
            <button class="btn-icon del" onclick="S.B.gen.splice(${i},1);render()">${ico('trash',12)}</button>
          </div>
        </div>
        <input class="fi" placeholder="Текст питання…" value="${(q.text||'').replace(/"/g,'&quot;')}" oninput="S.B.gen[${i}].text=this.value" style="margin-bottom:9px"/>
        ${q.type==='choice'?`<div style="display:grid;gap:6px">
          ${(q.options||['','','','']).map((opt,oi)=>`
            <div style="display:flex;align-items:center;gap:8px">
              <button onclick="S.B.gen[${i}].correct=${oi};render()" style="width:24px;height:24px;border-radius:50%;border:2px solid ${q.correct===oi?'var(--green)':'var(--line2)'};background:${q.correct===oi?'var(--green)':'var(--sur)'};color:${q.correct===oi?'white':'var(--ink3)'};display:grid;place-items:center;font-size:.7rem;font-weight:700;cursor:pointer;flex-shrink:0">${String.fromCharCode(65+oi)}</button>
              <input class="fi" placeholder="Варіант відповіді" value="${(opt||'').replace(/"/g,'&quot;')}" oninput="S.B.gen[${i}].options[${oi}]=this.value" style="flex:1;height:34px;padding:6px 10px;font-size:.82rem"/>
            </div>
          `).join('')}
        </div>`:''}
      </div>
    `).join('')}
    <button class="btn btn-s btn-sm" onclick="S.B.gen.push({id:Date.now(),text:'',type:'choice',options:['','','',''],correct:0});render()" style="width:100%">${ico('plus',12)} Додати питання</button>
  </div>`;
}

function rAIMode(b){
  return`<div>
    <div style="background:var(--blt);border-left:3px solid var(--blue);border-radius:var(--r2);padding:11px 13px;margin-bottom:14px">
      <div style="font-size:.72rem;font-weight:700;color:var(--blue);text-transform:uppercase;letter-spacing:.07em;margin-bottom:3px">Як це працює</div>
      <div style="font-size:.78rem;color:var(--ink2);line-height:1.55">Вкажіть тему, складність та типи питань — AI згенерує готові завдання з відповідями. Згенеровані питання можна переглянути та відредагувати.</div>
    </div>

    <div class="frow">
      <div class="fg">
        <label class="fl">Тема <span style="color:var(--red)">*</span></label>
        <input class="fi" placeholder="Напр.: Квадратні рівняння" value="${b.topic}" oninput="S.B.topic=this.value"/>
      </div>
      <div class="fg">
        <label class="fl">Підтема (необовʼязково)</label>
        <input class="fi" placeholder="Дискримінант, формула Вієта" value="${b.subtopic}" oninput="S.B.subtopic=this.value"/>
      </div>
    </div>
    <div class="fg">
      <label class="fl">Підручник / контекст (необовʼязково)</label>
      <input class="fi" placeholder="Напр.: Алгебра 8 клас, Мерзляк, розділ 4" value="${b.book}" oninput="S.B.book=this.value"/>
    </div>
    <div class="frow3">
      <div class="fg">
        <label class="fl">Кількість питань</label>
        <input class="fi" type="number" value="${b.qcnt}" min="1" max="20" oninput="S.B.qcnt=+this.value"/>
      </div>
      <div class="fg">
        <label class="fl">Складність</label>
        <select class="fs" onchange="S.B.diff=this.value">
          <option value="easy"${b.diff==='easy'?' selected':''}>🟢 Легка</option>
          <option value="medium"${b.diff==='medium'?' selected':''}>🟡 Середня</option>
          <option value="hard"${b.diff==='hard'?' selected':''}>🔴 Важка</option>
        </select>
      </div>
      <div class="fg">
        <label class="fl">Клас</label>
        <select class="fs" onchange="S.B.gradeLevel=this.value">
          ${[5,6,7,8,9,10,11].map(g=>`<option value="${g}"${(b.gradeLevel||10)==g?' selected':''}>${g} клас</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="fg">
      <label class="fl">Типи питань</label>
      <div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:3px">
        <label class="cpill${b.qtypes.includes('choice')?' on':''}"><input type="checkbox" onchange="tQ('choice',this.checked)"${b.qtypes.includes('choice')?' checked':''}/> Тестові (4 варіанти)</label>
        <label class="cpill${b.qtypes.includes('truefalse')?' on':''}"><input type="checkbox" onchange="tQ('truefalse',this.checked)"${b.qtypes.includes('truefalse')?' checked':''}/> Так/Ні</label>
        <label class="cpill${b.qtypes.includes('open')?' on':''}"><input type="checkbox" onchange="tQ('open',this.checked)"${b.qtypes.includes('open')?' checked':''}/> Відкриті</label>
      </div>
    </div>

    ${b.loading?`<div style="background:var(--bg2);border-radius:var(--r2);padding:18px;margin-top:14px;text-align:center">
      <div style="display:flex;align-items:center;justify-content:center;gap:11px;margin-bottom:10px">
        <span class="spn" style="border-color:var(--bg3);border-top-color:var(--blue)"></span>
        <span style="font-family:var(--ff);font-size:1rem;font-weight:500">AI генерує питання…</span>
      </div>
      <div style="font-size:.78rem;color:var(--ink3)">Це може зайняти 10–20 секунд</div>
    </div>`:''}

    ${b.genError?`<div class="alert a-warn" style="margin-top:12px;font-size:.79rem">
      <b>Помилка:</b> ${b.genError}<br>
      <span style="font-size:.74rem">Спробуйте ще раз або створіть питання вручну</span>
    </div>`:''}

    ${b.gen.length>0?`<div style="background:var(--gbg);border-left:3px solid var(--green);border-radius:var(--r2);padding:11px 13px;margin-top:14px">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
        <div>
          <div style="font-size:.85rem;font-weight:600;color:var(--green)">✓ Згенеровано ${b.gen.length} питань</div>
          <div style="font-size:.74rem;color:var(--ink3);margin-top:2px">Натисніть «Переглянути» щоб побачити результат</div>
        </div>
        <button class="btn btn-s btn-sm" onclick="S.B.gen=[];render()">Очистити</button>
      </div>
    </div>`:''}

    <div style="display:flex;gap:9px;align-items:center;margin-top:14px;flex-wrap:wrap">
      <button class="btn btn-p" onclick="genAI()" ${b.loading||!b.topic?'disabled':''} style="${!b.topic?'opacity:.4;pointer-events:none':''}">
        ${b.loading?'<span class="spn"></span> Генерую…':b.gen.length>0?ico('ai',13)+' Згенерувати знову':ico('ai',13)+' Згенерувати питання'}
      </button>
      ${!b.topic?`<span style="font-size:.74rem;color:var(--ink3)">Спочатку вкажіть тему</span>`:''}
    </div>
  </div>`;
}

function rBuilderPrev(){
  const b=S.B;
  return`<div>
    <div class="bc"><button class="bca" onclick="S.B.step='form';render()">← Редагувати</button><span class="bcs">›</span><span class="bcc">Перегляд</span></div>
    <div class="ph ph-row">
      <div><div class="pt">Перегляд завдання</div><div class="ps">${b.title||'Без назви'} · ${b.gen.length} питань · ${b.tmin} хв</div></div>
      <button class="btn btn-p btn-sm" onclick="saveA()">${ico('check',12)} Зберегти</button>
    </div>
    ${b.gen.map((q,i)=>{
      const opts=q.options||q.opts||[];
      const correct=q.correct!==undefined?q.correct:q.ok;
      return`<div class="qprev" style="margin-bottom:11px">
        <div class="qprev-n">Питання ${i+1}${q.type==='open'?' · Відкрите':q.type==='truefalse'?' · Так/Ні':' · Тестове'}</div>
        <div class="qprev-t">${q.text||q.txt||''}</div>
        ${opts.length?opts.map((o,oi)=>`<div class="qprev-o${oi===correct?' cor':''}">${String.fromCharCode(65+oi)}) ${o}${oi===correct?' ✓':''}</div>`).join(''):`<div style="font-size:.78rem;color:var(--ink3);font-style:italic;padding:7px 0">Очікується розгорнута відповідь учня</div>`}
        ${q.explanation?`<div style="margin-top:8px;font-size:.75rem;color:var(--ink2);background:var(--bg2);padding:7px 10px;border-radius:var(--r2);border-left:2px solid var(--blue)"><b>Пояснення:</b> ${q.explanation}</div>`:''}
      </div>`;
    }).join('')}
    <div style="display:flex;gap:9px;justify-content:flex-end;margin-top:14px;flex-wrap:wrap">
      <button class="btn btn-s btn-sm" onclick="S.B.step='form';render()">← Редагувати</button>
      <button class="btn btn-p btn-sm" onclick="saveA()">${ico('check',12)} Зберегти завдання</button>
    </div>
  </div>`;
}

async function genAI(){
  const b=S.B;
  if(!b.topic||!b.topic.trim()){toast('Вкажіть тему','warn');return;}
  if(!b.qtypes||!b.qtypes.length){toast('Оберіть хоча б один тип питань','warn');return;}

  S.B.loading=true;
  S.B.genError=null;
  render();

  const dm={easy:'легка',medium:'середня',hard:'важка'};
  const subjectName=getSub(b.sid).n;
  const grade=b.gradeLevel||10;
  const types=[];
  if(b.qtypes.includes('choice'))types.push('тестові з 4 варіантами відповіді');
  if(b.qtypes.includes('truefalse'))types.push('Так/Ні (з 2 варіантами «Так»/«Ні»)');
  if(b.qtypes.includes('open'))types.push('відкриті');
  const typeStr=types.join(', ');
  const taskTypeName=b.type==='test'?'тесту':b.type==='control'?'контрольної роботи':'домашнього завдання';

  const prompt=`Ти — досвідчений учитель з предмету «${subjectName}» в українській школі. Твоє завдання — згенерувати ${b.qcnt} високоякісних питань для ${taskTypeName} в стилі НМТ/ЗНО.

ПАРАМЕТРИ:
- Предмет: ${subjectName}
- Клас: ${grade}-й
- Тема: "${b.topic.trim()}"${b.subtopic?'\n- Підтема: "'+b.subtopic.trim()+'"':''}${b.book?'\n- Підручник: "'+b.book.trim()+'"':''}
- Складність: ${dm[b.diff]}
- Типи питань: ${typeStr}
- Кількість: ${b.qcnt}

ВИМОГИ ДО ПИТАНЬ:
- Питання повинні бути чіткими, однозначними, без двозначностей
- Для тестових питань: рівно 4 варіанти відповіді, тільки ОДНА правильна
- Дистрактори (хибні варіанти) повинні бути правдоподібними, не очевидно неправильними
- Правильна відповідь не завжди має бути першою — рандомізуй позицію
- Уникай питань на чисту memorization без розуміння
- Складність відповідає вказаному рівню: легка — базові концепції, середня — застосування, важка — аналіз/синтез
- Питання українською мовою, грамотною та академічно правильною
- Уникай питань про події після 2024 року
- Для математики/фізики/хімії: формули записуй у текстовому форматі (не LaTeX)
- ОБОВʼЯЗКОВО додавай коротке пояснення (1-2 речення) ЧОМУ це правильна відповідь

ФОРМАТ ВІДПОВІДІ — СТРОГО ВАЛІДНИЙ JSON МАСИВ, БЕЗ ТЕКСТУ ПОЗА НИМ, БЕЗ КОДОВИХ БЛОКІВ:

[
  {
    "id": 1,
    "text": "Текст питання",
    "type": "choice",
    "options": ["варіант А", "варіант Б", "варіант В", "варіант Г"],
    "correct": 0,
    "explanation": "Коротке пояснення чому ця відповідь правильна"
  },
  {
    "id": 2,
    "text": "Твердження",
    "type": "truefalse",
    "options": ["Так", "Ні"],
    "correct": 0,
    "explanation": "Пояснення"
  },
  {
    "id": 3,
    "text": "Питання що вимагає розгорнутої відповіді",
    "type": "open",
    "explanation": "Очікувана модельна відповідь або ключові пункти"
  }
]

Згенеруй рівно ${b.qcnt} питань зі вказаних типів.`;

  let result=null;let lastErr='';

  for(let attempt=0;attempt<2;attempt++){
    try{
      const r=await fetch('/api/claude',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({
          model:'claude-sonnet-4-20250514',
          max_tokens:3500,
          messages:[{role:'user',content:prompt}]
        })
      });
      if(!r.ok){
        let errBody='';
        try{const j=await r.json();errBody=j.error?.message||'';}catch(_){}
        lastErr='HTTP '+r.status+(errBody?': '+errBody:'');
        continue;
      }
      const d=await r.json();
      if(d.error){lastErr=d.error.message||'API error';continue;}
      const respText=(d.content||[]).map(c=>c.text||'').join('');
      if(!respText){lastErr='Порожня відповідь';continue;}
      const cleaned=respText.replace(/```json\s*/g,'').replace(/```\s*/g,'').trim();
      const m=cleaned.match(/\[[\s\S]*\]/);
      if(!m){lastErr='Не знайдено JSON масив';continue;}
      try{
        result=JSON.parse(m[0]);
        if(!Array.isArray(result)||!result.length){lastErr='Невалідна структура';continue;}
        break;
      }catch(parseErr){
        lastErr='Парсинг JSON: '+parseErr.message;
      }
    }catch(e){
      lastErr=e.message||'Помилка мережі';
    }
  }

  if(!result){
    result=localGenerateQuestions(b);
    S.B._fallback=true;
    const bank=findRelevantQuestions(b.sid,b.topic);
    if(bank&&bank.length>0){
      S.B.genError='AI-сервіс тимчасово недоступний. Згенеровано якісні питання з вбудованої бази для теми «'+b.topic+'». Перегляньте та використайте.';
    }else{
      S.B.genError='AI-сервіс недоступний ('+lastErr+'). Створено шаблонні питання — відредагуйте їх вручну, або спробуйте ще раз.';
    }
  }else{
    S.B._fallback=false;
    S.B.genError=null;
  }

  result=result.slice(0,b.qcnt).map((q,i)=>({
    id:i+1,
    text:q.text||q.txt||'',
    type:q.type||'choice',
    options:q.options||q.opts||(q.type==='truefalse'?['Так','Ні']:undefined),
    correct:q.correct!==undefined?q.correct:(q.ok!==undefined?q.ok:0),
    explanation:q.explanation||''
  }));

  S.B.gen=result;
  if(!S.B.title)S.B.title=`${tL(S.B.type)}: ${S.B.topic}`;
  S.B.loading=false;
  render();
  toast(`Згенеровано ${result.length} питань`,S.B._fallback?'warn':'ok',3500);
}

const QUESTION_BANK = {
  math: {
    'квадратні рівняння': [
      {q:'Яке з рівнянь є квадратним?',opts:['x² + 5x − 6 = 0','3x + 7 = 0','2x³ − 8 = 0','5/x = 4'],c:0,e:'Квадратне рівняння має старший степінь 2'},
      {q:'Чому дорівнює дискримінант рівняння x² − 6x + 5 = 0?',opts:['16','36','4','24'],c:0,e:'D = b² − 4ac = 36 − 20 = 16'},
      {q:'Скільки коренів має рівняння, якщо D > 0?',opts:['Два різних','Один','Нуль','Безліч'],c:0,e:'Якщо дискримінант додатний, рівняння має два різні корені'},
      {q:'За формулою Вієта для x² + px + q = 0, x₁ · x₂ дорівнює:',opts:['q','−q','p','−p'],c:0,e:'За теоремою Вієта добуток коренів дорівнює q'},
      {q:'Знайдіть корені: x² − 5x + 6 = 0',opts:['2 і 3','−2 і −3','1 і 6','−1 і 6'],c:0,e:'D = 1, x = (5±1)/2 = 2 або 3'},
      {q:'Яке з тверджень про квадратне рівняння хибне?',opts:['Завжди має 2 корені','Може не мати дійсних коренів','Старший коефіцієнт ≠ 0','Має вигляд ax² + bx + c = 0'],c:0,e:'Може не мати дійсних коренів якщо D < 0'},
    ],
    'похідна': [
      {q:'Похідна функції f(x) = x³ дорівнює:',opts:['3x²','x²','3x','x⁴/4'],c:0,e:'(xⁿ)′ = n · x^(n−1)'},
      {q:'Похідна сталої функції дорівнює:',opts:['0','1','x','саме сталій'],c:0,e:'Похідна константи завжди 0'},
      {q:'Похідна суми функцій дорівнює:',opts:['Сумі похідних','Добутку похідних','Різниці похідних','Не визначається'],c:0,e:'(f+g)′ = f′ + g′'},
      {q:'Похідна f(x) = sin(x) дорівнює:',opts:['cos(x)','−cos(x)','−sin(x)','tg(x)'],c:0,e:'Похідна синуса — косинус'},
      {q:'Геометричний зміст похідної у точці — це:',opts:['Тангенс кута нахилу дотичної','Площа під графіком','Значення функції','Координата точки'],c:0,e:'Похідна — це кутовий коефіцієнт дотичної'},
    ],
    'логарифми': [
      {q:'Чому дорівнює log₂(8)?',opts:['3','2','4','8'],c:0,e:'2³ = 8, тому log₂(8) = 3'},
      {q:'log(a · b) дорівнює:',opts:['log(a) + log(b)','log(a) · log(b)','log(a) − log(b)','log(a/b)'],c:0,e:'Логарифм добутку = сума логарифмів'},
      {q:'log(a/b) дорівнює:',opts:['log(a) − log(b)','log(a) + log(b)','log(a) · log(b)','log(b/a)'],c:0,e:'Логарифм частки = різниця логарифмів'},
      {q:'log(aⁿ) дорівнює:',opts:['n · log(a)','log(a) / n','aⁿ','a · log(n)'],c:0,e:'Логарифм степеня = показник × логарифм основи'},
    ],
  },
  ukr: {
    'частини мови': [
      {q:'До якої частини мови належить слово «швидко»?',opts:['Прислівник','Прикметник','Іменник','Дієслово'],c:0,e:'Прислівник позначає ознаку дії і відповідає на «як?»'},
      {q:'Що позначає іменник?',opts:['Предмет','Дію','Ознаку','Кількість'],c:0,e:'Іменник позначає предмет, явище або поняття'},
      {q:'Яке слово є дієсловом?',opts:['Бігти','Швидкий','Біг','Швидко'],c:0,e:'Дієслово позначає дію або стан'},
      {q:'Скільки відмінків в українській мові?',opts:['7','6','8','5'],c:0,e:'В українській мові 7 відмінків, включаючи кличний'},
    ],
    'фразеологізми': [
      {q:'Що означає фразеологізм «бити байдики»?',opts:['Нічого не робити','Готуватись до уроку','Сваритися','Швидко працювати'],c:0,e:'«Бити байдики» — нічого не робити, ледарювати'},
      {q:'Яке значення має «зарубати на носі»?',opts:['Запам\'ятати','Забути','Образитись','Загубити'],c:0,e:'«Зарубати на носі» — запам\'ятати міцно'},
      {q:'Що означає «крапля в морі»?',opts:['Дуже мало','Дуже багато','Точно в ціль','Завжди'],c:0,e:'«Крапля в морі» — мізерна кількість'},
    ],
  },
  hist: {
    'україна': [
      {q:'У якому році Україна проголосила незалежність?',opts:['1991','1990','1989','1992'],c:0,e:'24 серпня 1991 року Верховна Рада прийняла Акт проголошення незалежності'},
      {q:'Хто був першим президентом України?',opts:['Леонід Кравчук','Леонід Кучма','Віктор Ющенко','Михайло Грушевський'],c:0,e:'Леонід Кравчук — перший президент незалежної України (1991-1994)'},
      {q:'Коли було прийнято Конституцію України?',opts:['28 червня 1996','24 серпня 1991','1 грудня 1991','22 січня 1918'],c:0,e:'Конституція України прийнята 28 червня 1996 року'},
    ],
  },
  cs: {
    'алгоритми': [
      {q:'Складність бульбашкового сортування:',opts:['O(n²)','O(n log n)','O(n)','O(1)'],c:0,e:'Bubble sort у найгіршому випадку O(n²)'},
      {q:'Який алгоритм найшвидший у середньому?',opts:['Quicksort','Bubble sort','Insertion sort','Selection sort'],c:0,e:'Quicksort має середню складність O(n log n)'},
      {q:'Що таке рекурсія?',opts:['Функція викликає сама себе','Цикл for','Умовний оператор','Тип даних'],c:0,e:'Рекурсія — техніка, коли функція викликає сама себе'},
    ],
    'структури даних': [
      {q:'Що таке стек?',opts:['LIFO','FIFO','Зв\'язний список','Масив'],c:0,e:'Stack — Last In First Out (останній прийшов — перший вийшов)'},
      {q:'Що таке черга?',opts:['FIFO','LIFO','Дерево','Граф'],c:0,e:'Queue — First In First Out'},
    ],
  },
  phys: {
    'закони ньютона': [
      {q:'Перший закон Ньютона:',opts:['Тіло зберігає стан спокою або рівномірного руху','F = ma','Дія = протидія','E = mc²'],c:0,e:'Перший закон Ньютона — закон інерції'},
      {q:'Формула другого закону Ньютона:',opts:['F = ma','F = mg','F = mv','F = m/a'],c:0,e:'Сила дорівнює добутку маси на прискорення'},
      {q:'Третій закон Ньютона стверджує:',opts:['Дія дорівнює протидії','Сила тяжіння','Закон інерції','Закон збереження'],c:0,e:'Сили взаємодії двох тіл рівні за модулем і протилежні за напрямом'},
    ],
    'енергія': [
      {q:'Кінетична енергія обчислюється:',opts:['mv²/2','mgh','mc²','F·s'],c:0,e:'Кінетична енергія — енергія рухомого тіла'},
      {q:'Потенціальна енергія в полі тяжіння:',opts:['mgh','mv²/2','F·t','m·a'],c:0,e:'E_p = mgh, де h — висота над рівнем відліку'},
    ],
  },
};

function findRelevantQuestions(subjectId,topic){
  const subjectBank=QUESTION_BANK[subjectId]||{};
  const topicLower=(topic||'').toLowerCase().trim();
  for(const key in subjectBank){
    if(topicLower.includes(key)||key.includes(topicLower)){
      return subjectBank[key];
    }
  }
  for(const key in subjectBank){
    const keyWords=key.split(/\s+/);
    const topicWords=topicLower.split(/\s+/);
    if(keyWords.some(kw=>topicWords.some(tw=>tw.length>3&&kw.includes(tw)||tw.includes(kw)))){
      return subjectBank[key];
    }
  }
  return null;
}

function localGenerateQuestions(b){
  const types=b.qtypes||['choice'];
  const out=[];
  const subj=getSub(b.sid);
  const subjName=subj.n;

  const bank=findRelevantQuestions(b.sid,b.topic);

  if(bank&&bank.length>0){
    const shuffled=[...bank].sort(()=>Math.random()-0.5);
    for(let i=0;i<Math.min(b.qcnt,shuffled.length);i++){
      const t=shuffled[i];
      out.push({
        id:i+1,
        text:t.q,
        type:'choice',
        options:t.opts,
        correct:t.c,
        explanation:t.e
      });
    }
    for(let i=out.length;i<b.qcnt;i++){
      const t=shuffled[i%shuffled.length];
      out.push({
        id:i+1,
        text:t.q+' (варіант '+(Math.floor(i/shuffled.length)+1)+')',
        type:'choice',
        options:t.opts,
        correct:t.c,
        explanation:t.e
      });
    }
    return out;
  }

  for(let i=0;i<b.qcnt;i++){
    const type=types[i%types.length];
    if(type==='choice'){
      out.push({
        id:i+1,
        text:`[${subjName}] Питання ${i+1} з теми «${b.topic}»`,
        type:'choice',
        options:['Варіант А (відредагуйте)','Варіант Б','Варіант В','Варіант Г'],
        correct:0,
        explanation:'Шаблонне питання — відредагуйте вручну, або повторіть генерацію через AI'
      });
    }else if(type==='truefalse'){
      out.push({
        id:i+1,
        text:`[${subjName}] Твердження ${i+1} з теми «${b.topic}»`,
        type:'truefalse',
        options:['Так','Ні'],
        correct:0,
        explanation:'Шаблонне — відредагуйте текст і відповідь'
      });
    }else{
      out.push({
        id:i+1,
        text:`[${subjName}] Відкрите питання ${i+1}: розкрийте тему «${b.topic}»`,
        type:'open',
        explanation:'Очікується розгорнута відповідь учня'
      });
    }
  }
  return out;
}
