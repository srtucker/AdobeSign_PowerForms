import AgreementName from './form_components/AgreementName';
import CarbonCopyGroup from './form_components/CarbonCopyGroup';
import Expiration from './form_components/Expiration';
import ExpirationDateTimeBased from './form_components/ExpirationDateTimeBased';
import FileSelect from './form_components/FileSelect';
import FileUpload from './form_components/FileUpload';
import MergeField from './form_components/MergeField';
import PasswordOption from './form_components/PasswordOption';
import RecipientGroup from './form_components/RecipientGroup';
import Reminder from './form_components/Reminder';

import FormErrors from './FormErrors';

import Validator from './Validator';

import workflowFormTemplate from 'WorkflowForm.hbs'

export default class DynamicForm {
  constructor(config, workflow) {
    this.config = config;
    this.workflow = workflow;

    this.validator = new Validator();
    this.formErrors;

    this.file_info = [];
    this.merge_fields = [];
    this.expiration = null;
    this.cc_group = [];
    this.pass_option = "";
    this.reminders = "";
  }

  async buildRecipientsForm(appDiv) {
    //set template
    appDiv.innerHTML = workflowFormTemplate({displayName: this.config.displayName});

    //build sections
    this.createErrorSection(appDiv.querySelector('#form-errors'));
    this.createInstructionSection(appDiv.querySelector('#instruction_section'));
    this.createRecipientSection(appDiv.querySelector('#recipient_section'));
    this.createCCSection(appDiv.querySelector('#cc_section'));
    this.createAgreementSection(appDiv.querySelector('#agreement_section'));
    this.createMessageSection(appDiv.querySelector('#message_section'));
    this.createUploadSection(appDiv.querySelector('#upload_section'));
    this.createMergeSection(appDiv.querySelector('#merge_section'));
    this.createOptionsSection(appDiv.querySelector('#options_section'));

    this.createRecipientFormButton(appDiv.querySelector('button#form_submit_button'));
  }

  createErrorSection(sectionNode) {
    this.formErrors = new FormErrors(sectionNode, this.validator);
  }

  async createRecipientFormButton(submitButtonNode) {
    //connect the submit to Error handling
    this.formErrors.connectSubmitButton(submitButtonNode)

    // Add onClick event to submit button
    submitButtonNode.onclick = async function () {
      this.formErrors.showErrorDiv();
      this.validator.revalidateAll();

      if(this.formErrors.hasErrors()) {
        this.formErrors.scrollToError();
        console.log("Validation errors found, not submitting form");
        return false;
      }


      return;

      //this.workflow.verify();
      //this.workflow.buildAgreement();

      /*
      let workflow_object = this.workflow;
      let workflow_data = this.workflow_data;

      var async_wf_obj = await workflow_object;
      var wf_data = await workflow_data;

      async_wf_obj.updateAgreementName();
      async_wf_obj.updateRecipientGroup(wf_data['recipientsListInfo'], this.recipient_groups);
      async_wf_obj.updateFileInfos(this.file_info);
      async_wf_obj.updateMergeFieldInfos(this.merge_fields);
      async_wf_obj.updateReminder(this.reminders);
      async_wf_obj.updateMessage(document.getElementById('messages_input').value);

      if (wf_data['passwordInfo'].visible) {
        async_wf_obj.createOpenPass(this.pass_option.getPass(), this.pass_option.getProtection());
      }

      if (this.deadline.checked) {
        async_wf_obj.updateDeadline(this.deadline.today_date);
      }

      if ('ccsListInfo' in wf_data) {
        async_wf_obj.updateCcGroup(wf_data['ccsListInfo'][0], this.cc_group);
      }

      var response = await fetch(apiBaseURL + 'api/postAgreement/' + async_wf_obj.workflow_id, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(async_wf_obj.jsonData())
      }).then(function (resp) {
        return resp.json()
      }).then(function (data) {
        return data;
      });

      if ('url' in response) {
        alert('Agreement Sent');
        window.location.reload();
      }
      else {
        async_wf_obj.clearData();
        alert(response['message']);
      }*/
    }.bind(this);
  }

  // START of verified section

  createInstructionSection(sectionNode){
    //reset current node first
    this.resetDOMNode(sectionNode, false);

    let instructions = this.config.instructions;
    instructions = instructions.replace(/(?:\r\n|\r|\n)/g, '</br>');

    // Create element
    var instructionsNode = document.createElement('p');

    // Assign properties
    instructionsNode.innerHTML = instructions;
    instructionsNode.className = 'instructions';

    sectionNode.appendChild(instructionsNode);
  }

  createRecipientSection(sectionNode) {
    let config = this.config.recipients;

    //reset current node
    this.resetDOMNode(sectionNode, false);

    let fieldsetNode = document.createElement('fieldset');
    sectionNode.appendChild(fieldsetNode);

    let headerNode = document.createElement('legend');
    headerNode.innerHTML = "Recipients";
    fieldsetNode.appendChild(headerNode);

    // Get Recipient Information
    for (let counter = 0; counter < config.length; counter++) {
      let recipientGrp = new RecipientGroup(counter, config[counter]);
      recipientGrp.addToDOM(fieldsetNode);
      recipientGrp.setupValidation(this.validator);
      this.workflow.recipientGroups.push(recipientGrp);
    }
  }

  createCCSection(sectionNode) {
    //reset current node
    this.resetDOMNode(sectionNode, true);

    if ('carbonCopies' in this.config) {
      let config = this.config.carbonCopies;

      for (let counter = 0; counter < config.length; counter++) {
        let ccGrp = new CarbonCopyGroup(counter, config[counter]);
        ccGrp.addToDOM(sectionNode);
        ccGrp.setupValidation(this.validator);
        this.workflow.carbonCopyGroups.push(ccGrp);
      }

      this.showDomNode(sectionNode);
    }
  }

  createAgreementSection(sectionNode) {
    //reset current node
    this.resetDOMNode(sectionNode, true);

    if ('agreementName' in this.config) {
      let config = this.config.agreementName;

      let agreementName = new AgreementName(config);
      agreementName.addToDOM(sectionNode);
      agreementName.setupValidation(this.validator);

      this.showDomNode(sectionNode);
    }
  }

  createMessageSection(sectionNode) {
    //reset current node
    this.resetDOMNode(sectionNode, true);

    if ('message' in this.config) {
      const inputId = "messages_input";

      sectionNode.classList.add("form-group");

      // Create the label
      var labelNode = document.createElement('label');
      labelNode.innerHTML = "Message";
      labelNode.htmlFor = inputId;
      labelNode.className = "recipient_label";
      sectionNode.appendChild(labelNode);

      // Create the input
      var inputNode = document.createElement("textarea");
      inputNode.id = inputId;
      inputNode.name = inputId;
      inputNode.rows = 3;
      inputNode.className = 'recipient_form_input form-control';
      inputNode.placeholder = "Message";
      sectionNode.appendChild(inputNode);

      // Check to see if there's a default value
      if (this.config.message !== null) {
        inputNode.value = this.config.message;
      }

      this.showDomNode(sectionNode);
    }
  }

  createUploadSection(sectionNode) {
    //reset current node
    this.resetDOMNode(sectionNode, true);

    if ('files' in this.config) {
      let config = this.config.files;

      let fieldsetNode = document.createElement('fieldset');
      sectionNode.appendChild(fieldsetNode);

      let headerNode = document.createElement('legend');
      headerNode.innerHTML = "Files";
      fieldsetNode.appendChild(headerNode);

      // Get FileInfo information
      for (let counter = 0; counter < config.length; counter++) {
        if(config[counter].workflowLibraryDocumentSelectorList) {
          let file = new FileSelect(config[counter]);
          file.addToDOM(fieldsetNode);
          file.setupValidation(this.validator);
          this.workflow.files.push(file);
        }
        else {
          let file = new FileUpload(config[counter]);
          file.addToDOM(fieldsetNode);
          file.setupValidation(this.validator);
          this.workflow.files.push(file);
        }
      }

      this.showDomNode(sectionNode);
    }
  }

  createMergeSection(sectionNode) {
    //reset current node
    this.resetDOMNode(sectionNode, true);

    if ('mergeFields' in this.config) {
      let config = this.config.mergeFields;

      let fieldsetNode = document.createElement('fieldset');
      sectionNode.appendChild(fieldsetNode);

      let headerNode = document.createElement('legend');
      headerNode.innerHTML = "Fields";
      fieldsetNode.appendChild(headerNode);

      // Get merged field information
      for (let counter = 0; counter < config.length; counter++) {
        let mergeField = new MergeField(config[counter]);
        mergeField.addToDOM(fieldsetNode);

        this.merge_fields.push(mergeField);
      }

      this.showDomNode(sectionNode);
    }
  }

  createOptionsSection(sectionNode) {
    //reset current node
    this.resetDOMNode(sectionNode, true);

    let showSection = false;

    let showPassword = this.createPasswordSubsection(sectionNode);
    showSection = showSection || showPassword;

    let showExpiration = this.createExpirationSubsection(sectionNode);
    showSection = showSection || showExpiration;

    let showReminder = this.createReminderSubsection(sectionNode);
    showSection = showSection || showReminder;

    if(showSection) {
      this.showDomNode(sectionNode);
    }
  }

  createPasswordSubsection(sectionNode) {
    let config = this.config.password;

    // Get Password information
    if (config.visible) {
      let passwordOption = new PasswordOption(config);
      passwordOption.addToDOM(sectionNode);
      passwordOption.setupValidation(this.validator);
      return true;
    }

    return false;
  }

  createExpirationSubsection(sectionNode) {
    if('expiration' in this.config){
      let config = this.config.expiration;

      if (config.visible) {
        let expiration = (ClientConfig.expirationAsDate) ? new ExpirationDateTimeBased(config) : new Expiration(config);
        expiration.addToDOM(sectionNode);
        expiration.setupValidation(this.validator);
        return true;
      }
    }

    return false;
  }

  createReminderSubsection(sectionNode) {
    if('reminder' in this.config){
      let config = this.config.reminder;

      if(config.visible) {
        let reminder = new Reminder(config);
        reminder.addToDOM(sectionNode);
        //No validation
        return;
      }
    }

    return false;
  }

  resetDOMNode(node, hide) {
    if(hide) {
      node.classList.add("hidden");
    }
    else if(node.classList.contains("hidden")) {
      node.classList.remove("hidden");
    }

    //Remove children
    while (node.firstElementChild) {
        node.firstElementChild.remove();
    }
  }

  showDomNode(node) {
    if(node.classList.contains("hidden")) {
      node.classList.remove("hidden");
    }
  }
}
