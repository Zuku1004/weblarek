import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

/**
 * ModalView  компонент модального окна.
 * Управляет открытием, закрытием и содержимым модального окна.
 * Не может иметь дочерних классов — содержимое передаётся снаружи.
 */
export class ModalView extends Component<{ content: HTMLElement }> {
  protected _closeBtn: HTMLButtonElement;
  protected _modalContent: HTMLElement;
  protected _modalWrapper: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this._closeBtn = ensureElement('.modal__close', container) as HTMLButtonElement;
    this._modalContent = ensureElement('.modal__content', container);
    this._modalWrapper = container;

    this._closeBtn.addEventListener('click', this.close.bind(this));
    this._modalWrapper.addEventListener('click', this.close.bind(this));
    this._modalContent.addEventListener('click', (e) => e.stopPropagation());
  }

  set content(value: HTMLElement) {
    this._modalContent.innerHTML = '';
    this._modalContent.appendChild(value);
  }

  open() {
    this._modalWrapper.classList.add('modal_active');
  }

  close() {
    this._modalWrapper.classList.remove('modal_active');
    this._modalContent.innerHTML = '';
  }

  render(data: { content: HTMLElement }): HTMLElement {
    this.content = data.content;
    this.open();
    return this._modalWrapper;
  }
}
