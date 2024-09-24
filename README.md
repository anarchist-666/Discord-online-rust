# Discord-online-rust
Виджет для дискорда показывающий онлайн на серверах по игре RUST
# Функциональные возможности:
- Получение статуса сервера Rust через [GameDig](https://www.npmjs.com/package/gamedig).
- Автоматическая отправка сообщения о текущем количестве игроков на сервере в Discord.
- Редактирование существующего сообщения при обновлении статуса, а не создание новых сообщений.
- Сохранение ссылки на отправленное сообщение в файл `data.json`.
- Возможность отправки сообщения, если сервер недоступен или отключен.

## Требования

- Node.js
- Discord Bot Token
- Канал Discord, в который бот будет отправлять сообщения

## Установка

1. Склонируйте репозиторий:
    ```bash
    git clone https://github.com/anarchist-666/Discord-online-rust.git
    cd Discord-online-rust
    ```

2. Установите зависимости:
    ```bash
    npm install
    ```

3. Настройте файл `config.json` с данными о вашем сервере и боте:
    ```json
    {
    "token": "Токен бота",
    "channelId": "ID канала",
    "server": {
      "ip": "ip адркс",
      "queryPort": 666
    },
    "updateInterval": 60
    }
    ```

4. Настройте файлы конфигураций для сообщений:
    - **MessageOnlineConfig.json**:
    ```json
    {
    "content": null,
    "embeds": [
      {
        "title": "Крутой сервер",
        "description": "Онлайн {serverStatus.players}/{serverStatus.maxPlayers}",
        "color": null
      }
    ],
    "components": [
      {
        "type": 1,
        "components": [
          {
            "type": 2,
            "label": "Крутая группа вк",
            "style": 5,
            "url": "https://vk.com",
            "emoji": null
          }
        ]
      }
    ],
    "attachments": []
    }
    ```

    - **MessageOffOnlineConfig.json**:
    ```json
    {
    "content": null,
    "embeds": [
      {
        "title": "Крутой сервер",
        "description": "Выключен", 
        "color": null
      }
    ],
    "components": [],
    "attachments": []
    }
    ```

5. Запустите бота:
    ```bash
    node bot.js
    ```

## Использование

- Бот автоматически отправит сообщение с текущим количеством игроков на сервере Rust при запуске.
- Если сервер оффлайн или бот не может получить статус, сообщение будет обновлено информацией об оффлайн статусе.
- Все изменения статуса (онлайн или оффлайн) обновляются в одном и том же сообщении.

## Параметры для сообщения

| Параметр                      | Описание                          |
|-------------------------------|------------------------------------|
| `{serverStatus.maxPlayers}`    | Максимальное количество игроков, которые могут подключиться к серверу. |
| `{serverStatus.players}`       | Текущее количество игроков, находящихся онлайн на сервере. |

## Скриншоты

### 1. Сообщение, когда сервер онлайн:
![Online Message](https://via.placeholder.com/800x400?text=Online+Server+Message)

### 2. Сообщение, когда сервер оффлайн:
![Offline Message](https://via.placeholder.com/800x400?text=Offline+Server+Message)
