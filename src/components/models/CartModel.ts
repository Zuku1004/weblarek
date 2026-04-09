import { IProduct } from '../../types';

/**
 * CartModel — модель корзины покупок.
 * Хранит список выбранных пользователем товаров и предоставляет методы управления ими.
 */
export class CartModel {
  private _cartItems: IProduct[] = [];

  constructor() {
    this._cartItems = [];
  }

  /**
   * Возвращает текущий список товаров в корзине.
   */
  getCartItems(): IProduct[] {
    return this._cartItems;
  }

  /**
   * Добавляет товар в корзину.
   * @param product — объект добавляемого товара
   */
  addToCart(product: IProduct): void {
    this._cartItems.push(product);
  }

  /**
   * Удаляет товар из корзины по его ID.
   * @param productId — идентификатор удаляемого товара
   */
  deleteFromCart(productId: string): void {
    this._cartItems = this._cartItems.filter((item) => item.id !== productId);
  }

  /**
   * Полностью очищает корзину.
   */
  emptyCart(): void {
    this._cartItems = [];
  }

  /**
   * Рассчитывает и возвращает суммарную стоимость товаров в корзине.
   * Товары без цены (null) не учитываются.
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
   * Проверяет, находится ли товар с указанным ID в корзине.
   * @param productId — идентификатор проверяемого товара
   */
  hasItem(productId: string): boolean {
    return this._cartItems.some((item) => item.id === productId);
  }
}
