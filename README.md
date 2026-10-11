# Wave Forge — Backend API
## Описание
Backend-часть **Wave Forge** — веб-платформы для продажи музыкальных паков семпло. Сервер отвечает за бизнес-логику приложения, взаимодействие с базой данных, обработку заказов, интеграцию с платёжной системой и предоставление доступа к цифровым товарам.

## Стек

* **NestJS** — серверный фреймворк и модульная архитектура.

* **TypeScript** — типизация и повышение надёжности кода.

* **PostgreSQL** — реляционная база данных.

* **Prisma** — работа с базой данных и управление схемой.

* **YooKassa** — интеграция с платёжной системой.

* **Yandex Object Storage** — хранение цифровых файлов.

## Установка

## Установка

```
npm install
npx prisma generate
npm run start:dev
```

Создайте файл `.env` в корне проекта и укажите необходимые параметры подключения к базе данных и внешним сервисам.

Пример конфигурации:

```
DATABASE_URL=
ADMIN_API_KEY=

SHOP_ID=
YOOCASSA_SECRET_KEY=

YANDEX_STORAGE_ACCESS_KEY=
YANDEX_STORAGE_SECRET_KEY=

YANDEX_POSTBOX_ACCESS_KEY=
YANDEX_POSTBOX_SECRET_KEY=

MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASSWORD=

DOWNLOAD_URL=
```

Перед запуском настройте переменные окружения для базы данных, Yandex Object Storage, почты и платёжного сервиса.


