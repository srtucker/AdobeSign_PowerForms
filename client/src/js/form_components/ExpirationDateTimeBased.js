import Utils from '../util/Utils';
import DateUtils from '../util/Date';
import expirationDateTimeBasedTemplate from 'ExpirationDateTimeBased.hbs';

export default class ExpirationDateTimeBased {
  constructor(config) {
    this.config = config;

    this.checked = false;

    this._expireCheckbox;
    this._detailsDiv;
    this._expirationInput;

    //minDays = 1

    this.dateSettings = this.getDateSettings();
  }

  addToDOM(parentNode) {
    let data = {
      checked: (this.config.defaultValue) ? "checked" : "",
      readonly: !this.config.editable,
      minDate: this.dateSettings.minDateStr,
      maxDate: this.dateSettings.maxDateStr,
      value: this.dateSettings.defaultDateStr,
    };

    // Create the div
    let div = document.createElement('div');
    div.innerHTML = expirationDateTimeBasedTemplate(data);
    div.className = "expiration-section compose-option-section";
    parentNode.appendChild(div);

    //create hooks
    this._expireCheckbox = div.querySelector('#expiration-checkbox');
    this._detailsDiv = div.querySelector('#expiration-details');
    this._expirationInput = div.querySelector('#expiration-time');

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

    return;
  }

  setupValidation(validator) {
    let validationFn = this.runValidation.bind(this);
    let validationTracker = validator.createTracker(this._inputNode, validationFn);

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
    let expirationDate = this._expirationInput.value;

    if(this._expireCheckbox.checked === true) {
      if(this.config.editable && expirationDate == "") {
        error = true;
        message = `Please provide a valid value for agreement completion deadline.`
      }
      else {
        let minDate = this.dateSettings.minDateStr;
        let maxDate = this.dateSettings.maxDateStr;

        if(expirationDate < minDate) {
          error = true;
          message = `Completion deadline must be ${DateUtils.format(this.dateSettings.minDate,'MM/DD/YYYY')} or later.`
        }
        else if(expirationDate > maxDate) {
          error = true;
          message = `Completion deadline must be ${DateUtils.format(this.dateSettings.maxDate,'MM/DD/YYYY')} or earlier.`
        }
      }
    }

    if(error) {
      this._expirationInput.classList.add("is-invalid");
    }
    else {
      Utils.removeClass(this._expirationInput, "is-invalid");
    }

    validationTracker.update(error, message);
  }

  getValues() {
    if(this._expireCheckbox.checked === true) {
      const today = new Date();
      const selected_date = new Date(this._expirationInput.value);

      const diffTime = Math.abs(selected_date - today_date);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return null;
  }

  getDateSettings() {
    let dateSettings = {}
    var today = new Date();

    // Set max days and get string outputs
    dateSettings.minDate = DateUtils.addDays(today, 1)
    dateSettings.minDateStr = DateUtils.format(dateSettings.minDate, 'YYYY-MM-DD');
    dateSettings.maxDate = DateUtils.addDays(today, this.config.maxDays)
    dateSettings.maxDateStr = DateUtils.format(dateSettings.maxDate, 'YYYY-MM-DD');

    // if default date
    if(this.config.defaultValue){
      var defaultDate = DateUtils.addDays(today, Number(this.config.defaultValue))
      dateSettings.defaultDateStr = DateUtils.format(defaultDate, 'YYYY-MM-DD')
    }
    else {
      dateSettings.defaultDateStr = DateUtils.format(today, 'YYYY-MM-DD');
    }

    return dateSettings;
  }
}
