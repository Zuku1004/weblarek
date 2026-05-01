import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface ICatalogView {
  items: HTMLElement[];
}

/**
 * CatalogView  компонент отображения каталога товаров на главной странице.
 */
export class CatalogView extends Component<ICatalogView> {
  protected _catalogContainer: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._catalogContainer = ensureElement('.gallery', container);
  }

  set items(items: HTMLElement[]) {
    this._catalogContainer.replaceChildren(...items);
  }
}
