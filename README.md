Проектная работа "Веб-ларек"
Стек: HTML, SCSS, TS, Vite
Структура проекта:

src/ — исходные файлы проекта
src/components/ — папка с JS компонентами
src/components/base/ — папка с базовым кодом
src/components/models/ — модели данных
src/components/view/ — компоненты представления

Важные файлы:

index.html — HTML-файл главной страницы
src/types/index.ts — файл с типами
src/main.ts — точка входа приложения и презентер
src/scss/styles.scss — корневой файл стилей
src/utils/constants.ts — файл с константами
src/utils/utils.ts — файл с утилитами

Установка и запуск
Для установки и запуска проекта необходимо выполнить команды
npm install
npm run dev
или
yarn
yarn dev
Сборка
npm run build
или
yarn build

Интернет-магазин «Веб-ларёк»
Веб-ларёк — небольшой интернет-магазин для веб-разработчиков. Здесь можно листать каталог товаров, класть понравившееся в корзину и оформлять заказ. Проект учебный, сделан в рамках курса.
Архитектура приложения
Проект построен по паттерну MVP (Model-View-Presenter).
Идея в том, чтобы разделить три разные зоны ответственности:
Model — знает только про данные. Хранит товары, корзину, данные покупателя. Ничего не знает про то, как это выглядит на экране.
View — знает только про отображение. Рисует карточки, модальные окна, формы. Ничего не знает про бизнес-логику.
Presenter — связывает Model и View. Слушает события от обоих и решает что делать дальше. Реализован в src/main.ts.
Слои общаются через EventEmitter — брокер событий. Благодаря этому они не зависят друг от друга напрямую.

Базовый код
Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной T тип данных, которые могут быть переданы в метод render для отображения.
Конструктор:
constructor(container: HTMLElement) - принимает ссылку на DOM элемент за отображение, которого он отвечает.
Поля класса:
container: HTMLElement - поле для хранения корневого DOM элемента компонента.
Методы класса:
render(data?: Partial<T>): HTMLElement - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент.
setImage(element: HTMLImageElement, src: string, alt?: string): void - утилитарный метод для модификации DOM-элементов <img>
Класс Api
Содержит в себе базовую логику отправки запросов.
Конструктор:
constructor(baseUrl: string, options: RequestInit = {}) - принимает базовый адрес сервера и опциональный объект с заголовками запросов.
Поля класса:
baseUrl: string - базовый адрес сервера
options: RequestInit - объект с заголовками, которые будут использованы для запросов.
Методы:
get(uri: string): Promise<object> - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object> - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода.
handleResponse(response: Response): Promise<object> - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.
Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.
Конструктор класса не принимает параметров.
Поля класса:
_events: Map<string | RegExp, Set<Function>> - хранит коллекцию подписок на события.
Методы класса:
on<T extends object>(event: EventName, callback: (data: T) => void): void - подписка на событие.
emit<T extends object>(event: string, data?: T): void - инициализация события.
trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void - возвращает функцию, при вызове которой инициализируется требуемое событие.

Типы данных
Все типы лежат в src/types/index.ts.
TPayment
tstype TPayment = 'card' | 'cash';
Два возможных способа оплаты: картой или наличными.
IProduct
tsinterface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
Описывает один товар из каталога. Если price равен null — товар нельзя купить.
IBuyer
tsinterface IBuyer {
  payment: TPayment | '';
  email: string;
  phone: string;
  address: string;
}
Данные покупателя, которые он заполняет при оформлении заказа.
TValidationErrors
tstype TValidationErrors = Partial<Record<keyof IBuyer, string>>;
Объект с ошибками валидации. Ключ — название поля, значение — текст ошибки.
IProductListResponse
tsinterface IProductListResponse {
  total: number;
  items: IProduct[];
}
То, что возвращает сервер на запрос каталога товаров.
IOrderRequest
tsinterface IOrderRequest extends IBuyer {
  items: string[];
  total: number;
}
Данные заказа, которые отправляются на сервер.
IOrderConfirmation
tsinterface IOrderConfirmation {
  id: string;
  total: number;
}
Ответ сервера после успешного оформления заказа.

Модели данных
CatalogModel
Хранит список всех товаров магазина и отслеживает какой товар сейчас открыт для просмотра. При изменении данных генерирует события через брокер.
Конструктор: constructor(events: IEvents) — принимает брокер событий.
Поля:

_catalog: IProduct[] — все товары, загруженные с сервера
_selectedItem: IProduct | null — товар, открытый в данный момент
events: IEvents — брокер событий

Методы:
МетодЧто делаетloadProducts(products: IProduct[]): voidСохраняет товары и генерирует событие catalog:updatedgetAllProducts(): IProduct[]Отдаёт весь список товаровfindById(id: string): IProduct | undefinedИщет товар по IDselectItem(product: IProduct): voidЗапоминает товар и генерирует событие item:selectedgetSelectedItem(): IProduct | nullВозвращает текущий открытый товар

CartModel
Отвечает за корзину — хранит товары которые пользователь собирается купить.
Конструктор: constructor(events: IEvents) — принимает брокер событий.
Поля:

_cartItems: IProduct[] — товары в корзине
events: IEvents — брокер событий

Методы:
МетодЧто делаетgetCartItems(): IProduct[]Возвращает список товаров в корзинеaddToCart(product: IProduct): voidДобавляет товар и генерирует событие cart:changeddeleteFromCart(productId: string): voidУдаляет товар и генерирует событие cart:changedemptyCart(): voidОчищает корзину и генерирует событие cart:changedcalculateTotal(): numberСчитает итоговую суммуgetItemCount(): numberВозвращает количество товаровhasItem(productId: string): booleanПроверяет есть ли товар в корзине

CustomerModel
Хранит данные покупателя и проверяет правильность заполнения формы.
Конструктор: constructor(events: IEvents) — принимает брокер событий.
Поля:

_paymentMethod: TPayment | '' — выбранный способ оплаты
_deliveryAddress: string — адрес доставки
_customerEmail: string — электронная почта
_customerPhone: string — номер телефона
events: IEvents — брокер событий

Методы:
МетодЧто делаетupdateField(field: keyof IBuyer, value: string): voidОбновляет одно поле и генерирует событие customer:changedgetBuyerData(): IBuyerВозвращает все данные покупателяresetData(): voidСбрасывает все поля и генерирует событие customer:changedcheckValidity(): TValidationErrorsПроверяет поля и возвращает объект с ошибками

Слой коммуникации
ShopApi
Класс для работы с API сервера. Использует композицию — принимает экземпляр Api в конструктор.
Конструктор:
constructor(cdnBase: string, api: IApi)

cdnBase — адрес CDN для формирования полного пути к картинкам товаров
api — экземпляр класса реализующего интерфейс IApi

Поля:

_cdnBase: string — CDN-адрес для картинок
_api: IApi — экземпляр Api для выполнения запросов

Методы:

fetchProducts(): Promise<IProduct[]> — загружает список товаров с сервера (GET /product/), дополняет пути к картинкам
submitOrder(orderData: IOrderRequest): Promise<IOrderConfirmation> — отправляет оформленный заказ на сервер (POST /order/), возвращает подтверждение


Слой представления (View)
Базовые классы представления
CardBase
Базовый класс для всех карточек товара. Содержит общую логику отображения названия и цены. Все карточки наследуются от него.
Конструктор: constructor(container: HTMLElement) — принимает DOM-элемент карточки.
Поля:

_title: HTMLElement — элемент с названием товара
_price: HTMLElement — элемент с ценой товара

Сеттеры:

set title(value: string) — устанавливает название
set price(value: number | null) — устанавливает цену (null отображается как «Бесценно»)


FormBase
Базовый класс для форм оформления заказа. Управляет кнопкой отправки и отображением ошибок.
Конструктор: constructor(container: HTMLElement) — принимает DOM-элемент формы.
Поля:

_form: HTMLFormElement — элемент формы
_submitButton: HTMLButtonElement — кнопка отправки
_errorsContainer: HTMLElement — контейнер для ошибок

Сеттеры:

set valid(value: boolean) — активирует или деактивирует кнопку отправки
set errors(value: string) — отображает текст ошибки


Компоненты карточек
CardCatalog
Карточка товара для отображения в каталоге на главной странице. Наследует CardBase.
Конструктор: constructor(container: HTMLElement, onClick?: () => void) — принимает элемент и обработчик клика по карточке.
Поля:

_category: HTMLElement — элемент категории товара
_image: HTMLImageElement — изображение товара

Сеттеры:

set category(value: string) — устанавливает категорию и CSS-модификатор цвета
set image(value: string) — устанавливает изображение


CardPreview
Карточка товара для детального просмотра в модальном окне. Наследует CardBase.
Конструктор: constructor(container: HTMLElement, onButtonClick?: () => void) — принимает элемент и обработчик клика по кнопке действия.
Поля:

_category: HTMLElement — категория товара
_image: HTMLImageElement — изображение товара
_description: HTMLElement — описание товара
_actionButton: HTMLButtonElement — кнопка «В корзину» / «Убрать» / «Недоступно»

Сеттеры:

set category(value: string) — категория с CSS-модификатором
set image(value: string) — изображение
set description(value: string) — описание
set buttonText(value: string) — текст кнопки
set buttonDisabled(value: boolean) — блокирует кнопку


CardCart
Карточка товара внутри корзины. Наследует CardBase.
Конструктор: constructor(container: HTMLElement, onRemove?: () => void) — принимает элемент и обработчик удаления.
Поля:

_index: HTMLElement — порядковый номер товара в корзине
_removeButton: HTMLButtonElement — кнопка удаления

Сеттеры:

set index(value: number) — устанавливает порядковый номер


Компоненты страницы
HeaderView
Компонент шапки сайта. Управляет счётчиком корзины в шапке и кнопкой открытия корзины.

_cartCounter: HTMLElement — счётчик товаров в корзине
_cartButton: HTMLButtonElement — кнопка открытия корзины

Сеттеры:

set counter(value: number) — обновляет счётчик

Генерирует событие: cart:open — при клике на иконку корзины.

CatalogView
Компонент отображения каталога товаров на главной странице.
Конструктор: constructor(container: HTMLElement) — принимает контейнер.
Поля:

_catalogContainer: HTMLElement — контейнер для карточек

Сеттеры:

set items(items: HTMLElement[]) — заменяет содержимое каталога


ModalView
Компонент модального окна. Не может иметь дочерних классов — содержимое передаётся снаружи.
Конструктор: constructor(container: HTMLElement, events: IEvents) — принимает контейнер и брокер событий.
Поля:

_closeBtn: HTMLButtonElement — кнопка закрытия
_modalContent: HTMLElement — контейнер содержимого
_modalWrapper: HTMLElement — обёртка модального окна

Методы:

open(): void — открывает модальное окно (добавляет класс modal_active)
close(): void — закрывает и очищает содержимое
render(data: { content: HTMLElement }): HTMLElement — устанавливает содержимое и открывает окно


CartView
Компонент отображения корзины покупок.
Конструктор: constructor(container: HTMLElement, events: IEvents) — принимает контейнер и брокер событий.
Поля:

_itemsList: HTMLElement — список товаров
_totalPrice: HTMLElement — итоговая сумма
_checkoutButton: HTMLButtonElement — кнопка оформления

Сеттеры:

set items(items: HTMLElement[]) — обновляет список товаров
set total(value: number) — обновляет итоговую сумму
set disabled(value: boolean) — блокирует кнопку оформления

Генерирует событие: checkout:start — при клике на кнопку оформления.

Компоненты форм
DeliveryForm
Форма первого шага оформления заказа. Наследует FormBase. Содержит выбор способа оплаты и ввод адреса.
Конструктор: constructor(container: HTMLFormElement, events: IEvents) — принимает форму и брокер событий.
Поля:

_cardPayBtn: HTMLButtonElement — кнопка оплаты картой
_cashPayBtn: HTMLButtonElement — кнопка оплаты наличными
_addressInput: HTMLInputElement — поле адреса доставки

Сеттеры:

set payment(value: string) — подсвечивает активный способ оплаты
set address(value: string) — устанавливает значение поля адреса

Генерирует события:

delivery:paymentSelected — при выборе способа оплаты
delivery:addressChanged — при вводе адреса
delivery:submit — при отправке формы


ContactsForm
Форма второго шага оформления заказа. Наследует FormBase. Содержит поля email и телефона.
Конструктор: constructor(container: HTMLFormElement, events: IEvents) — принимает форму и брокер событий.
Поля:

_emailInput: HTMLInputElement — поле email
_phoneInput: HTMLInputElement — поле телефона

Сеттеры:

set email(value: string) — устанавливает значение email
set phone(value: string) — устанавливает значение телефона

Генерирует события:

contacts:emailChanged — при вводе email
contacts:phoneChanged — при вводе телефона
contacts:submit — при отправке формы


SuccessView
Компонент экрана успешного оформления заказа.
Конструктор: constructor(container: HTMLElement, events: IEvents)  принимает контейнер и брокер событий.
Поля:

_description: HTMLElement — текст с итоговой суммой
_closeButton: HTMLButtonElement — кнопка закрытия

Сеттеры:

set total(value: number) - устанавливает списанную сумму

Генерирует событие: success:close — при клике на кнопку закрытия.

Презентер
Презентер реализован в src/main.ts. Он создаёт все экземпляры классов и подписывается на события от моделей и представлений, координируя их взаимодействие.
События от моделей данных

| Событие | Когда генерируется | Что делает презентер |
|---|---|---|
| `catalog:updated` | После загрузки товаров с сервера | Отрисовывает карточки в каталоге |
| `item:selected` | После выбора товара для просмотра | Открывает модальное окно с превью |
| `cart:changed` | После любого изменения корзины | Обновляет счётчик и список товаров в корзине |
| `customer:changed` | После изменения данных покупателя | Обновляет значения полей и валидацию форм на основе данных модели |

| Событие | Источник | Что делает презентер |
|---|---|---|
| `card:select` | Клик на карточку в каталоге | Вызывает `catalogModel.selectItem()` |
| `card:actionClick` | Клик на кнопку в превью | Добавляет или удаляет товар из корзины |
| `cart:open` | Клик на иконку корзины | Открывает модальное окно с корзиной |
| `cart:removeItem` | Клик на удаление в корзине | Удаляет товар из корзины |
| `checkout:start` | Клик на «Оформить» в корзине | Открывает модальное окно с формой доставки |
| `delivery:paymentSelected` | Выбор способа оплаты | Сохраняет способ оплаты в модель |
| `delivery:addressChanged` | Ввод адреса | Сохраняет адрес в модель |
| `delivery:submit` | Клик на «Далее» | Открывает форму контактов |
| `contacts:emailChanged` | Ввод email | Сохраняет email в модель |
| `contacts:phoneChanged` | Ввод телефона | Сохраняет телефон в модель |
| `contacts:submit` | Клик на «Оплатить» | Отправляет заказ на сервер |
| `success:close` | Клик на кнопку закрытия | Закрывает модальное окно |