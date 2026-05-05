# Деплой на Netlify

Покрокова інструкція щоб запустити сайт онлайн з повністю працюючим AI.

## Що ти отримаєш

Після деплою:
- Постійне посилання типу `osvita-yarytskyi.netlify.app`
- AI-генерація завдань через Claude API працює
- Перевірка на AI працює реально через API
- HTTPS, мобільна версія, все безкоштовно

---

## Що тобі знадобиться (10–15 хвилин)

1. **GitHub аккаунт** — https://github.com (безкоштовно, 2 хв реєстрація)
2. **Netlify аккаунт** — https://netlify.com (безкоштовно, можна через GitHub)
3. **Anthropic API ключ** — https://console.anthropic.com (потрібно поповнити баланс ~$5)

---

## Крок 1. Завантажити проект на GitHub

### Варіант А: Через сайт GitHub (без терміналу)

1. Зайди на https://github.com та натисни **+** → **New repository**
2. Назви репозиторій `osvita-app`, постав **Public**
3. Натисни **Create repository**
4. На наступній сторінці натисни **uploading an existing file**
5. Перетягни ВСІ файли і папки з папки `osvita-app/` (НЕ саму папку — її вміст)
6. Натисни **Commit changes**

### Варіант Б: Через Git (якщо знаєш як)

```bash
cd osvita-app
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ТВІЙ_USERNAME/osvita-app.git
git push -u origin main
```

---

## Крок 2. Підключити до Netlify

1. Зайди на https://app.netlify.com (увійди через GitHub)
2. Натисни **Add new site** → **Import an existing project**
3. Натисни **Deploy with GitHub** → авторизуй
4. Знайди свій репозиторій `osvita-app` зі списку
5. Налаштування лиш як є (Netlify прочитає `netlify.toml` автоматично):
   - **Build command:** залишити порожнім
   - **Publish directory:** `src`
6. Натисни **Deploy osvita-app**

Зачекай 30-60 секунд. Сайт задеплоїться.

---

## Крок 3. Додати API ключ Anthropic

1. На https://console.anthropic.com → **API Keys** → **Create Key**
2. Скопіюй ключ (виглядає як `sk-ant-api03-XXXXXXX...`)
3. На https://console.anthropic.com → **Plans & Billing** → пополни баланс мінімум на $5

Тепер у Netlify:

1. Відкрий свій сайт у Netlify Dashboard
2. **Site configuration** → **Environment variables**
3. **Add a variable** → **Add a single variable**:
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** твій ключ з Anthropic
4. Натисни **Create variable**

---

## Крок 4. Перезапустити деплой

Щоб Netlify підхопив новий API ключ:

1. **Deploys** → **Trigger deploy** → **Deploy site**

Чекай 30 секунд. Готово.

---

## Крок 5. Змінити назву сайту (необовʼязково)

1. **Site configuration** → **Site details** → **Change site name**
2. Введи бажану назву, наприклад `osvita-yarytskyi`
3. Тепер URL: `osvita-yarytskyi.netlify.app`

---

## Перевірка що все працює

1. Відкрий свій URL
2. Увійди як **Teacher** (логін `Teacher`, будь-який пароль)
3. Зайди в **AI checker** → встав текст → натисни **Запустити перевірку**
4. Якщо побачиш «Локальний аналіз» — означає API ще не підключено (перевір змінну `ANTHROPIC_API_KEY`)
5. Якщо побачиш повний результат без банера про fallback — все працює

---

## Витрати

- Netlify — безкоштовно (100GB трафіку/міс, безкоштовний домен `.netlify.app`)
- GitHub — безкоштовно для публічних репо
- Anthropic API — за використання:
  - Одна перевірка тексту ≈ $0.005
  - Одна генерація 5 питань ≈ $0.01
  - $5 вистачить на ~500-1000 операцій

---

## Якщо щось не працює

**Білд впав:** перевір що завантажив папки `src/`, `netlify/functions/`, файли `netlify.toml` і `package.json` в корені репозиторію.

**API не працює:** перевір що змінна `ANTHROPIC_API_KEY` додана і зроблено новий деплой ПІСЛЯ її додавання.

**404 на функції:** перевір що в Netlify в розділі **Functions** видно функцію `claude`.

