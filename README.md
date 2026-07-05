# NoteHub

React + TypeScript застосунок для роботи з нотатками через публічний бекенд NoteHub API.

## Можливості

- отримання токена через email (`POST /auth`)
- завантаження нотаток (`GET /notes`)
- пошук нотаток по тексту (`search` query param)
- створення нотатки (`POST /notes`)
- видалення нотатки (`DELETE /notes/:id`)

## Налаштування токена (без хардкоду)

1. Створіть `.env` на основі `.env.example`.
2. Вкажіть свій токен у змінній:

```env
VITE_NOTEHUB_TOKEN=your_jwt_token
```

3. Перезапустіть dev-сервер після зміни env.

Токен для запитів бекенд очікує у заголовку:

```txt
Authorization: Bearer <token>
```

Після створення токена через `POST /auth` у вашу колекцію автоматично додаються 40 тестових нотаток.

## Запуск

```bash
npm install
npm run dev
```

## Збірка

```bash
npm run build
```
