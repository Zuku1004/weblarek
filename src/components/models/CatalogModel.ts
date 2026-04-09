import { IProduct } from '../../types';

/**
 * CatalogModel — модель для хранения каталога товаров магазина.
 * Отвечает за список всех доступных товаров и текущий выбранный для показа товар.
 */
export class CatalogModel {
  private _catalog: IProduct[] = [];
  private _selectedItem: IProduct | null = null;

  /**
   * Сохраняет переданный массив товаров в каталог.
   * @param products — массив товаров из API
   */
  loadProducts(products: IProduct[]): void {
    this._catalog = products;
  }

  /**
   * Возвращает полный список товаров каталога.
   */
  getAllProducts(): IProduct[] {
    return this._catalog;
  }

  /**
   * Находит и возвращает товар по его уникальному идентификатору.
   * @param id — строковый ID товара
   */
  findById(id: string): IProduct | undefined {
    return this._catalog.find((product) => product.id === id);
  }

  /**
   * Сохраняет товар, выбранный для показа в модальном окне.
   * @param product — объект товара
   */
  selectItem(product: IProduct): void {
    this._selectedItem = product;
  }

  /**
   * Возвращает товар, выбранный для просмотра, или null.
   */
  getSelectedItem(): IProduct | null {
    return this._selectedItem;
  }
}
