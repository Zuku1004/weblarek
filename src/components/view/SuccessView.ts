import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface ISuccessView {
  total: number;
}

/**
 * SuccessView  компонент экрана успешного оформления заказа.
 * Показывает итоговую сумму и кнопку закрытия.
 */
export class SuccessView extends Component<ISuccessView> {
  protected _description: HTMLElement;
  protected _closeButton: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this._description = ensureElement('.order-success__description', container);
    this._closeButton = ensureElement('.order-success__close', container) as HTMLButtonElement;

    this._closeButton.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  set total(value: number) {
    this._description.textContent = `Списано ${value} синапсов`;
  }

  render(data?: ISuccessView): HTMLElement {
    if (data) {
      this.total = data.total;
    }
    return this.container;
  }
}
