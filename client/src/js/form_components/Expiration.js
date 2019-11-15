import DOMUtils from '../util/DOMUtils';
import DateUtils from '../util/Date';
import expirationTemplate from 'Expiration.hbs';
import _ from 'lodash';

export default class Expiration {
  constructor(config) {
    this.config = config;

    this._expireCheckbox;
    this._detailsDiv;
    this._expirationInput;

    this.minDays = 1;
    this.maxDays = config.maxDays;
    this.today = new Date();
  }

  addToDOM(parentNode) {
    let data = {
      checked: (this.config.defaultValue) ? "checked" : "",
      readonly: !this.config.editable,
      minDays: this.minDays,
      maxDays: this.maxDays,
      value: this.config.defaultValue,
      inputLabelEnd: "to complete this agreement.",
      inputLabel: "days",
    };

    // Create the div
    let div = document.createElement('div');
    div.innerHTML = expirationTemplate(data);
    div.className = "expiration-section compose-option-section";
    parentNode.appendChild(div);

    //create hooks
    this._expireCheckbox = div.querySelector('#expiration-checkbox');
    this._detailsDiv = div.querySelector('#expiration-details');
    this._expirationInput = div.querySelector('#expiration-in-days-val');
    this._expirationAfterText = div.querySelector(".expiration-after-text");
    this._expirationError = div.querySelector(".expiration-error-text");

    this.updateExpirationAfterText();

    // Add event handlers
    this._expireCheckbox.onclick = function () {
      if (this._expireCheckbox.checked === true) {
        this._detailsDiv.hidden = false;
        this._expirationInput.focus()
      }
      else {
        this._detailsDiv.hidden = true;
      }
    }.bind(this);
  }

  setupValidation(validator) {
    let validationFn = this.runValidation.bind(this);
    let validationTracker = validator.createTracker(this._expirationInput, validationFn);

    this._expireCheckbox.addEventListener("click", (event) => {
      //only run when unchecking
      if(this._expireCheckbox.checked !== true) {
        validationFn(validationTracker, event);
      }
    });

    this._expirationInput.addEventListener("change", (event) => {
      validationFn(validationTracker, event);
    });
  }

  runValidation(validationTracker, event) {
    let error = false;
    let message = null;
    let expirationDays = this._expirationInput.value;
    let daysInt = parseInt(expirationDays);

    if(this._expireCheckbox.checked === true) {
      if(this.config.editable && expirationDays == "") {
        error = true;
        message = "Please enter the number of days after which this document expires.";
      }
      else {
        let minDays = this.minDays;
        let maxDays = this.maxDays;

        if(_.isNaN(daysInt)) {
          error = true;
          message = "Agreement expiration may only contain numbers.";
        }
        else if(expirationDays < minDays) {
          error = true;
          message = "There is a minimum of 1 day to set agreement expiration.";
        }
        else if(expirationDays > maxDays) {
          error = true;
          message = `There is a maximum of ${maxDays} days before agreement expiration.`;
        }
      }
    }

    if(error) {
      this._expirationError.innerText = message;
      this._expirationError.hidden = false;
      this._expirationAfterText.innerText = "";
      this._expirationAfterText.hidden = true;

      this._expirationInput.classList.add("is-invalid");
    }
    else {
      this._expirationError.innerText = "";
      this._expirationError.hidden = true;
      this.updateExpirationAfterText();

      DOMUtils.removeClass(this._expirationInput, "is-invalid");
    }

    validationTracker.update(error, message);
  }

  getValues() {
    if(this._expireCheckbox.checked === true) {
      return this._expirationInput.value;
    }
    return null;
  }

  updateExpirationAfterText() {
    let expirationDays = this._expirationInput.value;
    let daysInt = parseInt(expirationDays);
    let expirationDate = DateUtils.addDays(this.today, daysInt);

    this._expirationAfterText.innerText = `Agreement expires after ${expirationDate.toLocaleDateString("en-us", {year: 'numeric', month: 'short', day: 'numeric' })}.`;
    this._expirationAfterText.hidden = false;
  }
}
