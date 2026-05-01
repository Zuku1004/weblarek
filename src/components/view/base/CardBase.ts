import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';

export interface ICardBase {
  title: string;
  price: number | null;
}

/**
 * CardBase  базовый класс для всех карточек товара.
 * Содержит общую логику отображения названия и цены.
 */
export class CardBase<T extends ICardBase = ICardBase> extends Component<T> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._title = ensureElement('.card__title', container);
    this._price = ensureElement('.card__price', container);
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set price(value: number | null) {
    this._price.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
  }
}
