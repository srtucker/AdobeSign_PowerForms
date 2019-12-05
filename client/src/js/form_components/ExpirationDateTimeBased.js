import DOMUtils from '../util/DOMUtils';
import DateUtils from '../util/Date';
import expirationDateTimeBasedTemplate from 'ExpirationDateTimeBased.hbs';

export default class ExpirationDateTimeBased {
  constructor(config) {
    this.config = config;

    this.checked = false;

    this._expireCheckbox;
    this._detailsDiv;
    this._expirationInput;

    this.today = new Date();

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
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = expirationDateTimeBasedTemplate(data);
    var div = tempDiv.firstChild;
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
  }

  setupValidation(validator) {
    let validationFn = this.runValidation.bind(this);
    let validationTracker = validator.createTracker(this._expirationInput, validationFn);

    this._expireCheckbox.addEventListener("click", (event) => {
      //only run when unchecking
      if(this._expireCheckbox.checked !== true) {
        validationFn(validationTracker, event, false);
      }
    });

    this._expirationInput.addEventListener("change", (event) => {
      validationFn(validationTracker, event, false);
    });
  }

  runValidation(validationTracker, event, isRevalidate) {
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
      DOMUtils.removeClass(this._expirationInput, "is-invalid");
    }

    validationTracker.update(error, message);
  }

  getValues() {
    if(this._expireCheckbox.checked === true) {
      const selected_date = new Date(this._expirationInput.value);

      const diffTime = Math.abs(selected_date - this.today);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return null;
  }

  getDateSettings() {
    let dateSettings = {};

    // Set max days and get string outputs
    dateSettings.minDate = DateUtils.addDays(this.today, 1)
    dateSettings.minDateStr = DateUtils.format(dateSettings.minDate, 'YYYY-MM-DD');
    dateSettings.maxDate = DateUtils.addDays(this.today, this.config.maxDays)
    dateSettings.maxDateStr = DateUtils.format(dateSettings.maxDate, 'YYYY-MM-DD');

    // if default date
    if(this.config.defaultValue){
      var defaultDate = DateUtils.addDays(this.today, Number(this.config.defaultValue))
      dateSettings.defaultDateStr = DateUtils.format(defaultDate, 'YYYY-MM-DD')
    }
    else {
      dateSettings.defaultDateStr = DateUtils.format(this.today, 'YYYY-MM-DD');
    }

    return dateSettings;
  }
}
