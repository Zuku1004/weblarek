import { IApi, IProduct, IOrderRequest, IOrderConfirmation, IProductListResponse } from '../types';
 
/**
 * ShopApi — класс коммуникационного слоя приложения.
 * Использует функциональность класса Api через композицию.
 * Принимает экземпляр IApi в конструктор, не наследует его.
 */
export class ShopApi {
  private readonly _api: IApi;
  private readonly _cdnBase: string;
 
  /**
   * @param cdnBase — базовый URL для формирования пути к изображениям товаров
   * @param api — экземпляр класса, реализующего интерфейс IApi
   */
  constructor(cdnBase: string, api: IApi) {
    this._cdnBase = cdnBase;
    this._api = api;
  }
 
  /**
   * Запрашивает список всех товаров с сервера.
   * Дополняет пути к изображениям полным CDN-адресом.
   */
  fetchProducts(): Promise<IProduct[]> {
    return this._api.get<IProductListResponse>('/product/').then(
      (response: IProductListResponse) =>
        response.items.map((item) => ({
          ...item,
          image: this._cdnBase + item.image,
        }))
    );
  }
 
  /**
   * Отправляет оформленный заказ на сервер.
   * @param orderData — объект с данными покупателя, товарами и суммой
   */
  submitOrder(orderData: IOrderRequest): Promise<IOrderConfirmation> {
    return this._api.post<IOrderConfirmation>('/order/', orderData).then(
      (result: IOrderConfirmation) => result
    );
  }
}