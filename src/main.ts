import './scss/styles.scss';
import { Api } from './components/base/Api';
import { ShopApi } from './components/ShopApi';
import { EventEmitter } from './components/base/Events';
import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { CustomerModel } from './components/models/CustomerModel';
import { PageView } from './components/view/PageView';
import { ModalView } from './components/view/ModalView';
import { CatalogView } from './components/view/CatalogView';
import { CartView } from './components/view/CartView';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { CardCart } from './components/view/CardCart';
import { DeliveryForm } from './components/view/DeliveryForm';
import { ContactsForm } from './components/view/ContactsForm';
import { SuccessView } from './components/view/SuccessView';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, IOrderRequest } from './types';

// ─── Инициализация брокера событий ────────────────────────────────────────
const events = new EventEmitter();

// ─── Инициализация API ────────────────────────────────────────────────────
const baseApi = new Api(API_URL);
const shopApi = new ShopApi(CDN_URL, baseApi);

// ─── Инициализация моделей данных ─────────────────────────────────────────
const catalogModel = new CatalogModel(events);
const cartModel = new CartModel(events);
const customerModel = new CustomerModel(events);

// ─── Инициализация компонентов представления ──────────────────────────────
const pageContainer = ensureElement('.page__content');
const pageView = new PageView(pageContainer, events);
const catalogView = new CatalogView(pageContainer);

const modalContainer = ensureElement('#modal-container');
const modalView = new ModalView(modalContainer, events);

const cartTemplate = ensureElement('#basket') as HTMLTemplateElement;
const cartView = new CartView(cloneTemplate(cartTemplate), events);

const cardPreviewTemplate = ensureElement('#card-preview') as HTMLTemplateElement;
const cardPreviewElement = cloneTemplate(cardPreviewTemplate);
const cardPreview = new CardPreview(cardPreviewElement, () =>
  events.emit('card:actionClick')
);

const deliveryTemplate = ensureElement('#order') as HTMLTemplateElement;
const deliveryFormElement = cloneTemplate(deliveryTemplate) as HTMLFormElement;
const deliveryForm = new DeliveryForm(deliveryFormElement, events);

const contactsTemplate = ensureElement('#contacts') as HTMLTemplateElement;
const contactsFormElement = cloneTemplate(contactsTemplate) as HTMLFormElement;
const contactsForm = new ContactsForm(contactsFormElement, events);

const successTemplate = ensureElement('#success') as HTMLTemplateElement;
const successElement = cloneTemplate(successTemplate);
const successView = new SuccessView(successElement, events);

// ─── ПРЕЗЕНТЕР: обработчики событий ──────────────────────────────────────

// Каталог обновлён — отрисовываем карточки
events.on('catalog:updated', () => {
  const products = catalogModel.getAllProducts();
  const cardCatalogTemplate = ensureElement('#card-catalog') as HTMLTemplateElement;

  const cards = products.map((product) => {
    const cardElement = cloneTemplate(cardCatalogTemplate);
    const card = new CardCatalog(cardElement, () =>
      events.emit('card:select', product)
    );
    card.render(product);
    return cardElement;
  });

  pageView.counter = cartModel.getItemCount();
  catalogView.items = cards;
});

// Корзина изменилась — обновляем отображение
events.on('cart:changed', () => {
  pageView.counter = cartModel.getItemCount();

  const cardCartTemplate = ensureElement('#card-basket') as HTMLTemplateElement;

  const cartItems = cartModel.getCartItems().map((item, index) => {
    const cardElement = cloneTemplate(cardCartTemplate);
    const card = new CardCart(cardElement, () =>
      events.emit('cart:removeItem', { id: item.id })
    );
    card.render({ ...item, index: index + 1 });
    return cardElement;
  });

  cartView.items = cartItems;
  cartView.total = cartModel.calculateTotal();
  cartView.disabled = cartModel.getItemCount() === 0;
});

// Данные покупателя изменились — обновляем состояние форм
events.on('customer:changed', () => {
  const errors = customerModel.checkValidity();
  deliveryForm.valid = !errors.payment && !errors.address;
  deliveryForm.errors = errors.payment || errors.address || '';
  contactsForm.valid = !errors.email && !errors.phone;
  contactsForm.errors = errors.email || errors.phone || '';
});

// Выбранный товар изменился — отрисовываем превью
events.on('item:selected', () => {
  const product = catalogModel.getSelectedItem();
  if (!product) return;

  const inCart = cartModel.hasItem(product.id);
  const hasNoPrice = product.price === null;

  let buttonText = '';
  let buttonDisabled = false;

  if (hasNoPrice) {
    buttonText = 'Недоступно';
    buttonDisabled = true;
  } else {
    buttonText = inCart ? 'Убрать из корзины' : 'В корзину';
    buttonDisabled = false;
  }

  cardPreview.render({ ...product, buttonText, buttonDisabled });
  modalView.render({ content: cardPreview.render() });
});

// Пользователь кликнул на карточку в каталоге
events.on('card:select', (product: IProduct) => {
  catalogModel.selectItem(product);
});

// Пользователь нажал кнопку действия в превью (купить / убрать)
events.on('card:actionClick', () => {
  const product = catalogModel.getSelectedItem();
  if (!product || product.price === null) return;

  if (cartModel.hasItem(product.id)) {
    cartModel.deleteFromCart(product.id);
  } else {
    cartModel.addToCart(product);
  }
  modalView.close();
});

// Удаление товара из корзины
events.on('cart:removeItem', (data: { id: string }) => {
  cartModel.deleteFromCart(data.id);
});

// Открытие корзины
events.on('cart:open', () => {
  modalView.render({ content: cartView.render() });
});

// Начало оформления заказа
events.on('checkout:start', () => {
  const buyerData = customerModel.getBuyerData();
  deliveryForm.payment = buyerData.payment;
  deliveryForm.address = buyerData.address;
  modalView.render({ content: deliveryForm.render() });
});

// Выбор способа оплаты
events.on('delivery:paymentSelected', (data: { payment: string }) => {
  customerModel.updateField('payment', data.payment);
});

// Изменение адреса доставки
events.on('delivery:addressChanged', (data: { address: string }) => {
  customerModel.updateField('address', data.address);
});

// Отправка формы доставки — переход к форме контактов
events.on('delivery:submit', () => {
  const buyerData = customerModel.getBuyerData();
  contactsForm.email = buyerData.email;
  contactsForm.phone = buyerData.phone;
  modalView.render({ content: contactsForm.render() });
});

// Изменение email
events.on('contacts:emailChanged', (data: { email: string }) => {
  customerModel.updateField('email', data.email);
});

// Изменение телефона
events.on('contacts:phoneChanged', (data: { phone: string }) => {
  customerModel.updateField('phone', data.phone);
});

// Отправка заказа на сервер
events.on('contacts:submit', async () => {
  const buyerData = customerModel.getBuyerData();
  const order: IOrderRequest = {
    ...buyerData,
    items: cartModel.getCartItems().map((item) => item.id),
    total: cartModel.calculateTotal(),
  };

  try {
    const result = await shopApi.submitOrder(order);
    cartModel.emptyCart();
    customerModel.resetData();
    successView.total = result.total;
    modalView.render({ content: successView.render() });
  } catch (error) {
    console.error('Ошибка при оформлении заказа:', error);
  }
});

// Закрытие экрана успешного заказа
events.on('success:close', () => {
  modalView.close();
});

// ─── Загрузка товаров с сервера ───────────────────────────────────────────
shopApi
  .fetchProducts()
  .then((products) => {
    catalogModel.loadProducts(products);
  })
  .catch((error) => {
    console.error('Ошибка загрузки товаров:', error);
  });
