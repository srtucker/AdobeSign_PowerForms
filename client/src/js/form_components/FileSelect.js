import Utils from '../util/Utils';
import fileSelectTemplate from 'FileSelect.hbs';

export default class FileSelect {
  constructor(config) {
    this.config = config;
    this.libDocList = (config['workflowLibraryDocumentSelectorList'] || null);

    this._selectNode;
  }

  addToDOM(parentNode) {
    let data = {
      inputId: 'file_' + this.config.name,
      label: this.config.label,
      required: this.config.required,
      libDocList: this.libDocList
    };

    if(!this.config.required) {
      data.libDocList.push({
        label: "-- None --",
        workflowLibDoc: null
      });
    }
    else if(this.libDocList.length > 1) {
      data.libDocList.push({
        label: "-- Select a document --",
        workflowLibDoc: null
      });
    }

    data.libDocList.sort((a, b) => {
        if(a.workflowLibDoc == null) {
          return -1;
        }
        else if(b.workflowLibDoc == null) {
          return 1;
        }
        else {
          return a.label.localeCompare(b.label);
        }
      });

    // Create the div
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = fileSelectTemplate(data);
    var div = tempDiv.firstChild
    parentNode.appendChild(div);

    //create hooks
    this._selectNode = div.querySelector('select');
  }

  setupValidation(validator) {
    let validationFn = this.runValidation.bind(this);
    let validationTracker = validator.createTracker(this._selectNode, validationFn);

    this._selectNode.addEventListener("change", (event) => {
      validationFn(validationTracker, event);
    });
  }

  runValidation(validationTracker, event) {
    let error = false;
    let message = null;
    let docId = this._selectNode.value;

    if(this.config.required && docId == "") {
      error = true;
      message = `The file "${this.config.label}" is required.`
    }

    if(error) {
      this._selectNode.classList.add("is-invalid");
    }
    else {
      Utils.removeClass(this._selectNode, "is-invalid");
    }

    validationTracker.update(error, message);
  }

  getValues() {
    let docId = this._selectNode.value;
    if (docId) {
      return {
        name: this.config.name,
        workflowLibraryDocumentId: docId
      }
    }
    return null;
  }
}
