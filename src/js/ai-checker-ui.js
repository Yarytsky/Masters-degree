function rAIChecker(){
  const txt=S.aiCheckText||'';
  const stats=txt.length>0?textStats(txt):null;
  const minOk=txt.length>=200;
  const checking=S.aiChecking;
  const res=S.aiCheckResult;
  const showResult=res&&!checking;

  // Batch class-checking has its own flow
  if(S.aiBatchResult&&!S.aiBatchRunning&&S.aiInputMode==='batch'){
    return rBatchResult();
  }
  if(S.aiBatchRunning){
    return rBatchProgress();
  }

  if(showResult){
    return`<div>
      <div class="ph ph-row ai-result-header">
        <div><div class="pt">Результат перевірки</div><div class="ps">${stats?stats.wordCount+' слів · '+stats.sentCount+' речень':''}</div></div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn btn-s btn-sm" onclick="exportAIReport()">${ico('file',13)} Експорт</button>
          <button class="btn btn-s btn-sm" onclick="printAIReport()">${ico('book',13)} Друк</button>
          <button class="btn btn-s btn-sm" onclick="resetAICheck()">${ico('plus',13,'transform:rotate(45deg)')} Нова перевірка</button>
        </div>
      </div>
      ${rAIResultPro(res,stats)}
      ${rAIHistory()}
    </div>`;
  }

  if(checking){
    return`<div>
      <div class="ph"><div class="pt">Перевірка тексту</div><div class="ps">Виконується аналіз…</div></div>
      ${rAIProgress()}
    </div>`;
  }

  return`<div>
    <div class="ph"><div class="pt">Перевірка на AI та плагіат</div><div class="ps">Завантажте текст роботи учня для аналізу</div></div>

    <div class="card" style="margin-bottom:14px">
      <div class="ct">Текст роботи</div>

      <div class="tgl" style="margin-bottom:12px">
        <button class="tglb${(S.aiInputMode||'paste')==='paste'?' act':''}" onclick="S.aiInputMode='paste';S.aiSelectedWorkId=null;render()">${ico('edit',12)} Вставити текст</button>
        <button class="tglb${S.aiInputMode==='file'?' act':''}" onclick="S.aiInputMode='file';S.aiSelectedWorkId=null;render()">${ico('file',12)} Завантажити файл</button>
        <button class="tglb${S.aiInputMode==='works'?' act':''}" onclick="S.aiInputMode='works';render()">${ico('user',12)} Зі студентських робіт</button>
        <button class="tglb${S.aiInputMode==='batch'?' act':''}" onclick="S.aiInputMode='batch';render()">${ico('users',12)} Перевірити клас</button>
      </div>

      ${(S.aiInputMode||'paste')==='paste'?`
        <textarea class="fta" id="ai-txt" rows="12" placeholder="Вставте текст роботи учня для аналізу…&#10;&#10;Мінімум 200 символів для якісного аналізу" oninput="S.aiCheckText=this.value;updateAIStats()" style="min-height:240px;font-family:inherit">${txt}</textarea>
      `:S.aiInputMode==='file'?`
        <div class="fz" id="ai-drop" ondragover="event.preventDefault();this.style.borderColor='var(--blue)';this.style.background='var(--blt)'" ondragleave="this.style.borderColor='';this.style.background=''" ondrop="handleAIDrop(event)" onclick="document.getElementById('ai-file-inp').click()" style="padding:36px 22px">
          <input type="file" id="ai-file-inp" accept=".txt,.md,.csv,.html,.htm" style="display:none" onchange="handleAIFile(this.files[0])"/>
          <div style="font-size:2.4rem;margin-bottom:10px;opacity:.4">${ico('file',38)}</div>
          <div style="font-size:.95rem;font-weight:600;margin-bottom:5px">Перетягніть файл сюди або натисніть для вибору</div>
          <div style="font-size:.76rem;color:var(--ink3)">Підтримуються: TXT, MD, HTML · до 1 МБ</div>
          ${txt?`<div style="margin-top:14px;padding:8px 12px;background:var(--gbg);border-radius:var(--r2);font-size:.78rem;color:var(--green);font-weight:600;display:inline-block">✓ Завантажено: ${(txt.length/1024).toFixed(1)} КБ · ${stats?stats.wordCount:0} слів</div>`:''}
        </div>
      `:S.aiInputMode==='batch'?rBatchPicker():rWorksPicker(txt,stats)}

      ${S.aiInputMode!=='batch'?`<div id="ai-stats-bar" style="display:flex;align-items:center;justify-content:space-between;margin-top:14px;padding:10px 14px;background:var(--bg2);border-radius:var(--r2);flex-wrap:wrap;gap:10px">
        ${stats?`
        <div style="display:flex;gap:18px;flex-wrap:wrap;font-size:.78rem">
          <div><span style="color:var(--ink3)">Слова:</span> <b>${stats.wordCount}</b></div>
          <div><span style="color:var(--ink3)">Речення:</span> <b>${stats.sentCount}</b></div>
          <div><span style="color:var(--ink3)">Символи:</span> <b>${stats.chars}</b></div>
        </div>
        <span style="font-size:.74rem;color:${minOk?'var(--green)':'var(--ink3)'};font-weight:600">${minOk?'✓ Готово до аналізу':`Ще ${200-txt.length} симв.`}</span>
        `:`
        <span style="font-size:.78rem;color:var(--ink3)">Введіть текст для аналізу</span>
        <span style="font-size:.74rem;color:var(--ink3)">мінімум 200 символів</span>
        `}
      </div>` : ''}

      <div style="margin-top:14px;padding:11px 14px;background:var(--bg2);border-radius:var(--r2);border:1px solid var(--line)">
        <div style="font-size:.7rem;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.07em;margin-bottom:8px">Режим перевірки</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">
          <button onclick="S.aiStrictness='lenient';render()" style="padding:9px 8px;border-radius:var(--r2);border:1.5px solid ${(S.aiStrictness||'strict')==='lenient'?'var(--green)':'var(--line)'};background:${(S.aiStrictness||'strict')==='lenient'?'var(--gbg)':'var(--sur)'};cursor:pointer;text-align:center;transition:all .15s">
            <div style="font-size:1.05rem;margin-bottom:3px">🛡️</div>
            <div style="font-size:.74rem;font-weight:700;color:${(S.aiStrictness||'strict')==='lenient'?'var(--green)':'var(--ink)'}">Поблажливий</div>
            <div style="font-size:.65rem;color:var(--ink3);margin-top:2px">Поріг 65%</div>
          </button>
          <button onclick="S.aiStrictness='balanced';render()" style="padding:9px 8px;border-radius:var(--r2);border:1.5px solid ${(S.aiStrictness||'strict')==='balanced'?'var(--blue)':'var(--line)'};background:${(S.aiStrictness||'strict')==='balanced'?'var(--blt)':'var(--sur)'};cursor:pointer;text-align:center;transition:all .15s">
            <div style="font-size:1.05rem;margin-bottom:3px">⚖️</div>
            <div style="font-size:.74rem;font-weight:700;color:${(S.aiStrictness||'strict')==='balanced'?'var(--blue)':'var(--ink)'}">Збалансований</div>
            <div style="font-size:.65rem;color:var(--ink3);margin-top:2px">Поріг 50%</div>
          </button>
          <button onclick="S.aiStrictness='strict';render()" style="padding:9px 8px;border-radius:var(--r2);border:1.5px solid ${(S.aiStrictness||'strict')==='strict'?'var(--red)':'var(--line)'};background:${(S.aiStrictness||'strict')==='strict'?'var(--rbg)':'var(--sur)'};cursor:pointer;text-align:center;transition:all .15s">
            <div style="font-size:1.05rem;margin-bottom:3px">🔍</div>
            <div style="font-size:.74rem;font-weight:700;color:${(S.aiStrictness||'strict')==='strict'?'var(--red)':'var(--ink)'}">Строгий</div>
            <div style="font-size:.65rem;color:var(--ink3);margin-top:2px">Поріг 35%</div>
          </button>
        </div>
        <div style="font-size:.69rem;color:var(--ink3);margin-top:8px;line-height:1.5">${(S.aiStrictness||'strict')==='lenient'?'🛡️ Менше false positives. Підозра тільки на сильні маркери AI.':(S.aiStrictness||'strict')==='balanced'?'⚖️ Збалансований підхід. Підозра при ~50/50 ймовірності.':'🔍 Більше recall — спіймати все що схоже на AI. Деякі чесні роботи можуть отримати помилкову підозру.'}</div>
      </div>

      <div style="margin-top:11px;padding:11px 14px;background:var(--bg2);border-radius:var(--r2);border:1px solid var(--line)">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:${(S.aiWhitelistOpen||(S.aiWhitelist&&S.aiWhitelist.length))?'10px':'0'}">
          <div>
            <div style="font-size:.7rem;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.07em">Whitelist маркерів${S.aiWhitelist&&S.aiWhitelist.length?` · ${S.aiWhitelist.length}`:''}</div>
            <div style="font-size:.71rem;color:var(--ink3);margin-top:3px">Фрази які ігноруються при AI-перевірці</div>
          </div>
          <button class="btn btn-s btn-sm" onclick="S.aiWhitelistOpen=!S.aiWhitelistOpen;render()">${(S.aiWhitelistOpen||(S.aiWhitelist&&S.aiWhitelist.length))?'Сховати':'Налаштувати'}</button>
        </div>
        ${(S.aiWhitelistOpen||(S.aiWhitelist&&S.aiWhitelist.length))?`
        <div>
          ${S.aiWhitelist&&S.aiWhitelist.length?`<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:9px">
            ${S.aiWhitelist.map((w,i)=>`<span style="display:inline-flex;align-items:center;gap:5px;padding:4px 9px;background:var(--sur);border:1px solid var(--line2);border-radius:14px;font-size:.74rem">
              «${w}»
              <button onclick="S.aiWhitelist.splice(${i},1);render()" style="border:none;background:transparent;cursor:pointer;color:var(--ink3);font-weight:700;padding:0;line-height:1;font-size:.95rem">×</button>
            </span>`).join('')}
          </div>`:''}
          <div style="display:flex;gap:6px">
            <input class="fi" id="ai-wl-input" placeholder="напр.: у висновку" style="flex:1;height:32px;font-size:.78rem;padding:6px 11px" onkeydown="if(event.key==='Enter'){addToWhitelist(this.value);this.value=''}"/>
            <button class="btn btn-s btn-sm" onclick="const inp=document.getElementById('ai-wl-input');addToWhitelist(inp.value);inp.value=''">${ico('plus',12)} Додати</button>
          </div>
          <div style="font-size:.68rem;color:var(--ink3);margin-top:7px;line-height:1.5">Корисно якщо ви самі вимагаєте певних формальностей (напр. «у висновку») і не хочете щоб вони впливали на AI-оцінку.</div>
        </div>`:''}
      </div>

      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:14px;flex-wrap:wrap">
        ${S.aiInputMode==='batch'?`
          <button class="btn btn-p" onclick="runBatchCheck()">${ico('ai',13)} Перевірити весь клас (${(STUDENT_WORKS[S.aiSelectedClass||'11a']||[]).length} робіт)</button>
        `:`
          ${txt?`<button class="btn btn-s btn-sm" onclick="S.aiCheckText='';S.aiCheckResult=null;render()">${ico('trash',12)} Очистити</button>`:''}
          <button class="btn btn-p" onclick="S.aiCheckText=document.getElementById('ai-txt')?.value||S.aiCheckText;runAICheck()">
            ${ico('ai',13)} Запустити перевірку
          </button>
        `}
      </div>
    </div>

    ${S.aiChecks.length>0?rAIHistory():`
    <div class="card" style="background:linear-gradient(135deg,var(--bg2),var(--sur));border:1.5px dashed var(--line2)">
      <div style="text-align:center;padding:24px 18px">
        <div style="opacity:.3;margin-bottom:10px">${ico('ai',40)}</div>
        <div style="font-size:.85rem;color:var(--ink3);max-width:380px;margin:0 auto;line-height:1.55">
          Аналіз буде проведено по 7 параметрах: ймовірність AI, лексична різноманітність, особистий голос, природність структури, формальність, варіативність речень, типові маркери.
        </div>
      </div>
    </div>
    `}
  </div>`;
}

function rAIHistory(){
  if(!S.aiChecks.length)return'';
  return`<div>${rAIStatsCard()}<div class="card">
    <div class="ct" style="display:flex;justify-content:space-between;align-items:center">
      <span>Історія перевірок · ${S.aiChecks.length}</span>
      <button class="btn btn-s btn-sm" onclick="if(confirm('Очистити всю історію?')){S.aiChecks=[];render()}">Очистити</button>
    </div>
    ${S.aiChecks.slice(0,8).map(c=>`<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--line);cursor:pointer" onclick="loadAICheck('${c.id}')">
      <div style="flex:1;min-width:0;display:flex;align-items:center;gap:11px">
        <div style="width:36px;height:36px;border-radius:8px;display:grid;place-items:center;flex-shrink:0;background:${c.score>=70?'var(--rbg)':c.score>=40?'var(--abg)':'var(--gbg)'};color:${c.score>=70?'var(--red)':c.score>=40?'var(--amber)':'var(--green)'};font-family:var(--ff);font-weight:600;font-size:.85rem">${c.score}%</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:.84rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.label}</div>
          <div style="font-size:.7rem;color:var(--ink3)">${c.date} · ${c.wordCount} слів · ${c.score>=70?'Ймовірно AI':c.score>=40?'Підозріло':'Ймовірно людина'}</div>
        </div>
      </div>
      <button class="btn-icon del" onclick="event.stopPropagation();S.aiChecks=S.aiChecks.filter(x=>x.id!=='${c.id}');render()">${ico('trash',12)}</button>
    </div>`).join('')}
  </div></div>`;
}

function rAIProgress(){
  const stages=S.aiStages||[];
  return`<div class="card" style="max-width:520px;margin:0 auto">
    <div style="text-align:center;padding:18px 6px 22px">
      <div style="position:relative;width:96px;height:96px;margin:0 auto 18px">
        <svg width="96" height="96" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="40" fill="none" stroke="var(--bg3)" stroke-width="6"/>
          <circle cx="48" cy="48" r="40" fill="none" stroke="var(--blue)" stroke-width="6" stroke-linecap="round"
            stroke-dasharray="251" stroke-dashoffset="63"
            style="transform-origin:center;animation:aiSpin 1.4s linear infinite"/>
        </svg>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--blue)">${ico('ai',28)}</div>
      </div>
      <div style="font-family:var(--ff);font-size:1.1rem;font-weight:500;margin-bottom:5px">Виконується аналіз</div>
      <div style="font-size:.82rem;color:var(--ink2);margin-bottom:18px">Це може зайняти 10–30 секунд</div>
      <style>@keyframes aiSpin{to{transform:rotate(360deg)}}</style>
    </div>
    <div style="border-top:1px solid var(--line);padding:16px 4px 0">
      ${[
        {k:'stats',l:'Обробка статистики тексту'},
        {k:'lex',l:'Аналіз лексики та стилю'},
        {k:'api',l:'Запит до AI-детектора'},
        {k:'parse',l:'Аналіз результатів'},
      ].map(s=>{
        const status=stages.includes(s.k)?'done':stages.length>0&&!stages.includes(s.k)&&[s.k]==stages[stages.length-1]?'active':stages[stages.length]==undefined?'pending':'pending';
        const isDone=stages.includes(s.k);
        const isCurrent=!isDone&&stages.length>0&&stages.indexOf(stages[stages.length-1])>=0;
        return`<div style="display:flex;align-items:center;gap:11px;padding:9px 0">
          <div style="width:18px;height:18px;border-radius:50%;display:grid;place-items:center;flex-shrink:0;background:${isDone?'var(--green)':isCurrent?'var(--blue)':'var(--bg3)'};color:white;font-size:.65rem;font-weight:700">
            ${isDone?'✓':isCurrent?'<span class="spn" style="border-color:rgba(255,255,255,.3);border-top-color:#fff;width:10px;height:10px"></span>':''}
          </div>
          <span style="font-size:.83rem;color:${isDone?'var(--green)':isCurrent?'var(--ink)':'var(--ink3)'};font-weight:${isCurrent?'600':'500'}">${s.l}</span>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

function rAIResultPro(r,stats){
  const score=r.ai_probability||0;
  const col=score>=70?'var(--red)':score>=40?'var(--amber)':'var(--green)';
  const verdict=r.verdict||(score>=70?'Ймовірно AI-генерація':score>=40?'Підозріло — потребує перевірки':'Ймовірно людина');
  const verdictDetail=r.summary||(score>=70?'Текст має чіткі ознаки автоматичної генерації штучним інтелектом':score>=40?'Деякі ознаки AI присутні, але не вирішальні. Рекомендуємо особисту перевірку.':'Текст виглядає природно написаним людиною');
  const m=r.metrics||{};
  const circ=2*Math.PI*64;
  const off=circ*(1-score/100);

  // Threshold position based on strictness mode
  const strictness=S.aiStrictness||'strict';
  const threshold=strictness==='lenient'?65:strictness==='balanced'?50:35;
  const thresholdAngle=(threshold/100)*360-90;
  const thRad=thresholdAngle*Math.PI/180;
  const thX=90+72*Math.cos(thRad);
  const thY=90+72*Math.sin(thRad);
  const tickX1=90+58*Math.cos(thRad);
  const tickY1=90+58*Math.sin(thRad);
  const tickX2=90+72*Math.cos(thRad);
  const tickY2=90+72*Math.sin(thRad);
  const strictnessLabel=strictness==='lenient'?'Поблажливий':strictness==='balanced'?'Збалансований':'Строгий';

  return`<div>
    ${r._fallback?`<div class="alert a-info" style="margin-bottom:12px;font-size:.78rem">
      <b>Локальний аналіз:</b> AI-сервіс недоступний (${r._apiError||'помилка зʼєднання'}). Результат отримано на базі статистичного аналізу тексту.
    </div>`:''}
    <div class="card" style="margin-bottom:12px;background:linear-gradient(180deg,${col}08,transparent);border:1.5px solid ${col}33">
      <div style="display:grid;grid-template-columns:auto 1fr;gap:24px;align-items:center;flex-wrap:wrap" class="ai-result-hd">
        <div style="position:relative;width:180px;height:180px;flex-shrink:0">
          <svg width="180" height="180" viewBox="0 0 180 180" style="transform:rotate(-90deg)">
            <circle cx="90" cy="90" r="64" fill="none" stroke="var(--bg3)" stroke-width="12"/>
            <circle cx="90" cy="90" r="64" fill="none" stroke="${col}" stroke-width="12"
              stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"
              stroke-linecap="round"
              style="filter:drop-shadow(0 2px 8px ${col}55);transition:stroke-dashoffset 1s ease-out"/>
            <line x1="${tickX1.toFixed(1)}" y1="${tickY1.toFixed(1)}" x2="${tickX2.toFixed(1)}" y2="${tickY2.toFixed(1)}" stroke="var(--ink2)" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="${thX.toFixed(1)}" cy="${thY.toFixed(1)}" r="4" fill="var(--sur)" stroke="var(--ink2)" stroke-width="2"/>
          </svg>
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
            <div style="font-family:var(--ff);font-size:2.6rem;font-weight:600;line-height:1;color:${col}">${score}<span style="font-size:1.2rem;opacity:.7">%</span></div>
            <div style="font-size:.66rem;color:var(--ink3);text-transform:uppercase;letter-spacing:.1em;margin-top:4px;font-weight:600">AI ризик</div>
            <div style="font-size:.61rem;color:var(--ink3);margin-top:4px">поріг ${threshold}% · ${strictnessLabel}</div>
          </div>
        </div>
        <div>
          <div style="font-family:var(--ff);font-size:1.5rem;font-weight:500;color:${col};margin-bottom:7px;line-height:1.2">${verdict}</div>
          <div style="font-size:.86rem;color:var(--ink2);line-height:1.6;margin-bottom:12px">${verdictDetail}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <span class="b ${score>=70?'b-red':score>=40?'b-amber':'b-green'}" style="padding:5px 11px;font-size:.74rem">Достовірність: ${r.confidence||'Середня'}</span>
            ${r.text_quality?`<span class="b b-gray" style="padding:5px 11px;font-size:.74rem">Якість: ${r.text_quality}</span>`:''}
            ${stats?`<span class="b b-blue" style="padding:5px 11px;font-size:.74rem">${stats.wordCount} слів</span>`:''}
          </div>
        </div>
      </div>
    </div>

    ${r.summary?`<div class="card" style="margin-bottom:12px;border-left:4px solid ${col}">
      <div class="ct">Висновок експерта</div>
      <div style="font-size:.9rem;color:var(--ink);line-height:1.7">${r.summary}</div>
    </div>`:''}

    <div class="card" style="margin-bottom:12px">
      <div class="ct">Детальні метрики</div>
      <div style="display:grid;gap:14px">
        ${[
          {l:'Лексична різноманітність',v:m.lexical_diversity||0,inv:false,desc:'Скільки унікальних слів. Низьке значення — повтори (характерно для AI)'},
          {l:'Особистий голос автора',v:m.personal_voice||0,inv:false,desc:'Особисті займенники, емоції, особисті приклади (характерно для людини)'},
          {l:'Природність структури',v:m.naturalness||0,inv:false,desc:'Варіативність речень, природні переходи'},
          {l:'Формальність мови',v:m.formality||0,inv:true,desc:'Дуже висока формальність у роботі школяра — підозрілий маркер'},
        ].map(item=>{
          const colBar=item.inv?(item.v>75?'var(--red)':item.v>50?'var(--amber)':'var(--blue)'):(item.v>=60?'var(--green)':item.v>=40?'var(--amber)':'var(--red)');
          return`<div>
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px">
              <span style="font-size:.84rem;font-weight:600;color:var(--ink)">${item.l}</span>
              <span style="font-family:var(--ff);font-size:1rem;font-weight:600;color:${colBar}">${item.v}%</span>
            </div>
            <div style="height:8px;background:var(--bg3);border-radius:4px;overflow:hidden;margin-bottom:4px">
              <div class="ai-bar-fill" style="height:100%;border-radius:4px;width:${item.v}%;background:${colBar};transition:width 1s cubic-bezier(.4,0,.2,1)"></div>
            </div>
            <div style="font-size:.71rem;color:var(--ink3);line-height:1.5">${item.desc}</div>
          </div>`;
        }).join('')}
      </div>
    </div>

    ${stats?`<div class="card" style="margin-bottom:12px">
      <div class="ct">Статистика тексту</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:10px">
        ${[
          {l:'Слів',v:stats.wordCount},
          {l:'Речень',v:stats.sentCount},
          {l:'Символів',v:stats.chars},
          {l:'Абзаців',v:stats.paragraphs},
          {l:'Сл/реч.',v:stats.avgSentLen},
          {l:'Унік. слів',v:stats.uniqueWords},
        ].map(s=>`<div style="text-align:center;padding:10px 6px;background:var(--bg2);border-radius:var(--r2)">
          <div style="font-family:var(--ff);font-size:1.15rem;font-weight:500;color:var(--ink)">${s.v}</div>
          <div style="font-size:.65rem;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;margin-top:3px">${s.l}</div>
        </div>`).join('')}
      </div>
    </div>`:''}

    ${r.advanced_metrics?`<div class="card" style="margin-bottom:12px">
      <div class="ct">Розширені метрики аналізу</div>
      <div style="font-size:.74rem;color:var(--ink3);margin-bottom:10px;line-height:1.5">Технічні показники, які використовують професійні AI-детектори (GPTZero, Originality.AI)</div>
      <div style="display:grid;gap:10px">
        ${[
          {l:'Burstiness',v:r.advanced_metrics.burstiness,desc:'Варіативність довжини речень. <0.4 — підозріло, >0.6 — людяно',low:0.4,high:0.6,human:'high'},
          {l:'AI-щільність маркерів',v:r.advanced_metrics.ai_density+'/1k',num:r.advanced_metrics.ai_density,desc:'Кількість шаблонних AI-фраз на 1000 слів. >3 — тривожно',low:1.5,high:3,human:'low',inv:true},
          {l:'Особиста щільність',v:r.advanced_metrics.personal_density+'/1k',num:r.advanced_metrics.personal_density,desc:'Особисті займенники, емоції на 1000 слів. >5 — людяно',low:2,high:5,human:'high'},
          {l:'Структурна уніформність',v:r.advanced_metrics.uniformity+'%',num:r.advanced_metrics.uniformity,desc:'Наскільки однорідні речення за довжиною. >75% — підозріло',low:50,high:75,human:'low',inv:true},
          {l:'N-грам перетин',v:r.advanced_metrics.ngram_overlap+'%',num:r.advanced_metrics.ngram_overlap,desc:'Повторювані 4-словні фрагменти. >5% — повтори',low:2,high:5,human:'low',inv:true},
          {l:'Частка довгих слів',v:r.advanced_metrics.long_word_ratio+'%',num:r.advanced_metrics.long_word_ratio,desc:'Слова 7+ літер. >32% — формальний стиль',low:25,high:32,human:'low',inv:true},
          {l:'Hedge-слова',v:r.advanced_metrics.hedge_count,num:r.advanced_metrics.hedge_count,desc:'Слова невпевненості («можливо», «здається») — людяний маркер',low:1,high:3,human:'high'},
          {l:'Слова-філери',v:r.advanced_metrics.filler_count,num:r.advanced_metrics.filler_count,desc:'Розмовні «вставки» («просто», «загалом») — людяний маркер',low:2,high:5,human:'high'},
        ].map(m=>{
          const num=m.num!==undefined?m.num:m.v;
          let status='neutral';let col='var(--ink2)';
          if(m.human==='high'){
            if(num>=m.high){status='good';col='var(--green)';}
            else if(num<m.low){status='bad';col='var(--red)';}
          }else{
            if(num>=m.high){status='bad';col='var(--red)';}
            else if(num<m.low){status='good';col='var(--green)';}
          }
          const icon=status==='good'?'✓':status==='bad'?'⚠':'•';
          return`<div style="display:grid;grid-template-columns:auto 1fr auto;gap:10px;padding:10px 12px;background:var(--bg2);border-radius:var(--r2);align-items:center;border-left:3px solid ${col}">
            <div style="width:22px;height:22px;border-radius:50%;background:${col}22;color:${col};display:grid;place-items:center;font-weight:700;font-size:.78rem">${icon}</div>
            <div>
              <div style="font-size:.81rem;font-weight:600;margin-bottom:2px">${m.l}</div>
              <div style="font-size:.69rem;color:var(--ink3);line-height:1.4">${m.desc}</div>
            </div>
            <div style="font-family:var(--ff);font-size:1.05rem;font-weight:600;color:${col};white-space:nowrap">${m.v}</div>
          </div>`;
        }).join('')}
      </div>
    </div>`:''}

    ${r.evidence_log&&r.evidence_log.length?`<div class="card" style="margin-bottom:12px">
      <div class="ct">Журнал доказів</div>
      <div style="font-size:.74rem;color:var(--ink3);margin-bottom:10px">Кожен фактор, який вплинув на фінальну оцінку</div>
      ${r.evidence_log.sort((a,b)=>Math.abs(b.weight)-Math.abs(a.weight)).map(e=>{
        const sign=e.weight>0?'+':'';
        const col=e.weight>0?'var(--red)':'var(--green)';
        return`<div style="display:flex;align-items:center;gap:10px;padding:7px 11px;border-bottom:1px solid var(--line);font-size:.81rem">
          <div style="font-family:var(--ff);font-weight:600;color:${col};min-width:48px">${sign}${e.weight}</div>
          <div style="flex:1;color:var(--ink2)">${e.reason}</div>
        </div>`;
      }).join('')}
    </div>`:''}

    ${(r.ai_signs&&r.ai_signs.length)||(r.human_signs&&r.human_signs.length)?`<div class="card" style="margin-bottom:12px">
      <div class="ct">Виявлені ознаки</div>
      ${(r.ai_signs||[]).length>0?`<div style="margin-bottom:14px">
        <div style="display:flex;align-items:center;gap:7px;margin-bottom:8px">
          <div style="width:8px;height:8px;border-radius:50%;background:var(--red)"></div>
          <span style="font-size:.71rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--red)">Маркери AI · ${r.ai_signs.length}</span>
        </div>
        ${(r.ai_signs||[]).map(s=>`<div style="display:flex;align-items:flex-start;gap:9px;padding:10px 12px;background:var(--rbg);border-left:3px solid var(--red);border-radius:var(--r2);margin-bottom:6px">
          <div style="width:5px;height:5px;border-radius:50%;background:var(--red);flex-shrink:0;margin-top:7px"></div>
          <span style="font-size:.83rem;color:var(--ink);line-height:1.6">${s}</span>
        </div>`).join('')}
      </div>`:''}
      ${(r.human_signs||[]).length>0?`<div>
        <div style="display:flex;align-items:center;gap:7px;margin-bottom:8px">
          <div style="width:8px;height:8px;border-radius:50%;background:var(--green)"></div>
          <span style="font-size:.71rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--green)">Ознаки людського письма · ${r.human_signs.length}</span>
        </div>
        ${(r.human_signs||[]).map(s=>`<div style="display:flex;align-items:flex-start;gap:9px;padding:10px 12px;background:var(--gbg);border-left:3px solid var(--green);border-radius:var(--r2);margin-bottom:6px">
          <div style="width:5px;height:5px;border-radius:50%;background:var(--green);flex-shrink:0;margin-top:7px"></div>
          <span style="font-size:.83rem;color:var(--ink);line-height:1.6">${s}</span>
        </div>`).join('')}
      </div>`:''}
    </div>`:''}

    ${r.ensemble?`<div class="card" style="margin-bottom:12px;border-left:3px solid ${r.ensemble.spread<15?'var(--green)':r.ensemble.spread<30?'var(--amber)':'var(--red)'}">
      <div class="ct" style="display:flex;align-items:center;gap:8px">
        ${ico('ai',14)} Тристороння експертиза AI
      </div>
      <div style="font-size:.74rem;color:var(--ink3);margin-bottom:11px;line-height:1.5">Три незалежні AI-аналізи з різних кутів зору. Чим менший розкид, тим вища впевненість у вердикті.</div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px">
        <div style="padding:11px 8px;background:var(--bg2);border-radius:var(--r2);text-align:center">
          <div style="font-size:.62rem;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px">⚖️ Основний</div>
          <div style="font-family:var(--ff);font-size:1.3rem;font-weight:600;color:${r.ensemble.main_score>=60?'var(--red)':r.ensemble.main_score>=40?'var(--amber)':'var(--green)'}">${r.ensemble.main_score}%</div>
          <div style="font-size:.66rem;color:var(--ink3);margin-top:3px">збалансований</div>
        </div>
        <div style="padding:11px 8px;background:var(--bg2);border-radius:var(--r2);text-align:center">
          <div style="font-size:.62rem;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px">🔍 Скептик</div>
          <div style="font-family:var(--ff);font-size:1.3rem;font-weight:600;color:${(r.ensemble.devils_advocate_score||0)>=60?'var(--red)':(r.ensemble.devils_advocate_score||0)>=40?'var(--amber)':'var(--green)'}">${r.ensemble.devils_advocate_score!==null?r.ensemble.devils_advocate_score+'%':'—'}</div>
          <div style="font-size:.66rem;color:var(--ink3);margin-top:3px">шукає AI</div>
        </div>
        <div style="padding:11px 8px;background:var(--bg2);border-radius:var(--r2);text-align:center">
          <div style="font-size:.62rem;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px">🛡️ Захисник</div>
          <div style="font-family:var(--ff);font-size:1.3rem;font-weight:600;color:${(r.ensemble.human_advocate_score||0)>=60?'var(--red)':(r.ensemble.human_advocate_score||0)>=40?'var(--amber)':'var(--green)'}">${r.ensemble.human_advocate_score!==null?r.ensemble.human_advocate_score+'%':'—'}</div>
          <div style="font-size:.66rem;color:var(--ink3);margin-top:3px">шукає людину</div>
        </div>
      </div>

      <div style="padding:9px 12px;background:${r.ensemble.spread<15?'var(--gbg)':r.ensemble.spread<30?'var(--abg)':'var(--rbg)'};border-radius:var(--r2);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
        <div style="font-size:.78rem">
          <span style="font-weight:600">Зважений вердикт: </span>
          <span style="font-family:var(--ff);font-size:1rem;font-weight:600;color:${r.ensemble.weighted_score>=60?'var(--red)':r.ensemble.weighted_score>=40?'var(--amber)':'var(--green)'}">${r.ensemble.weighted_score}%</span>
        </div>
        <div style="font-size:.71rem;color:var(--ink2);font-weight:500">Розкид ${r.ensemble.spread}% · Згода: ${r.ensemble.agreement.toLowerCase()}</div>
      </div>
    </div>`:''}

    ${r.cross_validation?`<div class="card" style="margin-bottom:12px;border-left:3px solid ${r.cross_validation.disagreement<15?'var(--green)':r.cross_validation.disagreement<30?'var(--amber)':'var(--red)'}">
      <div class="ct" style="display:flex;align-items:center;gap:8px">
        ${ico('check',14)} Подвійна перевірка: AI + локальний детектор
      </div>
      <div style="font-size:.74rem;color:var(--ink3);margin-bottom:10px;line-height:1.5">Результат від Claude API звірено з локальним статистичним детектором.</div>
      <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:14px;align-items:center;padding:11px 14px;background:var(--bg2);border-radius:var(--r2)">
        <div style="text-align:center">
          <div style="font-size:.66rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--ink3);margin-bottom:4px">Claude API</div>
          <div style="font-family:var(--ff);font-size:1.4rem;font-weight:600;color:${r.cross_validation.api_score>=60?'var(--red)':r.cross_validation.api_score>=40?'var(--amber)':'var(--green)'}">${r.cross_validation.api_score}%</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:3px">
          <div style="font-size:1.1rem;color:var(--ink3)">⇄</div>
          <div style="font-size:.66rem;color:${r.cross_validation.disagreement<15?'var(--green)':r.cross_validation.disagreement<30?'var(--amber)':'var(--red)'};font-weight:600;text-transform:uppercase">${r.cross_validation.consensus}</div>
          <div style="font-size:.7rem;color:var(--ink3)">δ ${r.cross_validation.disagreement}%</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:.66rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--ink3);margin-bottom:4px">Локальний</div>
          <div style="font-family:var(--ff);font-size:1.4rem;font-weight:600;color:${r.cross_validation.local_score>=60?'var(--red)':r.cross_validation.local_score>=40?'var(--amber)':'var(--green)'}">${r.cross_validation.local_score}%</div>
        </div>
      </div>
      ${r.cross_validation.disagreement>=30?`<div style="margin-top:8px;font-size:.75rem;color:var(--amber);padding:7px 10px;background:var(--abg);border-radius:var(--r2)">⚠ Сильна розбіжність — фінальний результат збалансовано з обох оцінок</div>`:''}
    </div>`:''}

    ${r.sentence_analysis&&r.sentence_analysis.length?`<div class="card" style="margin-bottom:12px">
      <div class="ct" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
        <span>Аналіз речень · ${r.sentence_analysis.length}</span>
        <div style="display:flex;gap:6px;font-size:.66rem;font-weight:500">
          <span style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;border-radius:2px;background:#FFE0E0"></span>AI</span>
          <span style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;border-radius:2px;background:#FFF4D6"></span>Підозр.</span>
          <span style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;border-radius:2px;background:#E0F0E0"></span>Людина</span>
        </div>
      </div>
      <div style="font-size:.74rem;color:var(--ink3);margin-bottom:10px;line-height:1.5">Кожне речення оцінено окремо. Червоні — підозрілі на AI, жовті — межові, зелені — природне письмо.</div>
      <div style="font-size:.88rem;line-height:1.85;padding:12px;background:var(--bg2);border-radius:var(--r2)">
        ${r.sentence_analysis.map(sa=>{
          const bg=sa.ai_prob>=70?'#FFE0E0':sa.ai_prob>=50?'#FFF4D6':sa.ai_prob>=30?'#F8F4E8':'#E0F0E0';
          const col=sa.ai_prob>=70?'#A02020':sa.ai_prob>=50?'#A06010':sa.ai_prob>=30?'#806020':'#206020';
          const tip=sa.evidence.map(e=>(e.llr>0?'+':'')+e.llr.toFixed(1)+' '+e.factor).join(' • ')||'без сильних маркерів';
          return `<span title="${sa.ai_prob}% AI · ${tip.replace(/"/g,'&quot;')}" style="background:${bg};color:${col};padding:1px 4px;border-radius:3px;cursor:help;border-bottom:2px solid ${col}33">${sa.sentence}</span> `;
        }).join('')}
      </div>
      <div style="font-size:.72rem;color:var(--ink3);margin-top:9px;line-height:1.5">Наведіть курсор на речення щоб побачити деталі оцінки.</div>
    </div>`:''}

    ${r.self_critique&&r.self_critique.checks&&r.self_critique.checks.length?`<div class="card" style="margin-bottom:12px;background:var(--bg2);border-left:3px solid var(--blue)">
      <div class="ct" style="color:var(--blue);display:flex;align-items:center;gap:7px">
        ${ico('ai',14)} Самоперевірка детектора
      </div>
      <div style="font-size:.74rem;color:var(--ink3);margin-bottom:10px;line-height:1.5">Алгоритм перевіряє власне рішення на наявність протиріч і калібрує результат.</div>
      <div style="display:flex;gap:14px;align-items:center;margin-bottom:10px;padding:8px 12px;background:var(--sur);border-radius:var(--r2)">
        <div style="font-size:.74rem;color:var(--ink3)">Початкова оцінка</div>
        <div style="font-family:var(--ff);font-size:1rem;font-weight:600">${r.self_critique.original_prob}%</div>
        <div style="color:var(--ink3)">→</div>
        <div style="font-family:var(--ff);font-size:1.1rem;font-weight:600;color:${r.self_critique.adjusted_prob>=60?'var(--red)':r.self_critique.adjusted_prob>=40?'var(--amber)':'var(--green)'}">${r.self_critique.adjusted_prob}%</div>
        <div style="font-size:.72rem;color:var(--ink3)">після калібрування</div>
      </div>
      ${r.self_critique.checks.map(c=>`<div style="font-size:.79rem;padding:7px 10px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;gap:10px;align-items:center">
        <div>
          <div style="font-weight:600;color:var(--ink)">${c.check}</div>
          <div style="font-size:.72rem;color:var(--ink3);margin-top:2px">${c.action}</div>
        </div>
        <div style="font-family:var(--ff);font-size:.85rem;font-weight:600;color:${c.delta>0?'var(--red)':'var(--green)'};white-space:nowrap">${c.delta>0?'+':''}${c.delta}</div>
      </div>`).join('')}
    </div>`:''}

    ${r.suspicious_phrases&&r.suspicious_phrases.length?`<div class="card" style="margin-bottom:12px">
      <div class="ct">Підозрілі фрагменти · ${r.suspicious_phrases.length}</div>
      <div style="font-size:.74rem;color:var(--ink3);margin-bottom:10px">Цитати з тексту, які найбільше схожі на AI-генерацію</div>
      ${r.suspicious_phrases.map((p,i)=>`<div style="background:var(--abg);border-left:3px solid var(--amber);border-radius:var(--r2);padding:11px 14px;margin-bottom:7px">
        <div style="display:flex;gap:8px;margin-bottom:6px">
          <div style="font-family:var(--ff);font-size:.75rem;font-weight:600;color:var(--amber);flex-shrink:0">${i+1}.</div>
          <div style="font-size:.85rem;color:var(--ink);font-style:italic;line-height:1.6">«${p.text||p}»</div>
        </div>
        ${p.reason?`<div style="font-size:.72rem;color:var(--amber);font-weight:500;padding-left:18px">→ ${p.reason}</div>`:''}
      </div>`).join('')}
    </div>`:''}

    ${S.aiSimilarResults&&S.aiSimilarResults.length?`<div class="card" style="margin-bottom:12px;border:2px solid var(--red)">
      <div class="ct" style="color:var(--red);display:flex;align-items:center;gap:8px">
        ${ico('warn',16)} Виявлено схожість з іншими роботами · ${S.aiSimilarResults.length}
      </div>
      <div style="font-size:.76rem;color:var(--ink3);margin-bottom:12px;line-height:1.5">Аналіз через комбінований алгоритм Жакара та триграмного перекриття. Чим вище %, тим серйозніше підозра на списування.</div>
      ${S.aiSimilarResults.map((sim,i)=>{
        const sub=getSub(sim.work.subject);
        const cls=getCls(sim.work.cid);
        const simCol=sim.similarity>=60?'var(--red)':sim.similarity>=35?'var(--amber)':'var(--blue)';
        const verdict=sim.similarity>=60?'Дуже схоже':sim.similarity>=35?'Помітна схожість':'Деяка схожість';
        return`<div style="margin-bottom:12px;padding:14px;border:1px solid ${simCol}55;border-radius:var(--r2);background:${sim.similarity>=60?'var(--rbg)':sim.similarity>=35?'var(--abg)':'var(--bg2)'}">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px;flex-wrap:wrap">
            <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0">
              <div style="width:42px;height:42px;border-radius:50%;background:${simCol};color:white;display:grid;place-items:center;font-family:var(--ff);font-size:.95rem;font-weight:600;flex-shrink:0">${sim.similarity}%</div>
              <div style="flex:1;min-width:0">
                <div style="font-size:.86rem;font-weight:600;margin-bottom:2px">${sim.work.title}</div>
                <div style="display:flex;gap:7px;font-size:.72rem;color:var(--ink2);align-items:center;flex-wrap:wrap">
                  <span><b>${sim.work.student}</b></span>
                  <span>·</span>
                  <span>Клас ${cls?.n||sim.work.cid}</span>
                  <span>·</span>
                  <span style="color:${sub?.c}">${sub?.n||''}</span>
                  <span>·</span>
                  <span>${sim.work.date}</span>
                </div>
              </div>
            </div>
            <span class="b ${sim.similarity>=60?'b-red':sim.similarity>=35?'b-amber':'b-blue'}" style="font-size:.71rem;font-weight:700">${verdict}</span>
          </div>
          <div style="display:flex;gap:14px;font-size:.71rem;color:var(--ink3);padding:6px 0;margin-bottom:8px">
            <span>Жакар: <b style="color:var(--ink2)">${sim.jaccard}%</b></span>
            <span>Триграми: <b style="color:var(--ink2)">${sim.trigramSim}%</b></span>
            <span>Загалом: <b style="color:${simCol}">${sim.similarity}%</b></span>
          </div>
          ${sim.matchedPhrases&&sim.matchedPhrases.length?`<div style="border-top:1px solid var(--line);padding-top:9px">
            <div style="font-size:.66rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--ink3);margin-bottom:6px">Збіги фрагментів · ${sim.matchedPhrases.length}</div>
            ${sim.matchedPhrases.slice(0,3).map(mp=>`<div style="background:var(--sur);border-left:3px solid ${simCol};border-radius:var(--r2);padding:8px 11px;margin-bottom:5px">
              <div style="font-size:.79rem;color:var(--ink);font-style:italic;line-height:1.55">«${mp.phrase}»</div>
              ${mp.overlap?`<div style="font-size:.68rem;color:${simCol};margin-top:3px;font-weight:600">${mp.overlap}% слів збігаються</div>`:mp.identical?`<div style="font-size:.68rem;color:${simCol};margin-top:3px;font-weight:600">Ідентичний початок (${mp.identical} символів)</div>`:''}
            </div>`).join('')}
          </div>`:''}
        </div>`;
      }).join('')}
    </div>`:S.aiSelectedWorkId?`<div class="card" style="margin-bottom:12px;background:var(--gbg);border-left:3px solid var(--green)">
      <div style="display:flex;align-items:center;gap:9px">
        <div style="color:var(--green)">${ico('check',18)}</div>
        <div>
          <div style="font-size:.86rem;font-weight:600;color:var(--green);margin-bottom:2px">Списування не виявлено</div>
          <div style="font-size:.74rem;color:var(--ink2)">Робота не має значної схожості з іншими роботами учнів</div>
        </div>
      </div>
    </div>`:''}

    ${r.recommendation?`<div class="card" style="border-left:4px solid var(--blue);background:var(--blt)">
      <div class="ct" style="color:var(--blue)">Рекомендація вчителю</div>
      <div style="font-size:.88rem;color:var(--ink);line-height:1.75">${r.recommendation}</div>
    </div>`:''}
  </div>`;
}

function resetAICheck(){
  S.aiCheckResult=null;
  S.aiSimilarResults=null;
  S.aiSelectedWorkId=null;
  S.aiStages=[];
  render();
}

function updateAIStats(){
  const el=document.getElementById('ai-txt');
  if(el)S.aiCheckText=el.value;
  const bar=document.getElementById('ai-stats-bar');
  if(!bar)return;
  const stats=S.aiCheckText?textStats(S.aiCheckText):null;
  const minOk=S.aiCheckText.length>=200;
  if(stats){
    bar.innerHTML=`
      <div style="display:flex;gap:18px;flex-wrap:wrap;font-size:.78rem">
        <div><span style="color:var(--ink3)">Слова:</span> <b>${stats.wordCount}</b></div>
        <div><span style="color:var(--ink3)">Речення:</span> <b>${stats.sentCount}</b></div>
        <div><span style="color:var(--ink3)">Символи:</span> <b>${stats.chars}</b></div>
      </div>
      <span style="font-size:.74rem;color:${minOk?'var(--green)':'var(--ink3)'};font-weight:600">${minOk?'✓ Готово до аналізу':`Ще ${200-S.aiCheckText.length} симв.`}</span>
    `;
  }
}

function handleAIFile(file){
  if(!file)return;
  if(file.size>1024*1024){toast('Файл занадто великий (макс 1 МБ)','err');return;}
  const ext=file.name.split('.').pop().toLowerCase();
  if(!['txt','md','csv','html','htm'].includes(ext)){toast('Непідтримуваний формат','err');return;}
  const reader=new FileReader();
  reader.onload=e=>{
    let text=e.target.result;
    if(ext==='html'||ext==='htm'){
      const tmp=document.createElement('div');
      tmp.innerHTML=text;
      text=tmp.textContent||tmp.innerText||'';
    }
    S.aiCheckText=text.trim();
    S.aiCheckResult=null;
    toast(`Завантажено: ${file.name}`,'ok');
    render();
  };
  reader.onerror=()=>toast('Помилка читання файлу','err');
  reader.readAsText(file,'UTF-8');
}

function handleAIDrop(e){
  e.preventDefault();
  e.currentTarget.style.borderColor='';
  e.currentTarget.style.background='';
  const file=e.dataTransfer.files[0];
  if(file)handleAIFile(file);
}

function loadAICheck(id){
  const c=S.aiChecks.find(x=>x.id===id);
  if(!c)return;
  S.aiCheckResult=c.result;
  S.aiCheckText=c.fullText||'';
  S.aiSimilarResults=c.similar||null;
  render();
}

function rWorksPicker(txt,stats){
  const cid=S.aiSelectedClass||'11a';
  const works=STUDENT_WORKS[cid]||[];
  const selected=S.aiSelectedWorkId?works.find(w=>w.id===S.aiSelectedWorkId):null;
  return `
    <div style="display:grid;gap:12px">
      <div class="fg" style="margin-bottom:0">
        <label class="fl">Клас</label>
        <select class="fs" onchange="S.aiSelectedClass=this.value;S.aiSelectedWorkId=null;S.aiCheckText='';render()">
          ${CLS.map(c=>`<option value="${c.id}"${c.id===cid?' selected':''}>${c.n} · ${(STUDENT_WORKS[c.id]||[]).length} робіт</option>`).join('')}
        </select>
      </div>
      ${works.length===0?`
        <div style="padding:24px;text-align:center;background:var(--bg2);border-radius:var(--r2)">
          <div style="font-size:.85rem;color:var(--ink3)">У цьому класі ще немає завантажених робіт</div>
        </div>
      `:`
        <div style="border:1px solid var(--line);border-radius:var(--r);max-height:340px;overflow-y:auto">
          ${works.map(w=>{
            const sub=getSub(w.subject);
            const sel=S.aiSelectedWorkId===w.id;
            return `<div onclick="selectStudentWork('${w.id}')" style="display:flex;align-items:center;gap:12px;padding:12px 14px;border-bottom:1px solid var(--line);cursor:pointer;background:${sel?'var(--blt)':'transparent'};transition:background .15s">
              <div style="width:36px;height:36px;border-radius:8px;background:${sub?.cb||'var(--bg2)'};color:${sub?.c||'var(--ink2)'};display:grid;place-items:center;flex-shrink:0">${ico('file',16)}</div>
              <div style="flex:1;min-width:0">
                <div style="font-size:.84rem;font-weight:600;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${w.title}</div>
                <div style="display:flex;gap:8px;font-size:.71rem;color:var(--ink3);align-items:center">
                  <span>${w.student}</span>
                  <span>·</span>
                  <span style="color:${sub?.c}">${sub?.n||''}</span>
                  <span>·</span>
                  <span>${w.date}</span>
                </div>
              </div>
              ${sel?`<div style="color:var(--blue);font-weight:600;font-size:.78rem">✓ Обрано</div>`:`<div style="font-size:.7rem;color:var(--ink3)">${w.text.split(/\s+/).length} сл.</div>`}
            </div>`;
          }).join('')}
        </div>
        ${selected?`
        <div style="padding:12px 14px;background:var(--blt);border-left:3px solid var(--blue);border-radius:var(--r2)">
          <div style="font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--blue);margin-bottom:5px">Обрано для аналізу</div>
          <div style="font-size:.85rem;font-weight:600;margin-bottom:3px">${selected.title}</div>
          <div style="font-size:.74rem;color:var(--ink2);margin-bottom:8px">Автор: ${selected.student}</div>
          <div style="font-size:.78rem;color:var(--ink2);max-height:100px;overflow-y:auto;line-height:1.55;padding:8px 10px;background:var(--sur);border-radius:var(--r2)">${selected.text.substring(0,300)}${selected.text.length>300?'…':''}</div>
        </div>
        `:`<div style="padding:12px;font-size:.78rem;color:var(--ink3);text-align:center">Оберіть роботу учня для аналізу</div>`}
      `}
    </div>
  `;
}

function selectStudentWork(id){
  const all=getAllWorks();
  const w=all.find(x=>x.id===id);
  if(!w)return;
  S.aiSelectedWorkId=id;
  S.aiCheckText=w.text;
  S.aiCheckResult=null;
  S.aiSimilarResults=null;
  render();
}

function rAIPlaceholder(){return'';}
function rAIResult(r){return rAIResultPro(r,null);}

async function runAICheck(){
  const txt=S.aiCheckText.trim();
  if(txt.length<200){toast('Мінімум 200 символів','warn');return;}

  S.aiChecking=true;
  S.aiCheckResult=null;
  S.aiStages=['stats'];
  render();

  try{
  await new Promise(r=>setTimeout(r,1400));
  S.aiStages=['stats','lex'];render();
  await new Promise(r=>setTimeout(r,1800));

  const stats=textStats(txt);
  const analyzeText=txt.length>6000?txt.substring(0,6000):txt;

  S.aiStages=['stats','lex','api'];render();

  const prompt=`Ти — провідний експерт з виявлення AI-генерованих текстів. Працюєш у строгому режимі: краще помилково запідозрити людський текст, ніж пропустити AI. Аналізуй текст методично, використовуючи багаторівневий аналіз.

ТЕКСТ ДЛЯ АНАЛІЗУ:
"""
${analyzeText}
"""

ОБ'ЄКТИВНА СТАТИСТИКА:
- Слів: ${stats.wordCount}
- Речень: ${stats.sentCount}
- Середня довжина речення: ${stats.avgSentLen} слів
- Burstiness (варіативність довжин речень): ${stats.stdDev || stats.burstiness}
- Лексична унікальність: ${stats.lexDiv}%

═══════════════════════════════════════════
ПРИКЛАДИ ДЛЯ КАЛІБРУВАННЯ:
═══════════════════════════════════════════

ПРИКЛАД 1 — AI (95% впевненості):
"Книга відіграє ключову роль у формуванні особистості людини в сучасному світі. Важливо зазначити, що читання сприяє розвитку критичного мислення. У контексті стрімкого розвитку цифрових технологій книги залишаються невід'ємною частиною освітнього процесу."
Чому: множинні шаблонні фрази («ключову роль», «у сучасному світі», «важливо зазначити», «у контексті»), нульова особиста залученість, надмірна академічність для школяра.

ПРИКЛАД 2 — ЛЮДИНА (90% впевненості):
"Я ще пам'ятаю, як вперше відкрив для себе книги. Тоді мені було вісім, і батьки подарували «Незнайка». Чесно кажучи, я тоді не зовсім розумів усе, але пригоди коротульок захопили мене настільки, що я перечитував її кілька разів."
Чому: «я», «мені», «чесно кажучи» — особистий голос; конкретні деталі (8 років, Незнайко); природна неідеальність; сентиментальна емоція.

ПРИКЛАД 3 — AI з імітацією людськості (70% — будь обережним!):
"Я думаю, що книги дуже важливі. Вони допомагають нам розвивати критичне мислення та розширювати кругозір. На мою думку, кожна людина повинна читати книги, адже це сприяє особистісному розвитку."
Чому: «думаю», «на мою думку» — пастка для ледачих детекторів. Але зміст усе одно abstract, без конкретики, всі речення схожої довжини, формальна лексика «розвивати», «розширювати», «сприяє».

ПРИКЛАД 4 — ЛЮДИНА (формальний шкільний реферат, 30%):
"Творчість Тараса Шевченка є важливою частиною української літератури. Поет жив у складний період кріпосного права. Його найвідоміший твір — «Заповіт». У ньому Шевченко висловлює бажання бути похованим в Україні."
Чому: формальний стиль, але немає AI-кліше, простота, фактичність. Це шкільний реферат — формальний за вимогою, але не AI.

═══════════════════════════════════════════
МЕТОДИКА АНАЛІЗУ (виконай покроково):
═══════════════════════════════════════════

КРОК 1: Підрахуй AI-кліше у тексті.
Шукай: «важливо зазначити», «слід підкреслити», «варто відзначити», «у сучасному світі», «у контексті», «таким чином», «у висновку», «відіграє ключову роль», «не лише... але й», «з одного боку... з іншого», «незаперечним фактом», «беззаперечно», «безсумнівно», «представляє собою», «являє собою».

КРОК 2: Оціни особистий голос.
Скільки разів зустрічається «я», «мені», «мій»? Чи є конкретні деталі (імена, роки, події)? Чи є емоції (захоплення, розчарування, здивування)?

КРОК 3: Оціни структурну варіативність.
Чи всі речення однакової довжини? Чи всі абзаци починаються з зв'язки («Крім того», «Також», «Однак»)?

КРОК 4: Інверсія перевірки — пастка «імітації людськості».
AI може вставити «я думаю» / «на мою думку», але зміст залишається абстрактним без конкретики. Перевір: чи є КОНКРЕТНІ приклади з життя — імена людей, дати, місця, події?

КРОК 5: Оціни помилки/неідеальності.
Учнівські тексти мають типові помилки (1-3 на абзац — пропущена кома, неузгодженість роду, повтор слова). AI пише ідеально.

КРОК 6: Прийми рішення в строгому режимі.
- 0-30: чітко людина
- 30-50: ймовірно людина, але є дрібні підозри
- 50-65: підозрілий текст
- 65-80: ймовірно AI
- 80-100: майже точно AI

ВАЖЛИВО: У строгому режимі при сумнівах схиляйся до підозри AI. Краще false positive ніж пропустити недоброчесного учня.

ФОРМАТ ВІДПОВІДІ — СТРОГО JSON, БЕЗ ТЕКСТУ ПОЗА НИМ:

{
  "ai_probability": <ціле 0-100>,
  "confidence": "Висока" | "Середня" | "Низька",
  "text_quality": "Висока" | "Середня" | "Низька",
  "summary": "<3-4 речення з конкретними цитатами з тексту, які підтверджують вердикт>",
  "reasoning": "<коротке покрокове міркування — підрахуй AI-кліше, оціни особистий голос, помилки тощо>",
  "metrics": {
    "lexical_diversity": <0-100>,
    "personal_voice": <0-100>,
    "naturalness": <0-100>,
    "formality": <0-100>
  },
  "ai_signs": ["<конкретна ознака з цитатою>", "<ознака 2>", "<ознака 3>"],
  "human_signs": ["<конкретна ознака>", "<ознака 2>"],
  "suspicious_phrases": [
    {"text": "<точна цитата>", "reason": "<коротко>"},
    {"text": "<цитата>", "reason": "<коротко>"}
  ],
  "recommendation": "<що робити вчителю — конкретні кроки>"
}`;

  let result=null;let lastErr='';

  // Two alternative prompts for ensemble (shorter, different perspectives)
  const altPromptDevilsAdvocate=`Ти — скептичний рецензент. Твоя роль — знайти причини сумніватись у людському авторстві цього тексту. Шукай навіть тонкі ознаки AI.

ТЕКСТ:
"""
${analyzeText}
"""

Знайди КОНКРЕТНІ підозрілі ознаки. Не давай учневі легко пройти. Будь строгим.

Відповідай JSON:
{
  "ai_probability": <0-100, сильно схиляйся до підозри>,
  "reasoning": "<що конкретно підозріло>",
  "ai_signs": ["<ознака 1>", "<ознака 2>"]
}`;

  const altPromptHumanAdvocate=`Ти — справедливий захисник учня. Шукай ознаки людського письма, навіть якщо вони слабкі. Не звинувачуй без сильних доказів.

ТЕКСТ:
"""
${analyzeText}
"""

Знайди ознаки людського авторства. Захищай учня, якщо є сумніви.

Відповідай JSON:
{
  "ai_probability": <0-100, давай шанс людському тлумаченню>,
  "reasoning": "<що говорить про людину>",
  "human_signs": ["<ознака 1>", "<ознака 2>"]
}`;

  // Helper: single API call, returns parsed JSON or null
  async function callAPI(promptText,maxTokens){
    const controller=new AbortController();
    const timeoutId=setTimeout(()=>controller.abort(),25000);
    try{
      const r=await fetch('/api/claude',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        signal:controller.signal,
        body:JSON.stringify({
          model:'claude-sonnet-4-5',
          max_tokens:maxTokens||1500,
          messages:[{role:'user',content:promptText}]
        })
      });
      clearTimeout(timeoutId);
      if(!r.ok){
        let errBody='';
        try{const j=await r.json();errBody=j.error?.message||'';}catch(_){}
        return {error:'HTTP '+r.status+(errBody?': '+errBody:'')};
      }
      const d=await r.json();
      if(d.error)return {error:d.error.message||'API error'};
      const respText=(d.content||[]).map(c=>c.text||'').join('');
      if(!respText)return {error:'Порожня відповідь'};
      const cleaned=respText.replace(/```json\s*/g,'').replace(/```\s*/g,'').trim();
      const m=cleaned.match(/\{[\s\S]*\}/);
      if(!m)return {error:'JSON не знайдено'};
      try{
        return {data:JSON.parse(m[0])};
      }catch(parseErr){
        return {error:'Парсинг: '+parseErr.message};
      }
    }catch(e){
      clearTimeout(timeoutId);
      if(e.name==='AbortError')return {error:'timeout'};
      return {error:e.message||'Мережа'};
    }
  }

  // Run main analysis + 2 alternative perspectives in parallel (ensemble)
  const [mainRes,devilsRes,humanRes]=await Promise.all([
    callAPI(prompt,2500),
    callAPI(altPromptDevilsAdvocate,800),
    callAPI(altPromptHumanAdvocate,800),
  ]);

  if(mainRes.data&&typeof mainRes.data.ai_probability==='number'){
    result=mainRes.data;
    // Add ensemble cross-check
    const ensembleScores=[result.ai_probability];
    let ensembleNote='';
    if(devilsRes.data&&typeof devilsRes.data.ai_probability==='number'){
      ensembleScores.push(devilsRes.data.ai_probability);
    }
    if(humanRes.data&&typeof humanRes.data.ai_probability==='number'){
      ensembleScores.push(humanRes.data.ai_probability);
    }
    if(ensembleScores.length>=2){
      // Weighted average: main 50%, devil 25%, human 25%
      const weights=[0.5];
      if(devilsRes.data)weights.push(0.25);else weights.push(0);
      if(humanRes.data)weights.push(0.25);else weights.push(0);
      const totalW=weights.reduce((a,b)=>a+b,0);
      const weighted=ensembleScores.reduce((s,v,i)=>s+v*weights[i],0)/totalW;
      const ensembleProb=Math.round(weighted);
      const spread=Math.max(...ensembleScores)-Math.min(...ensembleScores);

      result.ensemble={
        main_score:result.ai_probability,
        devils_advocate_score:devilsRes.data?devilsRes.data.ai_probability:null,
        human_advocate_score:humanRes.data?humanRes.data.ai_probability:null,
        weighted_score:ensembleProb,
        spread,
        agreement:spread<15?'Висока':spread<30?'Помірна':'Низька',
      };

      // Use ensemble result if all three agree closely, otherwise keep main
      if(spread<25){
        result.ai_probability=ensembleProb;
      }
    }
  }else{
    lastErr=mainRes.error||'Невалідна відповідь';
  }

  if(!result){
    const _localFn=typeof localAIAnalysis==="function"?localAIAnalysis:window._aiFullAnalysis;
    if(!_localFn){toast("Помилка: перезавантажте сторінку","warn");S.aiChecking=false;S.aiStages=[];render();return;}
    result=_localFn(txt,stats);
    result._fallback=true;
    result._apiError=lastErr;
  }

  S.aiStages=['stats','lex','api','parse'];render();
  await new Promise(r=>setTimeout(r,400));

  result.ai_probability=Math.max(0,Math.min(100,Math.round(result.ai_probability||0)));
  if(result.metrics){
    Object.keys(result.metrics).forEach(k=>{
      result.metrics[k]=Math.max(0,Math.min(100,Math.round(result.metrics[k]||0)));
    });
  }

  if(!result._fallback){
    try{
      const localResult=window._aiFullAnalysis?window._aiFullAnalysis(txt):localAIAnalysis(txt);
      const apiProb=result.ai_probability;
      const localProb=localResult.ai_probability;
      const disagreement=Math.abs(apiProb-localProb);

      result.cross_validation={
        api_score:apiProb,
        local_score:localProb,
        disagreement,
        consensus:disagreement<15?'Висока згода':disagreement<30?'Часткова згода':'Сильна розбіжність',
      };

      if(disagreement>30){
        result.ai_probability=Math.round((apiProb*0.6+localProb*0.4));
      }

      result.sentence_analysis=localResult.sentence_analysis;
      result.advanced_metrics=localResult.advanced_metrics;
      result.evidence_log=localResult.evidence_log;
      result.self_critique=localResult.self_critique;
      result.repetition=localResult.repetition;
    }catch(e){
      console.warn('Cross-validation failed:',e);
    }
  }

  S.aiCheckResult=result;
  let similarResults=null;
  if(S.aiSelectedWorkId){
    similarResults=findSimilarWorks(txt,S.aiSelectedWorkId,15);
  }else{
    similarResults=findSimilarWorks(txt,null,25);
  }
  S.aiSimilarResults=similarResults;
  S.aiChecking=false;
  S.aiStages=[];

  const date=new Date().toLocaleDateString('uk-UA',{day:'2-digit',month:'short'});
  S.aiChecks.unshift({
    id:'c'+Date.now(),
    label:txt.substring(0,60).replace(/\s+/g,' ')+(txt.length>60?'…':''),
    score:result.ai_probability,
    date,
    wordCount:stats.wordCount,
    fullText:txt,
    result,
    similar:similarResults
  });
  if(S.aiChecks.length>20)S.aiChecks=S.aiChecks.slice(0,20);

  render();
  const verdict=result.ai_probability>=70?'Ймовірно AI':result.ai_probability>=40?'Підозріло':'Ймовірно людина';
  const simNote=similarResults&&similarResults.length>0?` · ${similarResults.length} схожих робіт`:'';
  toast(`Аналіз: ${verdict} (${result.ai_probability}%)${simNote}`,result.ai_probability>=70||similarResults?.length>0?'warn':'ok',4500);
  }catch(fatalErr){
    console.error('runAICheck fatal error:',fatalErr);
    S.aiChecking=false;
    S.aiStages=[];
    try{
      const _fn=typeof localAIAnalysis==="function"?localAIAnalysis:window._aiFullAnalysis;
      if(!_fn)throw new Error("Детектор не завантажено");
      const fallback=_fn(txt);
      fallback._fallback=true;
      fallback._apiError='Критична помилка: '+fatalErr.message;
      S.aiCheckResult=fallback;
    }catch(_){
      toast('Помилка аналізу: '+fatalErr.message,'warn',5000);
    }
    render();
  }
}

// ============= EXPORT FUNCTIONS =============

function printAIReport(){
  const r=S.aiCheckResult;
  if(!r){toast('Немає результату для друку','warn');return;}

  const html=buildPrintableReport(r);
  const w=window.open('','_blank','width=900,height=700');
  if(!w){toast('Дозвольте спливаючі вікна для друку','warn');return;}
  w.document.write(html);
  w.document.close();
  setTimeout(()=>{w.focus();w.print();},500);
}

function exportAIReport(){
  const r=S.aiCheckResult;
  if(!r){toast('Немає результату для експорту','warn');return;}

  const html=buildPrintableReport(r);
  const blob=new Blob([html],{type:'text/html;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  const date=new Date().toISOString().slice(0,10);
  a.href=url;
  a.download=`ai-report-${date}.html`;
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url);},100);
  toast('Звіт завантажено','ok');
}

function buildPrintableReport(r){
  const txt=S.aiCheckText||'';
  const stats=txt?textStats(txt):null;
  const date=new Date().toLocaleString('uk-UA');
  const verdictColor=r.ai_probability>=70?'#C53030':r.ai_probability>=50?'#D69E2E':r.ai_probability>=35?'#B7791F':'#2F855A';

  const sentenceMarkup=r.sentence_analysis?r.sentence_analysis.map(sa=>{
    const bg=sa.ai_prob>=70?'#FFE0E0':sa.ai_prob>=50?'#FFF4D6':sa.ai_prob>=30?'#F8F4E8':'#E0F0E0';
    const col=sa.ai_prob>=70?'#A02020':sa.ai_prob>=50?'#A06010':sa.ai_prob>=30?'#806020':'#206020';
    return `<span style="background:${bg};color:${col};padding:1px 4px;border-radius:3px">${escapeHtml(sa.sentence)}</span> `;
  }).join(''):escapeHtml(txt);

  return `<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="UTF-8">
<title>Звіт перевірки на AI · ${date}</title>
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#fff;color:#1a1a1a;margin:0;padding:32px;line-height:1.6;max-width:900px;margin:0 auto}
  h1{font-size:1.8rem;margin:0 0 4px 0;font-weight:600}
  h2{font-size:1.1rem;margin:24px 0 10px;border-bottom:1px solid #ddd;padding-bottom:6px;font-weight:600}
  .header{border-bottom:2px solid #1a1a1a;padding-bottom:12px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:flex-end}
  .meta{font-size:.85rem;color:#666}
  .verdict-card{background:linear-gradient(135deg,${verdictColor}15,${verdictColor}05);border:2px solid ${verdictColor}40;border-radius:8px;padding:24px;margin:18px 0;display:flex;align-items:center;gap:24px}
  .verdict-score{font-size:3.5rem;font-weight:700;color:${verdictColor};line-height:1}
  .verdict-label{font-size:1.4rem;font-weight:600;color:${verdictColor};margin-bottom:6px}
  .verdict-desc{font-size:.9rem;color:#444;line-height:1.5}
  .summary{background:#f7f7f7;border-left:4px solid ${verdictColor};padding:14px 18px;margin:18px 0;font-size:.92rem;line-height:1.7}
  .metric-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;margin:14px 0}
  .metric{background:#f7f7f7;padding:11px 14px;border-radius:6px}
  .metric-label{font-size:.7rem;color:#666;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px}
  .metric-value{font-size:1.4rem;font-weight:600}
  .signs{margin:14px 0}
  .sign{padding:8px 12px;margin:5px 0;border-radius:4px;font-size:.88rem}
  .sign-ai{background:#FFE5E5;border-left:3px solid #C53030;color:#1a1a1a}
  .sign-human{background:#E5F5E5;border-left:3px solid #2F855A;color:#1a1a1a}
  .quote{background:#FFF8DC;border-left:3px solid #D69E2E;padding:11px 14px;margin:7px 0;border-radius:4px}
  .quote-text{font-style:italic;font-size:.92rem}
  .quote-reason{font-size:.78rem;color:#A06010;margin-top:5px;font-weight:500}
  .text-block{background:#fafafa;border:1px solid #e0e0e0;border-radius:6px;padding:14px;font-size:.9rem;line-height:1.85;margin:12px 0}
  .footer{margin-top:48px;padding-top:14px;border-top:1px solid #ddd;font-size:.75rem;color:#999;text-align:center}
  .ev-table{width:100%;border-collapse:collapse;margin:10px 0;font-size:.85rem}
  .ev-table td{padding:7px 10px;border-bottom:1px solid #eee}
  .ev-pos{color:#C53030;font-weight:600;text-align:right;width:60px}
  .ev-neg{color:#2F855A;font-weight:600;text-align:right;width:60px}
  @media print{body{padding:18px}.verdict-card{break-inside:avoid}h2{break-after:avoid}}
</style>
</head>
<body>
  <div class="header">
    <div>
      <h1>Звіт перевірки на AI</h1>
      <div class="meta">Освітня платформа Osvita</div>
    </div>
    <div class="meta" style="text-align:right">
      <div>${date}</div>
      <div>Мова: ${r.language||'uk'} · Режим: ${(S.aiStrictness||'strict')==='lenient'?'Поблажливий':(S.aiStrictness||'strict')==='balanced'?'Збалансований':'Строгий'}</div>
    </div>
  </div>

  <div class="verdict-card">
    <div class="verdict-score">${r.ai_probability}%</div>
    <div>
      <div class="verdict-label">${r.verdict||''}</div>
      <div class="verdict-desc">${r.summary||''}</div>
      <div style="margin-top:8px;font-size:.85rem;color:#666">Достовірність: <b>${r.confidence||'Середня'}</b></div>
    </div>
  </div>

  ${stats?`<h2>Статистика тексту</h2>
  <div class="metric-grid">
    <div class="metric"><div class="metric-label">Слів</div><div class="metric-value">${stats.wordCount}</div></div>
    <div class="metric"><div class="metric-label">Речень</div><div class="metric-value">${stats.sentCount}</div></div>
    <div class="metric"><div class="metric-label">Символів</div><div class="metric-value">${stats.chars}</div></div>
    <div class="metric"><div class="metric-label">Сл/реч.</div><div class="metric-value">${stats.avgSentLen}</div></div>
  </div>`:''}

  ${r.advanced_metrics?`<h2>Розширені метрики</h2>
  <div class="metric-grid">
    <div class="metric"><div class="metric-label">Burstiness</div><div class="metric-value">${r.advanced_metrics.burstiness}</div></div>
    <div class="metric"><div class="metric-label">AI-щільність</div><div class="metric-value">${r.advanced_metrics.ai_density}/1k</div></div>
    <div class="metric"><div class="metric-label">Особистий голос</div><div class="metric-value">${r.advanced_metrics.personal_density}/1k</div></div>
    <div class="metric"><div class="metric-label">N-грам перетин</div><div class="metric-value">${r.advanced_metrics.ngram_overlap}%</div></div>
    ${r.advanced_metrics.yules_k!==undefined?`<div class="metric"><div class="metric-label">Yule's K</div><div class="metric-value">${r.advanced_metrics.yules_k}</div></div>`:''}
    ${r.advanced_metrics.mattr!==undefined?`<div class="metric"><div class="metric-label">MATTR</div><div class="metric-value">${r.advanced_metrics.mattr}%</div></div>`:''}
  </div>`:''}

  ${r.evidence_log&&r.evidence_log.length?`<h2>Журнал доказів</h2>
  <table class="ev-table">
    ${r.evidence_log.map(e=>`<tr>
      <td class="${e.weight>0?'ev-pos':'ev-neg'}">${e.weight>0?'+':''}${e.weight}</td>
      <td>${escapeHtml(e.reason||'')}</td>
    </tr>`).join('')}
  </table>`:''}

  ${r.ai_signs&&r.ai_signs.length?`<h2>Виявлені AI-маркери</h2>
  <div class="signs">
    ${r.ai_signs.map(s=>`<div class="sign sign-ai">${escapeHtml(s)}</div>`).join('')}
  </div>`:''}

  ${r.human_signs&&r.human_signs.length?`<h2>Ознаки людського письма</h2>
  <div class="signs">
    ${r.human_signs.map(s=>`<div class="sign sign-human">${escapeHtml(s)}</div>`).join('')}
  </div>`:''}

  ${r.suspicious_phrases&&r.suspicious_phrases.length?`<h2>Підозрілі фрагменти</h2>
  ${r.suspicious_phrases.map((p,i)=>`<div class="quote">
    <div class="quote-text">${i+1}. «${escapeHtml(p.text||p)}»</div>
    ${p.reason?`<div class="quote-reason">→ ${escapeHtml(p.reason)}</div>`:''}
  </div>`).join('')}`:''}

  ${r.sentence_analysis&&r.sentence_analysis.length?`<h2>Аналіз речень</h2>
  <div style="font-size:.78rem;color:#666;margin-bottom:10px">Червоні — підозрілі на AI · Жовті — межові · Зелені — людське письмо</div>
  <div class="text-block">${sentenceMarkup}</div>`:''}

  ${r.recommendation?`<h2>Рекомендація вчителю</h2>
  <div style="background:#E8F0FB;border-left:4px solid #3B6BAB;padding:14px 18px;border-radius:4px;font-size:.9rem;line-height:1.7">${escapeHtml(r.recommendation)}</div>`:''}

  <div class="footer">
    Звіт згенеровано автоматично системою аналізу на базі гібридного підходу: статистична Bayesian-агрегація + LLM аналіз через Claude API + стилометричний аналіз.<br>
    Звіт є допоміжним інструментом — фінальне рішення приймає вчитель.
  </div>
</body>
</html>`;
}

function escapeHtml(s){
  if(s==null)return'';
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

// ============= BATCH CLASS CHECK =============

function rBatchPicker(){
  const cid=S.aiSelectedClass||'11a';
  const works=(STUDENT_WORKS&&STUDENT_WORKS[cid])||[];
  const subjects={};
  works.forEach(w=>{subjects[w.subject]=(subjects[w.subject]||0)+1;});

  return `<div style="display:grid;gap:14px">
    <div style="background:var(--blt);border-left:3px solid var(--blue);border-radius:var(--r2);padding:11px 14px">
      <div style="font-size:.72rem;font-weight:700;color:var(--blue);text-transform:uppercase;letter-spacing:.07em;margin-bottom:3px">Масова перевірка</div>
      <div style="font-size:.82rem;color:var(--ink2);line-height:1.55">Аналіз усіх робіт класу одночасно. Кожна робота отримує AI-score, перевіряється на плагіат між учнями. Результати у вигляді таблиці з сортуванням та фільтрами.</div>
    </div>

    <div class="fg" style="margin:0">
      <label class="fl">Клас для перевірки</label>
      <select class="fs" onchange="S.aiSelectedClass=this.value;render()">
        ${(typeof CLS!=='undefined'?CLS:[]).map(c=>`<option value="${c.id}"${c.id===cid?' selected':''}>${c.n} · ${(STUDENT_WORKS&&STUDENT_WORKS[c.id]||[]).length} робіт</option>`).join('')}
      </select>
    </div>

    ${works.length===0?`
    <div style="padding:24px;text-align:center;background:var(--bg2);border-radius:var(--r2)">
      <div style="font-size:.85rem;color:var(--ink3)">У цьому класі ще немає завантажених робіт</div>
    </div>
    `:`
    <div style="background:var(--bg2);border-radius:var(--r2);padding:14px;display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px">
      <div style="text-align:center"><div style="font-family:var(--ff);font-size:1.6rem;font-weight:600">${works.length}</div><div style="font-size:.7rem;color:var(--ink3);text-transform:uppercase;letter-spacing:.06em;margin-top:3px">Робіт</div></div>
      <div style="text-align:center"><div style="font-family:var(--ff);font-size:1.6rem;font-weight:600">${new Set(works.map(w=>w.student)).size}</div><div style="font-size:.7rem;color:var(--ink3);text-transform:uppercase;letter-spacing:.06em;margin-top:3px">Учнів</div></div>
      <div style="text-align:center"><div style="font-family:var(--ff);font-size:1.6rem;font-weight:600">${Object.keys(subjects).length}</div><div style="font-size:.7rem;color:var(--ink3);text-transform:uppercase;letter-spacing:.06em;margin-top:3px">Предметів</div></div>
      <div style="text-align:center"><div style="font-family:var(--ff);font-size:1.6rem;font-weight:600">${works.reduce((s,w)=>s+(w.text||'').split(/\s+/).filter(Boolean).length,0)}</div><div style="font-size:.7rem;color:var(--ink3);text-transform:uppercase;letter-spacing:.06em;margin-top:3px">Слів</div></div>
    </div>

    <div style="font-size:.78rem;color:var(--ink3);line-height:1.5">
      <b>Час:</b> аналіз ${works.length} робіт займе приблизно ${Math.ceil(works.length*0.5)}–${Math.ceil(works.length*1.5)} секунд (без API). З API ~${Math.ceil(works.length*5)}–${Math.ceil(works.length*10)} секунд.
    </div>
    `}
  </div>`;
}

function rBatchProgress(){
  const total=S.aiBatchTotal||0;
  const done=S.aiBatchDone||0;
  const current=S.aiBatchCurrent||'';
  const pct=total?Math.round((done/total)*100):0;

  return `<div>
    <div class="ph"><div class="pt">Перевірка класу</div><div class="ps">Аналізується ${total} робіт…</div></div>

    <div class="card" style="max-width:560px;margin:0 auto">
      <div style="text-align:center;padding:16px 6px 22px">
        <div style="position:relative;width:120px;height:120px;margin:0 auto 18px">
          <svg width="120" height="120" viewBox="0 0 120 120" style="transform:rotate(-90deg)">
            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg3)" stroke-width="8"/>
            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--blue)" stroke-width="8" stroke-linecap="round"
              stroke-dasharray="${(2*Math.PI*50).toFixed(1)}" stroke-dashoffset="${((2*Math.PI*50)*(1-pct/100)).toFixed(1)}"
              style="transition:stroke-dashoffset .3s ease"/>
          </svg>
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--blue);font-family:var(--ff);font-size:1.6rem;font-weight:600">${pct}%</div>
        </div>
        <div style="font-family:var(--ff);font-size:1rem;font-weight:500;margin-bottom:5px">${done} з ${total}</div>
        <div style="font-size:.78rem;color:var(--ink3);min-height:1.2em">${current?'Зараз: '+current:'Підготовка…'}</div>
      </div>
      <div style="height:8px;background:var(--bg3);border-radius:4px;overflow:hidden">
        <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,var(--blue),#5588DD);transition:width .3s ease;border-radius:4px"></div>
      </div>
    </div>
  </div>`;
}

function rBatchResult(){
  const batch=S.aiBatchResult;
  if(!batch||!batch.results)return'';

  const sortBy=S.aiBatchSort||'score_desc';
  const filter=S.aiBatchFilter||'all';

  let results=[...batch.results];
  if(filter==='ai')results=results.filter(r=>r.score>=50);
  else if(filter==='suspicious')results=results.filter(r=>r.score>=35&&r.score<70);
  else if(filter==='clean')results=results.filter(r=>r.score<35);
  else if(filter==='plagiarism')results=results.filter(r=>r.similar_count>0);

  if(sortBy==='score_desc')results.sort((a,b)=>b.score-a.score);
  else if(sortBy==='score_asc')results.sort((a,b)=>a.score-b.score);
  else if(sortBy==='student')results.sort((a,b)=>a.student.localeCompare(b.student));
  else if(sortBy==='subject')results.sort((a,b)=>a.subject.localeCompare(b.subject));

  const aiCount=batch.results.filter(r=>r.score>=70).length;
  const susCount=batch.results.filter(r=>r.score>=35&&r.score<70).length;
  const cleanCount=batch.results.filter(r=>r.score<35).length;
  const plagCount=batch.results.filter(r=>r.similar_count>0).length;
  const avgScore=Math.round(batch.results.reduce((s,r)=>s+r.score,0)/batch.results.length);

  return `<div>
    <div class="ph ph-row">
      <div><div class="pt">Звіт по класу</div><div class="ps">${batch.cls_name} · ${batch.results.length} робіт · середній AI-score ${avgScore}%</div></div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-s btn-sm" onclick="exportBatchReport()">${ico('file',13)} Експорт CSV</button>
        <button class="btn btn-s btn-sm" onclick="S.aiBatchResult=null;render()">${ico('plus',13,'transform:rotate(45deg)')} Нова перевірка</button>
      </div>
    </div>

    <div class="card" style="margin-bottom:14px">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px">
        <div onclick="S.aiBatchFilter='all';render()" style="padding:14px 10px;text-align:center;border-radius:var(--r2);cursor:pointer;background:${filter==='all'?'var(--bg2)':'transparent'};border:1.5px solid ${filter==='all'?'var(--ink2)':'var(--line)'}">
          <div style="font-family:var(--ff);font-size:1.5rem;font-weight:600">${batch.results.length}</div>
          <div style="font-size:.7rem;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;margin-top:3px">Усі</div>
        </div>
        <div onclick="S.aiBatchFilter='ai';render()" style="padding:14px 10px;text-align:center;border-radius:var(--r2);cursor:pointer;background:${filter==='ai'?'var(--rbg)':'transparent'};border:1.5px solid ${filter==='ai'?'var(--red)':'var(--line)'}">
          <div style="font-family:var(--ff);font-size:1.5rem;font-weight:600;color:var(--red)">${aiCount}</div>
          <div style="font-size:.7rem;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;margin-top:3px">AI ризик</div>
        </div>
        <div onclick="S.aiBatchFilter='suspicious';render()" style="padding:14px 10px;text-align:center;border-radius:var(--r2);cursor:pointer;background:${filter==='suspicious'?'var(--abg)':'transparent'};border:1.5px solid ${filter==='suspicious'?'var(--amber)':'var(--line)'}">
          <div style="font-family:var(--ff);font-size:1.5rem;font-weight:600;color:var(--amber)">${susCount}</div>
          <div style="font-size:.7rem;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;margin-top:3px">Підозрілі</div>
        </div>
        <div onclick="S.aiBatchFilter='clean';render()" style="padding:14px 10px;text-align:center;border-radius:var(--r2);cursor:pointer;background:${filter==='clean'?'var(--gbg)':'transparent'};border:1.5px solid ${filter==='clean'?'var(--green)':'var(--line)'}">
          <div style="font-family:var(--ff);font-size:1.5rem;font-weight:600;color:var(--green)">${cleanCount}</div>
          <div style="font-size:.7rem;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;margin-top:3px">Чисті</div>
        </div>
        <div onclick="S.aiBatchFilter='plagiarism';render()" style="padding:14px 10px;text-align:center;border-radius:var(--r2);cursor:pointer;background:${filter==='plagiarism'?'#FFE0E0':'transparent'};border:1.5px solid ${filter==='plagiarism'?'#C53030':'var(--line)'}">
          <div style="font-family:var(--ff);font-size:1.5rem;font-weight:600;color:#C53030">${plagCount}</div>
          <div style="font-size:.7rem;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;margin-top:3px">Плагіат</div>
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;padding-top:11px;border-top:1px solid var(--line);flex-wrap:wrap;gap:9px">
        <div style="font-size:.78rem;color:var(--ink2)">Показано <b>${results.length}</b> з ${batch.results.length}</div>
        <select class="fs" style="width:auto;height:32px;font-size:.78rem;padding:4px 26px 4px 10px" onchange="S.aiBatchSort=this.value;render()">
          <option value="score_desc"${sortBy==='score_desc'?' selected':''}>За AI-score (вище)</option>
          <option value="score_asc"${sortBy==='score_asc'?' selected':''}>За AI-score (нижче)</option>
          <option value="student"${sortBy==='student'?' selected':''}>За учнем</option>
          <option value="subject"${sortBy==='subject'?' selected':''}>За предметом</option>
        </select>
      </div>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      ${results.length===0?`<div style="padding:32px;text-align:center;color:var(--ink3);font-size:.85rem">Немає робіт за обраним фільтром</div>`:results.map((r,i)=>{
        const c=r.score>=70?'var(--red)':r.score>=50?'var(--amber)':r.score>=35?'#B7791F':'var(--green)';
        const cbg=r.score>=70?'var(--rbg)':r.score>=50?'var(--abg)':r.score>=35?'#FFF8DC':'var(--gbg)';
        return `<div onclick="loadBatchItem(${i})" style="display:grid;grid-template-columns:auto 1fr auto;gap:13px;padding:12px 16px;border-bottom:1px solid var(--line);cursor:pointer;align-items:center;transition:background .15s" onmouseover="this.style.background='var(--bg2)'" onmouseout="this.style.background=''">
          <div style="width:50px;height:50px;border-radius:50%;background:${cbg};color:${c};display:flex;align-items:center;justify-content:center;font-family:var(--ff);font-weight:600;font-size:1rem;flex-shrink:0;border:1.5px solid ${c}55">${r.score}%</div>
          <div style="min-width:0">
            <div style="font-size:.86rem;font-weight:600;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${r.title}</div>
            <div style="display:flex;gap:7px;flex-wrap:wrap;align-items:center;font-size:.72rem;color:var(--ink2)">
              <span><b>${r.student}</b></span>
              <span style="opacity:.5">·</span>
              <span>${r.subject_name}</span>
              <span style="opacity:.5">·</span>
              <span>${r.word_count} сл.</span>
              ${r.similar_count>0?`<span style="opacity:.5">·</span><span style="color:#C53030;font-weight:600">⚠ ${r.similar_count} схож. роб.</span>`:''}
            </div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            <div style="font-size:.74rem;font-weight:600;color:${c}">${r.verdict}</div>
            <div style="font-size:.68rem;color:var(--ink3);margin-top:2px">${r.confidence}</div>
          </div>
        </div>`;
      }).join('')}
    </div>

    ${plagCount>0?`<div class="card" style="margin-top:14px;border-left:3px solid #C53030">
      <div class="ct" style="color:#C53030">⚠ Виявлено схожість між роботами</div>
      <div style="font-size:.74rem;color:var(--ink3);margin-bottom:11px">Пари робіт з підозрою на списування. Чим вищий %, тим більша подібність.</div>
      ${batch.plagiarism_pairs.slice(0,8).map(p=>`<div style="padding:9px 0;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
        <div style="flex:1;min-width:0">
          <div style="font-size:.83rem;font-weight:600">${p.student_a} ↔ ${p.student_b}</div>
          <div style="font-size:.7rem;color:var(--ink3);margin-top:2px">«${p.title_a.substring(0,40)}» та «${p.title_b.substring(0,40)}»</div>
        </div>
        <span class="b ${p.similarity>=60?'b-red':'b-amber'}">${p.similarity}% схожості</span>
      </div>`).join('')}
    </div>`:''}
  </div>`;
}

async function runBatchCheck(){
  const cid=S.aiSelectedClass||'11a';
  const works=(STUDENT_WORKS&&STUDENT_WORKS[cid])||[];
  if(works.length===0){toast('У класі немає робіт','warn');return;}
  const cls=(typeof CLS!=='undefined'?CLS:[]).find(c=>c.id===cid);

  S.aiBatchRunning=true;
  S.aiBatchTotal=works.length;
  S.aiBatchDone=0;
  S.aiBatchCurrent='';
  S.aiBatchResult=null;
  render();

  const results=[];
  for(let i=0;i<works.length;i++){
    const w=works[i];
    S.aiBatchCurrent=`${w.student} — ${w.title}`;
    S.aiBatchDone=i;
    render();
    await new Promise(r=>setTimeout(r,150));

    try{
      const analysis=window._aiFullAnalysis?window._aiFullAnalysis(w.text):localAIAnalysis(w.text);
      const wordCount=(w.text||'').split(/\s+/).filter(Boolean).length;
      const subj=(typeof getSub==='function')?getSub(w.subject):{n:w.subject};
      let similarCount=0;
      try{
        if(typeof findSimilarWorks==='function'){
          const sims=findSimilarWorks(w.text,w.id,30);
          similarCount=sims.length;
        }
      }catch(_){}
      results.push({
        work_id:w.id,
        student:w.student,
        title:w.title,
        subject:w.subject,
        subject_name:subj.n||w.subject,
        score:analysis.ai_probability,
        verdict:analysis.verdict||'',
        confidence:analysis.confidence||'',
        word_count:wordCount,
        similar_count:similarCount,
        full_analysis:analysis,
        text:w.text,
      });
    }catch(e){
      console.warn('Failed analysis for',w.id,e);
    }
  }

  S.aiBatchDone=works.length;
  S.aiBatchCurrent='Виявлення плагіату між учнями…';
  render();
  await new Promise(r=>setTimeout(r,200));

  const plagPairs=[];
  for(let i=0;i<works.length;i++){
    for(let j=i+1;j<works.length;j++){
      try{
        if(typeof findSimilarWorks==='function'){
          const sims=findSimilarWorks(works[i].text,works[i].id,30);
          const match=sims.find(s=>s.work&&s.work.id===works[j].id);
          if(match&&match.similarity>=30){
            plagPairs.push({
              work_a:works[i].id,
              work_b:works[j].id,
              student_a:works[i].student,
              student_b:works[j].student,
              title_a:works[i].title,
              title_b:works[j].title,
              similarity:match.similarity,
            });
          }
        }
      }catch(_){}
    }
  }
  plagPairs.sort((a,b)=>b.similarity-a.similarity);

  S.aiBatchResult={
    cls_id:cid,
    cls_name:cls?cls.n:cid,
    timestamp:Date.now(),
    results,
    plagiarism_pairs:plagPairs,
  };
  S.aiBatchRunning=false;
  S.aiBatchFilter='all';
  S.aiBatchSort='score_desc';
  render();

  const aiCount=results.filter(r=>r.score>=70).length;
  toast(`Перевірено ${results.length} робіт · виявлено ${aiCount} підозр на AI`,aiCount>0?'warn':'ok',4500);
}

function loadBatchItem(idx){
  const batch=S.aiBatchResult;
  if(!batch||!batch.results||!batch.results[idx])return;
  const item=batch.results[idx];
  S.aiCheckText=item.text;
  S.aiCheckResult=item.full_analysis;
  S.aiInputMode='paste';
  S.aiBatchResult=null;
  render();
  toast(`Завантажено: ${item.title}`,'info');
}

function exportBatchReport(){
  const batch=S.aiBatchResult;
  if(!batch||!batch.results){toast('Немає даних','warn');return;}

  // Build CSV with BOM for Excel UTF-8 compatibility
  const csvHeader=['№','Учень','Робота','Предмет','Слів','AI-score (%)','Вердикт','Достовірність','Схожих робіт'].join(',');
  const csvRows=batch.results.map((r,i)=>{
    return [
      i+1,
      `"${(r.student||'').replace(/"/g,'""')}"`,
      `"${(r.title||'').replace(/"/g,'""')}"`,
      `"${r.subject_name||''}"`,
      r.word_count,
      r.score,
      `"${(r.verdict||'').replace(/"/g,'""')}"`,
      `"${r.confidence||''}"`,
      r.similar_count
    ].join(',');
  });

  let csv='\uFEFF'+csvHeader+'\n'+csvRows.join('\n');

  if(batch.plagiarism_pairs.length>0){
    csv+='\n\n'+['Учень А','Учень Б','Робота А','Робота Б','Схожість (%)'].join(',')+'\n';
    csv+=batch.plagiarism_pairs.map(p=>[
      `"${p.student_a}"`,
      `"${p.student_b}"`,
      `"${(p.title_a||'').replace(/"/g,'""')}"`,
      `"${(p.title_b||'').replace(/"/g,'""')}"`,
      p.similarity
    ].join(',')).join('\n');
  }

  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  const date=new Date().toISOString().slice(0,10);
  a.href=url;
  a.download=`batch-report-${batch.cls_name}-${date}.csv`;
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url);},100);
  toast('CSV експортовано','ok');
}

// ============= WHITELIST =============

function addToWhitelist(phrase){
  if(!phrase||!phrase.trim())return;
  if(!S.aiWhitelist)S.aiWhitelist=[];
  const p=phrase.trim().toLowerCase();
  if(p.length<3){toast('Занадто коротка фраза','warn');return;}
  if(S.aiWhitelist.includes(p)){toast('Вже у списку','warn');return;}
  if(S.aiWhitelist.length>=30){toast('Максимум 30 фраз','warn');return;}
  S.aiWhitelist.push(p);
  render();
  toast('Додано до whitelist','ok');
}

// ============= HISTORY WITH STATS =============

function rAIStatsCard(){
  if(!S.aiChecks||S.aiChecks.length<3)return'';

  const checks=S.aiChecks.slice(0,30);
  const aiCount=checks.filter(c=>c.score>=70).length;
  const susCount=checks.filter(c=>c.score>=35&&c.score<70).length;
  const cleanCount=checks.filter(c=>c.score<35).length;
  const avgScore=Math.round(checks.reduce((s,c)=>s+c.score,0)/checks.length);

  // Build sparkline (mini chart)
  const recent=checks.slice(0,15).reverse();
  const w=300, h=60;
  const max=100, min=0;
  const points=recent.map((c,i)=>{
    const x=(i/(recent.length-1||1))*w;
    const y=h-((c.score-min)/(max-min))*h;
    return [x,y,c];
  });
  const path=points.map((p,i)=>(i===0?'M':'L')+p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');

  return`<div class="card" style="margin-bottom:14px">
    <div class="ct">Статистика перевірок · ${checks.length}</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:10px;margin-bottom:14px">
      <div style="text-align:center;padding:10px;background:var(--bg2);border-radius:var(--r2)">
        <div style="font-family:var(--ff);font-size:1.4rem;font-weight:600">${avgScore}%</div>
        <div style="font-size:.66rem;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;margin-top:3px">Середній AI</div>
      </div>
      <div style="text-align:center;padding:10px;background:var(--rbg);border-radius:var(--r2)">
        <div style="font-family:var(--ff);font-size:1.4rem;font-weight:600;color:var(--red)">${aiCount}</div>
        <div style="font-size:.66rem;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;margin-top:3px">AI ризик</div>
      </div>
      <div style="text-align:center;padding:10px;background:var(--abg);border-radius:var(--r2)">
        <div style="font-family:var(--ff);font-size:1.4rem;font-weight:600;color:var(--amber)">${susCount}</div>
        <div style="font-size:.66rem;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;margin-top:3px">Підозрілі</div>
      </div>
      <div style="text-align:center;padding:10px;background:var(--gbg);border-radius:var(--r2)">
        <div style="font-family:var(--ff);font-size:1.4rem;font-weight:600;color:var(--green)">${cleanCount}</div>
        <div style="font-size:.66rem;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;margin-top:3px">Чисті</div>
      </div>
    </div>
    <div>
      <div style="font-size:.7rem;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:7px">Динаміка останніх ${recent.length} перевірок</div>
      <svg width="100%" viewBox="0 0 ${w} ${h+12}" style="display:block">
        <line x1="0" y1="${h-((70-min)/(max-min))*h}" x2="${w}" y2="${h-((70-min)/(max-min))*h}" stroke="var(--red)" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.4"/>
        <line x1="0" y1="${h-((35-min)/(max-min))*h}" x2="${w}" y2="${h-((35-min)/(max-min))*h}" stroke="var(--amber)" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.4"/>
        <path d="${path}" fill="none" stroke="var(--blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        ${points.map(p=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3" fill="${p[2].score>=70?'var(--red)':p[2].score>=35?'var(--amber)':'var(--green)'}" stroke="var(--sur)" stroke-width="1.5">
          <title>${p[2].score}% · ${p[2].label||''}</title>
        </circle>`).join('')}
      </svg>
      <div style="display:flex;justify-content:space-between;font-size:.66rem;color:var(--ink3);margin-top:5px">
        <span>${recent[0]?.date||''}</span>
        <span>зараз</span>
      </div>
    </div>
  </div>`;
}
