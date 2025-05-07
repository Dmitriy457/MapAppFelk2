# Инструкция по установке

**Основные требования:**

- Node.js
- Expo CLI
- Приложение Expo Go на смартфоне



**Установка и запуск:**

1. ```shell
   git clone https://github.com/Dmitriy457/MapAppFelk2.git
   cd MapAppFelk2
   ```

2. ```shell
   npx expo install expo-image
   npx expo install expo-image-picker
   npx expo install react-native-maps
   npx expo install expo-sqlite
   ```

3. ```shell
   npx expo start
   ```

4. Просканируйте появившийся QR-код через приложение Expo Go

5. Готово!

   

# База данных

```sqlite
-- Таблица маркеров
CREATE TABLE IF NOT EXISTS markers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Таблица изображений
CREATE TABLE IF NOT EXISTS marker_images (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	marker_id INTEGER NOT NULL,
	uri TEXT NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (marker_id) REFERENCES markers (id) ON DELETE CASCADE
);
```

Реализованные операции с базой данных:

- Инициализация базы данных
- Добавление маркера
- Удаление маркера
- Получение всех данных
- Добавление изображения
- Удаление изображения (в том числе при удалении маркера)
- Получение всех изображений для маркера



# Обработка ошибок

Для всех операций с базой данных предусмотрена обработка ошибок, а также вывод дополнительной отладочной информации в консоль для отслеживания успешности выполнения операций. Пример:

```typescript
// Добавление маркера в базу данных
const addMarker = async (latitude: number, longitude: number): Promise<number> => {
	if (!db) { // проверяем, инициализирована ли база данных
		throw new Error('База данных не инициализирована');
	}
    try {
      	const result = await db.runAsync(
        	'INSERT INTO markers (latitude, longitude) VALUES (?, ?)', // добавляем маркер в базу данных
        	[latitude, longitude]
      );
      console.log(`Маркер добавлен: id=${result.lastInsertRowId}, latitude=${latitude}, longitude=${longitude}`);
      return result.lastInsertRowId; // возвращаем id добавленного маркера
    } catch (error) {
      	throw new Error(`Не удалось добавить маркер: ${error}`);
    }
};
```





# Видео работы приложения

https://github.com/user-attachments/assets/dbf78c0e-851c-4370-b098-353471ab76da

