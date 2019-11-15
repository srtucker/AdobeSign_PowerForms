import AgreementName from './form_components/AgreementName';
import CarbonCopyGroup from './form_components/CarbonCopyGroup';
import Expiration from './form_components/Expiration';
import ExpirationDateTimeBased from './form_components/ExpirationDateTimeBased';
import FileSelect from './form_components/FileSelect';
import FileUpload from './form_components/FileUpload';
import MergeField from './form_components/MergeField';
import MessageSection from './form_components/MessageSection';
import PasswordOption from './form_components/PasswordOption';
import RecipientGroup from './form_components/RecipientGroup';
import Reminder from './form_components/Reminder';
import DOMUtils from './util/DOMUtils';

import FormErrors from './FormErrors';

import Validator from './Validator';

import workflowFormTemplate from 'WorkflowForm.hbs';
import loaderTemplate from 'Loader.hbs';
import submitCompleteTemplate from 'SubmitComplete.hbs';

export default class DynamicForm {
  constructor(config, workflow) {
    this.config = config;
    this.workflow = workflow;

    this.validator = new Validator();
    this._appDiv;
    this._formErrors;
    this._submitButton;
  }

  async buildRecipientsForm(appDiv) {
    this._appDiv = appDiv;

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

    // deal with submit
    this._submitButton = appDiv.querySelector('button#form_submit_button');
    //connect the submit to Error handling
    this._formErrors.connectSubmitButton(this._submitButton);
    // Add onClick event to submit button
    this._submitButton.onclick = this._handleSubmit.bind(this);
  }

  createErrorSection(sectionNode) {
    this._formErrors = new FormErrors(sectionNode, this.validator);
  }

  async _handleSubmit() {
    this._formErrors.showErrorDiv();
    this.validator.revalidateAll();

    if(this._formErrors.hasErrors()) {
      this._formErrors.scrollToError();
      console.log("Validation errors found, not submitting form");
      return false;
    }

    try {
      //disable submit
      this._submitButton.disabled = true;

      var loadingDiv = document.createElement('div');
      loadingDiv.innerHTML = loaderTemplate({text: "Submitting..."});
      this._appDiv.appendChild(loadingDiv);

      var backdropDiv = document.createElement('div');
      backdropDiv.className = "modal-backdrop fadeIn"
      document.body.appendChild(backdropDiv);

      //Submit the files
      let result = await this.workflow.submit();
      console.log("Submit result", result)

      this._appDiv.querySelector('.workflow_content').innerHTML = submitCompleteTemplate({body: "The agreement has been submitted successfully. The first recipient should recieve an email shortly with a link to the agreement."});

      DOMUtils.removeElement(loadingDiv);
      DOMUtils.removeElement(backdropDiv);
    }
    catch(e) {
      console.error(e);

      DOMUtils.removeElement(loadingDiv);
      DOMUtils.removeElement(backdropDiv);

      //enable submit
      this._submitButton.disabled = false;
    }
  }

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
      this.workflow.formHooks.recipientGroups.push(recipientGrp);
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
        this.workflow.formHooks.carbonCopyGroups.push(ccGrp);
      }

      DOMUtils.removeClass(sectionNode, "hidden");
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
      this.workflow.formHooks.agreementName = agreementName;

      DOMUtils.removeClass(sectionNode, "hidden");
    }
  }

  createMessageSection(sectionNode) {
    //reset current node
    this.resetDOMNode(sectionNode, true);

    if ('message' in this.config) {
      let config = this.config.message;

      let messageSection = new MessageSection(config);
      messageSection.addToDOM(sectionNode);
      messageSection.setupValidation(this.validator);
      this.workflow.formHooks.message = messageSection;

      DOMUtils.removeClass(sectionNode, "hidden");
    }
  }

  createUploadSection(sectionNode) {
    //reset current node
    this.resetDOMNode(sectionNode, true);

    if ('files' in this.config && this.config.files.length > 0) {
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
          this.workflow.formHooks.files.push(file);
        }
        else {
          let file = new FileUpload(config[counter]);
          file.addToDOM(fieldsetNode);
          file.setupValidation(this.validator);
          this.workflow.formHooks.files.push(file);
        }
      }

      DOMUtils.removeClass(sectionNode, "hidden");
    }
  }

  createMergeSection(sectionNode) {
    //reset current node
    this.resetDOMNode(sectionNode, true);

    if ('mergeFields' in this.config && this.config.mergeFields.length > 0) {
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
        mergeField.setupValidation(this.validator);
        this.workflow.formHooks.mergeFields.push(mergeField);
      }

      DOMUtils.removeClass(sectionNode, "hidden");
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
      DOMUtils.removeClass(sectionNode, "hidden");
    }
  }

  createPasswordSubsection(sectionNode) {
    let config = this.config.password;

    // Get Password information
    if (config.visible) {
      let passwordOption = new PasswordOption(config);
      passwordOption.addToDOM(sectionNode);
      passwordOption.setupValidation(this.validator);
      this.workflow.formHooks.passwordOption = passwordOption;
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
        this.workflow.formHooks.expiration = expiration;
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
        this.workflow.formHooks.reminder = reminder;
        return true;
      }
    }

    return false;
  }

  resetDOMNode(node, hide) {
    if(hide) {
      node.classList.add("hidden");
    }
    else {
      DOMUtils.removeClass(node, "hidden");
    }

    //Remove children
    while (node.firstElementChild) {
        node.firstElementChild.remove();
    }
  }
}
