import { Api } from './base/Api';
import { IApi, IProduct, IOrderRequest, IOrderConfirmation, IProductListResponse } from '../types';

/**
 * ShopApi — класс коммуникационного слоя приложения.
 * Использует функциональность базового класса Api через наследование.
 * Инкапсулирует конкретные эндпоинты сервера Web-Ларёк.
 */
export class ShopApi extends Api {
  private readonly _cdnBase: string;

  /**
   * @param cdnBase — базовый URL для формирования пути к изображениям товаров
   * @param baseUrl — базовый URL API сервера
   * @param options — дополнительные опции для HTTP-запросов
   */
  constructor(cdnBase: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this._cdnBase = cdnBase;
  }

  /**
   * запрашивает список всех товаров с сервера.
   * Дополняет пути к изображениям полным CDN-адресом.
   * @returns Promise с массивом товаров
   */
  fetchProducts(): Promise<IProduct[]> {
    return this.get<IProductListResponse>('/product/').then(
      (response: IProductListResponse) =>
        response.items.map((item) => ({
          ...item,
          image: this._cdnBase + item.image,
        }))
    );
  }

  /**
   * отправляет оформленный заказ на сервер.
   * @param orderData — объект с данными покупателя, товарами и суммой
   * @returns Promise с подтверждением заказа (id и итоговая сумма)
   */
  submitOrder(orderData: IOrderRequest): Promise<IOrderConfirmation> {
    return this.post<IOrderConfirmation>('/order/', orderData).then(
      (result: IOrderConfirmation) => result
    );
  }
}
