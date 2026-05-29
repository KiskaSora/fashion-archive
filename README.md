# ✦ Digital Fashion Archive

Личный fashion-space: Pinterest + digital wardrobe + moodboard + outfit builder.

## Стек

- **React 18** + **Vite**
- Чистый CSS (glassmorphism, y2k / coquette aesthetic)
- Без лишних зависимостей

## Запуск

```bash
npm install
npm run dev
```

Откроется на `http://localhost:5173`

## Деплой на Vercel

1. Загрузи папку на GitHub
2. Зайди на [vercel.com](https://vercel.com) → New Project → импортируй репозиторий
3. Framework Preset: **Vite** — Vercel определит автоматически
4. Нажми Deploy ✦

## Структура

```
fashion-archive/
├── index.html          ← точка входа
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx        ← рендер React
    ├── App.jsx         ← весь UI: Archive, Outfit Builder, Moodboard
    └── index.css       ← стили
```

## Что есть

| Раздел | Функции |
|--------|---------|
| **Archive** | Masonry grid · Поиск · Фильтры по категории/стилю/полу · Избранное · Карточка вещи · Добавление |
| **Outfit Builder** | Drag & drop холст · Масштаб · Поворот · Удаление |
| **Moodboard** | Свободное размещение картинок · Изменение размера |

## Дальнейшее развитие (Этапы 2–5 из плана)

- [ ] Supabase — сохранение данных в облаке
- [ ] Загрузка фото с устройства (File API → Supabase Storage)
- [ ] Удаление фона (remove.bg API или @imgly/background-removal)
- [ ] Сохранение outfit'ов
- [ ] AI random outfit / подбор по цвету
- [ ] Авторизация (Supabase Auth)
