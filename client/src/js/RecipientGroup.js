export default class RecipientGroup {
  constructor(group_id, recipient_group_data){
    this.group_id = group_id;
    this.recipient_group_data = recipient_group_data;
    this.number_of_members = 0;
    this.target_div = "";
    this.inputNode = null;

    this.required = !(this.recipient_group_data.minListCount == 0);
  }

  createRecipientDiv(hide_predefined) {
    const inputId = 'recipient_' + this.group_id;

    // Create the div
    var div = $('<div/>');
    div.attr('id', "recipient_group_" + this.group_id);
    div.addClass("add_border_bottom");

    // Create the label
    var label = $('<label/>')
    label.html(this.recipient_group_data['label']);
    label.attr("for", inputId);
    label.addClass("recipient_label");

    // Create the input
    var input = $("<input/>");
    input.attr({
      type: "email",
      id: inputId,
      name: inputId,
      placeholder: "Enter Recipient's Email"
    });
    input.addClass('recipient_form_input form-control');

    if(this.required) {
      input.attr('required', '');
      label.addClass("required");
    }

    // If data is not blank, fill it in with predefine information
    if (this.recipient_group_data['defaultValue'] !== "") {
      input.val(this.recipient_group_data['defaultValue']);
      input.addClass("predefined_input");

      if(!this.recipient_group_data.editable) {
        input.attr('readonly', '');
      }

      // Hide settings
      if(hide_predefined) {
          div.addClass('recipient_hidden');
      }
    }

    //Track inputNode for retrieval later
    this.inputNode = input


    // This feature is currently blocked. There's a bug in Adobe API that
    // has been reported. Once this bug is fixed, it will be enabled in
    // the next version.

    // // If group is a recipient group
    // if (this.recipient_group_data['maxListCount'] > 1) {
    //     this.createAdditionalRecipientInput(input.id);
    //     this.removeParticipentButton(this.target_div);
    // }

    div.append(label, input);

    this.target_div = div;
    return div
  }


  createAdditionalRecipientInput(recipient_id) {
      /***
       * This function add additions recipeints input
       */

      var add_div = document.createElement('div');
      add_div.id = 'add_section_' + this.group_id;
      add_div.className = "add_section";
      this.target_div.appendChild(add_div);

      // Create the add new recipient button
      var add_marker_button = document.createElement("button");
      add_marker_button.type = "button";
      add_marker_button.id = "add_button";

      // Add onclick function to allow us to create new recipient inputs
      add_marker_button.onclick = function () {
          let new_recipient_id = recipient_id + '_' + this.number_of_members;
          this.number_of_members++;
          this.appendNewParticipentInput(new_recipient_id);
      }.bind(this);

      add_div.append(add_marker_button);

      // Add the plus icon to the button
      var add_recipient_marker = document.createElement("i");
      add_recipient_marker.className = "fa fa-plus";

      add_marker_button.appendChild(add_recipient_marker)
  }

  appendNewParticipentInput(participent_id) {
      /***
       * This functiuon appends a new recipient input
       */

      // Create a line break
      var linebreak = document.createElement("br");

      // Create new input field
      var participent_input = document.createElement('input');
      participent_input.type = "text";
      participent_input.className = "recipient_form_input";
      participent_input.placeholder = "Enter Recipient's Email";
      participent_input.id = participent_id;
      participent_input.name = participent_id;

      // Append to the div before buttons
      var target = document.getElementById("add_section_" + this.group_id);
      this.target_div.insertBefore(participent_input, target);
  }

  removeParticipentButton() {
      /***
       * This function removes a recipient
       */

      var remove_button = document.createElement("button");
      remove_button.type = "button";
      remove_button.id = "remove_button";
      remove_button.onclick = function () {
          if(this.number_of_members > 0){
              // remove input field
              this.target_div.removeChild(this.target_div.querySelectorAll("input")[this.number_of_members]);
              this.number_of_members--;
          }
      }.bind(this);
      document.getElementById('add_section_' + this.group_id).appendChild(remove_button);

      var remove_button_marker = document.createElement("i");
      remove_button_marker.className = "fa fa-minus";
      remove_button.appendChild(remove_button_marker);
  }

  getEmail() {
    return this.inputNode.val();
  }
}
