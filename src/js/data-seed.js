const SUBS=[
  {id:'math',n:'Математика',    c:'#1A3C6E',cb:'#EEF3FA',t:'Іваненко М.В.',sch:[1,3,5]},
  {id:'ukr', n:'Укр. мова',     c:'#7A4A10',cb:'#FDF5E8',t:'Петренко О.С.',sch:[1,4]},
  {id:'hist',n:'Історія',       c:'#4A1A7A',cb:'#F5F0FF',t:'Коваленко Р.І.',sch:[2,5]},
  {id:'cs',  n:'Інформатика',   c:'#1A5C35',cb:'#EEFAF3',t:'Сидоренко В.М.',sch:[3]},
  {id:'phys',n:'Фізика',        c:'#7A1A1A',cb:'#FDF0F0',t:'Шевченко Т.О.',sch:[2,4]},
];
const CLS=[
  {id:'11a',n:'11-А',g:11,students:['Ярицький Юрій','Коваль Олена','Мороз Василь','Лисенко Катерина','Бондар Максим','Петренко Андрій','Сидоренко Іван','Дяченко Роман','Кравченко Тетяна','Захаренко Людмила','Гончаренко Вікторія','Шевченко Надія']},
  {id:'10b',n:'10-Б',g:10,students:['Остапенко Сергій','Павленко Марина','Романенко Олег','Тимченко Анна','Супруненко Кирило','Коломієць Діана','Черненко Олексій','Ткаченко Валерія']},
  {id:'9v', n:'9-В', g:9, students:['Іванченко Дмитро','Савченко Марія','Хоменко Олег','Руденко Ірина','Мельник Андрій','Білик Юлія']},
];
let ASGN=[
  {id:'a1',sid:'math',cid:'11a',type:'test',   title:'Тест: Похідна функції',due:'2026-04-08',tmin:30,src:'manual',qs:[
    {id:1,txt:'Похідна f(x)=x³+2x?',type:'choice',opts:['3x²+2','3x+2','x²+2x','3x²'],ok:0},
    {id:2,txt:'lim(x→0) sin(x)/x?',type:'choice',opts:['0','1','∞','Не існує'],ok:1},
    {id:3,txt:'Первісна f(x)=2x?',type:'choice',opts:['x²','2x²','x²+C','2'],ok:2},
  ]},
  {id:'a2',sid:'cs',cid:'11a',type:'control',title:'КР: Алгоритми і складність',due:'2026-04-14',tmin:45,src:'ai',qs:[
    {id:1,txt:'Складність бінарного пошуку?',type:'choice',opts:['O(n)','O(log n)','O(n²)','O(1)'],ok:1},
    {id:2,txt:'Що таке рекурсія?',type:'choice',opts:['Цикл for','Функція що викликає саму себе','Масив','Умовний оператор'],ok:1},
    {id:3,txt:'Структура LIFO?',type:'choice',opts:['Черга','Стек','Список','Дерево'],ok:1},
  ]},
];
let SUBS_DATA={'a1_Коваль Олена':{ans:[0,1,2],sc:3,tot:3,pct:100,at:'30 бер'},'a1_Мороз Василь':{ans:[0,0,2],sc:2,tot:3,pct:67,at:'30 бер'},'a1_Бондар Максим':{ans:[1,1,0],sc:1,tot:3,pct:33,at:'31 бер'},'a1_Сидоренко Іван':{ans:[0,1,2],sc:3,tot:3,pct:100,at:'31 бер'}};
const GRADE_TYPES={control:'Контрольна',test:'Тест',oral:'Усне опитування',hw:'Домашнє завдання',work:'Класна робота',project:'Проект'};
let STUDENT_WORKS = {
  '11a': [
    {id:'w1', student:'Ярицький Юрій', subject:'ukr', title:'Твір: Роль книги в моєму житті', date:'02.04', filename:'tvir_yarytskyi.txt',
     text:`Книга — це справжній скарб, який супроводжує мене все життя. Я ще пам'ятаю, як вперше відкрив для себе світ художньої літератури. Тоді мені було приблизно вісім років, і батьки подарували мені «Незнайка на Місяці» Носова. Чесно кажучи, я тоді не зовсім розумів усі ідеї книги, але героїчні пригоди коротульок захопили мене настільки, що я перечитував її кілька разів.

З того часу читання стало для мене не просто хобі, а способом життя. Деякі книги мене вразили глибоко — наприклад, «Тигролови» Багряного. Спочатку було важко, мова трохи незвична, але потім я не міг відірватися. Думаю, що саме така література формує характер.

Іноді мені здається, що я живу у книгах більше, ніж у реальному світі. Це, мабуть, не зовсім нормально, але я нічого не можу з цим вдіяти. Книги вчать, заспокоюють, надихають. Без них моє життя було би набагато сумнішим.`},

    {id:'w2', student:'Коваль Олена', subject:'ukr', title:'Твір: Роль книги в моєму житті', date:'02.04', filename:'tvir_koval.txt',
     text:`Книга відіграє ключову роль у формуванні особистості людини в сучасному світі. Важливо зазначити, що читання сприяє розвитку критичного мислення, збагачує лексику та розширює кругозір. У контексті стрімкого розвитку цифрових технологій книги залишаються невід'ємною частиною освітнього процесу.

Слід підкреслити, що класична література, зокрема творчість українських письменників, формує національну свідомість. Таким чином, книга виконує не лише розважальну, а й виховну функцію. Можна стверджувати, що читання є фундаментальною основою інтелектуального розвитку.

У висновку слід наголосити, що в умовах сьогодення важливість книги неможливо переоцінити. Без сумніву, читання залишається одним з найефективніших інструментів самовдосконалення та особистісного зростання.`},

    {id:'w3', student:'Мороз Василь', subject:'ukr', title:'Твір: Роль книги в моєму житті', date:'03.04', filename:'tvir_moroz.txt',
     text:`Я люблю читати з дитинства. Перша книга, яку я прочитав сам — це «Чарлі і шоколадна фабрика». Мені тоді було сім років, і я закохався в цю історію. Спочатку батьки читали мені вголос, а потім я почав сам.

Зараз мені більше подобається фантастика. Останнім часом захоплююся серією про Гаррі Поттера. Знаю, що це дитяча, але мене не цікавить що думають інші. Книги переносять у інший світ, і це круто.

У школі ми вивчаємо багато творів. Деякі нудні, чесно скажу. Але «Кобзар» Шевченка реально зачепив. Я навіть вивчив кілька віршів напам'ять, не бо змусили, а сам захотів.

Без книг моє життя було б нудним. Думаю, кожна людина повинна знайти свою книгу.`},

    {id:'w4', student:'Лисенко Катерина', subject:'ukr', title:'Твір: Роль книги в моєму житті', date:'02.04', filename:'tvir_lysenko.txt',
     text:`Книга відіграє ключову роль у формуванні особистості людини в сучасному світі. Важливо зазначити, що читання сприяє розвитку критичного мислення, збагачує лексику та розширює кругозір. У контексті стрімкого розвитку цифрових технологій книги залишаються невід'ємною частиною освітнього процесу.

У висновку слід наголосити, що в умовах сьогодення важливість книги неможливо переоцінити. Книга — це джерело знань та натхнення, яке супроводжує людину протягом усього життя.`},

    {id:'w5', student:'Бондар Максим', subject:'math', title:'Реферат: Похідна функції', date:'04.04', filename:'referat_bondar.txt',
     text:`Похідна функції є фундаментальним поняттям математичного аналізу, що характеризує швидкість зміни функції. Формально, похідна f'(x) визначається як границя відношення приросту функції до приросту аргументу при прямуванні останнього до нуля. Застосування похідних охоплює широкий спектр задач у різних галузях науки та техніки.

Похідна функції є фундаментальним поняттям математичного аналізу, що характеризує швидкість зміни функції. Формально, похідна f'(x) визначається як границя відношення приросту функції до приросту аргументу при прямуванні останнього до нуля. Застосування похідних охоплює широкий спектр задач у різних галузях науки та техніки.

Таким чином, диференціальне числення становить теоретичну основу для подальшого вивчення інтегрального числення.`},

    {id:'w6', student:'Петренко Андрій', subject:'phys', title:'Лабораторна: Закони Ньютона', date:'05.04', filename:'lab_petrenko.txt',
     text:`Сьогодні ми проводили лабораторну роботу з вивчення законів Ньютона. Я працював у парі з Іваном. Спочатку було трохи складно зрозуміти, як правильно вимірювати силу за допомогою динамометра, але вчителька допомогла.

Перший закон я зрозумів інтуїтивно — якщо нічого не штовхає, то воно не рухається. Але другий закон з формулою F=ma виявився цікавішим. Ми вимірювали прискорення візка з різними вантажами, і дані майже збіглися з теорією. Майже — бо було тертя.

Найскладніше було з третім законом. Здається простим: дія дорівнює протидії. Але в реальних задачах легко заплутатися де яка сила. Думаю, потрібно ще порозв'язувати задачі.`},
  ],

  '10b': [
    {id:'w7', student:'Остапенко Сергій', subject:'cs', title:'Доповідь: Алгоритми сортування', date:'03.04', filename:'dop_ostapenko.txt',
     text:`Алгоритми сортування є важливою темою в інформатиці. Я розглянув три основні: бульбашкове, швидке (quicksort) і сортування злиттям. Першим я реалізував bubble sort на Python — простий, але повільний для великих масивів.

Quicksort виявився цікавішим. Ідея з опорним елементом сподобалась, але рекурсію спочатку важко було уявити. Прийшлось малювати дерево викликів. Складність O(n log n) у середньому, але O(n²) у найгіршому — це коли масив вже відсортований.

Merge sort стабільний, завжди O(n log n), але потребує додаткової пам'яті. Я тестував на масиві 10000 чисел: bubble — 5 секунд, quicksort — 0.05, merge — 0.07. Різниця колосальна. Тепер розумію чому в реальних застосунках використовують саме швидкі алгоритми.`},

    {id:'w8', student:'Павленко Марина', subject:'hist', title:'Есе: Друга світова війна', date:'04.04', filename:'esse_pavlenko.txt',
     text:`Друга світова війна є фундаментальною подією XX століття, яка кардинально змінила геополітичну карту світу. Важливо зазначити, що передумови війни сформувалися у міжвоєнний період внаслідок невирішених питань Версальського договору. У контексті економічної кризи 1929-1933 років, тоталітарні режими отримали можливість для зміцнення своєї влади.

Слід підкреслити, що війна охопила широкий спектр територій та залучила більшість країн світу. Можна стверджувати, що ця війна стала найбільшою катастрофою в історії людства. Таким чином, її уроки залишаються актуальними і сьогодні.`},
  ],

  '9v': [
    {id:'w9', student:'Іванченко Дмитро', subject:'ukr', title:'Твір: Моя родина', date:'01.04', filename:'tvir_ivanchenko.txt',
     text:`Моя родина — це найдорожче, що в мене є. Нас четверо: тато, мама, я і молодша сестричка Софійка. Вона ще ходить у садочок, і часом мене дратує, але я її люблю.

Тато працює інженером, а мама вчителька. Тато постійно розповідає мені про техніку, як що працює. Мені цікаво, але іноді він пояснює надто детально. Мама, навпаки, любить розмовляти про книги і фільми.

У вихідні ми любимо ходити в парк або їздити до бабусі в село. Бабуся пече найкращі пироги. Я навчився у неї робити вареники, хоча мої виходять кривенькі. Але бабуся каже що головне — від душі.

Сім'я — це не просто люди, які живуть разом. Це ті, хто завжди тебе підтримає.`},
  ],
};

function getAllWorks(){
  const all=[];
  Object.entries(STUDENT_WORKS).forEach(([cid,works])=>{
    works.forEach(w=>all.push({...w,cid}));
  });
  return all;
}

function findSimilarWorks(targetText,targetId,minSimilarity=15){
  const all=getAllWorks();
  const targetTokens=tokenizeForSim(targetText);
  if(!targetTokens.length)return [];
  const targetSet=new Set(targetTokens);
  const targetTrigrams=getTrigrams(targetTokens);
  const results=[];
  all.forEach(w=>{
    if(w.id===targetId)return;
    const tokens=tokenizeForSim(w.text);
    if(!tokens.length)return;
    const set=new Set(tokens);
    const intersection=[...targetSet].filter(x=>set.has(x)).length;
    const union=new Set([...targetSet,...set]).size;
    const jaccard=union?(intersection/union)*100:0;
    const trigrams=getTrigrams(tokens);
    const triIntersect=[...targetTrigrams].filter(x=>trigrams.has(x)).length;
    const triUnion=new Set([...targetTrigrams,...trigrams]).size;
    const trigramSim=triUnion?(triIntersect/triUnion)*100:0;
    const overall=Math.round((jaccard*0.4+trigramSim*0.6));
    if(overall>=minSimilarity){
      const matchedPhrases=findMatchingPhrases(targetText,w.text);
      results.push({work:w,similarity:overall,jaccard:Math.round(jaccard),trigramSim:Math.round(trigramSim),matchedPhrases});
    }
  });
  return results.sort((a,b)=>b.similarity-a.similarity);
}

function tokenizeForSim(t){
  return t.toLowerCase()
    .replace(/[^\wа-яіїєґ' ]/gi,' ')
    .replace(/\s+/g,' ')
    .trim()
    .split(' ')
    .filter(w=>w.length>=3)
    .map(w=>w.replace(/[аеєиіїоуюяь]+$/u,''));
}

function getTrigrams(tokens){
  const trigrams=new Set();
  for(let i=0;i<tokens.length-2;i++){
    const tg=tokens[i]+' '+tokens[i+1]+' '+tokens[i+2];
    if(tg.replace(/\s/g,'').length>=8)trigrams.add(tg);
  }
  return trigrams;
}

function findMatchingPhrases(t1,t2){
  const sentences1=t1.split(/(?<=[.!?…])\s+/).filter(s=>s.trim().length>20);
  const sentences2=t2.split(/(?<=[.!?…])\s+/).filter(s=>s.trim().length>20);
  const matches=[];
  sentences1.forEach(s1=>{
    const norm1=s1.toLowerCase().replace(/[^\wа-яіїєґ' ]/gi,' ').replace(/\s+/g,' ').trim();
    sentences2.forEach(s2=>{
      const norm2=s2.toLowerCase().replace(/[^\wа-яіїєґ' ]/gi,' ').replace(/\s+/g,' ').trim();
      if(norm1.length<25)return;
      const minLen=Math.min(norm1.length,norm2.length);
      const maxLen=Math.max(norm1.length,norm2.length);
      let identical=0;
      for(let i=0;i<minLen;i++)if(norm1[i]===norm2[i])identical++;else break;
      if(identical>=Math.min(50,minLen*0.7)&&minLen/maxLen>0.5){
        matches.push({phrase:s1.trim().substring(0,200),identical:identical});
      } else {
        const words1=norm1.split(' ');
        const words2=norm2.split(' ');
        const set2=new Set(words2);
        const overlap=words1.filter(w=>w.length>3&&set2.has(w)).length;
        if(words1.length>=5&&overlap/words1.length>0.7){
          matches.push({phrase:s1.trim().substring(0,200),overlap:Math.round(overlap/words1.length*100)});
        }
      }
    });
  });
  return matches.slice(0,5);
}

let GRADE_LOG = {
  '11a_math': [
    {id:'gr1', student:'Коваль Олена',    date:'01.04', grade:'11', type:'test',    comment:'Тест: межа функції. Розв\'язала всі 6 завдань без помилок.',       topic:'Межа функції'},
    {id:'gr2', student:'Мороз Василь',    date:'01.04', grade:'9',  type:'test',    comment:'Тест: межа функції. Допустив помилку у 3-му завданні.',              topic:'Межа функції'},
    {id:'gr3', student:'Лисенко Катерина',date:'01.04', grade:'10', type:'test',    comment:'Тест: межа функції. Повна відповідь, охайне оформлення.',            topic:'Межа функції'},
    {id:'gr4', student:'Бондар Максим',   date:'01.04', grade:'7',  type:'test',    comment:'Тест: межа функції. Не виконав завдання підвищеної складності.',     topic:'Межа функції'},
    {id:'gr5', student:'Ярицький Юрій',   date:'01.04', grade:'12', type:'test',    comment:'Тест: межа функції. Відмінна робота, додаткове завдання виконано.', topic:'Межа функції'},
    {id:'gr6', student:'Петренко Андрій', date:'01.04', grade:'9',  type:'test',    comment:'Тест: межа функції. Добрий результат.',                             topic:'Межа функції'},
    {id:'gr7', student:'Коваль Олена',    date:'03.04', grade:'11', type:'oral',    comment:'Усне опитування: правила диференціювання. Чітко відповіла на запитання.',topic:'Похідна'},
    {id:'gr8', student:'Ярицький Юрій',   date:'03.04', grade:'12', type:'oral',    comment:'Усне опитування: пояснив правило Лопіталя. Приклад навів самостійно.',  topic:'Похідна'},
    {id:'gr9', student:'Мороз Василь',    date:'03.04', grade:'8',  type:'hw',      comment:'Домашня робота §8 ст.112. Виконана повністю, 2 помилки в обчисленнях.',  topic:'Похідна'},
    {id:'gr10',student:'Бондар Максим',   date:'03.04', grade:'5',  type:'hw',      comment:'Домашня робота §8. Виконано лише перші 3 завдання з 8.',               topic:'Похідна'},
    {id:'gr11',student:'Лисенко Катерина',date:'07.04', grade:'11', type:'work',    comment:'Самостійна робота: інтеграл. Повне розв\'язання, без помилок.',          topic:'Інтеграл'},
    {id:'gr12',student:'Ярицький Юрій',   date:'07.04', grade:'12', type:'control', comment:'Контрольна: похідна складної функції. Бездоганна робота.',              topic:'Похідна складної функції'},
    {id:'gr13',student:'Коваль Олена',    date:'07.04', grade:'10', type:'control', comment:'Контрольна: похідна складної функції. Незначна помилка в знаку.',       topic:'Похідна складної функції'},
    {id:'gr14',student:'Бондар Максим',   date:'07.04', grade:'6',  type:'control', comment:'Контрольна: похідна складної функції. Незадовільний результат, потребує додаткових занять.',topic:'Похідна складної функції'},
    {id:'gr15',student:'Мороз Василь',    date:'07.04', grade:'9',  type:'control', comment:'Контрольна: похідна складної функції. Добрий результат.',               topic:'Похідна складної функції'},
  ],
  '11a_cs': [
    {id:'gc1', student:'Ярицький Юрій',   date:'03.04', grade:'12', type:'project', comment:'Проект: реалізація сортування на Python. Чистий код, документація, тести.',topic:'Алгоритми сортування'},
    {id:'gc2', student:'Сидоренко Іван',  date:'03.04', grade:'11', type:'project', comment:'Проект: реалізація сортування. Повна реалізація, мінімальна документація.', topic:'Алгоритми сортування'},
    {id:'gc3', student:'Коваль Олена',    date:'03.04', grade:'10', type:'project', comment:'Проект: сортування. Реалізовано 3 з 4 алгоритмів.',                        topic:'Алгоритми сортування'},
    {id:'gc4', student:'Лисенко Катерина',date:'07.04', grade:'9',  type:'test',    comment:'Тест: Big O нотація. Правильно визначила складність 7 з 10 алгоритмів.',   topic:'Big O'},
    {id:'gc5', student:'Бондар Максим',   date:'07.04', grade:'7',  type:'test',    comment:'Тест: Big O. Труднощі з рекурсивними алгоритмами.',                        topic:'Big O'},
    {id:'gc6', student:'Ярицький Юрій',   date:'07.04', grade:'12', type:'test',    comment:'Тест: Big O. Всі відповіді правильні, пояснення повні.',                   topic:'Big O'},
  ],
  '11a_ukr': [
    {id:'gu1', student:'Коваль Олена',    date:'01.04', grade:'11', type:'work',  comment:'Твір «Мова — душа народу». Виразна мова, цікаві аргументи.',  topic:'Стилістика'},
    {id:'gu2', student:'Ярицький Юрій',   date:'01.04', grade:'10', type:'work',  comment:'Твір. Добрий стиль, є незначні пунктуаційні помилки.',          topic:'Стилістика'},
    {id:'gu3', student:'Бондар Максим',   date:'01.04', grade:'6',  type:'work',  comment:'Твір не відповідає обсягу. Думки не розвинуті.',                topic:'Стилістика'},
  ],
  '11a_hist': [],
  '11a_phys': [
    {id:'gp1', student:'Ярицький Юрій',   date:'02.04', grade:'11', type:'oral',  comment:'Усне: закони Ньютона. Правильно сформулював всі три закони з прикладами.', topic:'Закони Ньютона'},
    {id:'gp2', student:'Коваль Олена',    date:'02.04', grade:'10', type:'oral',  comment:'Усне: закони Ньютона. Гарна відповідь, незначна плутанина в 3-му законі.', topic:'Закони Ньютона'},
  ],
  '10b_math':[],'10b_cs':[],'10b_ukr':[],'10b_hist':[],'10b_phys':[],
  '9v_math':[], '9v_cs':[], '9v_ukr':[], '9v_hist':[], '9v_phys':[],
};

const LESSON_DATES = {
  '11a': [
    {lid:'ld1',  sid:'math', date:'31.03', time:'08:30', room:'201',   topic:'Межа функції: повторення',           day:1},
    {lid:'ld2',  sid:'cs',   date:'31.03', time:'10:10', room:'Лаб 1', topic:'Вступ до алгоритмів',                day:1},
    {lid:'ld3',  sid:'ukr',  date:'31.03', time:'11:50', room:'105',   topic:'Синтаксис: складне речення',         day:1},
    {lid:'ld4',  sid:'hist', date:'01.04', time:'08:30', room:'302',   topic:'Передумови Другої світової',         day:2},
    {lid:'ld5',  sid:'phys', date:'01.04', time:'10:10', room:'301',   topic:'Закони Ньютона — практика',          day:2},
    {lid:'ld6',  sid:'math', date:'02.04', time:'09:20', room:'201',   topic:'Тест: межа функції',                 day:3},
    {lid:'ld7',  sid:'cs',   date:'02.04', time:'11:00', room:'Лаб 1', topic:'Алгоритми сортування',               day:3},
    {lid:'ld8',  sid:'ukr',  date:'03.04', time:'08:30', room:'105',   topic:'Стилістика наукового тексту',        day:4},
    {lid:'ld9',  sid:'phys', date:'03.04', time:'10:10', room:'301',   topic:'Рівноприскорений рух',               day:4},
    {lid:'ld10', sid:'math', date:'04.04', time:'08:30', room:'201',   topic:'Похідна: правила',                   day:5},
    {lid:'ld11', sid:'hist', date:'04.04', time:'10:10', room:'302',   topic:'Початок Другої світової',            day:5},
    {lid:'ld12', sid:'cs',   date:'07.04', time:'09:20', room:'Лаб 1', topic:'Big O нотація + тест',               day:1},
    {lid:'ld13', sid:'math', date:'07.04', time:'11:00', room:'201',   topic:'Контрольна: похідна',                day:1},
    {lid:'ld14', sid:'ukr',  date:'08.04', time:'08:30', room:'105',   topic:'Аналіз творчих робіт',               day:2},
    {lid:'ld15', sid:'phys', date:'08.04', time:'10:10', room:'301',   topic:'Задачі на рівноприскорений рух',     day:2},
    {lid:'ld16', sid:'math', date:'09.04', time:'09:20', room:'201',   topic:'Інтеграл: визначення',               day:3},
    {lid:'ld17', sid:'cs',   date:'09.04', time:'11:00', room:'Лаб 1', topic:'Рекурсія на практиці',               day:3},
  ],
};
let LESSON_ATT = {};
(()=>{
  const rnd=()=>{const r=Math.random();return r>.1?'p':r>.05?'a':'l';};
  CLS.forEach(c=>{
    const ls=LESSON_DATES[c.id]||[];
    ls.forEach(l=>c.students.forEach(s=>{LESSON_ATT[`${c.id}_${l.lid}_${s}`]=rnd();}));
  });
})();

let GRADES={};
CLS.forEach(c=>SUBS.forEach(sub=>{
  c.students.forEach(s=>{
    const entries=(GRADE_LOG[`${c.id}_${sub.id}`]||[]).filter(e=>e.student===s);
    const vals=entries.map(e=>+e.grade).filter(Boolean);
    GRADES[`${c.id}_${s}_${sub.id}`]=vals.length?String(Math.round(vals.reduce((a,b)=>a+b,0)/vals.length)):'';
  });
}));

const ATT_DATES=['31.03','01.04','02.04','03.04','04.04','07.04','08.04','09.04'];
let ATTENDANCE={};
CLS.forEach(c=>c.students.forEach(s=>ATT_DATES.forEach(d=>{
  const ls=(LESSON_DATES[c.id]||[]).filter(l=>l.date===d);
  if(!ls.length){ATTENDANCE[`${c.id}_${s}_${d}`]='p';return;}
  const vals=ls.map(l=>LESSON_ATT[`${c.id}_${l.lid}_${s}`]||'p');
  ATTENDANCE[`${c.id}_${s}_${d}`]=vals.includes('a')?'a':vals.includes('l')?'l':'p';
})));
let LESSONS={'11a':[
  {id:'l1',sid:'math',day:1,time:'08:30',room:'201',topic:'Похідна складної функції',objectives:'Навчити застосовувати правило похідної складеної функції',materials:'Підручник Мерзляка §8, картки',activities:'Мотивація 5хв, теорія 15хв, задачі 20хв, підсумок 5хв',homework:'§8 ст.112, задачі 1–5',tags:['теорія','практика']},
  {id:'l2',sid:'cs', day:1,time:'10:10',room:'Лаб 1',topic:'Алгоритм Дейкстри',objectives:'Розуміти жадібні алгоритми',materials:'Слайди, граф на дошці',activities:'Повторення 5хв, нова тема 20хв, практика 15хв, тест 5хв',homework:'Реалізувати Дейкстру на Python',tags:['алгоритми']},
  {id:'l3',sid:'hist',day:2,time:'08:30',room:'302',topic:'Передумови Другої світової',objectives:'Аналізувати геополітичну ситуацію 1930-х',materials:'Карта, документи',activities:'Перевірка ДЗ 5хв, лекція 20хв, обговорення 15хв',homework:'Скласти хронологічну таблицю 1933–1939',tags:['лекція']},
  {id:'l4',sid:'phys',day:2,time:'10:10',room:'301',topic:'Закони Ньютона',objectives:'Закріпити три закони Ньютона',materials:'Демонстраційне обладнання',activities:'Демонстрація 10хв, теорія 15хв, задачі 20хв',homework:'Задачник с.45 №1–8',tags:['закони']},
  {id:'l5',sid:'math',day:3,time:'09:20',room:'201',topic:'Інтеграл та застосування',objectives:'Обчислювати визначений інтеграл',materials:'Підручник §11',activities:'Теорія 15хв, приклади 15хв, самостійна 15хв',homework:'§11 задачі 1–6',tags:['інтеграл']},
  {id:'l6',sid:'ukr', day:4,time:'08:30',room:'105',topic:'Стилістика наукового тексту',objectives:'Відрізняти наукові стилі від публіцистичного',materials:'Дидактичні картки',activities:'Аналіз текстів 15хв, теорія 10хв, вправи 20хв',homework:'Написати есе у науковому стилі',tags:['стилі']},
  {id:'l7',sid:'phys',day:4,time:'10:10',room:'301',topic:'Рівноприскорений рух',objectives:'Виводити формули кінематики',materials:'Презентація',activities:'Демонстрація 5хв, теорія 15хв, задачі 25хв',homework:'Задачник с.52 №1–10',tags:['кінематика']},
  {id:'l8',sid:'math',day:5,time:'08:30',room:'201',topic:'Диференціальні рівняння',objectives:'Розв\'язувати прості ДР',materials:'Підручник §14',activities:'Теорія 20хв, приклади 20хв, підсумок 5хв',homework:'§14 задачі 1–4',tags:['ДР']},
]};
let MATERIALS={'11a_math':[{id:'m1',n:'Похідна — теорія.pdf',type:'pdf',size:'1.2 МБ',date:'20 бер',desc:'Теоретичний конспект'},{id:'m2',n:'Збірник задач.pdf',type:'pdf',size:'3.5 МБ',date:'22 бер',desc:'200 задач'}],'11a_cs':[{id:'m3',n:'Алгоритми — конспект.pdf',type:'pdf',size:'800 КБ',date:'18 бер',desc:''}],'11a_ukr':[{id:'m5',n:'Синтаксис — схема.pdf',type:'pdf',size:'500 КБ',date:'15 бер',desc:''}],'11a_hist':[],'11a_phys':[{id:'m6',n:'Кінематика — формули.pdf',type:'pdf',size:'900 КБ',date:'12 бер',desc:''}],'10b_math':[],'10b_cs':[],'10b_ukr':[],'10b_hist':[],'10b_phys':[],'9v_math':[],'9v_cs':[],'9v_ukr':[],'9v_hist':[],'9v_phys':[]};
let ANNOUNCEMENTS=[
  {id:'an1',title:'Вимоги до контрольних робіт',body:'Контрольні виконуються в окремих зошитах. Підпис: клас, прізвище, ім\'я, дата. Олівець не допускається.',date:'29 бер',priority:'high',classes:['11a','10b','9v']},
  {id:'an2',title:'Батьківські збори',body:'28 квітня о 18:00 — батьківські збори в актовому залі. Присутність обов\'язкова.',date:'31 бер',priority:'med',classes:['11a']},
  {id:'an3',title:'Олімпіада з математики',body:'5 квітня — шкільний тур олімпіади. Охочих прошу повідомити до 3 квітня.',date:'31 бер',priority:'low',classes:['11a','10b']},
];
let STUDENT_NOTES={};CLS.forEach(c=>c.students.forEach(s=>{STUDENT_NOTES[`${c.id}_${s}`]=[];}));
STUDENT_NOTES['11a_Коваль Олена']=[{id:'n1',text:'Активна на уроках, відмінно розв\'язує задачі. Рекомендую до олімпіади.',date:'28 бер',type:'pos'}];
STUDENT_NOTES['11a_Бондар Максим']=[{id:'n2',text:'Систематично не виконує домашні завдання. Необхідна розмова з батьками.',date:'25 бер',type:'con'}];
let STUDENT_PROFILES = {
  '11a_Ярицький Юрій':      {firstName:'Юрій',  lastName:'Ярицький',   phone:'+38 096 111 2233', momPhone:'+38 050 444 5566', email:'yuriy.yarytsky@school.ua',   photo:null, note:'Відмінник, активний учасник олімпіад'},
  '11a_Коваль Олена':       {firstName:'Олена', lastName:'Коваль',     phone:'+38 067 222 3344', momPhone:'+38 093 777 8899', email:'olena.koval@school.ua',       photo:null, note:''},
  '11a_Мороз Василь':       {firstName:'Василь',lastName:'Мороз',      phone:'+38 095 333 4455', momPhone:'+38 066 888 9900', email:'vasyl.moroz@school.ua',       photo:null, note:''},
  '11a_Лисенко Катерина':   {firstName:'Катерина',lastName:'Лисенко',  phone:'+38 073 444 5566', momPhone:'+38 050 111 2233', email:'kateryna.lysenko@school.ua',  photo:null, note:''},
  '11a_Бондар Максим':      {firstName:'Максим',lastName:'Бондар',     phone:'+38 096 555 6677', momPhone:'+38 067 222 3344', email:'maksym.bondar@school.ua',     photo:null, note:'Потребує додаткових занять'},
  '11a_Петренко Андрій':    {firstName:'Андрій',lastName:'Петренко',   phone:'+38 050 666 7788', momPhone:'+38 095 333 4455', email:'andriy.petrenko@school.ua',   photo:null, note:''},
  '11a_Сидоренко Іван':     {firstName:'Іван',  lastName:'Сидоренко',  phone:'+38 063 777 8899', momPhone:'+38 073 444 5566', email:'ivan.sydorenko@school.ua',    photo:null, note:''},
  '11a_Дяченко Роман':      {firstName:'Роман', lastName:'Дяченко',    phone:'+38 099 888 9900', momPhone:'+38 063 555 6677', email:'roman.dyachenko@school.ua',   photo:null, note:''},
  '11a_Кравченко Тетяна':   {firstName:'Тетяна',lastName:'Кравченко',  phone:'+38 066 999 0011', momPhone:'+38 099 666 7788', email:'tetyana.kravchenko@school.ua',photo:null, note:''},
  '11a_Захаренко Людмила':  {firstName:'Людмила',lastName:'Захаренко', phone:'+38 050 000 1122', momPhone:'+38 066 777 8899', email:'lyudmyla.zakharenko@school.ua',photo:null, note:''},
  '11a_Гончаренко Вікторія':{firstName:'Вікторія',lastName:'Гончаренко',phone:'+38 093 111 2233',momPhone:'+38 050 888 9900',email:'viktoria.goncharenko@school.ua',photo:null,note:''},
  '11a_Шевченко Надія':     {firstName:'Надія', lastName:'Шевченко',   phone:'+38 095 222 3344', momPhone:'+38 093 999 0011', email:'nadiya.shevchenko@school.ua', photo:null, note:''},
};
CLS.forEach(c=>c.students.forEach(s=>{
  if(!STUDENT_PROFILES[`${c.id}_${s}`]){
    const parts=s.split(' ');
    STUDENT_PROFILES[`${c.id}_${s}`]={firstName:parts[1]||'',lastName:parts[0]||'',phone:'',momPhone:'',email:'',photo:null,note:''};
  }
}));

let TEACHER_PROFILES = {
  'math': {firstName:'Марія', lastName:'Іваненко',  patronymic:'Василівна', phone:'+38 067 100 2233', email:'m.ivanenko@school.ua',     position:'Вчитель математики',     cabinet:'201', experience:'14 років', photo:null},
  'ukr':  {firstName:'Оксана',lastName:'Петренко',  patronymic:'Сергіївна', phone:'+38 050 200 3344', email:'o.petrenko@school.ua',      position:'Вчитель укр. мови та літ.',cabinet:'105',experience:'9 років', photo:null},
  'hist': {firstName:'Роман', lastName:'Коваленко',  patronymic:'Іванович',  phone:'+38 093 300 4455', email:'r.kovalenko@school.ua',     position:'Вчитель історії',        cabinet:'302', experience:'11 років',photo:null},
  'cs':   {firstName:'Василь',lastName:'Сидоренко', patronymic:'Миколайович',phone:'+38 066 400 5566', email:'v.sydorenko@school.ua',     position:'Вчитель інформатики',    cabinet:'Лаб 1',experience:'7 років',photo:null},
  'phys': {firstName:'Тетяна',lastName:'Шевченко',  patronymic:'Олексіївна',phone:'+38 063 500 6677', email:'t.shevchenko@school.ua',    position:'Вчитель фізики',         cabinet:'301', experience:'16 років',photo:null},
};

const TEACHER_SUBJECT_ID = 'math';

let TASKS=[
  {id:'t1',text:'Підготувати план уроку на 7 квітня',done:false,priority:'high',due:'06.04'},
  {id:'t2',text:'Перевірити контрольні 10-Б',done:false,priority:'high',due:'04.04'},
  {id:'t3',text:'Заповнити журнал за березень',done:true,priority:'med',due:'31.03'},
  {id:'t4',text:'Надіслати звіт завучу',done:false,priority:'med',due:'05.04'},
];
let AI_CHECKS=[];
const DAY_N=['','Понеділок','Вівторок','Середа','Четвер','П\'ятниця','Субота','Неділя'];
const DAY_S=['','Пн','Вт','Ср','Чт','Пт','Сб','Нд'];
