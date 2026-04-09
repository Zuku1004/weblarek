import './scss/styles.scss';
import { ShopApi } from './components/ShopApi';
import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { CustomerModel } from './components/models/CustomerModel';
import { API_URL, CDN_URL } from './utils/constants';
import { apiProducts } from './utils/data';

//  Создание экземпляров классов 
const shopApi = new ShopApi(CDN_URL, API_URL);
const catalogModel = new CatalogModel();
const cartModel = new CartModel();
const customerModel = new CustomerModel();

// ТЕСТИРОВАНИЕ CatalogModel
console.log('=== Тест: CatalogModel (статические данные) ===');

// Загрузка каталога из тестовых данных
catalogModel.loadProducts(apiProducts.items);
console.log('Все товары каталога:', catalogModel.getAllProducts());

// Поиск конкретного товара по ID
const firstId = apiProducts.items[0].id;
console.log(`Товар с ID "${firstId}":`, catalogModel.findById(firstId));

// Выбор товара для детального просмотра
catalogModel.selectItem(apiProducts.items[1]);
console.log('Выбранный товар для просмотра:', catalogModel.getSelectedItem());

// ТЕСТИРОВАНИЕ CartModel
console.log('=== Тест: CartModel ===');

// Добавление товаров в корзину
cartModel.addToCart(apiProducts.items[0]);
cartModel.addToCart(apiProducts.items[1]);
console.log('Корзина после добавления 2 товаров:', cartModel.getCartItems());
console.log('Кол-во товаров в корзине:', cartModel.getItemCount());
console.log('Итоговая сумма корзины:', cartModel.calculateTotal());

// Проверка наличия товара
console.log(`Товар ${firstId} в корзине?`, cartModel.hasItem(firstId));

// Удаление одного товара
cartModel.deleteFromCart(firstId);
console.log('Корзина после удаления первого товара:', cartModel.getCartItems());

// Полная очистка
cartModel.emptyCart();
console.log('Корзина после очистки:', cartModel.getCartItems());

// ТЕСТИРОВАНИЕ CustomerModel
console.log('=== Тест: CustomerModel ===');

// Валидация при пустых полях
console.log('Ошибки пустой формы:', customerModel.checkValidity());

// Частичное заполнение
customerModel.updateField('payment', 'card');
customerModel.updateField('address', 'г. Москва, ул. Пушкина, д. 1');
console.log('Данные после частичного заполнения:', customerModel.getBuyerData());
console.log('Ошибки после ввода оплаты и адреса:', customerModel.checkValidity());

// Полное заполнение
customerModel.updateField('email', 'user@example.com');
customerModel.updateField('phone', '+79991234567');
console.log('Все данные покупателя:', customerModel.getBuyerData());
console.log('Ошибки при полностью заполненной форме:', customerModel.checkValidity());

// Сброс данных
customerModel.resetData();
console.log('Данные после сброса:', customerModel.getBuyerData());

// РАБОТА С СЕРВЕРОМ: ShopApi
console.log('=== Тест: ShopApi — загрузка данных с сервера ===');

shopApi
  .fetchProducts()
  .then((products) => {
    catalogModel.loadProducts(products);
    console.log('Каталог, загруженный с сервера:', catalogModel.getAllProducts());
  })
  .catch((err) => console.error('Ошибка при получении товаров:', err));
