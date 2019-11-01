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
        /**
         * This function will be building out the dynamic recipient group
         */

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

        // TODO: set triggers for CC and Uploads

        //bottom_form_top
        this.createInstructionSection($('#instruction_section', this.parent_div), this.data['description']);
        this.createRecipientSection($('#recipient_section', this.parent_div));
        if ('ccsListInfo' in this.data) {
          this.createCCSection($('#cc_section', this.parent_div));
        }

        //bottom_form_bottom
        this.createAgreementSection($('#agreement_section', this.parent_div));
        this.createMessageSection($('#message_section', this.parent_div));
        this.createLayoutDivs("upload");
        this.createHeaderLabel("upload", "Files");
        this.createLayoutDivs("merge");
        this.createHeaderLabel("merge", "Fields");


        // Get FileInfo information
        for (let counter = 0; counter < this.data['fileInfos'].length; counter++) {
            let file = this.data['fileInfos'][counter];
            this.file_info.push(new FileInfo(
                this.parent_div.children[1], file['name'], file['label'], file['required'], file['workflowLibraryDocumentSelectorList']));
            this.file_info[counter].createFileInfoDiv();
            this.file_info[counter].createDocumentTitleLabel();
            this.file_info[counter].createFileLabelName(this.file_info[counter]['required']);
        }

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

  createInstructionSection(sectionNode, msg){
    // Create element
    var instructionsNode = $('<p/>');

    // Assign properties
    instructionsNode.html(msg.replace(/(?:\r\n|\r|\n)/g, '</br>'));
    instructionsNode.addClass('instructions');

    sectionNode.empty().append(instructionsNode);
  }

  createMessageSection(sectionNode) {
    const inputId = "messages_input";

    // Create the label
    var label = $('<label/>')
    label.html("Messages");
    label.attr("for", inputId);
    label.addClass("recipient_label");

    // Create the input
    var input = $("<textarea/>");
    input.attr({
      id: inputId,
      name: 'messages_input',
      rows: 3,
      placeholder: "Message"
    });
    input.addClass('recipient_form_input form-control');

    // Check to see if there's a default value
    if (this.data['messageInfo']['defaultValue'] !== null) {
      input.val(this.data['messageInfo']['defaultValue']);
    }

    // Append to parent
    sectionNode.empty().append(label, input);
  }

  createAgreementSection(sectionNode) {
    const inputId = "agreement_name";

    // Create the label
    var label = $('<label/>');
    label.html("Document Name");
    label.attr("for", inputId);
    label.addClass('recipient_label required');

    // Create the input
    var input = $('<input/>');
    input.attr({
      id: inputId,
      name: 'agreement_name',
      placeholder: "Enter Agreement Name",
      required: true
    });
    input.addClass('recipient_form_input form-control');

    // Check to see if there's a default value
    if (this.data['agreementNameInfo']['defaultValue'] !== null) {
      input.val(this.data['agreementNameInfo']['defaultValue']);
    }

    sectionNode.empty().append(label, input);
    //formElm.append(sectionElm);
    //$('#agreement_section',formElm).replaceWith(sectionElm);

  }

  createRecipientSection(sectionNode) {
    let newNodes = [];
    newNodes.push($('<h2>Recipients</h2>'));

    // Set up triggers for features in config
    let hide_predefined = this.features['hide_predefined'];
    let hidden_list = this.features['hide_workflow_list'];
    let hide_predefined_trigger = this.getHidePredefinedTrigger(hide_predefined, hidden_list);

    let grps = this.recipient_groups;

    // Get Recipient Information
    for (let counter = 0; counter < this.data['recipientsListInfo'].length; counter++) {

      let recipient_group_data = this.data['recipientsListInfo'][counter];
      let recipientGrp = new RecipientGroup(this.recipeint_group_id, recipient_group_data);
      let recipientNode = recipientGrp.createRecipientDiv(hide_predefined_trigger);

      this.recipient_groups.push(recipientGrp);
      this.recipeint_group_id++;

      newNodes.push(recipientNode);
    }

    sectionNode.append(newNodes);
  }

  createCCSection(sectionNode) {
    let newNodes = [];
    //let sectionNode = $('<div/>').attr('id', 'recipient_section');

    console.log(this.data)
    // Set up triggers for features in config
    let hide_predefined = this.features['hide_cc'];
    let hidden_list = this.features['hide_cc_workflow_list'];
    let hide_predefined_trigger = this.getHidePredefinedTrigger(hide_predefined, hidden_list);

    // Get CC Information
    let cc_group_data = this.data['ccsListInfo'][0];

    newNodes.push($('<h2/>').html(cc_group_data.label));

    let cc_group_recipients = cc_group_data['defaultValue'].split(",");
    let maxCount = cc_group_data['maxListCount'];
    let minCount = cc_group_data['minListCount'];
    let defaultCount = cc_group_recipients.length;

    //let availableCount = maxCount - defaultCount;

    for (let counter = 1; counter <= maxCount; counter++) {
      // If cc group is editable or count is less than number preset we will create them
      if (cc_group_data['editable'] ||  counter < cc_group_recipients.length) {
        let required = (counter <= minCount);
        let ccGrp = new CarbonCopy(counter, cc_group_recipients[counter-1], required);
        let ccNode = ccGrp.createCcDiv(hide_predefined_trigger);

        this.cc_group.push(ccGrp);

        newNodes.push(ccNode);
      }
    }

    sectionNode.append(newNodes);
  }
}
