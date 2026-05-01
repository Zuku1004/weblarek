import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

/**
 * CartModel  модель корзины покупок.
 * Хранит список выбранных пользователем товаров и генерирует события при изменениях.
 */
export class CartModel {
  private _cartItems: IProduct[] = [];
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  /**
   * Возвращает текущий список товаров в корзине.
   */
  getCartItems(): IProduct[] {
    return this._cartItems;
  }

  /**
   * Добавляет товар в корзину и генерирует событие изменения.
   * @param product  объект добавляемого товара
   */
  addToCart(product: IProduct): void {
    this._cartItems.push(product);
    this.events.emit('cart:changed');
  }

  /**
   * Удаляет товар из корзины по ID и генерирует событие изменения.
   * @param productId  идентификатор удаляемого товара
   */
  deleteFromCart(productId: string): void {
    this._cartItems = this._cartItems.filter((item) => item.id !== productId);
    this.events.emit('cart:changed');
  }

  /**
   * Полностью очищает корзину и генерирует событие изменения.
   */
  emptyCart(): void {
    this._cartItems = [];
    this.events.emit('cart:changed');
  }

  /**
   * Рассчитывает суммарную стоимость товаров в корзине.
   */
  calculateTotal(): number {
    return this._cartItems.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  /**
   * Возвращает количество товаров в корзине.
   */
  getItemCount(): number {
    return this._cartItems.length;
  }

  /**
   * Проверяет наличие товара в корзине по ID.
   * @param productId  идентификатор проверяемого товара
   */
  hasItem(productId: string): boolean {
    return this._cartItems.some((item) => item.id === productId);
  }
}
