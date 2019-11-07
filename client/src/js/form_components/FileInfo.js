import Axios from 'axios';

export default class FileInfo {
  constructor(config) {
    this.file_name = config['name'];
    this.label = config['label'];
    this.required = config['required'];

    this.libDocList = (config['workflowLibraryDocumentSelectorList'] || null);

    this.workflow_lib_doc_id = (config['workflowLibraryDocumentSelectorList'] || null);

    this.transient_id = null;
    this.target_div = "";
    this.fileInfo = {};
  }

  addToDOM(parentNode) {
    const inputId = 'file_' + this.file_name;

    // Create the div
    var divNode = document.createElement('div');
    divNode.id = "file_info_" + this.file_name;
    divNode.className = "form-group form-row file_info_div";
    parentNode.appendChild(divNode);

    // Create the label
    var labelNode = document.createElement('label');
    labelNode.innerText = this.label;
    labelNode.htmlFor = inputId;
    labelNode.className = 'col-md-4 col-form-label';
    divNode.appendChild(labelNode);

    var inputDivNode = document.createElement('div');
    inputDivNode.className = "col-md-8";
    divNode.appendChild(inputDivNode);

    if (this.libDocList !== null) {
      var selectNode = document.createElement('select');
      selectNode.id = inputId;
      selectNode.name = inputId;
      selectNode.className = 'form-control';
      inputDivNode.appendChild(selectNode);

      if(!this.required) {
        let optionNode = document.createElement('option');
        optionNode.innerText = "-- None --";
        selectNode.appendChild(optionNode);
      }

      this.libDocList.forEach(doc => {
        let optionNode = document.createElement('option');
        optionNode.innerText = doc.label;
        optionNode.value = doc.workflowLibDoc;
        selectNode.appendChild(optionNode);
      });
    }
    else {
      var uploadDivNode = this.createFileUpload(inputId);
      inputDivNode.appendChild(uploadDivNode);
    }

    if(this.required) {
      labelNode.classList.add("required");
    }

    return;
  }

  createFileUpload(inputId) {
    var uploadDivNode = document.createElement('div');
    uploadDivNode.className = 'custom-file';
    uploadDivNode.id = 'upload_' + this.file_name;

    var inputNode = document.createElement('input');
    //inputNode.className = 'form-control-file';
    inputNode.className = 'custom-file-input';
    //inputNode.id = 'logo_' + this.file_name;
    inputNode.id = inputId;
    inputNode.type = 'file';
    uploadDivNode.appendChild(inputNode);

    var uploadLabelNode = document.createElement('span');
    uploadLabelNode.innerText = "Please Upload A File";
    uploadLabelNode.htmlFor = inputId;
    uploadLabelNode.className = 'custom-file-label text-truncate';
    uploadDivNode.appendChild(uploadLabelNode);

    if(this.required) {
      inputNode.required = true;
    }

    inputNode.onchange = async function () {
      this.handleFileUpload(inputNode, uploadLabelNode);
    }.bind(this);

    return uploadDivNode;
  }

  async handleFileUpload(inputNode, uploadLabelNode) {
    var file = inputNode.files[0];

    uploadLabelNode.innerText = file.name;

    var formData = new FormData();
    formData.append('myfile', file);

    const api_response = await Axios.post(apiBaseURL + 'api/postTransient', formData);
    this.transient_id =  (await api_response)['transientDocumentId'];
  }
}
