import DOMUtils from '../util/DOMUtils';
import passwordOptionTemplate from 'PasswordOption.hbs'
import passwordOptionErrorTemplate from 'PasswordOptionError.hbs'

export default class PasswordOption {
  constructor(config){
    this.config = config;

    this._protectCheckbox;
    this._passContainer;
    this._showPassCheckbox;
    this._passwordInput;
    this._passwordConfirmInput;
    this._passwordErrorDiv;
  }

  addToDOM(parentNode){
    let data = {
      required: this.config.required
    };

    // Create the div
    let div = document.createElement('div');
    div.innerHTML = passwordOptionTemplate(data);
    div.className = "pdf-protect-section compose-option-section";
    parentNode.appendChild(div);

    //create hooks
    this._protectCheckbox = div.querySelector('input#pdf-protect');
    this._passContainer = div.querySelector('#password-container');
    this._showPassCheckbox = div.querySelector('#show-password');
    this._passwordInput = div.querySelector('#protect-password');
    this._passwordConfirmInput = div.querySelector('#protect-password-confirm');
    this._passwordErrorDiv = div.querySelector('.password-error');

    // Add event handlers
    this._protectCheckbox.onclick = function () {
      // show sub pass div
      if(this._protectCheckbox.checked === true){
        this._passContainer.hidden = false;
        this._passwordInput.focus()
      }
      // hide sub pass div
      else {
        this._passContainer.hidden = true;
      }
    }.bind(this);

    this._showPassCheckbox.onclick = function() {
      if(this._showPassCheckbox.checked === false){
        this._passwordInput.type = 'password';
        this._passwordConfirmInput.type = 'password';
      }
      else{
        this._passwordInput.type = 'text';
        this._passwordConfirmInput.type = 'text';
      }
    }.bind(this);
  }

  setupValidation(validator) {
    let validationFn = this.runValidation.bind(this);
    let validationTracker = validator.createTracker(this._passwordInput, validationFn);

    this._protectCheckbox.addEventListener("click", (event) => {
      //only run when unchecking
      if(this._protectCheckbox.checked !== true) {
        validationFn(validationTracker, event);
      }
    });

    this._passwordInput.addEventListener("change", (event) => {
      validationFn(validationTracker, event);
    });

    this._passwordConfirmInput.addEventListener("change", (event) => {
      validationFn(validationTracker, event);
    });
  }

  runValidation(validationTracker, event) {
    let error = false;
    let message = null;
    let passwordInput = this._passwordInput;
    let password = passwordInput.value;
    let passwordConfirmInput = this._passwordConfirmInput;
    let passwordConfirm = passwordConfirmInput.value;
    let messages = [];

    if(this._protectCheckbox.checked === true) {
      if(password != passwordConfirm) {
        error = true;
        messages.push(`Passwords do not match.`);
      }

      if(password.length < 3) {
        error = true;
        messages.push(`Password needs to be at least 3 characters long.`);
      }

      if(password.length > 32) {
        error = true;
        messages.push(`Password exceeds 32 characters.`);
      }
    }

    if(error) {
      message = `You need to set a password to protect the downloaded PDF.`;
      let errorDisplayData = {};

      if(messages.length > 1) {
        errorDisplayData.messages = messages;
      }
      else {
        errorDisplayData.message = messages[0];
      }

      // show the error message
      this._passwordErrorDiv.innerHTML = passwordOptionErrorTemplate(errorDisplayData);

      //format inputs with error
      passwordInput.classList.add("is-invalid");
      passwordConfirmInput.classList.add("is-invalid");
    }
    else {
      this._passwordErrorDiv.innerText = "";
      DOMUtils.removeClass(passwordInput, "is-invalid");
      DOMUtils.removeClass(passwordConfirmInput, "is-invalid");
    }

    validationTracker.update(error, message);
  }

  getValues() {
    let values = {
      protectOpen: this._protectCheckbox.checked
    }

    if(this._protectCheckbox.checked === true) {
      values.openPassword = this._passwordInput.value
    }

    return values;
  }
}
