import template from 'AgreementPassword.hbs'

export default class PassOption {
  constructor(config){
    this.required = config['required'];

    this.protectCheckbox;
    this.passContainer;
    this.showPassCheckbox;
    this.passwordInput;
    this.passwordConfirmInput;

    this.target_div = "";
    this.disabled_button = false;
    this.checked = false;
  }

  createDiv(parentNode){
    // Create the div
    let div = document.createElement('div');
    div.innerHTML = template();
    div.className = "pdf-protect-section compose-option-section";
    parentNode.appendChild(div);

    //create hooks
    this.protectCheckbox = document.getElementById('pdf-protect');
    this.passContainer = document.getElementById('password-container');
    this.showPassCheckbox = document.getElementById('show-password');
    this.passwordInput = document.getElementById('protect-password');
    this.passwordConfirmInput = document.getElementById('protect-password-confirm');

    //set initial values
    if(this.required){
      this.protectCheckbox.checked = true;
      this.protectCheckbox.disabled = true;
      //this.disabled_button = true;
    }

    // Add event handlers
    this.protectCheckbox.onclick = function () {
      this.checkBoxChangeHandler();
    }.bind(this);

    this.showPassCheckbox.onclick = function() {
      if(this.showPassCheckbox.checked === false){
        this.passwordInput.type = 'password';
        this.passwordConfirmInput.type = 'password';
      }
      else{
        this.passwordInput.type = 'text';
        this.passwordConfirmInput.type = 'text';
      }
    }.bind(this);


    // run change handler once to set inital settings
    this.checkBoxChangeHandler();

    return true;
  }

  checkBoxChangeHandler() {
    // Hide sub pass div
    if(this.protectCheckbox.checked === true){
      this.passContainer.hidden = false;
      this.checked = true;

      // Disable button on empty
      if(this.passwordInput.value.length === 0){
        document.getElementById('recipient_submit_button').disabled = true;
      }

      // Reenable submit button if it's disabled
      if (this.disabled_button) {
        //var submit_button = document.getElementById('recipient_submit_button');
        //submit_button.disabled = true;
        this.disabled_button = false;
      }
    }
    // Show sub pass div
    else {
      this.passContainer.hidden = true;
      //var submit_button = document.getElementById('recipient_submit_button');
      //submit_button.disabled = false;
      this.checked = false;;
    }
  }

  createErrorMsg(){
      /***
       * This function creates the error message
       */

      // Create label for recipient
      var label = document.createElement('h3');

      // Add attributes
      label.className = "recipient_label error_msg";
      label.innerHTML = "Password Requirment Not Met";
      label.hidden = true;

      // Get divs for validations
      var pass_input = document.getElementById('Password');
      var confirm_input = document.getElementById('Confirm Password');

      // Add validation functions
      this.getValidation(pass_input, label);
      this.getValidation(confirm_input, label);

  }

  getValidation(target_div,label){
    /***
     * This function checks for input validations
     * @param {Object} target_div Div to apply event listener
     * @param {Object} label error message label
     */

    target_div.onchange = function(){
      var submit_button = document.getElementById('recipient_submit_button');
      // Enable submit and hide error msg if input matches
      if(document.getElementById("Password").value === document.getElementById("Confirm Password").value
      && document.getElementById('Password').value.length > 0){
        submit_button.disabled = false;
        label.hidden = true;
        this.disabled_button = false;
      }
      // Disable submit, set trigger, and show error message if mismatch
      else{
        submit_button.disabled = true;
        this.disabled_button = true;
        label.hidden = false;
      }
    }.bind(this)
  }

  getPass(){
    if(this.checked){
      return this.passwordInput.value;
    }
    else{
      return "";
    }
  }

  getProtection(){
    /***
     * This function returns the protection mode
     */

    if(document.getElementById('Password').value === " "){
      return false;
    }
    else{
      return true;
    }
  }
}
