import Utils from '../util/Utils';
import agreementNameTemplate from 'AgreementName.hbs';

export default class AgreementName {
  constructor(config) {
    this.config = config;

    this._inputNode;
  }

  addToDOM(parentNode) {
    let data = {
      defaultValue: this.config.defaultValue,
      readonly: !this.config.editable,
    };

    // Create the div
    parentNode.innerHTML = agreementNameTemplate(data);

    //create hooks
    this._inputNode = parentNode.querySelector('input');
  }

  setupValidation(validator) {
    let validationFn = this.runValidation.bind(this);
    let validationTracker = validator.createTracker(this._inputNode, validationFn);

    this._inputNode.addEventListener("change", (event) => {
      validationFn(validationTracker, event);
    });
  }

  runValidation(validationTracker, event) {
    let error = false;
    let message = null;
    let email = this._inputNode.value;

    if(this._inputNode.value == "") {
      error = true;
      message = "Please name the agreement.";
    }

    if(error) {
      this._inputNode.classList.add("is-invalid");
    }
    else {
      Utils.removeClass(this._inputNode, "is-invalid");
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
