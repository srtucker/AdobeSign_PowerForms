import { ValidationObserver } from './Validator';
import formErrorsTemplate from 'FormErrors.hbs'

export default class FormErrors {
  constructor(sectionNode, validator) {
    this._sectionNode = sectionNode;
    this._validator = validator;
    this.submitButtonNode = null;
    this._showErrorDiv = false;

    this._observer = validator.createObserver("FormErrors");
    this._observer.setHook(this.handleErrors.bind(this));


    this._hasErrors = false;
  }

  connectSubmitButton(submitButtonNode) {
    this._submitButtonNode = submitButtonNode;
  }

  handleErrors(errors) {
    let keys = Object.keys(errors);
    this._hasErrors = (keys.length > 0);

    if(this._showErrorDiv) {
      let data = {errors: false};

      if (this._submitButtonNode !== null) {
        this._submitButtonNode.disabled = this._hasErrors;
      }

      if(this._hasErrors) {
        data.errors = {};
        keys.sort().forEach(function(key) {
          data.errors[key] = errors[key];
        });
      }
      this._sectionNode.innerHTML = formErrorsTemplate(data);
    }
  }

  showErrorDiv() {
    this._showErrorDiv = true;
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
