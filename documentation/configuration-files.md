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
  - This key is needed to login to the Adobe Sign API to get workflow configuartions and sending agreements.
  - To generate an integration key, follow [Adobe's documentation](https://helpx.adobe.com/sign/kb/how-to-create-an-integration-key.html) with the following settings:
    ![Image of AdobeSign Integration key settings](/documentation/images/AdobeSign-Integration-Key.png)

### WorkFlowConfig
These setting are used for configuring how the API server interprets a workflow's configuration.
- **recipients**
  - **hide_predefined**: false
  - **hide_readonly**: true
- **cc**:
  - **hide_predefined**: true
  - **hide_readonly**: true
- **agreementName**:
  - **hide**: false
- **message**:
  - **hide**: true
- **files**:
  - **hide_predefined**: true
- **mergeFields**:
  - **hide_predefined**: true
  - **hide_readonly**: true
- **expiration**:
  - **hide**: false
- **reminder**:
  - **hide_readonly**: true
  - **hide_notpredefined**: true

### ClientConfig
These settings are used in the generation of the web client.
- **apiBaseURL**: '/PowerForm/'
  - This is the base URL all client API calls will be made to.
  - It can be relative or absolute url. If not defined publicPath will be used.
  - It must end with a '/'.
- **expirationAsDate**: false
  - Setting to show Agreement expiration as date if true or as number of days if false
- **appTitle**: 'PowerForm'
  - Title of the web client (what will show in the web browser's tab)
- **workflowPath**: ''
  - The path that workflows will be accessed at, this will be appended to publicPath. It should not start with a '/' and must end with '/' if it is not empty.

## config.scss
Configuration file for webclient styles.
