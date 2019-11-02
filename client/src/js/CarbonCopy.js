export default class CarbonCopy {
  constructor(id, email, required, editable){
    this.id = id;
    this.email = email;
    this.required = required;
    this.editable = editable;
    this.predefined = false;

    this.inputNode = null;
  }

  createCcDiv(settings){
    let hide_predefined = settings.hide_predefined;
    let hide_readonly = settings.hide_readonly;
    const inputId = 'cc_' + this.id;

    // Create the div
    var divNode = document.createElement('div');
    divNode.id = "cc_div_" + this.id;
    divNode.className = "add_border_bottom";

    // Create the label
    var labelNode = document.createElement('label');
    labelNode.innerHTML = "CC";
    labelNode.htmlFor = inputId;
    labelNode.className = "recipient_label";
    divNode.appendChild(labelNode);

    // Create the input
    var inputNode = document.createElement("input");
    inputNode.type = "email";
    inputNode.id = inputId;
    inputNode.name = inputId;
    inputNode.className = 'recipient_form_input form-control';
    inputNode.placeholder = "Enter Cc's Email";
    divNode.appendChild(inputNode);

    if(this.required) {
      inputNode.required = true;
      labelNode.classList.add("required");
    }

    // Add predefine tags
    if( typeof this.email !== "undefined"){
      inputNode.value = this.email;
      inputNode.classList.add("predefined_input");

      this.predefined = true;

      if(!this.editable) {
        inputNode.readonly = true;

        if(hide_readonly) {
          divNode.classList.add('recipient_hidden');
        }
      }

      // Hide settings
      if(hide_predefined) {
        divNode.classList.add('recipient_hidden');
      }
    }

    // Add on change event to update user email
    inputNode.onchange = function(){
        this.email = inputNode.value;
    }.bind(this);

    //Track inputNode for retrieval later
    this.inputNode = inputNode

    return divNode;
  }

  getEmail() {
    return this.inputNode.value;
  }
}
