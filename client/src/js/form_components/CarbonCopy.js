import Utils from '../util/Utils';
import CarbonCopyLine from './CarbonCopyLine';

export default class CarbonCopy {
  constructor(id, config){
    this.id = id;
    this.config = config;

    //this.inputNodes = [];
    this.carbonCopyLines = [];
  }

  addToDOM(parentNode) {
    let fieldsetNode = document.createElement('fieldset');
    parentNode.appendChild(fieldsetNode);

    let headerNode = document.createElement('legend');
    headerNode.innerHTML = this.config.label;
    fieldsetNode.appendChild(headerNode);

    let readOnly = !this.config.editable;
    let defaultValuesCount = this.config.defaultValues.length;
    let maxCount = (this.config.editable) ? this.config.maxListCount : defaultValuesCount;

    for (let i=1; i <= maxCount; i++) {
      let required = (i <= this.config.minListCount);
      let ccLine = new CarbonCopyLine(i, this.config.defaultValues[i-1], required, readOnly);
      ccLine.addToDOM(fieldsetNode);
      this.carbonCopyLines.push(ccLine);
    }
  }

  setupValidation(validator) {
    this.carbonCopyLines.forEach(carbonCopyLine => {
      carbonCopyLine.setupValidation(validator);
    });
  }

  runValidation(validationTracker) {
    this.carbonCopyLines.forEach(carbonCopyLine => {
      carbonCopyLine.runValidation(validationTracker);
    });
  }

  getValues() {
    if (this.config.editable) {
      return {
        name: this.config.name,
        emails: this.carbonCopyLines.reduce((results, carbonCopyLine) => {
          let val = carbonCopyLine.getValues();
          if(val !== null && val != "") {
            results.push(val);
          }
          return results;
        }, []),
      }
    }
    return null;
  }
}
