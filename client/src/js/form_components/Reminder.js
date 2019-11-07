import reminderSectionTemplate from 'ReminderSection.hbs';

export default class Reminder{
  constructor(config){
    this.config = config;
    this.checked = false;

    this.reminderCheckbox;
    this.reminderSelect;
  }

  createDiv(parentNode) {
    let data = {
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

    // Create the div
    let div = document.createElement('div');
    div.innerHTML = reminderSectionTemplate(data);
    div.className = "reminder-section compose-option-section";
    parentNode.appendChild(div);

    //create hooks
    this.reminderCheckbox = document.getElementById('reminder-option');
    this.reminderDetailsDiv = document.getElementById('reminder-details');
    this.reminderSelect = document.getElementById('reminder-frequency');

    // Add event handlers
    this.reminderCheckbox.onclick = function () {
      this.checkBoxChangeHandler();
    }.bind(this)

    // run change handler once to set inital settings
    this.checkBoxChangeHandler();

    return true;
  }

  checkBoxChangeHandler() {
    if (this.reminderCheckbox.checked === true) {
      this.reminderDetailsDiv.hidden = false;
      this.checked = true;
    }
    // Show sub pass div
    else {
      this.reminderDetailsDiv.hidden = true;
      this.checked = false;
    }
  }
}
