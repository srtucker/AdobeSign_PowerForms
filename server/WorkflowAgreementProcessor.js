
class WorkflowAgreementProcessor {
  constructor(agreementReq, settings) {
    this.agreementReq = agreementReq;
    this.settings = settings;
  }

  getAgreement() {
    let creationInfo = {};

    creationInfo.fileInfos = this.buildFiles();
    creationInfo.name = this.buildAgreementName();
    creationInfo.recipientsListInfo = this.buildRecipients();
    //creationInfo.callbackInfo = this.();
    creationInfo.ccs = this.buildCarbonCopy();
    creationInfo.daysUntilSigningDeadline = this.buildExpiration();
    //creationInfo.formFieldLayerTemplates = this.();
    //creationInfo.formFields = this.();
    //creationInfo.locale = this.();
    creationInfo.mergeFieldInfo = this.buildMergeFields();
    creationInfo.message = this.buildMessage();
    //creationInfo.postSignOptions = this.();
    creationInfo.reminderFrequency = this.buildReminder();
    creationInfo.securityOptions = this.buildSecurityOptions();
    //creationInfo.vaultingInfo = this.();

    return {
      documentCreationInfo: creationInfo
    }
  }

  buildRecipients() {
    //this.agreementReq.recipients
  }

  buildCarbonCopy() {
    //carbonCopies
  }

  buildAgreementName() {
    //agreementName
  }

  buildMessage() {
    //message
  }

  buildFiles() {
    //files
  }

  buildMergeFields() {
    //mergeFields
  }

  buildSecurityOptions() {
    //password
  }

  buildExpiration() {
    //expiration
  }

  buildReminder() {
    //reminder
  }

}

module.exports = WorkflowAgreementProcessor;
