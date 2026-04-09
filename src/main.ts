import './scss/styles.scss';
import { Api } from './components/base/Api';
import { ShopApi } from './components/ShopApi';
import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { CustomerModel } from './components/models/CustomerModel';
import { API_URL, CDN_URL } from './utils/constants';
import { apiProducts } from './utils/data';
 
// ─── Создание экземпляров классов ───────────────────────────────────────────
const baseApi = new Api(API_URL);
const shopApi = new ShopApi(CDN_URL, baseApi);
const catalogModel = new CatalogModel();
const cartModel = new CartModel();
const customerModel = new CustomerModel();
 
// ТЕСТИРОВАНИЕ CatalogModel
console.log('=== Тест: CatalogModel (статические данные) ===');
 
catalogModel.loadProducts(apiProducts.items);
console.log('Все товары каталога:', catalogModel.getAllProducts());
 
const firstId = apiProducts.items[0].id;
console.log(`Товар с ID "${firstId}":`, catalogModel.findById(firstId));
 
catalogModel.selectItem(apiProducts.items[1]);
console.log('Выбранный товар для просмотра:', catalogModel.getSelectedItem());
 
// ТЕСТИРОВАНИЕ CartModel
console.log('=== Тест: CartModel ===');
 
cartModel.addToCart(apiProducts.items[0]);
cartModel.addToCart(apiProducts.items[1]);
console.log('Корзина после добавления 2 товаров:', cartModel.getCartItems());
console.log('Кол-во товаров в корзине:', cartModel.getItemCount());
console.log('Итоговая сумма корзины:', cartModel.calculateTotal());
 
console.log(`Товар ${firstId} в корзине?`, cartModel.hasItem(firstId));
 
cartModel.deleteFromCart(firstId);
console.log('Корзина после удаления первого товара:', cartModel.getCartItems());
 
cartModel.emptyCart();
console.log('Корзина после очистки:', cartModel.getCartItems());
 
// ТЕСТИРОВАНИЕ CustomerModel
console.log('=== Тест: CustomerModel ===');
 
console.log('Ошибки пустой формы:', customerModel.checkValidity());
 
customerModel.updateField('payment', 'card');
customerModel.updateField('address', 'г. Москва, ул. Пушкина, д. 1');
console.log('Данные после частичного заполнения:', customerModel.getBuyerData());
console.log('Ошибки после ввода оплаты и адреса:', customerModel.checkValidity());
 
customerModel.updateField('email', 'user@example.com');
customerModel.updateField('phone', '+79991234567');
console.log('Все данные покупателя:', customerModel.getBuyerData());
console.log('Ошибки при полностью заполненной форме:', customerModel.checkValidity());
 
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
  