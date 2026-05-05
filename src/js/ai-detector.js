function detectRepetition(txt,stats){
  const result={fullDup:false,dupSentences:0,maxSentDup:1,dupParagraphs:0,maxParaDup:1,ngramRepeats:0,ngramOverlap:0};
  const halfLen=Math.floor(txt.length/2);
  if(txt.length>=400){
    const a=txt.substring(0,halfLen).toLowerCase().replace(/\s+/g,' ').trim();
    const b=txt.substring(halfLen).toLowerCase().replace(/\s+/g,' ').trim();
    const probe=a.substring(Math.floor(a.length*0.1),Math.floor(a.length*0.1)+150);
    if(probe.length>50&&b.includes(probe))result.fullDup=true;
  }
  const sigCounts={};
  stats.sentences.forEach(s=>{
    const sig=s.trim().toLowerCase().replace(/[^\wа-яіїєґ' ]/gi,'').replace(/\s+/g,' ').substring(0,100);
    if(sig.length>20)sigCounts[sig]=(sigCounts[sig]||0)+1;
  });
  Object.values(sigCounts).forEach(c=>{
    if(c>1){result.dupSentences++;if(c>result.maxSentDup)result.maxSentDup=c;}
  });
  const paras=txt.split(/\n\s*\n/).filter(p=>p.trim().length>50);
  const paraSigs={};
  paras.forEach(p=>{
    const sig=p.trim().toLowerCase().replace(/\s+/g,' ').substring(0,200);
    paraSigs[sig]=(paraSigs[sig]||0)+1;
  });
  Object.values(paraSigs).forEach(c=>{
    if(c>1){result.dupParagraphs++;if(c>result.maxParaDup)result.maxParaDup=c;}
  });
  if(stats.lemmas.length>=20){
    const ngrams={};
    for(let i=0;i<stats.lemmas.length-3;i++){
      const ng=stats.lemmas.slice(i,i+4).join(' ');
      if(ng.replace(/\s/g,'').length>5)ngrams[ng]=(ngrams[ng]||0)+1;
    }
    Object.values(ngrams).forEach(c=>{if(c>1)result.ngramRepeats++;});
    result.ngramOverlap=stats.lemmas.length?+(result.ngramRepeats/stats.lemmas.length*100).toFixed(1):0;
  }
  return result;
}

function detectAIPatterns(txt,stats){
  const lower=txt.toLowerCase();
  const result={highHits:[],medHits:[],totalAI:0};
  const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  AI_PHRASES_HIGH.forEach(p=>{
    const re=new RegExp('\\b'+escape(p)+'\\b','gi');
    const m=lower.match(re);
    if(m){result.highHits.push({phrase:p,count:m.length});result.totalAI+=m.length;}
  });
  AI_PHRASES_MED.forEach(p=>{
    const re=new RegExp('\\b'+escape(p)+'\\b','gi');
    const m=lower.match(re);
    if(m){result.medHits.push({phrase:p,count:m.length});result.totalAI+=m.length;}
  });
  result.density=stats.wordCount?+(result.totalAI/stats.wordCount*1000).toFixed(2):0;
  return result;
}

function detectPersonalVoice(txt,stats){
  const lower=txt.toLowerCase();
  const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  let highHits=0,medHits=0,hedgeHits=0,fillerHits=0;
  const examples=[];
  PERSONAL_HIGH.forEach(p=>{
    const re=new RegExp(escape(p),'gi');
    const m=lower.match(re);
    if(m){highHits+=m.length;if(examples.length<5&&m.length)examples.push(p.trim());}
  });
  PERSONAL_MED.forEach(p=>{
    const re=new RegExp(escape(p),'gi');
    const m=lower.match(re);
    if(m){medHits+=m.length;if(examples.length<8&&m.length)examples.push(p.trim());}
  });
  HEDGES.forEach(p=>{
    const re=new RegExp('\\b'+escape(p)+'\\b','gi');
    const m=lower.match(re);
    if(m)hedgeHits+=m.length;
  });
  FILLER.forEach(p=>{
    const re=new RegExp('\\b'+escape(p)+'\\b','gi');
    const m=lower.match(re);
    if(m)fillerHits+=m.length;
  });
  const total=highHits*2+medHits+hedgeHits+fillerHits*0.5;
  const density=stats.wordCount?+(total/stats.wordCount*1000).toFixed(2):0;
  return{highHits,medHits,hedgeHits,fillerHits,density,examples};
}

function detectStructuralUniformity(stats){
  if(stats.sentLengths.length<5)return{uniformity:0,monotonous:false,bucketDistribution:{}};
  const mean=stats.sentLengths.reduce((a,b)=>a+b,0)/stats.sentLengths.length;
  const cv=mean?stats.stdDev/mean:0;
  const uniformity=Math.round((1-Math.min(1,cv))*100);
  let buckets={short:0,med:0,long:0};
  stats.sentLengths.forEach(l=>{if(l<8)buckets.short++;else if(l<18)buckets.med++;else buckets.long++;});
  const dominantRatio=Math.max(buckets.short,buckets.med,buckets.long)/stats.sentLengths.length;
  return{uniformity,monotonous:dominantRatio>0.7,bucketDistribution:buckets};
}

function detectErrorPatterns(txt){
  const result={typos:0,doubleSpaces:0,naturalErrors:0,details:[]};
  const dbl=(txt.match(/  +/g)||[]).length;
  result.doubleSpaces=dbl;
  const lc=(txt.match(/[а-яіїєґ][.!?]\s+[а-яіїєґ]/g)||[]).length;
  if(lc>0){result.naturalErrors+=lc;result.details.push(`${lc} речень починається з малої літери`);}
  const ellipses=(txt.match(/\.\.\./g)||[]).length;
  if(ellipses>0)result.details.push(`${ellipses} тризначних крапок (характерно для людей)`);
  const dashUse=(txt.match(/ — /g)||[]).length;
  if(dashUse>3)result.details.push(`Активне використання тире (${dashUse}) — стилістична риса`);
  return result;
}

function localAIAnalysis(txt,stats){
  const rep=detectRepetition(txt,stats);
  const aiPat=detectAIPatterns(txt,stats);
  const personal=detectPersonalVoice(txt,stats);
  const structural=detectStructuralUniformity(stats);
  const errors=detectErrorPatterns(txt);

  let aiScore=25;
  const evidenceLog=[];

  if(rep.fullDup){aiScore+=35;evidenceLog.push({weight:35,reason:'Повний повтор половини тексту'});}
  if(rep.maxParaDup>=2){aiScore+=25;evidenceLog.push({weight:25,reason:`Абзаци дублюються до ${rep.maxParaDup} разів`});}
  if(rep.maxSentDup>=3){aiScore+=20;evidenceLog.push({weight:20,reason:`Речення повторюються ${rep.maxSentDup}+ разів`});}
  else if(rep.maxSentDup===2){aiScore+=10;evidenceLog.push({weight:10,reason:'Деякі речення повторюються двічі'});}
  if(rep.ngramOverlap>3){aiScore+=8;evidenceLog.push({weight:8,reason:`Високий повтор N-грам (${rep.ngramOverlap}%)`});}

  if(aiPat.density>5){aiScore+=22;evidenceLog.push({weight:22,reason:`Дуже висока щільність AI-маркерів (${aiPat.density}/1k)`});}
  else if(aiPat.density>3){aiScore+=14;evidenceLog.push({weight:14,reason:`Висока щільність AI-маркерів (${aiPat.density}/1k)`});}
  else if(aiPat.density>1.5){aiScore+=8;evidenceLog.push({weight:8,reason:`Помірна кількість AI-маркерів`});}
  else if(aiPat.density<0.3)aiScore-=5;

  if(personal.density<1){aiScore+=18;evidenceLog.push({weight:18,reason:'Майже відсутній особистий голос'});}
  else if(personal.density<2.5){aiScore+=8;evidenceLog.push({weight:8,reason:'Слабкий особистий голос'});}
  else if(personal.density>6){aiScore-=15;evidenceLog.push({weight:-15,reason:'Сильний особистий голос'});}
  else if(personal.density>10)aiScore-=22;

  if(stats.burstiness<0.25){aiScore+=20;evidenceLog.push({weight:20,reason:`Дуже однорідні речення (burstiness ${stats.burstiness})`});}
  else if(stats.burstiness<0.4){aiScore+=12;evidenceLog.push({weight:12,reason:`Низька варіативність речень (${stats.burstiness})`});}
  else if(stats.burstiness>0.7){aiScore-=12;evidenceLog.push({weight:-12,reason:'Природна варіативність речень'});}

  if(structural.monotonous){aiScore+=10;evidenceLog.push({weight:10,reason:'Монотонна структура — переважає один тип речень'});}
  if(structural.uniformity>75){aiScore+=8;evidenceLog.push({weight:8,reason:`Висока уніформність структури (${structural.uniformity}%)`});}

  if(stats.longWordRatio>32){aiScore+=10;evidenceLog.push({weight:10,reason:`Висока частка довгих слів (${stats.longWordRatio}%)`});}
  if(stats.avgSentLen>22){aiScore+=8;evidenceLog.push({weight:8,reason:`Завищена довжина речень (${stats.avgSentLen} слів)`});}
  if(stats.avgWordLen>6.5){aiScore+=6;evidenceLog.push({weight:6,reason:'Підвищена середня довжина слів'});}

  if(stats.lexDiv>78){aiScore+=8;evidenceLog.push({weight:8,reason:'Надмірна лексична різноманітність'});}
  else if(stats.lexDiv<35)aiScore-=5;

  if(errors.naturalErrors>1){aiScore-=10;evidenceLog.push({weight:-10,reason:`Природні помилки/особливості (${errors.naturalErrors})`});}
  if(errors.doubleSpaces>2){aiScore-=4;evidenceLog.push({weight:-4,reason:'Подвійні пробіли — людська помилка'});}

  if(personal.hedgeHits>=3){aiScore-=8;evidenceLog.push({weight:-8,reason:`Вживання hedge-слів (${personal.hedgeHits})`});}
  if(personal.fillerHits>=4){aiScore-=6;evidenceLog.push({weight:-6,reason:`Слова-філери (${personal.fillerHits})`});}

  aiScore=Math.max(2,Math.min(98,aiScore));

  const evidenceCount=evidenceLog.filter(e=>Math.abs(e.weight)>=10).length;
  let confidence='Низька';
  if(evidenceCount>=4)confidence='Висока';
  else if(evidenceCount>=2)confidence='Середня';
  if(stats.wordCount<100)confidence='Низька';

  const lexDivMetric=Math.min(100,Math.round(stats.lexDiv*1.2));
  const personalVoice=Math.min(100,Math.max(0,Math.round(personal.density*11)));
  const naturalness=Math.max(5,Math.min(100,Math.round(stats.burstiness*120-(rep.maxSentDup>1?25:0)-(structural.monotonous?15:0))));
  const formality=Math.min(100,Math.max(20,Math.round(35+aiPat.density*9+stats.longWordRatio*0.6)));

  const aiSigns=[];
  if(rep.fullDup)aiSigns.push('🚨 Виявлено дублювання великих фрагментів — ймовірне копіювання');
  if(rep.maxParaDup>=2)aiSigns.push(`🚨 Абзаци повторюються ${rep.maxParaDup} рази — серйозна ознака недоброчесності`);
  if(rep.maxSentDup>=2)aiSigns.push(`Знайдено ${rep.dupSentences} повторюваних речень (макс ${rep.maxSentDup}×)`);
  if(aiPat.highHits.length>0){
    const top=aiPat.highHits.sort((a,b)=>b.count-a.count).slice(0,4);
    aiSigns.push(`Шаблонні AI-фрази: ${top.map(h=>'«'+h.phrase+'»'+(h.count>1?' ×'+h.count:'')).join(', ')}`);
  }
  if(stats.burstiness<0.4)aiSigns.push(`Низька варіативність речень (${stats.burstiness}) — ознака AI`);
  if(personal.density<1.5)aiSigns.push('Майже відсутні особисті займенники та емоції');
  if(stats.longWordRatio>30)aiSigns.push(`Завищена частка довгих слів (${stats.longWordRatio}%) — формальний стиль`);
  if(structural.monotonous)aiSigns.push('Монотонна структура речень — переважає один формат');
  if(aiSigns.length===0)aiSigns.push('Чітких маркерів AI не виявлено');

  const humanSigns=[];
  if(personal.density>=4)humanSigns.push(`Активний особистий голос (${personal.highHits+personal.medHits} маркерів, щільність ${personal.density}/1k)`);
  if(stats.burstiness>0.5)humanSigns.push(`Природна варіативність речень (${stats.burstiness})`);
  if(personal.hedgeHits>=2)humanSigns.push(`Нерішучі слова (${personal.hedgeHits}): «можливо», «здається»`);
  if(personal.fillerHits>=3)humanSigns.push(`Слова-філери (${personal.fillerHits}) — характерно для розмовного стилю`);
  if(errors.naturalErrors>0)humanSigns.push(errors.details[0]||'Природні особливості тексту');
  if(personal.examples.length)humanSigns.push(`Особисті маркери: ${personal.examples.slice(0,4).join(', ')}`);
  if(humanSigns.length===0&&aiScore<50)humanSigns.push('Текст має ознаки природного письма');
  if(humanSigns.length===0)humanSigns.push('Помітних ознак людського письма не виявлено');

  const suspicious=[];
  if(rep.maxSentDup>=2){
    const seen=new Set();
    stats.sentences.forEach(s=>{
      const sig=s.trim().toLowerCase().replace(/[^\wа-яіїєґ' ]/gi,'').replace(/\s+/g,' ').substring(0,100);
      if(seen.has(sig))return;
      seen.add(sig);
      const cnt=stats.sentences.filter(s2=>{
        const sig2=s2.trim().toLowerCase().replace(/[^\wа-яіїєґ' ]/gi,'').replace(/\s+/g,' ').substring(0,100);
        return sig2===sig;
      }).length;
      if(cnt>1&&suspicious.length<2){
        suspicious.push({text:s.trim().substring(0,250),reason:`Це речення повторюється ${cnt} разів у тексті`});
      }
    });
  }
  aiPat.highHits.slice(0,3).forEach(h=>{
    const sent=stats.sentences.find(s=>s.toLowerCase().includes(h.phrase));
    if(sent&&!suspicious.some(p=>p.text===sent.trim().substring(0,250))){
      suspicious.push({text:sent.trim().substring(0,250),reason:`Шаблонна AI-фраза: «${h.phrase}»`});
    }
  });

  let summary;
  if(rep.fullDup||rep.maxParaDup>=2){
    summary=`Виявлено серйозне дублювання контенту. ${rep.maxParaDup>=2?'Абзаци':'Великі фрагменти'} повторюються до ${Math.max(rep.maxSentDup,rep.maxParaDup)}× — це чітка ознака порушення академічної доброчесності.`;
  }else if(aiScore>=75){
    summary=`Текст має сильні ознаки AI-генерації: ${aiPat.totalAI} шаблонних фраз, монотонна структура (burstiness ${stats.burstiness}), слабкий особистий голос (${personal.density}/1k). Висока ймовірність використання AI.`;
  }else if(aiScore>=50){
    summary=`Текст має суттєві ознаки AI. Виявлено ${aiPat.totalAI} AI-маркерів, ${personal.highHits+personal.medHits} особистих маркерів. Потрібна додаткова перевірка.`;
  }else if(aiScore>=30){
    summary=`Текст має змішані ознаки. Деякі формальні елементи присутні, але є й маркери людського письма. Низька ймовірність AI.`;
  }else{
    summary=`Текст виглядає природно написаним людиною: активний особистий голос, природна варіативність речень, наявність розмовних елементів.`;
  }

  let recommendation;
  if(rep.fullDup||rep.maxParaDup>=2){
    recommendation='Робота містить дубльований контент. Поверніть учню на доопрацювання та проведіть бесіду про академічну доброчесність.';
  }else if(aiScore>=75){
    recommendation='Високий ризик AI-генерації. Проведіть усну співбесіду — попросіть учня пояснити основні тези роботи власними словами та навести додаткові приклади.';
  }else if(aiScore>=50){
    recommendation='Результат вимагає особистої перевірки. Запропонуйте учню розширити певні фрагменти роботи усно або письмово в класі.';
  }else if(aiScore>=30){
    recommendation='Незначні підозри, проте загалом текст виглядає прийнятно. Стандартна перевірка змісту достатня.';
  }else{
    recommendation='Текст виглядає природним. Жодних додаткових перевірок не потрібно.';
  }

  return{
    ai_probability:aiScore,
    confidence,
    text_quality:stats.lexDiv>=55?'Висока':stats.lexDiv>=40?'Середня':'Низька',
    summary,
    metrics:{lexical_diversity:lexDivMetric,personal_voice:personalVoice,naturalness,formality},
    advanced_metrics:{
      burstiness:stats.burstiness,
      ai_density:aiPat.density,
      personal_density:personal.density,
      uniformity:structural.uniformity,
      ngram_overlap:rep.ngramOverlap,
      long_word_ratio:stats.longWordRatio,
      hedge_count:personal.hedgeHits,
      filler_count:personal.fillerHits
    },
    repetition:rep,
    evidence_log:evidenceLog,
    ai_signs:aiSigns,
    human_signs:humanSigns,
    suspicious_phrases:suspicious,
    recommendation
  };
}
