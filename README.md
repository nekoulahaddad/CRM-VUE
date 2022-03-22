# td-csk-crm

> TD-CSK CRM

## Ручное обновление приложения на production сервере

```bash
# Перейти в директорию проекта
$ cd /var/www/td-csk-crm/

# На сервере стянуть проект в ветку main
$ git pull origin main

# Установить зависимости в корне проекта 
$ npm install

# Перейти в директорию server установить зависимости и вернуться в корень проекта 
$ cd server && npm install && cd ..

# Запустить сборку приложения 
$ npm run build

# Перезапустить приложения
$ pm2 reload csk_crm
```
