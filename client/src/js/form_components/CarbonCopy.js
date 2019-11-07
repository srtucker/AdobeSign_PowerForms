import Utils from './Utils';

export default class CarbonCopy {
  constructor(id, email, required, editable){
    this.id = id;
    this.email = email;
    this.required = required;
    this.editable = editable;
    this.predefined = false;

    this.inputNode = null;
    this.inputId;
  }

  createDiv(){
    const inputId = 'cc_' + this.id;
    this.inputId = inputId;

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

  setupValidation(validator) {
    let validationFn = this.runValidation.bind(this);

    let validationTracker = validator.createTracker(this.inputNode, validationFn);

    this.inputNode.onchange = function() {
      validationFn(validationTracker);
    };

    return [validationTracker];
  }

  runValidation(validationTracker) {
    let error = false;
    let message = null;
    let email = this.inputNode.value;

    if(this.required && email == "") {
      error = true;
      message = `CC recipient ${this.id} is required.`
    }
    else if(email != "" && !Utils.isValidEmail(email)) {
      error = true;
      message = `The email "${email}" for CC recipient ${this.id} is not a valid email address.`
    }

    if(error) {
      this.inputNode.classList.add("is-invalid");
    }
    else {
      Utils.removeClass(this.inputNode, "is-invalid");
    }

    validationTracker.update(error, message);

    return status;
  }

  getEmail() {
    return this.inputNode.value;
  }
}
