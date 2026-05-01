import { FormBase } from './base/FormBase';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IContactsFormData {
  email: string;
  phone: string;
}

/**
 * ContactsForm  форма второго шага оформления заказа.
 * Содержит поля для ввода email и телефона покупателя.
 */
export class ContactsForm extends FormBase<IContactsFormData> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;
  protected events: IEvents;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);
    this.events = events;

    this._emailInput = ensureElement('input[name="email"]', container) as HTMLInputElement;
    this._phoneInput = ensureElement('input[name="phone"]', container) as HTMLInputElement;

    this._emailInput.addEventListener('input', () => {
      this.events.emit('contacts:emailChanged', {
        email: this._emailInput.value,
      });
    });

    this._phoneInput.addEventListener('input', () => {
      this.events.emit('contacts:phoneChanged', {
        phone: this._phoneInput.value,
      });
    });
  }

  set email(value: string) {
    this._emailInput.value = value;
  }

  set phone(value: string) {
    this._phoneInput.value = value;
  }

  protected onSubmit() {
    this.events.emit('contacts:submit');
  }
}
