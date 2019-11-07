export default class MergeField {
  constructor(config){
    this.config = config;

    this.target_div = "";

    this.inputNode = null;


    this.field_name = config['fieldName'];
    this.display_name = config['displayName'];
    this.default_value = config['defaultValue'];
    this.editable = config['editable'];
    this.visable = config['visible'];
  }

  addToDOM(parentNode) {
    const inputId = 'merge_input_' + this.field_name;

    // Create the div
    var divNode = document.createElement('div');
    divNode.id = "merge_" + this.field_name;
    divNode.className = "form-group form-row";
    parentNode.appendChild(divNode);

    // Create the label
    var labelNode = document.createElement('label');
    labelNode.innerText = this.display_name;
    labelNode.htmlFor = inputId;
    labelNode.className = 'col-md-4 col-form-label';
    divNode.appendChild(labelNode);

    var inputDivNode = document.createElement('div');
    inputDivNode.className = "col-md-8";
    divNode.appendChild(inputDivNode);

    // Create the input
    var inputNode = document.createElement("input");
    inputNode.id = inputId;
    inputNode.className = 'form-control merge_input';
    inputDivNode.appendChild(inputNode);

    /*if(this.required) {
      inputNode.required = true;
      labelNode.classList.add("required");
    }*/

    // If data is not blank, fill it in with predefine information
    if(this.config.defaultValue !== ""){
      inputNode.value = this.config.defaultValue;
      inputNode.classList.add("predefined_input");
    }

    if(!this.config.editable) {
      inputNode.readonly = true;
    }

    //Track inputNode for retrieval later
    this.inputNode = inputNode;

    inputNode.onchange = function () {
        this.default_value = inputNode.value;
    }.bind(this);

    return;
  }

}
