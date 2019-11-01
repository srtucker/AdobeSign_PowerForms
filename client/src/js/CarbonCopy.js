export default class CarbonCopy {
  constructor(id, email, required){
    this.id = id;
    this.email = email;
    this.required = required;
    this.predefined = false;

    this.inputNode = null;
  }

  createCcDiv(hide_predefined){
    const inputId = 'cc_' + this.id;

    // Create the element
    var div = $('<div/>');
    div.attr('id', "cc_div_" + this.id);
    div.addClass("add_border_bottom");

    // Create the label
    var label = $('<label/>')
    label.html("CC");
    label.attr("for", inputId);
    label.addClass("recipient_label");

    // Create the input
    var input = $("<input/>");
    input.attr({
      type: "email",
      id: inputId,
      name: inputId,
      placeholder: "Enter Cc's Email"
    });
    input.addClass('recipient_form_input form-control');

    if(this.required) {
      input.attr('required', '');
      label.addClass("required");
    }

    // Add predefine tags
    if( typeof this.email !== "undefined"){
      input.val(this.email);
      input.addClass("predefined_input");

      this.predefined = true;

      // Hide settings
      if(hide_predefined) {
          div.addClass('recipient_hidden');
      }
    }

    // Add on change event to update user email
    input.change(this, (event) => {
      event.data.email = $(event.target).val();
    });

    //Track inputNode for retrieval later
    this.inputNode = input

    div.append(label, input);
    return div;
  }

  getEmail() {
    return this.inputNode.val();
  }
}
