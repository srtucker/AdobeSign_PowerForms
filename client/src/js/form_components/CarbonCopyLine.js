import Utils from '../util/Utils';
import DOMUtils from '../util/DOMUtils';
import carbonCopyLineTemplate from 'CarbonCopyLine.hbs';

export default class CarbonCopyLine {
  constructor(id, defaultValue, required, readonly) {
    this.id = id;
    this.defaultValue = defaultValue;
    this.required = required;
    this.readonly = readonly;

    this._inputNode;
  }

  addToDOM(parentNode) {
    let data = {
      inputId: 'cc_' + this.id,
      label: "CC " + this.id,
      defaultValue: this.defaultValue,
      placeholder: "Enter Cc's Email",
      required: this.required,
      readonly: this.readonly
    };

    // Create the div
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = carbonCopyLineTemplate(data);
    var div = tempDiv.firstChild;
    parentNode.appendChild(div);

    //create hooks
    this._inputNode = div.querySelector('input');
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

    if(this.required && email == "") {
      error = true;
      message = `CC recipient ${this.id} is required.`
    }
    else if(email != "" && !Utils.isValidEmail(email)) {
      error = true;
      message = `The email "${email}" for CC recipient ${this.id} is not a valid email address.`
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
    if (!this.readonly) {
      return this._inputNode.value;
    }
    return null;
  }
}
