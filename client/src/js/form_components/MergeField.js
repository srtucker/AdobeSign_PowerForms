import DOMUtils from '../util/DOMUtils';
import mergeFieldTemplate from 'MergeField.hbs';

export default class MergeField {
  constructor(config){
    this.config = config;
    this.readonly = !config.editable;

    this._inputNode;
  }

  addToDOM(parentNode) {
    let data = {
      inputId: 'merge_input_' + this.config.fieldName,
      label: this.config.displayName,
      defaultValue: this.config.defaultValue,
      required: this.config.required,
      readonly: this.readonly,
    };

    // Create the div
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = mergeFieldTemplate(data);
    var div = tempDiv.firstChild
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
    let value = this._inputNode.value;

    if(this.config.required && value == "") {
      error = true;
      message = `The field "${this.config.displayName}" is required.`
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
      return {
        fieldName: this.config.fieldName,
        defaultValue: this._inputNode.value
      };
    }
    return null;
  }

}
