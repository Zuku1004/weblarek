import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface ICartView {
  items: HTMLElement[];
  total: number;
}

/**
 * CartView  компонент отображения корзины покупок.
 * показывает список товаров, итоговую сумму и кнопку оформления.
 */
export class CartView extends Component<ICartView> {
  protected _itemsList: HTMLElement;
  protected _totalPrice: HTMLElement;
  protected _checkoutButton: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this._itemsList = ensureElement('.basket__list', container);
    this._totalPrice = ensureElement('.basket__price', container);
    this._checkoutButton = ensureElement('.basket__button', container) as HTMLButtonElement;

    this._checkoutButton.addEventListener('click', () => {
      this.events.emit('checkout:start');
    });
  }

  set items(items: HTMLElement[]) {
    this._itemsList.replaceChildren(...items);
  }

  set total(value: number) {
    this._totalPrice.textContent = `${value} синапсов`;
  }

  set disabled(value: boolean) {
    this._checkoutButton.disabled = value;
  }
}
