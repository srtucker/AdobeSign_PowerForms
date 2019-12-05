import DOMUtils from '../util/DOMUtils';
import messageSectionTemplate from 'MessageSection.hbs';

export default class MessageSection {
  constructor(config) {
    this.config = config;

    this._inputNode;
  }

  addToDOM(parentNode) {
    let data = {
      defaultValue: this.config.defaultValue.trim(),
      readonly: !this.config.editable,
    };

    // Create the div
    parentNode.innerHTML = messageSectionTemplate(data);

    //create hooks
    this._inputNode = parentNode.querySelector('textarea');
  }

  setupValidation(validator) {
    let validationFn = this.runValidation.bind(this);
    let validationTracker = validator.createTracker(this._inputNode, validationFn);

    this._inputNode.addEventListener("change", (event) => {
      validationFn(validationTracker, event, false);
    });
  }

  runValidation(validationTracker, event, isRevalidate) {
    let error = false;
    let message = null;
    let email = this._inputNode.value;

    if(this._inputNode.value == "") {
      error = true;
      message = "Please provide a valid value for agreement message.";
    }

    if(error) {
      this._inputNode.classList.add("is-invalid");
    }
    else {
      DOMUtils.removeClass(this._inputNode, "is-invalid");
    }

    validationTracker.update(error, message);
  }

  getValues() {
    if (this.config.editable) {
      return this._inputNode.value;
    }
    return null;
  }
}
