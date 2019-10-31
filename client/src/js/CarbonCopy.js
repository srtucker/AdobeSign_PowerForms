export default class CarbonCopy {
  constructor(id, parent_div, email, required){
    this.id = id;
    this.parent_div = parent_div;
    this.email = email;
    this.required = required;
    this.target_div = "";
    this.predefined = false;
  }

  createCcDiv(){
    const inputId = 'cc_123' + this.id;

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
      name: 'cc_' + this.id,
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
    }

    // Add on change event to update user email
    input.change(this, (event) => {
      event.data.email = $(event.target).val();
    });

    div.append(label, input)

    // Append to parent
    this.target_div = div;
    return div;
  }
}
