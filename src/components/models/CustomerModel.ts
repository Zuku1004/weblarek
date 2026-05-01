import { IBuyer, TPayment, TValidationErrors } from '../../types';
import { IEvents } from '../base/Events';

/**
 * CustomerModel  модель данных покупателя.
 * хранит данные для оформления заказа и генерирует события при изменениях.
 */
export class CustomerModel {
  private _paymentMethod: TPayment | '' = '';
  private _deliveryAddress: string = '';
  private _customerEmail: string = '';
  private _customerPhone: string = '';
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  /**
   * Обновляет одно поле модели покупателя и генерирует событие.
   * @param field  ключ поля интерфейса IBuyer
   * @param value  новое значение поля
   */
  updateField(field: keyof IBuyer, value: string): void {
    if (field === 'payment') {
      if (value === 'card' || value === 'cash') {
        this._paymentMethod = value;
      } else {
        console.warn(`Некорректный способ оплаты: ${value}`);
      }
    } else if (field === 'address') {
      this._deliveryAddress = value;
    } else if (field === 'email') {
      this._customerEmail = value;
    } else if (field === 'phone') {
      this._customerPhone = value;
    }
    this.events.emit('customer:changed');
  }

  /**
   * Возвращает объект со всеми данными покупателя.
   */
  getBuyerData(): IBuyer {
    return {
      payment: this._paymentMethod,
      address: this._deliveryAddress,
      email: this._customerEmail,
      phone: this._customerPhone,
    };
  }

  /**
   * Сбрасывает все поля модели и генерирует событие.
   */
  resetData(): void {
    this._paymentMethod = '';
    this._deliveryAddress = '';
    this._customerEmail = '';
    this._customerPhone = '';
    this.events.emit('customer:changed');
  }

  /**
   * Проверяет валидность полей и возвращает объект с ошибками.
   */
  checkValidity(): TValidationErrors {
    const errors: TValidationErrors = {};

    if (!this._paymentMethod) {
      errors.payment = 'Не выбран способ оплаты';
    }
    if (!this._deliveryAddress.trim()) {
      errors.address = 'Укажите адрес доставки';
    }
    if (!this._customerEmail.trim()) {
      errors.email = 'Укажите адрес электронной почты';
    }
    if (!this._customerPhone.trim()) {
      errors.phone = 'Укажите номер телефона';
    }

    return errors;
  }
}
