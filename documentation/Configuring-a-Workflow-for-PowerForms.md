
# Adobe Sign - Configuring a Workflow for PowerForms

## Table of Contents
-   [About](#about)
-   [Workflow Configuration](#workflow-configuration)
    - [Workflow Info](#workflow-info)
    -   [Agreement Info](#agreement-info)
    -   [Recipients](#recipients)
    -   [Documents](#documents)
    -   [Sender Input Fields](#sender-input-fields)
        -   [Merge Fields](#merge-fields)
            -   [WFSetting_SendingAccount](#wfsetting_sendingaccount)
            -   [WFSetting_HideAgreementName](#wfsetting_hideagreementname)
            -   [WFSetting_Reminder](#wfsetting_reminder)
-   [Testing the PowerForm](#testing-the-powerform)

## About

The Adobe Sign PowerForm is a custom application created by A&F at Cal Poly to provide a solution for self-service forms. It was created to fill an Adobe Sign gap where multiple signers need to be defined by the individual requesting the form. An example would be a self-service form that requires supervisor approval. The supervisor would be dependent on the individual initiating the form. The PowerForm allows the individual initiating the form to supply the appropriate email address.

A PowerForm is launched via URL and there are no restrictions on who may use it. Once a PowerForm has been successfully submitted, the first recipient will receive an email to the address submitted with a link to the Adobe Sign form. A PowerForm accepts any valid email. There is no validation against the Cal Poly Directory. Provisioned Cal Poly staff and faculty will need to authenticate with their Cal Poly Portal credentials to launch the form, while everyone else will be taken to directly to the signing session.

Document Unit Coordinators (DUCs) with group administrator privileges can configure PowerForms via Workflow Designer in Adobe Sign. Settings in Adobe Sign Workflow Designer create the web-based user interface.

>The PowerForm application is provided as is by A&F for the use by the Cal Poly community. No user support is provided by Adobe Sign, A&F, or any other Cal Poly department.

Questions or comments regarding the application can be added as comments to this wiki page.




## Workflow Configuration
The guide below is divided into sections matching those of the Workflow Designer. Make sure to review each section for additional considerations required to ensure your workflow can be correctly interpreted by the PowerForm.

For more detailed information on the Workflow Designer, see Adobe's [Set up signing workflows](https://helpx.adobe.com/sign/using/workflow-designer-signature-workflow.html) documentation.

### Workflow Info

| **Setting** |**Configuration Notes**  |
|:--|:--|
| Workflow Name | Displays at the top of the PowerForm in the banner |
| Instructions for the Sender | Displays at the top of the PowerForm after the workflow name. Can be customized with the following html tags. See the "Workflow Info" section of [Set up signing workflows](https://helpx.adobe.com/sign/using/workflow-designer-signature-workflow.html) in Adobe's documentation.  `<p>,<br>,<b>,<i>,<u>,<ul>,<ol>,<li>`



### Agreement Info

| **Setting** | **Configuration Notes** |
|:--|:--|
| Agreement Name | It is used for the subject line of emails and in Adobe Sign for the sender & signers. It also displays in the "Agreement Name" section of the PowerForm if it is not hidden via the [WFSetting_HideAgreementName](#wfsetting_hideagreementname) setting. Replacement variables can be added with “${variable}” where "variable" is replaced with a [merge field](#merge-fields) or recipient role name. |
| Message | It is sent in the email to recipients and as a message from the sender within each signing session. The same email will go to all workflow recipients - private messages per recipient are not currently available. Replacement variables can be added with “${variable}” where "variable" is replaced with a [merge field](#merge-fields) or recipient role name. Can be customized with html tags. |
| Cc | It is displayed on the PowerForm after the "Recipients" section if marked as "Editable" and the "Maximum" value entered exceeds the number of default email addresses entered. Default values will not be shown on the PowerForm. Use for recipients who need to receive a copy as there is no role for "Receives a Copy" in the "Recipients" section of the workflow designer. Email addresses that should always receive a copy can be added here. To send to more than one by default, use a comma or semicolon between each address.
|Cc: Config to allow the requester to add CCs | 1. Check "Editable" 2. Set a minimum & maximum number (if you skip this the PowerForm will show 500 lines of CC). The number of default values added will be deducted from the minimum and maximum number of CCs shown on the PowerForm. *Example*: Default value = "test1@example.com;test2@example.com", minimum = 3, & maximum = 8. This will result in 6 CC's showing on the PowerForm with the first one required.
|Cc: Config to enter default values and not allow requester to add CCs | 1. Check "Editable" 2. Set a minimum & maximum number that matches the number of email addresses entered as the default value. *Example*: Default value = "test1@example.com;test2@example.com", minimum = 1, & maximum = 1. This will result in 0 CC's showing on the PowerForm.
| Send Options: Set password to open downloaded PDF | This will allow or require the sender to set a PDF password that will be required for all users to open the PDF. This setting should never be used. The password is not retrievable in any way and will prevent your department from accessing the signed agreement as well.
| Send Options: Completion deadline | A completion deadline sets the maximum number of days that all recipients have to sign the agreement before it expires. Cal Poly enforces maximum of 90 days at the system configuration level that cannot be modified.  If you supply a value larger than 90 days it will show to the the user but a maximum of 90 days is still enforced
| Send Options: Allow authoring of documents prior to sending | This setting should never be checked as it does not work with PowerForms. |

## Recipients

Use the diagram below to help you determine the participant number when designing workflows with parallel routing.

| **Setting** | **Configuration Notes** |
|:--|:--|
| Role Name | All role names must be unique. Role name can be edited by clicking the pencil at the top of the recipient popup |
| Email | Required if "Editable" is not checked. Can only contain a single email address. The same email cannot exist twice in the same workflow without causing issues for that signer.
| This recipient is the sender | This must be left unchecked as it is not supported with PowerForms
| Mark as recipient group | This must be left unchecked. Recipient groups (signing groups) cannot be configured in workflows and are not available for PowerForms
| Role | Recipient role definitions can be found here: [Adobe Sign - Recipient roles](https://helpx.adobe.com/sign/using/set-up-signer-approver-roles.html)
| Required | If checked the requester will be required to fill in an email address before they can submit the PowerForm
| Editable | If unchecked, it will not be shown on the PowerForm
| Identity Authentication | "None" must be checked and all others must be unchecked |

## Documents

-   All document titles must be unique.
-   All library documents that are selected must be owned by or shared with the sending account.
-   Each documents will be shown on the PowerForm with the "Document Title" unless one file is selected and it is required.
-   Multiple documents can be added to a single Workflow. This is useful for Per row configuration:
    -   If no file is selected:
        -   It will allow the end-user to upload a file which becomes part of the agreement.
        -   If "Required" is checked the end-user will be required to upload a file before they can submit the PowerForm.
    -   If only one file is selected:
        -   If required, the document will not appear on the PowerForm.
        -   If not required, a drop down will appear on the PowerForm with drop down list that contain "-- None --" and the "Document Name".
    -   If more than one file is selected:
        -   It will be shown on the PowerForm as a drop down with each file's "Document Name" (in alphabetical order).
        -   If required, "-- Select a document --" is shown at the top of the drop down list and one of the files must be selected before the end-user can submit the PowerForm.
        -   If not required, "-- None --" is shown at the top of the drop down list.

## Sender Input Fields

"Sender Input Fields" serves multiple purposes with PowerForms:

1.  To supply setting to the PowerForm application
    -   [WFSetting_SendingAccount](#wfsetting_sendingaccount) - **Required for all workflows used via the PowerForm App**
    -   [WFSetting_HideAgreementName](#wfsetting_hideagreementname)
    -   [WFSetting_Reminder](#wfsetting_reminder)

3.  As merge fields which can be used for:
    -   Variable replacements in the "Agreement Name" and "Message" fields
    -   Pre-filling form fields on documents
    -   See the "Sender input fields" section of the Adobe Sign webpage for more information: [Set up signing workflows](https://helpx.adobe.com/sign/using/workflow-designer-signature-workflow.html)

### Merge Fields

| **Setting** | **Value** |
|:--|:--|
| Field Title | Enter the title for display on the PowerForm in the "Fields" section. Cannot start with "WFSetting"
| Document Field Name | Enter the name of the form field. Note: Form field may not have spaces
| Default Value | Blank: PowerForm end-user can enter a value. Any Value: hides the "Fields" section
| Required | Checked
| Editable | Checked

### WFSetting_SendingAccount
**Purpose**: Sets the account the agreement will be sent from.
Mandatory for workflows that will be used as a PowerForm.
| **Setting** | **Value** |
|:--|:--|
| Field Title | "WFSetting_SendingAccount"
| Document Field Name | "WFSetting_SendingAccount"
| Default Value | Email address of the AdobeSign account that will send the agreement
| Required | Unchecked
| Editable | Unchecked

### WFSetting_HideAgreementName

**Purpose**: Override the default PowerForm setting and either show or hide the "Agreement Name" section on the PowerForm.

| **Setting** | **Value** |
|:--|:--|
| Field Title | "WFSetting_HideAgreementName"
| Document Field Name | "WFSetting_HideAgreementName"
| Default Value | "false": show the Agreement Name section. "true": hide the Agreement Name section
| Required | Unchecked
| Editable | Unchecked

### WFSetting_Reminder

**Purpose**: Controls the Reminder options on the PowerForm. If a default value is set and not editable the agreement will always be sent with the configured reminder setting.

| **Setting** | **Value** |
|:--|:--|
| Field Title | "WFSetting_Reminder"
| Document Field Name | "WFSetting_Reminder"
| Default Value | No default value: No reminder is set by default. Possible default values: ```"DAILY_UNTIL_SIGNED": Every Day``` ```"WEEKLY_UNTIL_SIGNED": Every week``` ```WEEKDAILY_UNTIL_SIGNED": Every business day``` ```"EVERY_OTHER_DAY_UNTIL_SIGNED": Every other day``` ```"EVERY_THIRD_DAY_UNTIL_SIGNED": Every third day``` ```"EVERY_FIFTH_DAY_UNTIL_SIGNED": Every fifth day```
| Required | Unchecked
| Editable | Unchecked: hides the reminder section. Checked: the requester can edit the reminder section


# Testing the PowerForm

Once the workflow is built in Adobe Sign and activated it will be available for use within Adobe Sign. Before publishing it should be tested to ensure the Workflow Info, Agreement Info, Recipients, Documents, and Sender Input Fields sections have all been correctly configured. Upon successful testing of the workflow within Adobe Sign, follow the following steps to test the PowerForm.

1.  Open the workflow and copy the workflow ID from the URL which is found after the "=" in the URL.
  ![Image of AdobeSign Workflow edit URL bar](/documentation/images/AdobeSign-Workflow-URL.png)
2.  Open a new window or tab in your web browser and enter the following URL: https://{hostname}/PowerForm/
3.  Paste the workflow ID from step 1 to the end of the URL from step 2 to create your PowerForm URL
