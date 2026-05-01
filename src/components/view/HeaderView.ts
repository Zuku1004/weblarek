import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
 
export interface IHeaderView {
  counter: number;
}
 
/**
 * HeaderView компонент шапки сайта.
 * Управляет счётчиком корзины и кнопкой её открытия.
 */
export class HeaderView extends Component<IHeaderView> {
  protected _cartCounter: HTMLElement;
  protected _cartButton: HTMLButtonElement;
  protected events: IEvents;
 
  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this._cartCounter = ensureElement('.header__basket-counter', container);
    this._cartButton = ensureElement('.header__basket', container) as HTMLButtonElement;
 
    this._cartButton.addEventListener('click', () => {
      this.events.emit('cart:open');
    });
  }
 
  set counter(value: number) {
    this._cartCounter.textContent = String(value);
  }
}