import expirationSectionTemplate from 'ExpirationSection.hbs';

export default class Expiration {
  constructor(config) {
    this.config = config;

    this.default_value = config['defaultValue'];
    this.editable = config['editable'];
    this.visable = config['visible'];
    this.max_days = config['maxDays'];
    this.today_date = "";
    this.checked = false;

    this.checkbox;
    this.detailsDiv;
    this.dateInput;
  }

  addToDOM(parentNode) {
    let isVisible = true;

    // Create the div
    let div = document.createElement('div');
    div.innerHTML = expirationSectionTemplate();
    div.className = "expiration-section compose-option-section";
    parentNode.appendChild(div);

    //create hooks
    this.checkbox = document.getElementById('expiration-checkbox');
    this.detailsDiv = document.getElementById('expiration-details');
    this.dateInput = document.getElementById('expiration-time');

    //set initial values
    if(typeof this.config.defaultValue !== 'undefined') {
      this.checkbox.checked = true;
    }
    this.setDateValues(this.dateInput);

    // Add event handlers
    this.checkbox.onclick = function () {
      this.checkBoxChangeHandler();
    }.bind(this);

    // run change handler once to set inital settings
    this.checkBoxChangeHandler();

    return isVisible;
  }

  checkBoxChangeHandler() {
    if (this.checkbox.checked === true) {
      this.detailsDiv.hidden = false;
      this.checked = true;
    }
    // Show sub pass div
    else {
      this.detailsDiv.hidden = true;
      this.checked = false;
    }
  }

  setDateValues(target_input){
    /***
     * This function will add the date time logic
     * @param {Object} target_input The target date input to add date logic
     */

    // Create Date objects
    var today = new Date();
    var max_days = new Date();
    var predefine_date = new Date();

    // Set max days and get string outputs
    this.today_date = this.getDateFormat(today);
    today.setDate(today.getDate() + 1);
    max_days.setDate(today.getDate() + this.max_days);
    var max_days_date = this.getDateFormat(max_days);

    // Set range of dates
    if(typeof this.default_value !== 'undefined'){
      predefine_date.setDate(today.getDate() + Number(this.default_value));
      let predefine_date_format = this.getDateFormat(predefine_date)
      target_input.value = predefine_date_format;
    }
    else{
      target_input.value = this.today_date;
    }

    target_input.min = this.today_date;
    target_input.max = max_days_date;

  }

  addDays(date, days) {
    /***
     * This function will add days to the date
     * @param {Date} date The date object we wish to target
     * @param {Number} days The amount of days added to the target date
     */

    // Create new date object and add the days delta to it
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  getDateFormat(date) {
    /***
     * This function will formate the date for input
     * @param {Date} date The date object we wish to formate
     */

    // Create the day, month, and year variables
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var y = date.getFullYear();

    // Month under 10 add leading 0
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }

    // Format
    var date_format = y + '-' + mm + '-' + dd;

    return date_format;
  }

}
