# Configuring the PowerForm Web App

## config.yaml
The config.yaml file handles configuration for the api server as well as the generation of the web client.

- **PORT**: The port that the express server should listen on if it is not provided by process.env.PORT
- **publicPath**: The public path the server will be located at. It must end with a '/'.

### adobeApi
These are the settings for the integration with the Adobe Sign API.

- **host**: https://api.na1.documents.adobe.com
  - The host address to your Sign Console.
- **endpoint**: "/api/rest/v5"
  - This is the API endpoint of Adobe Sign
  - DO NOT CHANGE THE FOLLOWING CONFIGURATION
- **integrationKey**
  - This is your integration key for Adobe Sign.
  - This key is needed to login to the Adobe Sign API to get workflow configurations and sending agreements.
  - To generate an integration key, follow [Adobe's documentation](https://helpx.adobe.com/sign/kb/how-to-create-an-integration-key.html) with the following settings:
    ![Image of AdobeSign Integration key settings](/documentation/images/AdobeSign-Integration-Key.png)

### WorkFlowConfig
These setting are used for configuring how the API server interprets a workflow's configuration.
- **recipients**
  - **hide_predefined**: false
    - Hide recipients that have an email pre-defined
  - **hide_readonly**: true
    - Hide recipients where editable is un-checked
- **cc**:
  - **hide_predefined**: true
    - Hides Cc emails that are in the in the workflow's config
  - **hide_readonly**: true
    - Hides the Cc section when editable is un-checked
- **agreementName**:
  - **hide**: false
    - Hides the agreement name on PowerForm
    - Can be overridden by the [WFSetting_HideAgreementName](/documentation/Configuring-a-Workflow-for-PowerForms.md#wfsetting_hideagreementname) Sender Input Field in a workflow's configuration
- **message**:
  - **hide**: true
    - Hides the message section on the PowerForm
- **files**:
  - **hide_predefined**: true
    - Hides library documents that are required and only have one associated file
- **mergeFields**:
  - **hide_predefined**: true
    - Hides merge fields / sender input fields that have a default value
  - **hide_readonly**: true
    - Hides merge fields / sender input fields where editable is un-checked
- **expiration**:
  - **hide**: false
    - Hides the completion deadline / expiration section on the PowerForm
- **reminder**:
  - **hide_readonly**: true
    - Hides reminders when [WFSetting_Reminder](/documentation/Configuring-a-Workflow-for-PowerForms.md##wfsetting_reminder) is configured in the workflow and editable is unchecked
  - **hide_notpredefined**: true
    - Hides reminders when [WFSetting_Reminder](/documentation/Configuring-a-Workflow-for-PowerForms.md##wfsetting_reminder) is not configured in the workflow's config


### ClientConfig
These settings are used in the generation of the web client.
- **apiBaseURL**: '/PowerForm/'
  - This is the base URL all client API calls will be made to.
  - It can be relative or absolute url.
  - If not defined publicPath will be used.
  - It must end with a '/'.
- **expirationAsDate**: false
  - Setting to show Agreement expiration as date if true or as number of days if false
- **appTitle**: 'PowerForm'
  - Title of the web client (what will show in the web browser's tab)
- **workflowPath**: ''
  - The path that workflows will be accessed at, this will be appended to publicPath. It should not start with a '/' and must end with '/' if it is not empty.

## config.scss
Configuration file for webclient styles.
