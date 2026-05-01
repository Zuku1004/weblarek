import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

/**
 * CatalogModel модель для хранения каталога товаров магазина.
 * Отвечает за список всех доступных товаров и текущий выбранный для показа товар.
 * При изменении данных генерирует события через брокер событий.
 */
export class CatalogModel {
  private _catalog: IProduct[] = [];
  private _selectedItem: IProduct | null = null;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  /**
   * Сохраняет переданный массив товаров в каталог и генерирует событие обновления.
   * @param products массив товаров из API
   */
  loadProducts(products: IProduct[]): void {
    this._catalog = products;
    this.events.emit('catalog:updated');
  }

  /**
   * Возвращает полный список товаров каталога.
   */
  getAllProducts(): IProduct[] {
    return this._catalog;
  }

  /**
   * Находит и возвращает товар по его уникальному идентификатору.
   * @param id  строковый ID товара
   */
  findById(id: string): IProduct | undefined {
    return this._catalog.find((product) => product.id === id);
  }

  /**
   * Сохраняет товар для детального просмотра и генерирует событие.
   * @param product  объект товара
   */
  selectItem(product: IProduct): void {
    this._selectedItem = product;
    this.events.emit('item:selected');
  }

  /**
   * Возвращает товар, выбранный для просмотра, или null.
   */
  getSelectedItem(): IProduct | null {
    return this._selectedItem;
  }
}
