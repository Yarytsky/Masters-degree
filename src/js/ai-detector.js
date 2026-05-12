function detectLanguage(text) {
  const ukrChars = (text.match(/[а-яіїєґА-ЯІЇЄҐ]/g) || []).length;
  const engChars = (text.match(/[a-zA-Z]/g) || []).length;
  const total = ukrChars + engChars;
  if (total < 10) return 'unknown';
  const ukrRatio = ukrChars / total;
  if (ukrRatio > 0.6) return 'uk';
  if (ukrRatio < 0.2) return 'en';
  return 'mixed';
}

const AI_LEXICON = {
  uk: {
    high_confidence: [
      'важливо зазначити', 'слід підкреслити', 'варто відзначити',
      'необхідно враховувати', 'неможливо переоцінити', 'у сучасному світі',
      'у сучасних реаліях', 'у даному контексті', 'у цьому контексті',
      'слід наголосити', 'без сумніву', 'не викликає сумнівів',
      'охоплює широкий спектр', 'відіграє ключову роль', 'відіграє важливу роль',
      'грає важливу роль', 'становить теоретичну основу', 'має фундаментальне значення',
      'є невід\'ємною частиною', 'є фундаментальним', 'характеризується наступними',
      'представляє собою', 'у даний момент', 'на сьогоднішній день',
      'у нинішніх умовах', 'розкриваючи дане питання', 'торкаючись даної теми',
      'розглядаючи дане питання', 'аналізуючи вищезазначене',
      'враховуючи вищесказане', 'на підставі вищевикладеного',
      'не лише', 'але й також', 'разом з тим', 'у той же час',
      'тим не менш', 'між тим', 'таким чином', 'отже, можна зробити висновок',
    ],
    medium_confidence: [
      'у висновку', 'насамперед', 'перш за все', 'у першу чергу',
      'крім того', 'до того ж', 'зокрема, що',
      'необхідно зазначити', 'необхідно підкреслити',
      'важливо враховувати', 'слід враховувати', 'варто враховувати',
      'враховуючи вищенаведене', 'беручи до уваги',
      'значною мірою', 'певною мірою', 'у значній мірі',
      'широкого спектру', 'низку аспектів', 'ряд факторів',
      'в умовах сьогодення', 'в умовах сучасності',
      'дане питання', 'дана проблема', 'дана тема',
      'являє собою', 'являється', 'виступає в якості',
    ],
    pleonasms: [
      'вкрай важливо', 'абсолютно необхідно', 'надзвичайно актуально',
      'максимально ефективно', 'повністю комплексно', 'детально розкрити',
      'глибоко проаналізувати', 'всесторонньо вивчити',
    ],
  },
  en: {
    high_confidence: [
      'it is important to note', 'it should be noted', 'it is worth noting',
      'in conclusion', 'in summary', 'to summarize',
      'furthermore', 'moreover', 'consequently', 'subsequently',
      'in todays world', 'in modern times', 'in contemporary society',
      'plays a crucial role', 'plays a significant role', 'plays a vital role',
      'plays a pivotal role', 'serves as a foundation', 'forms the basis',
      'encompasses a wide range', 'spans a broad spectrum',
      'this demonstrates', 'this illustrates', 'this exemplifies',
      'it is essential to', 'it is crucial to', 'it is imperative to',
      'one must consider', 'one should consider', 'it is paramount',
      'in the realm of', 'in the context of', 'within the framework',
      'navigating the complexities', 'understanding the nuances',
      'delving into', 'exploring the depths', 'unpacking the concept',
    ],
    medium_confidence: [
      'as a result', 'as such', 'in essence',
      'in this regard', 'in this context', 'in this manner',
      'comprehensive', 'multifaceted', 'holistic',
      'underscores', 'highlights the importance', 'emphasizes the need',
      'serves as an example', 'represents a',
      'one of the most', 'among the most',
      'fundamentally important', 'critically important',
    ],
    pleonasms: [
      'absolutely essential', 'critically important', 'extremely vital',
      'completely comprehensive', 'fully understand', 'deeply analyze',
      'thoroughly examine', 'extensively explore',
    ],
  },
};

const PERSONAL_LEXICON = {
  uk: {
    high_confidence: [
      'я ', 'мені ', 'мій ', 'моя ', 'моє ', 'мої ',
      'мене ', 'мене,', 'мене.', 'мною ', 'про мене',
      'для мене', 'у мене', 'до мене',
      'думаю', 'вважаю', 'здається', 'мені здається',
      'як на мене', 'на мою думку', 'я переконаний',
      'я впевнений', 'я знаю', 'я бачу', 'я відчуваю',
      'я пам\'ятаю', 'я зрозумів', 'я помітив',
      'чесно кажучи', 'якщо чесно', 'правду кажучи',
      'особисто я', 'що стосується мене',
    ],
    casual: [
      'круто', 'класно', 'нудно', 'весело',
      'подобається', 'не подобається', 'ненавиджу', 'обожнюю',
      'бомба', 'жесть', 'кайф', 'жах',
      'якось', 'кудись', 'десь', 'хтось',
      'насправді', 'власне', 'взагалі-то', 'до речі',
      'ну ', 'ось ', 'от так', 'мовляв',
      'наче', 'ніби', 'мабуть',
    ],
    fillers: [
      'ну ', 'значить ', 'типу ', 'типа ',
      'короче', 'буквально', 'практично', 'реально',
      'просто', 'просто-таки', 'насправді',
    ],
  },
  en: {
    high_confidence: [
      'i ', 'me ', 'my ', 'mine ',
      'i think', 'i believe', 'i feel', 'i know',
      'i remember', 'i realized', 'i noticed',
      'i was', 'i am', 'i\'m', 'i\'ve', 'i\'ll',
      'in my opinion', 'as for me', 'personally',
      'honestly', 'frankly', 'to be honest',
      'for me', 'about me', 'with me',
    ],
    casual: [
      'cool', 'awesome', 'sucks', 'weird', 'crazy',
      'love it', 'hate it', 'kinda', 'sorta',
      'pretty much', 'super ', 'totally',
      'actually', 'basically', 'literally',
      'kind of', 'sort of', 'a bit',
    ],
    fillers: [
      'like ', 'um ', 'uh ', 'you know ',
      'just ', 'really ', 'very ', 'so ',
    ],
  },
};

const HEDGES = {
  uk: ['можливо', 'певно', 'мабуть', 'напевно', 'здається', 'схоже', 'наче', 'ніби', 'неначе', 'очевидно', 'імовірно', 'десь', 'якось', 'либонь'],
  en: ['maybe', 'perhaps', 'probably', 'possibly', 'seems', 'appears', 'likely', 'might', 'somewhat', 'somehow', 'kind of', 'sort of'],
};

function tokenize(text) {
  return text.toLowerCase()
    .replace(/[^\wа-яіїєґА-ЯІЇЄҐ'\- ]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
}

function tokenizeSentences(text) {
  return text.split(/(?<=[.!?…])\s+/).filter(s => s.trim().length > 3);
}

function yulesK(tokens) {
  if (tokens.length < 10) return 0;
  const freq = {};
  tokens.forEach(t => freq[t] = (freq[t] || 0) + 1);
  const freqOfFreq = {};
  Object.values(freq).forEach(f => freqOfFreq[f] = (freqOfFreq[f] || 0) + 1);
  let M2 = 0;
  Object.entries(freqOfFreq).forEach(([f, n]) => M2 += n * f * f);
  const N = tokens.length;
  return Math.round((10000 * (M2 - N)) / (N * N) * 10) / 10;
}

function honoreR(tokens) {
  if (tokens.length < 20) return 0;
  const freq = {};
  tokens.forEach(t => freq[t] = (freq[t] || 0) + 1);
  const V = Object.keys(freq).length;
  const V1 = Object.values(freq).filter(c => c === 1).length;
  if (V === V1 || V === 0) return 0;
  return Math.round(100 * Math.log(tokens.length) / (1 - V1 / V));
}

function mattr(tokens, windowSize = 50) {
  if (tokens.length < windowSize) {
    const types = new Set(tokens).size;
    return tokens.length ? Math.round((types / tokens.length) * 100) : 0;
  }
  let sum = 0, count = 0;
  for (let i = 0; i <= tokens.length - windowSize; i++) {
    const window = tokens.slice(i, i + windowSize);
    const types = new Set(window).size;
    sum += types / windowSize;
    count++;
  }
  return Math.round((sum / count) * 100);
}
function burstiness(text) {
  const sentences = tokenizeSentences(text);
  if (sentences.length < 3) return 0;
  const lengths = sentences.map(s => s.split(/\s+/).filter(Boolean).length);
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((a, l) => a + Math.pow(l - mean, 2), 0) / lengths.length;
  const stdDev = Math.sqrt(variance);
  return mean ? +(stdDev / mean).toFixed(3) : 0;
}

const FUNCTION_WORDS = {
  uk: ['і', 'та', 'що', 'як', 'у', 'в', 'на', 'до', 'з', 'із', 'для', 'про', 'або', 'але', 'також', 'тому', 'якщо', 'коли', 'де', 'хто'],
  en: ['the', 'a', 'an', 'and', 'or', 'but', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'as', 'is', 'are', 'was', 'were', 'be'],
};

function functionWordDeviation(tokens, lang) {
  const words = FUNCTION_WORDS[lang] || FUNCTION_WORDS.uk;
  const counts = words.map(w => tokens.filter(t => t === w).length);
  const total = counts.reduce((a, b) => a + b, 0);
  if (total < 5) return 0;
  const expected = total / words.length;
  const chiSq = counts.reduce((sum, obs) => sum + Math.pow(obs - expected, 2) / (expected || 1), 0);
  return Math.round(chiSq * 10) / 10;
}

function punctuationEntropy(text) {
  const puncts = text.match(/[.!?,;:—…\-]/g) || [];
  if (puncts.length < 5) return 0;
  const freq = {};
  puncts.forEach(p => freq[p] = (freq[p] || 0) + 1);
  const total = puncts.length;
  let entropy = 0;
  Object.values(freq).forEach(c => {
    const p = c / total;
    if (p > 0) entropy -= p * Math.log2(p);
  });
  return Math.round(entropy * 100) / 100;
}

function sentenceStartDiversity(text) {
  const sentences = tokenizeSentences(text);
  if (sentences.length < 4) return 100;
  const starts = sentences.map(s => {
    const w = s.trim().split(/\s+/)[0] || '';
    return w.toLowerCase().replace(/[^\wа-яіїєґ]/gi, '');
  });
  const unique = new Set(starts).size;
  return Math.round((unique / starts.length) * 100);
}


function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function countMatches(text, patterns) {
  const lower = text.toLowerCase();
  let total = 0;
  const matched = [];
  patterns.forEach(p => {
    const re = new RegExp(escapeRegex(p), 'gi');
    const m = lower.match(re);
    if (m && m.length > 0) {
      total += m.length;
      matched.push({ phrase: p, count: m.length });
    }
  });
  return { total, matched };
}

function detectAIMarkers(text, lang) {
  const lex = AI_LEXICON[lang === 'en' ? 'en' : 'uk'];
  const whitelist = (typeof S !== 'undefined' && S.aiWhitelist) ? S.aiWhitelist : [];
  const wlSet = new Set(whitelist.map(w => w.toLowerCase().trim()).filter(Boolean));

  const filterByWl = (patterns) => patterns.filter(p => !wlSet.has(p.toLowerCase()));

  const high = countMatches(text, filterByWl(lex.high_confidence));
  const med = countMatches(text, filterByWl(lex.medium_confidence));
  const pleo = countMatches(text, filterByWl(lex.pleonasms));
  return {
    high_confidence: high,
    medium: med,
    pleonasms: pleo,
    total: high.total + med.total + pleo.total,
    whitelisted: whitelist.length,
  };
}

function detectPersonalMarkers(text, lang) {
  const lex = PERSONAL_LEXICON[lang === 'en' ? 'en' : 'uk'];
  const high = countMatches(text, lex.high_confidence);
  const casual = countMatches(text, lex.casual);
  const fillers = countMatches(text, lex.fillers);
  return {
    high_confidence: high,
    casual: casual,
    fillers: fillers,
    total: high.total + casual.total + fillers.total,
  };
}

function detectHedges(text, lang) {
  const lex = HEDGES[lang === 'en' ? 'en' : 'uk'];
  return countMatches(text, lex);
}


function detectRepetition(text) {
  const sentences = tokenizeSentences(text);
  const result = {
    duplicate_sentences: 0,
    max_sentence_dup: 1,
    duplicate_paragraphs: 0,
    max_para_dup: 1,
    half_text_overlap: false,
    ngram_overlap_pct: 0,
  };

  const sigCounts = {};
  sentences.forEach(s => {
    const sig = s.trim().toLowerCase().replace(/\s+/g, ' ').substring(0, 100);
    if (sig.length > 20) sigCounts[sig] = (sigCounts[sig] || 0) + 1;
  });
  Object.values(sigCounts).forEach(c => {
    if (c > 1) {
      result.duplicate_sentences++;
      if (c > result.max_sentence_dup) result.max_sentence_dup = c;
    }
  });

  const paras = text.split(/\n\s*\n/).filter(p => p.trim().length > 50);
  const paraSigs = {};
  paras.forEach(p => {
    const sig = p.trim().toLowerCase().replace(/\s+/g, ' ').substring(0, 200);
    paraSigs[sig] = (paraSigs[sig] || 0) + 1;
  });
  Object.values(paraSigs).forEach(c => {
    if (c > 1) {
      result.duplicate_paragraphs++;
      if (c > result.max_para_dup) result.max_para_dup = c;
    }
  });

  if (text.length >= 400) {
    const half = Math.floor(text.length / 2);
    const a = text.substring(0, half).toLowerCase().replace(/\s+/g, ' ');
    const b = text.substring(half).toLowerCase().replace(/\s+/g, ' ');
    const probe = a.substring(Math.floor(a.length * 0.1), Math.floor(a.length * 0.1) + 150);
    if (probe.length > 50 && b.includes(probe)) result.half_text_overlap = true;
  }

  const tokens = tokenize(text);
  if (tokens.length >= 20) {
    const ngrams = {};
    for (let i = 0; i < tokens.length - 3; i++) {
      const ng = tokens.slice(i, i + 4).join(' ');
      if (ng.replace(/\s/g, '').length > 5) ngrams[ng] = (ngrams[ng] || 0) + 1;
    }
    let repeats = 0;
    Object.values(ngrams).forEach(c => { if (c > 1) repeats++; });
    result.ngram_overlap_pct = tokens.length ? +(repeats / tokens.length * 100).toFixed(1) : 0;
  }

  return result;
}


function calculateEvidence(features, lang, strict = true) {
  const evidence = [];

  const rep = features.repetition;
  if (rep.half_text_overlap) {
    evidence.push({ llr: 3.5, factor: 'Дублювання великих фрагментів тексту', weight: 'critical' });
  }
  if (rep.max_para_dup >= 2) {
    evidence.push({ llr: 2.8, factor: `Абзаци дублюються до ${rep.max_para_dup} разів`, weight: 'critical' });
  }
  if (rep.max_sentence_dup >= 3) {
    evidence.push({ llr: 2.0, factor: `Речення повторюються ${rep.max_sentence_dup}+ разів`, weight: 'high' });
  } else if (rep.max_sentence_dup === 2) {
    evidence.push({ llr: 0.8, factor: `Речення повторюються 2 рази`, weight: 'medium' });
  }
  if (rep.ngram_overlap_pct > 8) {
    evidence.push({ llr: 1.2, factor: `Високий повтор n-грам (${rep.ngram_overlap_pct}%)`, weight: 'high' });
  } else if (rep.ngram_overlap_pct > 4) {
    evidence.push({ llr: 0.5, factor: `Помірний повтор n-грам (${rep.ngram_overlap_pct}%)`, weight: 'medium' });
  }

  const aiMarkers = features.ai_markers;
  const aiDensity = features.word_count ? (aiMarkers.total / features.word_count) * 1000 : 0;
  if (aiDensity > 8) {
    evidence.push({ llr: 2.2, factor: `Дуже висока щільність AI-маркерів (${aiDensity.toFixed(1)}/1k)`, weight: 'high' });
  } else if (aiDensity > 5) {
    evidence.push({ llr: 1.5, factor: `Висока щільність AI-маркерів (${aiDensity.toFixed(1)}/1k)`, weight: 'high' });
  } else if (aiDensity > 3) {
    evidence.push({ llr: 0.9, factor: `Помітна кількість AI-маркерів (${aiDensity.toFixed(1)}/1k)`, weight: 'medium' });
  } else if (aiDensity > 1.5) {
    evidence.push({ llr: 0.4, factor: `Помірна кількість AI-маркерів`, weight: 'low' });
  } else if (aiDensity < 0.5 && features.word_count > 100) {
    evidence.push({ llr: -0.4, factor: `Майже відсутні AI-маркери`, weight: 'low' });
  }

  if (aiMarkers.high_confidence.matched.length >= 4) {
    evidence.push({ llr: 1.0, factor: `Множинні шаблонні AI-фрази (${aiMarkers.high_confidence.matched.length} різних)`, weight: 'high' });
  }
  if (aiMarkers.pleonasms.total >= 2) {
    evidence.push({ llr: 0.7, factor: `Плеоназми/перебільшення (${aiMarkers.pleonasms.total})`, weight: 'medium' });
  }

  const personal = features.personal_markers;
  const personalDensity = features.word_count ? (personal.total / features.word_count) * 1000 : 0;
  if (personalDensity > 12) {
    evidence.push({ llr: -2.5, factor: `Дуже сильний особистий голос (${personalDensity.toFixed(1)}/1k)`, weight: 'high' });
  } else if (personalDensity > 7) {
    evidence.push({ llr: -1.6, factor: `Сильний особистий голос (${personalDensity.toFixed(1)}/1k)`, weight: 'high' });
  } else if (personalDensity > 4) {
    evidence.push({ llr: -0.9, factor: `Помітний особистий голос`, weight: 'medium' });
  } else if (personalDensity < 1) {
    evidence.push({ llr: 1.4, factor: `Майже відсутній особистий голос`, weight: 'high' });
  } else if (personalDensity < 2) {
    evidence.push({ llr: 0.6, factor: `Слабкий особистий голос`, weight: 'medium' });
  }

  if (personal.casual.total >= 5) {
    evidence.push({ llr: -1.0, factor: `Розмовні слова (${personal.casual.total})`, weight: 'medium' });
  } else if (personal.casual.total >= 2) {
    evidence.push({ llr: -0.5, factor: `Деякі розмовні слова`, weight: 'low' });
  }

  if (personal.fillers.total >= 4) {
    evidence.push({ llr: -0.7, factor: `Філери/розмовні вставки (${personal.fillers.total})`, weight: 'medium' });
  }

  // ---- Hedges (uncertainty markers — human-like)
  const hedgeCount = features.hedges.total;
  if (hedgeCount >= 4) {
    evidence.push({ llr: -0.8, factor: `Hedge-слова (${hedgeCount}): ознаки невпевненості`, weight: 'medium' });
  } else if (hedgeCount >= 2) {
    evidence.push({ llr: -0.4, factor: `Деякі hedge-слова (${hedgeCount})`, weight: 'low' });
  }

  // ---- Stylometric features
  const burst = features.burstiness;
  if (burst < 0.25) {
    evidence.push({ llr: 1.8, factor: `Дуже однорідні речення (burstiness ${burst})`, weight: 'high' });
  } else if (burst < 0.4) {
    evidence.push({ llr: 1.0, factor: `Низька варіативність речень (${burst})`, weight: 'medium' });
  } else if (burst > 0.8) {
    evidence.push({ llr: -0.8, factor: `Висока варіативність речень (${burst})`, weight: 'medium' });
  }

  const ssd = features.sentence_start_diversity;
  if (ssd < 50 && features.sentence_count >= 5) {
    evidence.push({ llr: 0.8, factor: `Однотипні початки речень (${ssd}%)`, weight: 'medium' });
  } else if (ssd > 85) {
    evidence.push({ llr: -0.5, factor: `Різноманітні початки речень`, weight: 'low' });
  }

  const yk = features.yules_k;
  if (yk > 0 && features.word_count > 100) {
    if (yk > 200) {
      evidence.push({ llr: 0.6, factor: `Висока концентрація лексики (Yule K=${yk})`, weight: 'low' });
    } else if (yk < 80) {
      evidence.push({ llr: -0.3, factor: `Багата лексика (Yule K=${yk})`, weight: 'low' });
    }
  }

  if (features.punct_entropy < 1.2 && features.word_count > 80) {
    evidence.push({ llr: 0.5, factor: `Одноманітна пунктуація`, weight: 'low' });
  } else if (features.punct_entropy > 1.8) {
    evidence.push({ llr: -0.4, factor: `Різноманітна пунктуація`, weight: 'low' });
  }

  const fwd = features.function_word_deviation;
  if (fwd > 0 && fwd < 15 && features.word_count > 100) {
    evidence.push({ llr: 0.5, factor: `Рівномірний розподіл службових слів (типово для AI)`, weight: 'low' });
  }

  if (features.avg_sentence_length > 22) {
    evidence.push({ llr: 0.5, factor: `Завищена середня довжина речень`, weight: 'low' });
  } else if (features.avg_sentence_length < 8 && features.sentence_count > 5) {
    evidence.push({ llr: -0.4, factor: `Короткі речення`, weight: 'low' });
  }

  if (features.avg_word_length > 6.5) {
    evidence.push({ llr: 0.4, factor: `Підвищена формальність (довгі слова)`, weight: 'low' });
  }

  return evidence;
}

function aggregateBayesian(evidence, prior = 0.5, strictness = 'strict') {


  let adjustedPrior;
  if (strictness === 'strict') adjustedPrior = 0.55;
  else if (strictness === 'lenient') adjustedPrior = 0.45;
  else adjustedPrior = 0.50;

  let logOdds = Math.log(adjustedPrior / (1 - adjustedPrior));

  evidence.forEach(e => {
    logOdds += e.llr;
  });

  const probability = 1 / (1 + Math.exp(-logOdds));


  const totalAbsLLR = evidence.reduce((s, e) => s + Math.abs(e.llr), 0);
  const strongEvidence = evidence.filter(e => Math.abs(e.llr) >= 1.0).length;
  let confidence = 'Низька';
  if (totalAbsLLR > 6 || strongEvidence >= 3) confidence = 'Висока';
  else if (totalAbsLLR > 3 || strongEvidence >= 1) confidence = 'Середня';

  return {
    probability: Math.round(probability * 100),
    log_odds: +logOdds.toFixed(2),
    total_evidence: +totalAbsLLR.toFixed(2),
    confidence,
  };
}


function extractFeatures(text) {
  const lang = detectLanguage(text);
  const tokens = tokenize(text);
  const sentences = tokenizeSentences(text);

  return {
    lang,
    tokens,
    sentences,
    word_count: tokens.length,
    sentence_count: sentences.length,
    char_count: text.length,
    paragraph_count: text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length,
    unique_words: new Set(tokens).size,
    avg_word_length: tokens.length ? +(tokens.reduce((a, w) => a + w.length, 0) / tokens.length).toFixed(2) : 0,
    avg_sentence_length: sentences.length ? +(tokens.length / sentences.length).toFixed(1) : 0,
    type_token_ratio: tokens.length ? Math.round((new Set(tokens).size / tokens.length) * 100) : 0,
    mattr: mattr(tokens),
    yules_k: yulesK(tokens),
    honore_r: honoreR(tokens),
    burstiness: burstiness(text),
    sentence_start_diversity: sentenceStartDiversity(text),
    punct_entropy: punctuationEntropy(text),
    function_word_deviation: functionWordDeviation(tokens, lang === 'en' ? 'en' : 'uk'),
    ai_markers: detectAIMarkers(text, lang),
    personal_markers: detectPersonalMarkers(text, lang),
    hedges: detectHedges(text, lang),
    repetition: detectRepetition(text),
  };
}

function localAIAnalysis(text, _stats) {
  const features = extractFeatures(text);
  const evidence = calculateEvidence(features, features.lang, true);

  evidence.sort((a, b) => Math.abs(b.llr) - Math.abs(a.llr));

  const result = aggregateBayesian(evidence, 0.5, (typeof S !== 'undefined' && S.aiStrictness) ? S.aiStrictness : 'strict');

  const aiSigns = [];
  const humanSigns = [];
  evidence.forEach(e => {
    if (e.llr > 0.3) aiSigns.push(e.factor);
    else if (e.llr < -0.3) humanSigns.push(e.factor);
  });
  if (aiSigns.length === 0) aiSigns.push('Чітких маркерів AI не виявлено');
  if (humanSigns.length === 0 && result.probability > 60) {
    humanSigns.push('Помітних ознак людського письма не виявлено');
  } else if (humanSigns.length === 0) {
    humanSigns.push('Текст має ознаки природного письма');
  }

  const suspicious = [];
  if (features.repetition.max_sentence_dup >= 2) {
    const sigCounts = {};
    features.sentences.forEach(s => {
      const sig = s.trim().toLowerCase().replace(/\s+/g, ' ').substring(0, 100);
      sigCounts[sig] = (sigCounts[sig] || 0) + 1;
    });
    const seen = new Set();
    features.sentences.forEach(s => {
      const sig = s.trim().toLowerCase().replace(/\s+/g, ' ').substring(0, 100);
      if (sigCounts[sig] >= 2 && !seen.has(sig)) {
        seen.add(sig);
        if (suspicious.length < 2) {
          suspicious.push({
            text: s.trim().substring(0, 250),
            reason: `Це речення повторюється ${sigCounts[sig]} рази`,
          });
        }
      }
    });
  }
  features.ai_markers.high_confidence.matched.slice(0, 3).forEach(h => {
    const sent = features.sentences.find(s => s.toLowerCase().includes(h.phrase));
    if (sent && !suspicious.some(p => p.text === sent.trim().substring(0, 250))) {
      suspicious.push({
        text: sent.trim().substring(0, 250),
        reason: `Шаблонна AI-фраза: «${h.phrase}»`,
      });
    }
  });

  const strictness = (typeof S !== 'undefined' && S.aiStrictness) ? S.aiStrictness : 'strict';
  const thresholds = strictness === 'lenient'
    ? { high: 80, suspicion: 65, mild: 50 }
    : strictness === 'balanced'
    ? { high: 75, suspicion: 50, mild: 35 }
    : { high: 65, suspicion: 35, mild: 25 };

  let verdict, summary, recommendation;
  if (features.repetition.half_text_overlap || features.repetition.max_para_dup >= 2) {
    verdict = 'Виявлено дублювання';
    summary = `Робота містить дубльований контент. ${features.repetition.max_para_dup >= 2 ? 'Абзаци' : 'Великі фрагменти'} повторюються до ${Math.max(features.repetition.max_para_dup, features.repetition.max_sentence_dup)}× — це чітка ознака порушення академічної доброчесності.`;
    recommendation = 'Поверніть учню роботу на доопрацювання та проведіть бесіду про академічну доброчесність.';
  } else if (result.probability >= thresholds.high) {
    verdict = 'Висока ймовірність AI';
    summary = `Множинні маркери AI-генерації: щільність шаблонних фраз ${((features.ai_markers.total / features.word_count) * 1000).toFixed(1)}/1k, burstiness ${features.burstiness}, особистий голос ${((features.personal_markers.total / features.word_count) * 1000).toFixed(1)}/1k. Bayesian-агрегація вказує на ${result.probability}% ймовірність AI.`;
    recommendation = 'Високий ризик AI-генерації. Проведіть усну співбесіду — попросіть учня пояснити основні тези роботи власними словами.';
  } else if (result.probability >= thresholds.suspicion) {
    verdict = 'Підозра на AI';
    summary = `Текст має суттєві ознаки AI (${result.probability}%). Виявлено ${features.ai_markers.total} AI-маркерів, ${features.personal_markers.total} особистих маркерів. Потрібна додаткова перевірка.`;
    recommendation = `У ${strictness === 'strict' ? 'строгому' : strictness === 'balanced' ? 'збалансованому' : 'поблажливому'} режимі цей текст вважається підозрілим. Запропонуйте учню розширити фрагменти усно.`;
  } else if (result.probability >= thresholds.mild) {
    verdict = 'Деякі маркери AI';
    summary = `Невелика кількість AI-ознак (${result.probability}%). Це межовий результат, який вимагає уваги.`;
    recommendation = 'Зверніть увагу на конкретні підозрілі фрагменти. Стандартна перевірка змісту достатня.';
  } else {
    verdict = 'Ймовірно людина';
    summary = `Текст має ознаки природного письма (${result.probability}%). Активний особистий голос (${features.personal_markers.total} маркерів), варіативність речень ${features.burstiness}.`;
    recommendation = 'Жодних додаткових перевірок не потрібно.';
  }

  return {
    ai_probability: result.probability,
    verdict,
    confidence: result.confidence,
    text_quality: features.mattr >= 65 ? 'Висока' : features.mattr >= 45 ? 'Середня' : 'Низька',
    language: features.lang,
    summary,
    metrics: {
      lexical_diversity: features.mattr,
      personal_voice: Math.min(100, Math.round((features.personal_markers.total / Math.max(features.word_count, 1)) * 1000 * 10)),
      naturalness: Math.max(5, Math.min(100, Math.round(features.burstiness * 130))),
      formality: Math.min(100, Math.max(15, 30 + Math.round((features.ai_markers.total / Math.max(features.word_count, 1)) * 1000 * 6))),
    },
    advanced_metrics: {
      burstiness: features.burstiness,
      ai_density: +((features.ai_markers.total / Math.max(features.word_count, 1)) * 1000).toFixed(2),
      personal_density: +((features.personal_markers.total / Math.max(features.word_count, 1)) * 1000).toFixed(2),
      uniformity: 100 - features.sentence_start_diversity,
      ngram_overlap: features.repetition.ngram_overlap_pct,
      long_word_ratio: 0,
      hedge_count: features.hedges.total,
      filler_count: features.personal_markers.fillers.total,
      yules_k: features.yules_k,
      honore_r: features.honore_r,
      mattr: features.mattr,
      punct_entropy: features.punct_entropy,
      log_odds: result.log_odds,
      total_evidence: result.total_evidence,
    },
    repetition: features.repetition,
    evidence_log: evidence.map(e => ({
      weight: Math.round(e.llr * 25),
      reason: e.factor,
      llr: e.llr,
      strength: e.weight,
    })),
    ai_signs: aiSigns,
    human_signs: humanSigns,
    suspicious_phrases: suspicious,
    recommendation,
  };
}

function analyzeSentences(text) {
  const sentences = tokenizeSentences(text);
  if (sentences.length === 0) return [];

  const lang = detectLanguage(text);
  const results = [];

  sentences.forEach((sent, idx) => {
    const tokens = tokenize(sent);
    if (tokens.length < 3) {
      results.push({ sentence: sent, ai_prob: 50, evidence: [], idx });
      return;
    }

    const evidence = [];


    const aiMarkers = detectAIMarkers(sent, lang);
    if (aiMarkers.high_confidence.matched.length > 0) {
      const found = aiMarkers.high_confidence.matched.map(m => m.phrase).slice(0, 2);
      evidence.push({
        llr: 1.5 + (aiMarkers.high_confidence.matched.length - 1) * 0.5,
        factor: `AI-кліше: «${found.join('», «')}»`,
      });
    }
    if (aiMarkers.medium.matched.length > 0) {
      evidence.push({
        llr: 0.6,
        factor: `Формальний зворот`,
      });
    }
    if (aiMarkers.pleonasms.total > 0) {
      evidence.push({
        llr: 0.8,
        factor: `Плеоназм/перебільшення`,
      });
    }

    const personal = detectPersonalMarkers(sent, lang);
    if (personal.high_confidence.matched.length > 0) {
      evidence.push({
        llr: -1.2,
        factor: `Особистий голос`,
      });
    }
    if (personal.casual.matched.length > 0) {
      evidence.push({
        llr: -0.7,
        factor: `Розмовна лексика`,
      });
    }

    const hedges = detectHedges(sent, lang);
    if (hedges.total > 0) {
      evidence.push({
        llr: -0.5,
        factor: `Hedge-слова`,
      });
    }

    const len = tokens.length;
    if (len > 30) {
      evidence.push({ llr: 0.4, factor: 'Довге речення' });
    } else if (len < 5) {
      evidence.push({ llr: -0.3, factor: 'Коротке речення' });
    }

    let logOdds = Math.log(0.55 / 0.45);
    evidence.forEach(e => logOdds += e.llr);
    const prob = Math.round(100 / (1 + Math.exp(-logOdds)));

    results.push({
      sentence: sent,
      ai_prob: prob,
      evidence,
      idx,
      length: len,
    });
  });

  return results;
}


function selfCritique(features, initialProb, evidence) {

  const checks = [];
  let adjustment = 0;

 
  const hasPersonalPronouns = features.personal_markers.high_confidence.total > 0;
  const personalDensity0 = (features.personal_markers.total / Math.max(features.word_count, 1)) * 1000;
  const text = features.sentences.join(' ');
  const hasNumbers = /\b\d{1,4}\b/.test(text);

  const properNounMatches = text.match(/(?<=[а-яa-z]\s)[А-ЯA-Z][а-яa-z]{2,}/g) || [];
  const hasProperNouns = properNounMatches.length >= 1;
  const hasYears = /\b(19|20)\d{2}\b/.test(text);
  const hasEmotion = features.personal_markers.casual.total >= 1;
  const hasFillers = features.personal_markers.fillers.total >= 1;


  const narrativeWords = ['пам\'ятаю','пригадую','вперше','тоді','спочатку','потім','колись','якось','одного разу','останнім часом','минулого','раніше','тогочасний','той час','пішов','прийшов','відкрив','зробив','знайшов','побачив','почув','відчув','згадав','зрозумів','подарували','купили','давно','недавно','вчора','сьогодні','remember','recall','first time','once','when i was','i went','i saw','i heard','i found','i felt'];
  const lowerText = text.toLowerCase();
  let narrativeHits = 0;
  narrativeWords.forEach(w => {
    const re = new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const m = lowerText.match(re);
    if (m) narrativeHits += m.length;
  });
  const hasNarrativeMarkers = narrativeHits >= 2;
  const hasQuotedItems = /[«»"'""'']/.test(text);  


  const concreteScore = (hasNumbers ? 1 : 0) + (hasProperNouns ? 1 : 0) +
                        (hasYears ? 1 : 0) + (hasEmotion ? 1 : 0) +
                        (hasFillers ? 1 : 0) + (hasNarrativeMarkers ? 2 : 0) +
                        (hasQuotedItems ? 1 : 0);


  if (features.personal_markers.high_confidence.total >= 5 && concreteScore <= 2 && !hasNarrativeMarkers && features.word_count >= 50) {
    adjustment += 35;
    checks.push({
      check: 'Часті «я думаю/вважаю» БЕЗ розповідного стилю та конкретики',
      action: 'Класична AI-імітація людськості — підвищено на 35',
      delta: 35,
    });
  } else if (hasPersonalPronouns && concreteScore <= 1 && features.word_count > 100 && !hasNarrativeMarkers) {
    adjustment += 15;
    checks.push({
      check: 'Особисті займенники без конкретики та розповідних маркерів',
      action: 'Можлива імітація — підвищено на 15',
      delta: 15,
    });
  }

  if (personalDensity0 > 200 && !hasNarrativeMarkers && features.word_count >= 50) {
    adjustment += 20;
    checks.push({
      check: `Надмірна щільність "я" без розповідного стилю (${personalDensity0.toFixed(0)}/1k)`,
      action: 'Підозріло — підвищено на 20',
      delta: 20,
    });
  }

  if (personalDensity0 > 50 && hasNarrativeMarkers && hasQuotedItems) {
    adjustment -= 15;
    checks.push({
      check: 'Особисті займенники + розповідний стиль + цитати',
      action: 'Реальна особиста історія — знижено на 15',
      delta: -15,
    });
  }

  const personalDensity = (features.personal_markers.total / Math.max(features.word_count, 1)) * 1000;
  if (initialProb > 60 && personalDensity > 8) {
    adjustment -= 8;
    checks.push({
      check: 'Високий особистий голос за високого AI-score',
      action: 'Зменшено оцінку AI на 8',
      delta: -8,
    });
  }


  if (initialProb < 40 && features.burstiness < 0.25 && features.sentence_count >= 5) {
    adjustment += 8;
    checks.push({
      check: 'Дуже низька варіативність речень за низького AI-score',
      action: 'Підвищено оцінку AI на 8',
      delta: 8,
    });
  }

  if (features.repetition.half_text_overlap || features.repetition.max_para_dup >= 2) {
    if (initialProb < 80) {
      const target = 92;
      adjustment += (target - initialProb);
      checks.push({
        check: 'Виявлено серйозне дублювання',
        action: `Підвищено до ${target}`,
        delta: target - initialProb,
      });
    }
  }

  if (features.word_count < 30) {

    const target = 50;
    const delta = (target - initialProb) * 0.6;
    adjustment += delta;
    checks.push({
      check: `Дуже короткий текст (${features.word_count} слів)`,
      action: 'Малий зразок — оцінка майже неінформативна',
      delta: Math.round(delta),
    });
  } else if (features.word_count < 60) {

    if (initialProb > 80) adjustment -= 15;
    else if (initialProb > 70) adjustment -= 10;
    else if (initialProb < 20) adjustment += 10;
    else if (initialProb < 30) adjustment += 5;
    checks.push({
      check: `Короткий текст (${features.word_count} слів)`,
      action: 'Зменшено впевненість крайніх оцінок',
      delta: initialProb > 80 ? -15 : initialProb > 70 ? -10 : initialProb < 20 ? 10 : initialProb < 30 ? 5 : 0,
    });
  } else if (features.word_count < 100) {

    if (initialProb > 85) adjustment -= 7;
    if (initialProb < 15) adjustment += 5;
    checks.push({
      check: `Помірно короткий текст (${features.word_count} слів)`,
      action: 'Невелика корекція',
      delta: initialProb > 85 ? -7 : initialProb < 15 ? 5 : 0,
    });
  }

  const casualCount = features.personal_markers.casual.total;
  const aiHigh = features.ai_markers.high_confidence.total;
  if (aiHigh >= 2 && casualCount === 0 && personalDensity < 5) {
    adjustment += 5;
    checks.push({
      check: 'AI-маркери присутні, особистий голос слабкий',
      action: 'Підвищено впевненість в AI',
      delta: 5,
    });
  }

  const adjusted = Math.max(0, Math.min(100, initialProb + adjustment));
  return {
    original_prob: initialProb,
    adjusted_prob: adjusted,
    total_adjustment: adjustment,
    checks,
  };
}

window._aiBaseAnalysis = localAIAnalysis;
localAIAnalysis = function(text, _stats) {
  const result = window._aiBaseAnalysis(text, _stats);
  const features = extractFeatures(text);

  const critique = selfCritique(features, result.ai_probability, result.evidence_log || []);
  result.ai_probability = critique.adjusted_prob;
  result.self_critique = critique;

  result.sentence_analysis = analyzeSentences(text);

  const strictness2 = (typeof S !== 'undefined' && S.aiStrictness) ? S.aiStrictness : 'strict';
  const verdictThresh = strictness2 === 'lenient'
    ? { high: 80, suspicion: 65, mild: 50 }
    : strictness2 === 'balanced'
    ? { high: 75, suspicion: 50, mild: 35 }
    : { high: 65, suspicion: 35, mild: 25 };

  if (features.repetition.half_text_overlap || features.repetition.max_para_dup >= 2) {
    result.verdict = 'Виявлено дублювання';
  } else if (result.ai_probability >= verdictThresh.high) {
    result.verdict = 'Висока ймовірність AI';
  } else if (result.ai_probability >= verdictThresh.suspicion) {
    result.verdict = 'Підозра на AI';
  } else if (result.ai_probability >= verdictThresh.mild) {
    result.verdict = 'Деякі маркери AI';
  } else {
    result.verdict = 'Ймовірно людина';
  }

  return result;
};


window._aiFullAnalysis = localAIAnalysis;
