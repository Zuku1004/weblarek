import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';

export interface IFormState {
  valid: boolean;
  errors: string[];
}

/**
 * FormBase  базовый класс для форм оформления заказа.
 * Содержит общую логику управления кнопкой отправки и отображением ошибок.
 */
export class FormBase<T> extends Component<T> {
  protected _form: HTMLFormElement;
  protected _submitButton: HTMLButtonElement;
  protected _errorsContainer: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._form = container as HTMLFormElement;
    this._submitButton = ensureElement(
      '.button[type="submit"]',
      container,
    ) as HTMLButtonElement;
    this._errorsContainer = ensureElement('.form__errors', container);

    this._form.addEventListener('input', () => {
      this.onInputChange();
    });

    this._form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onSubmit();
    });
  }

  protected onInputChange(): void {
    // переопределяется в наследниках
  }

  protected onSubmit(): void {
    // переопределяется в наследниках
  }

  set valid(value: boolean) {
    this._submitButton.disabled = !value;
  }

  set errors(value: string) {
    this._errorsContainer.textContent = value;
  }
}
