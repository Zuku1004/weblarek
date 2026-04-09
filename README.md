# Проектная работа «Веб-ларёк»

Стек: HTML, SCSS, TypeScript, Vite

## О проекте

«Веб-ларёк» — интернет-магазин с товарами для веб-разработчиков. Пользователь может просматривать каталог товаров, добавлять их в корзину и оформлять заказ с выбором способа оплаты и указанием контактных данных.

## Структура проекта

- `src/` — исходные файлы проекта
- `src/components/` — компоненты приложения
- `src/components/base/` — базовые классы (Api, EventEmitter, Component)
- `src/components/models/` — классы моделей данных
- `src/types/index.ts` — все интерфейсы и типы
- `src/main.ts` — точка входа приложения
- `src/utils/constants.ts` — константы (URL сервера)
- `src/utils/utils.ts` — вспомогательные утилиты

## Установка и запуск

Создайте файл `.env` в корне проекта:
```
VITE_API_ORIGIN=https://larek-api.nomoreparties.co
```

Затем выполните:
```
npm install
npm run dev
```

Сборка для продакшена:
```
npm run build
```

---

## Архитектура приложения

Приложение построено по паттерну **MVP (Model-View-Presenter)**:

- **Model** — классы для хранения и управления данными (`CatalogModel`, `CartModel`, `CustomerModel`). Не знают об отображении.
- **View** — компоненты для работы с DOM (будут реализованы во второй части).
- **Presenter** — связующее звено между Model и View через систему событий (EventEmitter).

Взаимодействие между слоями организовано через событийно-ориентированный подход: модели и представления генерируют события, презентер подписывается на них и координирует обновления.

---

## Базовые классы

### Класс `Api`

Базовый класс для HTTP-запросов к серверу.

**Конструктор:**
`constructor(baseUrl: string, options: RequestInit = {})` — принимает базовый URL сервера и опциональный объект с заголовками.

**Поля:**
- `baseUrl: string` — базовый адрес сервера
- `options: RequestInit` — настройки запросов (заголовки и пр.)

**Методы:**
- `get<T>(uri: string): Promise<T>` — выполняет GET-запрос к указанному эндпоинту
- `post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>` — выполняет POST/PUT/DELETE запрос с телом в JSON
- `handleResponse<T>(response: Response): Promise<T>` — обрабатывает ответ сервера, возвращает данные или отклоняет промис при ошибке

### Класс `EventEmitter`

Реализует паттерн «Наблюдатель» для организации событийного взаимодействия между частями приложения.

**Конструктор:** без параметров.

**Поля:**
- `_events: Map<EventName, Set<Subscriber>>` — коллекция подписок: ключ — имя события, значение — набор обработчиков

**Методы:**
- `on<T>(event: EventName, callback: (data: T) => void): void` — подписка на событие
- `off(event: EventName, callback: Subscriber): void` — отписка от события
- `emit<T>(event: string, data?: T): void` — инициирует событие с передачей данных
- `onAll(callback: (event: EmitterEvent) => void): void` — подписка на все события
- `offAll(): void` — снятие всех подписок
- `trigger<T>(event: string, context?: Partial<T>): (data: T) => void` — возвращает функцию-триггер для инициации события

### Класс `Component<T>`

Абстрактный базовый класс для всех UI-компонентов.

**Конструктор:**
`constructor(container: HTMLElement)` — принимает корневой DOM-элемент компонента.

**Методы:**
- `render(data?: Partial<T>): HTMLElement` — записывает данные в поля компонента и возвращает корневой элемент
- `setImage(element: HTMLImageElement, src: string, alt?: string): void` — устанавливает `src` и `alt` для изображения

---

## Типы данных (`src/types/index.ts`)

### `TPayment`
```ts
type TPayment = 'card' | 'cash';
```
Допустимые способы оплаты заказа.

### `IProduct`
```ts
interface IProduct {
  id: string;          // уникальный идентификатор товара
  description: string; // описание
  image: string;       // ссылка на изображение
  title: string;       // название
  category: string;    // категория
  price: number | null;// цена (null — бесценный/недоступный товар)
}
```

### `IBuyer`
```ts
interface IBuyer {
  payment: TPayment; // способ оплаты
  email: string;     // электронная почта
  phone: string;     // телефон
  address: string;   // адрес доставки
}
```

### `TValidationErrors`
```ts
type TValidationErrors = Partial<Record<keyof IBuyer, string>>;
```
Объект ошибок валидации: ключ — поле с ошибкой, значение — текст ошибки.

### `IProductListResponse`
```ts
interface IProductListResponse {
  total: number;
  items: IProduct[];
}
```
Ответ сервера на запрос каталога.

### `IOrderRequest`
```ts
interface IOrderRequest extends IBuyer {
  items: string[];  // массив ID товаров
  total: number;    // итоговая сумма
}
```
Данные, отправляемые на сервер при оформлении заказа.

### `IOrderConfirmation`
```ts
interface IOrderConfirmation {
  id: string;    // ID созданного заказа
  total: number; // подтверждённая сумма
}
```
Ответ сервера после успешного оформления заказа.

---

## Модели данных (`src/components/models/`)

### Класс `CatalogModel`

Отвечает за хранение и управление каталогом товаров магазина.

**Конструктор:** `constructor()` — инициализирует пустой каталог.

**Поля:**
- `_catalog: IProduct[]` — массив всех товаров, полученных с сервера
- `_selectedItem: IProduct | null` — товар, выбранный пользователем для детального просмотра

**Методы:**
- `loadProducts(products: IProduct[]): void` — сохраняет массив товаров в каталог
- `getAllProducts(): IProduct[]` — возвращает полный список товаров
- `findById(id: string): IProduct | undefined` — ищет и возвращает товар по ID
- `selectItem(product: IProduct): void` — устанавливает выбранный товар для просмотра
- `getSelectedItem(): IProduct | null` — возвращает текущий выбранный товар

---

### Класс `CartModel`

Управляет списком товаров, добавленных пользователем в корзину.

**Конструктор:** `constructor()` — инициализирует пустую корзину.

**Поля:**
- `_cartItems: IProduct[]` — массив товаров, находящихся в корзине

**Методы:**
- `getCartItems(): IProduct[]` — возвращает список товаров в корзине
- `addToCart(product: IProduct): void` — добавляет товар в корзину
- `deleteFromCart(productId: string): void` — удаляет товар из корзины по ID
- `emptyCart(): void` — полностью очищает корзину
- `calculateTotal(): number` — вычисляет суммарную стоимость товаров (null-цены игнорируются)
- `getItemCount(): number` — возвращает количество товаров в корзине
- `hasItem(productId: string): boolean` — проверяет наличие товара по ID

---

### Класс `CustomerModel`

Хранит данные покупателя, введённые в форме оформления заказа, и выполняет их валидацию.

**Конструктор:** `constructor()` — инициализирует все поля пустыми значениями.

**Поля:**
- `_paymentMethod: TPayment | ''` — выбранный способ оплаты
- `_deliveryAddress: string` — адрес доставки
- `_customerEmail: string` — электронная почта
- `_customerPhone: string` — номер телефона

**Методы:**
- `updateField(field: keyof IBuyer, value: string): void` — обновляет одно конкретное поле модели, не затрагивая остальные
- `getBuyerData(): IBuyer` — возвращает объект со всеми данными покупателя
- `resetData(): void` — сбрасывает все поля в пустые значения
- `checkValidity(): TValidationErrors` — проверяет валидность полей и возвращает объект ошибок. Если поле пустое — добавляется соответствующая ошибка. Пример результата: `{ payment: 'Не выбран способ оплаты', phone: 'Укажите номер телефона' }`

---

## Слой коммуникации

### Класс `ShopApi`

Наследует базовый класс `Api`. Инкапсулирует логику работы с конкретными эндпоинтами сервера Web-Ларёк. Принимает экземпляр `Api` через наследование, обеспечивая инверсию зависимостей.

**Конструктор:**
`constructor(cdnBase: string, baseUrl: string, options?: RequestInit)`
- `cdnBase` — базовый URL для формирования полных путей к изображениям
- `baseUrl` — базовый URL API сервера
- `options` — дополнительные параметры HTTP-запросов

**Поля:**
- `_cdnBase: string` — хранит CDN-адрес для склейки с путями изображений товаров

**Методы:**
- `fetchProducts(): Promise<IProduct[]>` — делает GET-запрос на `/product/`, возвращает массив товаров с полными URL изображений
- `submitOrder(orderData: IOrderRequest): Promise<IOrderConfirmation>` — делает POST-запрос на `/order/` с данными заказа, возвращает подтверждение с ID и суммой
