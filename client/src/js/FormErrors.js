import { ValidationObserver } from './Validator';
import formErrorsTemplate from 'FormErrors.hbs'

export default class FormErrors {
  constructor(sectionNode, validator) {
    this._sectionNode = sectionNode;
    this._validator = validator;
    this._submitButton = null;
    this._showErrorDiv = false;

    this._observer = validator.createObserver("FormErrors");
    this._observer.setHook(this.handleErrors.bind(this));


    this._hasErrors = false;
    this._currentErrors = [];
  }

  connectSubmitButton(submitButton) {
    this._submitButton = submitButton;
  }

  handleErrors(errors) {
    if(errors) {
      this._currentErrors = errors;
    }

    let keys = Object.keys(this._currentErrors);
    this._hasErrors = (keys.length > 0);

    if(this._showErrorDiv) {
      let data = {errors: false};

      if (this._submitButton !== null) {
        this._submitButton.disabled = this._hasErrors;
      }

      if(this._hasErrors) {
        data.errors = {};
        keys.sort().forEach(key => {
          data.errors[key] = this._currentErrors[key];
        });
      }
      this._sectionNode.innerHTML = formErrorsTemplate(data);
    }
  }

  showErrorDiv() {
    this._showErrorDiv = true;
    this.handleErrors();
  }

  hasErrors() {
    return this._hasErrors;
  }

  scrollToError() {
    this._sectionNode.scrollIntoView({
      behavior: 'smooth'
    });
  }
}
