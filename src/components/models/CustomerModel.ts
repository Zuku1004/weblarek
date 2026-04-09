import { IBuyer, TPayment, TValidationErrors } from '../../types';

/**
 * CustomerModel — модель данных покупателя.
 * Хранит введённые пользователем данные для оформления заказа
 * и выполняет их валидацию.
 */
export class CustomerModel {
  private _paymentMethod: TPayment | '' = '';
  private _deliveryAddress: string = '';
  private _customerEmail: string = '';
  private _customerPhone: string = '';

  constructor() {}

  /**
   * Обновляет одно поле модели покупателя.
   * Позволяет сохранить отдельное значение, не затрагивая остальные.
   * @param field — ключ поля интерфейса IBuyer
   * @param value — новое значение поля
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
  }

  /**
   * Возвращает объект со всеми данными покупателя.
   */
  getBuyerData(): IBuyer {
    return {
      payment: this._paymentMethod ,
      address: this._deliveryAddress,
      email: this._customerEmail,
      phone: this._customerPhone,
    };
  }

  /**
   * Сбрасывает все поля модели в пустые значения.
   */
  resetData(): void {
    this._paymentMethod = '';
    this._deliveryAddress = '';
    this._customerEmail = '';
    this._customerPhone = '';
  }

  /**
   * Проверяет валидность введённых данных.
   * Возвращает объект с ошибками по полям; если поле корректно — его ключ отсутствует.
   * Пример: { payment: 'Не выбран способ оплаты', phone: 'Укажите телефон' }
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
