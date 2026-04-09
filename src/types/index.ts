export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

// Доступные способы оплаты заказа
export type TPayment = 'card' | 'cash';

// Описывает структуру одного товара, получаемого с сервера
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Описывает данные покупателя при оформлении заказа
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Тип для хранения ошибок валидации формы покупателя
export type TValidationErrors = Partial<Record<keyof IBuyer, string>>;

// Объект ответа сервера на запрос списка товаров
export interface IProductListResponse {
  total: number;
  items: IProduct[];
}

// Данные заказа, отправляемые на сервер
export interface IOrderRequest extends IBuyer {
  items: string[];
  total: number;
}

// Ответ сервера после успешного оформления заказа
export interface IOrderConfirmation {
  id: string;
  total: number;
}
