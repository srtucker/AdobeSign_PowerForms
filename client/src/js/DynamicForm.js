import RecipientGroup from './RecipientGroup';
import CarbonCopy from './CarbonCopy';
import FileInfo from './FileInfo';
import MergeField from './MergeField';
import Deadline from './Deadline';
import PassOption from './PassOption';
import Reminder from './Reminder';

export default class DynamicForm {
  constructor(parent_div, data, agreement_data, features) {
        this.parent_div = parent_div;
        this.workflow_data = data;
        this.agreement_data = agreement_data;
        this.recipient_groups = [];
        this.recipeint_group_id = 0;
        this.file_info = [];
        this.merge_fields = [];
        this.deadline = null;
        this.features = features;
        this.cc_group = [];
        this.pass_option = "";
        this.reminders = "";
    }

  async buildRecipientsForm() {
    // Clear out the old dynamic form
    this.removeRecipientForm('upload_section');
    this.removeRecipientForm('merge_section');
    this.removeRecipientForm('deadline_section');
    this.removeRecipientForm('reminder_section');
    this.removeRecipientForm('send_options_section');
    this.removeRecipientForm('form_submit');

    // Hide merge
    $('#merge_section', this.parent_div).hide();

    // Get workflow information
    this.data = await this.workflow_data;
    console.log(this.data)

    // TODO: set triggers for CC and Uploads

    //bottom_form_top
    this.createInstructionSection($('#instruction_section', this.parent_div)[0], this.data['description']);
    //this.createRecipientSection($('#recipient_section', this.parent_div)[0]);
    //this.createCCSection($('#cc_section', this.parent_div)[0]);

    //bottom_form_bottom
    this.createAgreementSection($('#agreement_section', this.parent_div)[0]);
    this.createMessageSection($('#message_section', this.parent_div)[0]);
    this.createUploadSection($('#upload_section', this.parent_div)[0]);



    //this.createLayoutDivs("upload");
    //this.createHeaderLabel("upload", "Files");
    this.createLayoutDivs("merge");
    this.createHeaderLabel("merge", "Fields");


        // Get FileInfo information
        /*for (let counter = 0; counter < this.data['fileInfos'].length; counter++) {
            let file = this.data['fileInfos'][counter];
            this.file_info.push(new FileInfo(
                this.parent_div.children[1], file['name'], file['label'], file['required'], file['workflowLibraryDocumentSelectorList']));
            this.file_info[counter].createFileInfoDiv();
            this.file_info[counter].createDocumentTitleLabel();
            this.file_info[counter].createFileLabelName(this.file_info[counter]['required']);
        }*/

        // Get merged field information
        if ('mergeFieldsInfo' in this.data) {
            $('#merge_section', this.parent_div).show();
            for (let counter = 0; counter < this.data['mergeFieldsInfo'].length; counter++) {
                let merge_field_data = this.data['mergeFieldsInfo'][counter];
                this.merge_fields.push(new MergeField(this.parent_div.children[1], merge_field_data));
                this.merge_fields[counter].createMergeFieldDiv();
                this.merge_fields[counter].createMergeFieldLabel();
                this.merge_fields[counter].createMergeFieldInput();
            }
        }

        // Get Deadline information
        if( 'expirationInfo' in this.data){
            this.deadline = new Deadline(this.parent_div.children[1], this.data['expirationInfo']);
            if (this.deadline.visable) {
                this.deadline.createDeadlineDiv();
                this.deadline.createCheckbox();
                this.deadline.createSubDiv();
            }
        }

        // Get Password information
        if (this.data['passwordInfo'].visible) {
            this.pass_option = new PassOption(this.parent_div.children[1], this.data['passwordInfo']);
            this.pass_option.createPassDiv();
            this.pass_option.createCheckbox();
            this.pass_option.createSubPassDiv();
        }

        // Get Reminder information
        this.reminders = new Reminder(this.parent_div.children[1]);
        this.reminders.createReminderDiv();
        this.reminders.createReminderbox();
        this.reminders.createSubDiv();

        this.createRecipientFormButton(this.agreement_data, this.workflow_data);

        $('#dynamic_form').show();
    }

    getHidePredefinedTrigger(hide_predefined, hidden_list) {
      //This function sets the hide_predefed trigger for workflows
      let workflow_name = this.data['displayName'];

      let hide_trigger = false;

      if (hide_predefined === 'yes') {
        if(hidden_list === null) {
          hide_trigger = true;
        }
        else {
          hide_trigger = hidden_list.includes(workflow_name);
        }
      }

      return hide_trigger;
    }

    createLayoutDivs(name){
        /***
         * This function will create the file info div
         */

        // Create the element
        var file_header_div = document.createElement('div');
        var file_body_div = document.createElement('div');

        // Assign the attributes
        file_header_div.id = name + "_header";
        file_body_div.id = name + "_body";

        // Append
        var parent_div = document.getElementById(name + '_section')
        parent_div.append(file_header_div);
        parent_div.append(file_body_div);
    }

    createHeaderLabel(name, inner_html){
        /***
         * This function will append the file label to the file header
         */

        // Create the element
        var file_header_label = document.createElement('h3');

        // Assign the attributes
        file_header_label.id = name + "_header_label";
        file_header_label.className = "recipient_label";
        file_header_label.innerHTML = inner_html;

        // Append
        document.getElementById(name + '_header').append(file_header_label);
    }

    async createRecipientFormButton(workflow_object, workflow_data) {
        /***
         * This function will create submit button on the dynamic form
         * @param {Object} workflow_object The object to create workflow agreement
         * @param {Object} workflow_data The object that stores the workflow data
         */
        var async_wf_obj = await workflow_object;
        var wf_data = await workflow_data;

        // Create the button and style it
        var form_button = document.createElement('button');
        form_button.className = "btn btn-primary btn-custom";
        form_button.innerHTML = "Submit";
        form_button.type = "button";
        form_button.id = "recipient_submit_button";

        // If password is required disable the button
        if(this.pass_option.required){
            form_button.disabled = true;
        }

        // Add onClick event to submit button
        form_button.onclick = async function () {
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
            })
                .then(function (data) {
                    return data;
                });

            if ('url' in response) {
                alert('Agreement Sent');
                window.location.reload();
            } else {
                async_wf_obj.clearData();
                alert(response['message']);
            }
        }.bind(this);

        // Add button to the parent div
        this.parent_div.children['form_submit'].append(form_button);
    }

    removeRecipientForm(target_div) {
        /***
         * This function removes the whole dynamic form
         * @param {Object} target_div The div to the dynamic form
         */

        var removed_div = document.getElementById(target_div);

        while (removed_div.firstChild) {
            removed_div.removeChild(removed_div.firstChild)
        }
  }

  // START of verified section


  createInstructionSection(sectionNode, msg){
    //reset current node first
    this.resetDOMNode(sectionNode, false);

    // Create element
    var instructionsNode = document.createElement('p');

    // Assign properties
    instructionsNode.innerHTML = msg.replace(/(?:\r\n|\r|\n)/g, '</br>');
    instructionsNode.className = 'instructions';

    sectionNode.appendChild(instructionsNode);
  }

  createRecipientSection(sectionNode) {
    let settings = this.features.recipients;
    let data = this.data.recipientsListInfo;

    //reset current node
    this.resetDOMNode(sectionNode, false);

    let fieldsetNode = document.createElement('fieldset');
    sectionNode.appendChild(fieldsetNode);

    let headerNode = document.createElement('legend');
    headerNode.innerHTML = "Recipients";
    fieldsetNode.appendChild(headerNode);

    // Get Recipient Information
    for (let counter = 0; counter < data.length; counter++) {
      let recipientGrp = new RecipientGroup(this.recipeint_group_id, data[counter]);
      let recipientNode = recipientGrp.createRecipientDiv(settings);
      fieldsetNode.appendChild(recipientNode);

      this.recipient_groups.push(recipientGrp);
      this.recipeint_group_id++;
    }
  }

  createCCSection(sectionNode) {
    if ('ccsListInfo' in this.data) {
      let settings = this.features.cc;
      let data = this.data.ccsListInfo[0];

      //reset current node
      this.resetDOMNode(sectionNode, false);

      let fieldsetNode = document.createElement('fieldset');
      sectionNode.appendChild(fieldsetNode);

      let headerNode = document.createElement('legend');
      headerNode.innerHTML = data.label;
      fieldsetNode.appendChild(headerNode);

      let defaultCCs = data.defaultValue.split(/,|;/);
      let maxCount = data.maxListCount;
      let minCount = data.minListCount;
      let defaultCount = defaultCCs.length;

      //let availableCount = maxCount - defaultCount;

      for (let counter = 1; counter <= maxCount; counter++) {
        // If cc group is editable or count is less than number preset we will create them
        if (data.editable || counter < defaultCount) {
          let required = (counter <= minCount);
          let ccGrp = new CarbonCopy(counter, defaultCCs[counter-1], required, data.editable);
          let ccNode = ccGrp.createCcDiv(settings);
          fieldsetNode.appendChild(ccNode);

          this.cc_group.push(ccGrp);
        }
      }
    }
    else {
      //reset current node & hide
      this.resetDOMNode(sectionNode, true);
    }
  }

  createAgreementSection(sectionNode) {
    let settings = this.features.agreementName;
    let data = this.data.agreementNameInfo;
    const inputId = "agreement_name";

    //reset current node first
    this.resetDOMNode(sectionNode, false);

    sectionNode.classList.add("form-group");

    // Create the label
    var labelNode = document.createElement('label');
    labelNode.innerHTML = "Agreement Name";
    labelNode.htmlFor = inputId;
    labelNode.className = "recipient_label required";
    sectionNode.appendChild(labelNode);

    // Create the input
    var inputNode = document.createElement("input");
    inputNode.id = inputId;
    inputNode.name = 'agreement_name';
    inputNode.placeholder = "Enter Agreement Name";
    inputNode.className = 'recipient_form_input form-control';
    inputNode.required = true;
    sectionNode.appendChild(inputNode);

    // Check to see if there's a default value
    if (data.defaultValue !== null) {
      inputNode.value = data.defaultValue;
    }

    if(settings.hide) {
      inputNode.readonly = true;
      sectionNode.classList.add("hidden");
    }
  }

  createMessageSection(sectionNode) {
    let settings = this.features.message;
    let data = this.data.messageInfo;
    const inputId = "messages_input";

    //reset current node first
    this.resetDOMNode(sectionNode, false);

    sectionNode.classList.add("form-group");

    // Create the label
    var labelNode = document.createElement('label');
    labelNode.innerHTML = "Messages";
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
    if (data.defaultValue !== null) {
      inputNode.value = data.defaultValue;
    }

    if(settings.hide) {
      inputNode.readonly = true;
      sectionNode.classList.add("hidden");
    }
  }

  createUploadSection(sectionNode) {
    let settings = this.features.files;
    let data = this.data.fileInfos;

    //reset current node
    this.resetDOMNode(sectionNode, false);

    let fieldsetNode = document.createElement('fieldset');
    sectionNode.appendChild(fieldsetNode);

    let headerNode = document.createElement('legend');
    headerNode.innerHTML = "Files";
    fieldsetNode.appendChild(headerNode);

    // Get FileInfo information
    for (let counter = 0; counter < data.length; counter++) {
        let file = new FileInfo(data[counter]);
        let fileNode = file.createFileInfoDiv(settings);
        fieldsetNode.appendChild(fileNode);
        //this.file_info[counter].createDocumentTitleLabel();
        //this.file_info[counter].createFileLabelName(this.file_info[counter]['required']);

        this.file_info.push(file);
    }

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
}
