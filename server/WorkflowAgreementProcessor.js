
class WorkflowAgreementProcessor {
  constructor(wfData, settings, clientData) {
    this.wfData = wfData;
    this.settings = settings;
    this.clientData = clientData;

    this.sendingAccount = null;
    this.dictionary = {};

    this.agreementData = {};

    this._buildMergeFields();
    this._buildRecipients();
    this._buildCarbonCopy();
    this._buildFiles();
    this._buildSecurityOptions();
    this._buildExpiration();
    this._buildReminder();
    this._buildAgreementName();
    this._buildMessage();
  }

  getAgreement() {
    console.log("dictionary", this.dictionary);
    console.log("documentCreationInfo", this.agreementData);

    //this.agreementData.callbackInfo
    //this.agreementData.formFieldLayerTemplates
    //this.agreementData.formFields
    //this.agreementData.locale
    //this.agreementData.postSignOptions
    //this.agreementData.vaultingInfo

    return {
      documentCreationInfo: this.agreementData,
      options: {
        autoLoginUser: false,
      },
    };
  }

  getSendingAccount() {
    return this.sendingAccount;
  }

  _buildMergeFields() {
    if('mergeFieldsInfo' in this.wfData) {
      let data = this.agreementData.mergeFieldInfo = [];

      this.wfData.mergeFieldsInfo.forEach(wf => {
        let val = wf.defaultValue;

        if(wf.editable && 'mergeFields' in this.clientData) {
          this.clientData.mergeFields.forEach(cd => {
            if(cd.fieldName == wf.fieldName){
              val = cd.defaultValue;
            }
          });
        }

        //track for substitutions
        this.dictionary[wf.fieldName] = val;

        //add to agreement
        data.push({
          fieldName: wf.fieldName,
          defaultValue: val,
        });

        if(wf.fieldName == 'WFSetting_SendingAccount') {
          this.sendingAccount = val;
        }
      });
    }
  }

  _buildRecipients() {
    let data = this.agreementData.recipientsListInfo = [];

    this.wfData.recipientsListInfo.forEach(wf => {
      let recipients = [];
      if(wf.defaultValue != ""){
        recipients = [{email: wf.defaultValue}];
      }

      if(wf.editable && 'recipients' in this.clientData) {
        this.clientData.recipients.forEach(cd => {
          if(cd.name == wf.name){
            cd.recipients.forEach(recipient => {
              if(recipient.email) {
                recipients.push(recipient);
              }
            });
          }
        });
      }

      //track for substitutions
      this.dictionary[wf.label.replace(/\s/g, "_").replace(/[^\w|_]/g, "")] = recipients.map(recip => recip.email).join(";");

      if(recipients.length > 0) {
        //add to agreement
        data.push({
          name: wf.name,
          recipients: recipients,
        });
      }
    });
  }

  _buildCarbonCopy() {
    //carbonCopies
    if('ccsListInfo' in this.wfData) {
      let data = this.agreementData.ccs = [];
      let hide_predefined = this.settings.cc.hide_predefined;

      this.wfData.ccsListInfo.forEach(wf => {
        let emails = [];
        if(hide_predefined) {
          emails = wf.defaultValue.split(/,|;/);
        }

        if(wf.editable && 'carbonCopy' in this.clientData) {
          this.clientData.carbonCopy.forEach(cd => {
            if(cd.name == wf.name) {
              emails = emails.concat(cd.emails);
            }
          });
        }

        /*
        //error checking
        if(emails.length < wf.minListCount) {
          // does not meet min count
        }
        else if(emails.length > wf.maxListCount) {
          // more than max count
        }
        */

        if(emails.length > 0) {
          //add to agreement
          data.push({
            name: wf.name,
            emails: emails,
          });
        }
      });
    }
  }

  _buildFiles() {
    let data = this.agreementData.fileInfos = [];

    this.wfData.fileInfos.forEach(wf => {
      let file = null;

      if('files' in this.clientData) {
        this.clientData.files.forEach(cd => {
          if(cd.name == wf.name) {
            file = cd;
          }
        });
      }

      if(!file && wf.required) {
        if('workflowLibraryDocumentSelectorList' in wf && wf.workflowLibraryDocumentSelectorList.length > 0) {
          file = {
            name: wf.name,
            workflowLibraryDocumentId: wf.workflowLibraryDocumentSelectorList[0].workflowLibDoc
          }
        }
      }

      if(file) {
        //add to agreement
        data.push(file);
      }
    });
  }

  _buildSecurityOptions() {
    let securityOptions = null;

    if('password' in this.clientData) {
      securityOptions = this.clientData.password;
    }

    if(!securityOptions && this.wfData.passwordInfo.required) {
      //TODO: error
    }
    else if(securityOptions) {
      this.agreementData.securityOptions = securityOptions;
    }
  }

  _buildExpiration() {
    if('expirationInfo' in this.wfData) {
      let hide = this.settings.expiration.hide;
      let deadline = this.wfData.expirationInfo.defaultValue;

      if(!hide && this.clientData.expiration) {
        deadline = this.clientData.expiration;
      }

      let deadlineInt = parseInt(deadline);

      /*
      //error checking
      if(_.isNaN(deadlineInt)) {
        // expiration must be an int
      }
      else if(deadlineInt < 1) {
        error = true;
        message = "There is a minimum of 1 day to set agreement expiration.";
      }
      else if(deadlineInt > maxDays) {
        error = true;
        message = `There is a maximum of ${maxDays} days before agreement expiration.`;
      }
      */

      this.agreementData.daysUntilSigningDeadline = deadlineInt;
    }
  }

  _buildReminder() {
    let reminder = null;
    let validOptions = ["DAILY_UNTIL_SIGNED", "WEEKDAILY_UNTIL_SIGNED", "EVERY_OTHER_DAY_UNTIL_SIGNED", "EVERY_THIRD_DAY_UNTIL_SIGNED", "EVERY_FIFTH_DAY_UNTIL_SIGNED", "WEEKLY_UNTIL_SIGNED"];

    //get default if set in dictionary
    if(this.dictionary['WFSetting_Reminder']) {
      reminder = this.dictionary['WFSetting_Reminder'];
    }

    //get from client if it exists
    if(this.clientData.reminder) {
      reminder = this.clientData.reminder
    }

    if(reminder) {

      /*
      //error checking
      if(validOptions.indexOf(reminder) == -1) {
        //error invalid option
      }
      */

      this.agreementData.reminderFrequency = reminder;
    }
  }

  _buildAgreementName() {
    let agreementName = this.wfData.agreementNameInfo.defaultValue;

    //get from client if it exists
    if(this.clientData.agreementName) {
      agreementName = this.clientData.agreementName;
    }

    //replace variable if needed
    if(agreementName.includes("${")) {
      agreementName = processTemplateString(agreementName, this.dictionary);
    }

    this.agreementData.name = agreementName;
  }

  _buildMessage() {
    //message
    let message = this.wfData.messageInfo.defaultValue;

    //get from client if it exists
    if(this.clientData.message) {
      message = this.clientData.message;
    }

    //replace variable if needed
    if(message.includes("${")) {
      message = processTemplateString(message, this.dictionary);
    }

    this.agreementData.message = message;
  }
}

function processTemplateString(template, replacements) {
  for (const property in replacements) {
    template = template.replace("${"+property+"}", replacements[property]);
  }
  return template;
}

module.exports = WorkflowAgreementProcessor;
