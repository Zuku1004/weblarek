import { FormBase } from './base/FormBase';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IDeliveryFormData {
  payment: string;
  address: string;
}

/**
 * DeliveryForm  форма первого шага оформления заказа.
 * Содержит выбор способа оплаты и ввод адреса доставки.
 */
export class DeliveryForm extends FormBase<IDeliveryFormData> {
  protected _cardPayBtn: HTMLButtonElement;
  protected _cashPayBtn: HTMLButtonElement;
  protected _addressInput: HTMLInputElement;
  protected events: IEvents;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);
    this.events = events;

    this._cardPayBtn = ensureElement('button[name="card"]', container) as HTMLButtonElement;
    this._cashPayBtn = ensureElement('button[name="cash"]', container) as HTMLButtonElement;
    this._addressInput = ensureElement('input[name="address"]', container) as HTMLInputElement;

    this._cardPayBtn.addEventListener('click', () => {
      this.highlightPayment('card');
      this.events.emit('delivery:paymentSelected', { payment: 'card' });
    });

    this._cashPayBtn.addEventListener('click', () => {
      this.highlightPayment('cash');
      this.events.emit('delivery:paymentSelected', { payment: 'cash' });
    });

    this._addressInput.addEventListener('input', () => {
      this.events.emit('delivery:addressChanged', {
        address: this._addressInput.value,
      });
    });
  }

  private highlightPayment(type: 'card' | 'cash') {
    if (type === 'card') {
      this._cardPayBtn.classList.add('button_alt-active');
      this._cashPayBtn.classList.remove('button_alt-active');
    } else {
      this._cashPayBtn.classList.add('button_alt-active');
      this._cardPayBtn.classList.remove('button_alt-active');
    }
  }

  set payment(value: string) {
    if (value === 'card') {
      this.highlightPayment('card');
    } else if (value === 'cash') {
      this.highlightPayment('cash');
    } else {
      this._cardPayBtn.classList.remove('button_alt-active');
      this._cashPayBtn.classList.remove('button_alt-active');
    }
  }

  set address(value: string) {
    this._addressInput.value = value;
  }

  protected onSubmit() {
    this.events.emit('delivery:submit');
  }
}
