import reminderSectionTemplate from 'ReminderSection.hbs';

export default class Reminder{
  constructor(config){
    this.config = config;

    this._reminderCheckbox;
    this._detailsDiv;
    this._reminderSelect;
  }

  addToDOM(parentNode) {
    let data = {
      checked: false,
      disabled: !this.config.editable,
      reminderFrequencyOptions: [
        {
          value: 'DAILY_UNTIL_SIGNED',
          descr: 'Every day'
        },
        {
          value: 'WEEKLY_UNTIL_SIGNED',
          descr: 'Every week'
        },
        {
          value: 'WEEKDAILY_UNTIL_SIGNED',
          descr: 'Every business day'
        },
        {
          value: 'EVERY_OTHER_DAY_UNTIL_SIGNED',
          descr: 'Every other day'
        },
        {
          value: 'EVERY_THIRD_DAY_UNTIL_SIGNED',
          descr: 'Every third day'
        },
        {
          value: 'EVERY_FIFTH_DAY_UNTIL_SIGNED',
          descr: 'Every fifth day'
        }
      ]
    };

    if(this.config.defaultValue && this.config.defaultValue != "") {
      for(let i=0; i<data.reminderFrequencyOptions.length; i++) {
        if(data.reminderFrequencyOptions[i].value == this.config.defaultValue) {
          data.reminderFrequencyOptions[i].selected = true;
          data.checked = true;
        }
      }
    }

    // Create the div
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = reminderSectionTemplate(data);
    var div = tempDiv.firstChild;
    parentNode.appendChild(div);

    //create hooks
    this._reminderCheckbox = div.querySelector('#reminder-option');
    this._detailsDiv = div.querySelector('#reminder-details');
    this._reminderSelect = div.querySelector('#reminder-frequency');

    // Add event handlers
    this._reminderCheckbox.onclick = function () {
      if (this._reminderCheckbox.checked === true) {
        this._detailsDiv.hidden = false;
        this._reminderSelect.focus()
      }
      else {
        this._detailsDiv.hidden = true;
      }
    }.bind(this);
  }

  getValues() {
    if(this._reminderCheckbox.checked === true) {
      return this._reminderSelect.value;
    }
    return null;
  }
}
