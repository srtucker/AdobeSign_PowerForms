import RecipientGroup from './RecipientGroup';
import CarbonCopy from './CarbonCopy';
import FileInfo from './FileInfo';
import MergeField from './MergeField';
import Deadline from './Deadline';
import PassOption from './PassOption';

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
    }

    async buildRecipientsForm() {
        /**
         * This function will be building out the dynamic recipient group
         */

        // Clear out the old dynamic form
        this.removeRecipientForm('upload_section');
        this.removeRecipientForm('merge_section');
        this.removeRecipientForm('deadline_section');
        this.removeRecipientForm('send_options_section')
        this.removeRecipientForm('button_section');

        // Get workflow information
        this.data = await this.workflow_data;

        // TODO: set triggers for CC and Uploads

        this.createAgreementSection($(this.parent_div));
        this.createRecipientSection($(this.parent_div));
        if ('ccsListInfo' in this.data) {
          this.createCCSection($(this.parent_div));
        }

        // Get FileInfo information
        for (let counter = 0; counter < this.data['fileInfos'].length; counter++) {
            let file = this.data['fileInfos'][counter];
            this.file_info.push(new FileInfo(
                this.parent_div, file['name'], file['label'], file['required'], file['workflowLibraryDocumentSelectorList']));
            this.file_info[counter].createFileInfoDiv();
            this.file_info[counter].createDocumentTitleLabel();
            this.file_info[counter].createFileLabelName(this.file_info[counter]['required']);
        }

        // Get merged field information
        if ('mergeFieldsInfo' in this.data) {
            for (let counter = 0; counter < this.data['mergeFieldsInfo'].length; counter++) {
                let merge_field_data = this.data['mergeFieldsInfo'][counter];
                this.merge_fields.push(new MergeField(this.parent_div, merge_field_data));
                this.merge_fields[counter].createMergeFieldDiv();
                this.merge_fields[counter].createMergeFieldLabel();
                this.merge_fields[counter].createMergeFieldInput();
            }
        }

        // Get Deadline information
        this.deadline = new Deadline(this.parent_div, this.data['expirationInfo']);
        if (this.deadline.visable) {
            this.deadline.createDeadlineDiv();
            this.deadline.createCheckbox();
            this.deadline.createSubDiv();
        }

        // Get Password information
        if (this.data['passwordInfo'].visible) {
            this.pass_option = new PassOption(this.parent_div, this.data['passwordInfo']);
            this.pass_option.createPassDiv();
            this.pass_option.createCheckbox();
            this.pass_option.createSubPassDiv();
        }

        this.createRecipientFormButton(this.agreement_data, this.workflow_data);
    }

    getHidePredefinedTrigger() {
      //This function sets the hide_predefed trigger for workflows
      let workflow_name = this.data['displayName'];
      let hide_predefined = this.features['hide_predefined'];
      let hidden_list = this.features['hide_workflow_list'];

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
            async_wf_obj.createOpenPass(this.pass_option.getPass(), this.pass_option.getProtection());

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
        this.parent_div.children['button_section'].append(form_button);
    }

    removeRecipientForm(target_div) {
        /***
         * This function removes the whole dynamic form
         * @param {Object} target_div The div to the dynamic form
         */

        var removed_div = this.parent_div.children[target_div];

        while (removed_div.firstChild) {
            removed_div.removeChild(removed_div.firstChild)
        }
    }

    createAgreementSection(formElm) {
      let sectionElm = $('<div/>').attr('id', 'agreement_section');

      // label
      var agreement_name_label = $('<h3/>')
      agreement_name_label.html("Document Name");
      agreement_name_label.addClass('recipient_label');

      // input
      var agreement_name_input = $('<input/>');

      // Assign properties
      agreement_name_input.attr({
        id: "agreement_name",
        name: 'agreement_name',
        placeholder: "Enter Agreement Name",
        required: true
      });
      agreement_name_input.addClass('recipient_form_input');

      // Check to see if there's a default value
      if (this.data['agreementNameInfo']['defaultValue'] !== null) {
          agreement_name_input.val(this.data['agreementNameInfo']['defaultValue']);
      }

      sectionElm.append(agreement_name_label, agreement_name_input);
      formElm.append(sectionElm);
      //$('#agreement_section',formElm).replaceWith(sectionElm);

    }

  createRecipientSection(formElm) {
    let sectionElm = $('<div/>').attr('id', 'recipient_section');
    sectionElm.append($('<h2>Recipients</h2>'));

    // Set up triggers for features in config
    let hide_predefined_trigger = this.getHidePredefinedTrigger();

    let grps = this.recipient_groups;

    // Get Recipient Information
    for (let counter = 0; counter < this.data['recipientsListInfo'].length; counter++) {

      let recipient_group_data = this.data['recipientsListInfo'][counter];
      let recipientGrp = new RecipientGroup(this.recipeint_group_id, sectionElm, recipient_group_data);
      let recipientNode = recipientGrp.createRecipientDiv(hide_predefined_trigger);

      this.recipient_groups.push(recipientGrp);
      this.recipeint_group_id++;

      sectionElm.append(recipientNode);
    }


    formElm.append(sectionElm);
  }

  createCCSection(formNode) {
    let sectionNode = $('<div/>').attr('id', 'recipient_section');

    console.log(this.data)

    // Get CC Information
    let cc_group_data = this.data['ccsListInfo'][0];

    let label = cc_group_data.label;
    sectionNode.append($('<h2/>').html(label));

    let cc_group_recipients = cc_group_data['defaultValue'].split(",");
    let maxCount = cc_group_data['maxListCount'];
    let minCount = cc_group_data['minListCount'];
    let defaultCount = cc_group_recipients.length;

    //let availableCount = maxCount - defaultCount;


    for (let counter = 1; counter <= maxCount; counter++) {
      // If cc group is editable or count is less than number preset we will create them
      if (cc_group_data['editable'] ||  counter < cc_group_recipients.length) {
        let required = (counter <= minCount);
        let ccGrp = new CarbonCopy(counter, this.parent_div, cc_group_recipients[counter-1], required);
        let ccNode = ccGrp.createCcDiv();

        this.cc_group.push(ccGrp);

        sectionNode.append(ccNode);
      }
    }

    formNode.append(sectionNode);
  }
}
