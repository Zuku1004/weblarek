import { CardBase, ICardBase } from './base/CardBase';
import { ensureElement } from '../../utils/utils';

export interface ICardCart extends ICardBase {
  index: number;
}

/**
 * CardCart  карточка товара внутри корзины.
 * Отображает порядковый номер и кнопку удаления.
 */
export class CardCart extends CardBase<ICardCart> {
  protected _index: HTMLElement;
  protected _removeButton: HTMLButtonElement;

  constructor(container: HTMLElement, onRemove?: () => void) {
    super(container);
    this._index = ensureElement('.basket__item-index', container);
    this._removeButton = ensureElement('.basket__item-delete', container) as HTMLButtonElement;

    if (onRemove) {
      this._removeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        onRemove();
      });
    }
  }

  set index(value: number) {
    this._index.textContent = String(value);
  }
}
