import { CardBase, ICardBase } from './base/CardBase';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export interface ICardPreview extends ICardBase {
  category: string;
  image: string;
  description: string;
  buttonText: string;
  buttonDisabled: boolean;
}

/**
 * CardPreview  карточка товара для детального просмотра в модальном окне.
 */
export class CardPreview extends CardBase<ICardPreview> {
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;
  protected _description: HTMLElement;
  protected _actionButton: HTMLButtonElement;

  constructor(container: HTMLElement, onButtonClick?: () => void) {
    super(container);
    this._category = ensureElement('.card__category', container);
    this._image = ensureElement('.card__image', container) as HTMLImageElement;
    this._description = ensureElement('.card__text', container);
    this._actionButton = ensureElement('.card__button', container) as HTMLButtonElement;

    if (onButtonClick) {
      this._actionButton.addEventListener('click', (e) => {
        e.stopPropagation();
        onButtonClick();
      });
    }
  }

  set category(value: string) {
    if (value) {
      this._category.textContent = value;
      Object.values(categoryMap).forEach((modifier) => {
        this._category.classList.remove(modifier);
      });
      const modifier = categoryMap[value as keyof typeof categoryMap];
      if (modifier) {
        this._category.classList.add(modifier);
      }
    }
  }

  set image(value: string) {
    if (value) {
      this._image.src = value;
      this._image.alt = this._title?.textContent || 'Товар';
    }
  }

  set description(value: string) {
    this._description.textContent = value;
  }

  set buttonText(value: string) {
    this._actionButton.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this._actionButton.disabled = value;
  }
}
