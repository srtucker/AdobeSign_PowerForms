import DOMUtils from '../util/DOMUtils';

import loaderTemplate from 'Loader.hbs';

export default class Modal {
  constructor(appDiv) {
    this._appDiv = appDiv;

    this._backdropDiv;
    this._modalDiv;
  }

  showModal() {
    this.showBackdrop();

    /*if(!this._modalDiv) {
      this._modalDiv = document.createElement('div');
      this._appDiv.appendChild(this._modalDiv);
    }

    this._modalDiv.innerHTML = loaderTemplate({text: body});
    */

    return this._modalDiv;
  }

  showLoader(body) {
    this.showBackdrop();

    if(!this._modalDiv) {
      this._modalDiv = document.createElement('div');
      this._appDiv.appendChild(this._modalDiv);
    }

    this._modalDiv.innerHTML = loaderTemplate({text: body});

    return this._modalDiv;
  }

  showBackdrop() {
    if(!this._backdropDiv) {
      this._backdropDiv = document.createElement('div');
      this._backdropDiv.className = "modal-backdrop fadeIn"
      document.body.appendChild(this._backdropDiv);
    }
  }

  getModal() {
    return this._modalDiv;
  }

  remove() {
    if(this._modalDiv) {
      DOMUtils.removeElement(this._modalDiv);
      this._modalDiv = null;
    }
    this.removeBackdrop();
  }

  removeBackdrop() {
    if(this._backdropDiv) {
      DOMUtils.removeElement(this._backdropDiv);
      this._backdropDiv = null;
    }
  }
}
