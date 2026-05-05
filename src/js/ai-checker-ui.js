function rAIChecker(){
  const txt=S.aiCheckText||'';
  const stats=txt.length>0?textStats(txt):null;
  const minOk=txt.length>=200;
  const checking=S.aiChecking;
  const res=S.aiCheckResult;
  const showResult=res&&!checking;

  if(showResult){
    return`<div>
      <div class="ph ph-row">
        <div><div class="pt">Результат перевірки</div><div class="ps">${stats?stats.wordCount+' слів · '+stats.sentCount+' речень':''}</div></div>
        <button class="btn btn-s btn-sm" onclick="resetAICheck()">${ico('plus',13,'transform:rotate(45deg)')} Нова перевірка</button>
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
      `:rWorksPicker(txt,stats)}

      <div id="ai-stats-bar" style="display:flex;align-items:center;justify-content:space-between;margin-top:14px;padding:10px 14px;background:var(--bg2);border-radius:var(--r2);flex-wrap:wrap;gap:10px">
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
      </div>

      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:14px;flex-wrap:wrap">
        ${txt?`<button class="btn btn-s btn-sm" onclick="S.aiCheckText='';S.aiCheckResult=null;render()">${ico('trash',12)} Очистити</button>`:''}
        <button class="btn btn-p" onclick="runAICheck()" ${!minOk?'disabled':''} style="${!minOk?'opacity:.4;pointer-events:none':''}">
          ${ico('ai',13)} Запустити перевірку
        </button>
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
  return`<div class="card">
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
  </div>`;
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
  const verdict=score>=70?'Ймовірно AI-генерація':score>=40?'Підозріло — потребує перевірки':'Ймовірно людина';
  const verdictDetail=score>=70?'Текст має чіткі ознаки автоматичної генерації штучним інтелектом':score>=40?'Деякі ознаки AI присутні, але не вирішальні. Рекомендуємо особисту перевірку.':'Текст виглядає природно написаним людиною';
  const m=r.metrics||{};
  const circ=2*Math.PI*64;
  const off=circ*(1-score/100);

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
          </svg>
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
            <div style="font-family:var(--ff);font-size:2.6rem;font-weight:600;line-height:1;color:${col}">${score}<span style="font-size:1.2rem;opacity:.7">%</span></div>
            <div style="font-size:.66rem;color:var(--ink3);text-transform:uppercase;letter-spacing:.1em;margin-top:4px;font-weight:600">AI ризик</div>
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

  await new Promise(r=>setTimeout(r,1400));
  S.aiStages=['stats','lex'];render();
  await new Promise(r=>setTimeout(r,1800));

  const stats=textStats(txt);
  const analyzeText=txt.length>6000?txt.substring(0,6000):txt;

  S.aiStages=['stats','lex','api'];render();

  const prompt=`Ти — експерт-філолог з 20 років досвіду виявлення текстів, згенерованих штучним інтелектом. Проаналізуй наведений нижче текст українською мовою, написаний імовірно школярем (5–11 клас).

ТЕКСТ ДЛЯ АНАЛІЗУ:
"""
${analyzeText}
"""

СТАТИСТИКА ТЕКСТУ:
- Слів: ${stats.wordCount}
- Речень: ${stats.sentCount}
- Середня довжина речення: ${stats.avgSentLen} слів
- Стандартне відхилення довжини речень (burstiness): ${stats.stdDev}
- Лексична унікальність: ${stats.lexDiv}%

ВАЖЛИВО ПРО BURSTINESS:
Людські тексти мають високу варіативність довжини речень (burstiness > 5). AI генерує більш однорідні за довжиною речення (burstiness < 4). Це сильний сигнал.

ОЗНАКИ AI-ГЕНЕРАЦІЇ УКРАЇНСЬКОЮ:
- Шаблонні переходи: «важливо зазначити», «слід підкреслити», «варто відзначити», «у сучасному світі», «таким чином», «у висновку», «слід наголосити», «можна стверджувати», «у контексті»
- Надмірна академічність та формальність для віку 11–17 років
- Ідеально побудовані речення без жодних помилок
- Однорідна довжина речень (низький burstiness)
- Відсутність особистих займенників «я», «мені», «думаю», «вважаю»
- Узагальнені фрази без конкретних прикладів з життя
- Відсутність емоційного забарвлення
- Структурованість як у Вікіпедії
- Гладкість тексту без характерних для учня помилок
- Списки з чіткими однотипними пунктами
- Завершення кожного абзацу логічним «висновком»

ОЗНАКИ ЛЮДСЬКОГО ПИСЬМА ШКОЛЯРА:
- Природні граматичні/пунктуаційні помилки (1-3 на текст)
- Особисті приклади з життя
- Емоційні висловлювання, оцінки («було круто», «не сподобалось»)
- Розмовні елементи, слова-паразити
- Дуже варіативна довжина речень (короткі впереміш з довгими)
- Конкретні деталі замість узагальнень
- Подеколи нелогічні переходи між думками
- Повторення улюблених слів автора
- Вживання «я», «мені», «мій»

ВІДПОВІДЬ — СТРОГО ВАЛІДНИЙ JSON, БЕЗ КОДОВИХ БЛОКІВ ТА ТЕКСТУ ПОЗА JSON. Будь чесним і об'єктивним — не завищуй ризик AI без підстав, але й не занижуй за наявності чітких маркерів.

{
  "ai_probability": <ціле 0-100, об'єктивна оцінка>,
  "confidence": "Висока" | "Середня" | "Низька",
  "text_quality": "Висока" | "Середня" | "Низька",
  "summary": "<2-3 речення українською — головний висновок>",
  "metrics": {
    "lexical_diversity": <0-100>,
    "personal_voice": <0-100>,
    "naturalness": <0-100>,
    "formality": <0-100>
  },
  "ai_signs": [
    "<конкретна ознака AI знайдена в тексті>",
    "<ознака 2>",
    "<ознака 3>"
  ],
  "human_signs": [
    "<конкретна ознака людини знайдена в тексті>",
    "<ознака 2>"
  ],
  "suspicious_phrases": [
    {"text": "<точна цитата з тексту>", "reason": "<коротко чому>"},
    {"text": "<цитата>", "reason": "<причина>"}
  ],
  "recommendation": "<2-3 речення конкретних дій вчителю>"
}`;

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
          max_tokens:2500,
          messages:[{role:'user',content:prompt}]
        })
      });
      if(!r.ok){
        let errBody='';
        try{const j=await r.json();errBody=j.error?.message||JSON.stringify(j).substring(0,150);}catch(_){errBody=await r.text().catch(()=>'').then(t=>t.substring(0,150));}
        lastErr='HTTP '+r.status+(errBody?': '+errBody:'');
        continue;
      }
      const d=await r.json();
      if(d.error){lastErr=d.error.message||JSON.stringify(d.error);continue;}
      const respText=(d.content||[]).map(c=>c.text||'').join('');
      if(!respText){lastErr='Порожня відповідь';continue;}
      const cleaned=respText.replace(/```json\s*/g,'').replace(/```\s*/g,'').trim();
      const m=cleaned.match(/\{[\s\S]*\}/);
      if(!m){lastErr='Не знайдено JSON у відповіді';continue;}
      try{
        result=JSON.parse(m[0]);
        if(typeof result.ai_probability!=='number'){lastErr='Невалідне поле ai_probability';continue;}
        break;
      }catch(parseErr){
        lastErr='Парсинг JSON: '+parseErr.message;
        continue;
      }
    }catch(e){
      lastErr=e.message||'Помилка мережі';
    }
  }

  if(!result){
    result=localAIAnalysis(txt,stats);
    result._fallback=true;
    result._apiError=lastErr;
  }

  S.aiStages=['stats','lex','api','parse'];render();
  await new Promise(r=>setTimeout(r,1500));

  result.ai_probability=Math.max(0,Math.min(100,Math.round(result.ai_probability||0)));
  if(result.metrics){
    Object.keys(result.metrics).forEach(k=>{
      result.metrics[k]=Math.max(0,Math.min(100,Math.round(result.metrics[k]||0)));
    });
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
}
