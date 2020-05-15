# Adobe Sign PowerForms
The Adobe Sign PowerForm is a custom application to provide a solution for self-service forms. It was created to fill an Adobe Sign gap where multiple signers need to be defined by the individual requesting the form. An example would be a self-service form that requires supervisor approval. The supervisor would be dependent on the individual initiating the form. The PowerForm allows the individual initiating the form to supply the appropriate email address.

Configurations of PowerForms is done completely within Adobe Sign's Workflow Designer, see [Configuring a Workflow for PowerForms](/documentation/Configuring-a-Workflow-for-PowerForms.md) for instructions.

Additional documentation is available in the [documentation](/documentation/) directory.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites
- [Node.js](https://nodejs.org/)
- A webserver to a handle process management & https. Examples:
  - IIS with [iisnode](https://github.com/Azure/iisnode)
  - NGINX with [pm2](https://pm2.keymetrics.io/)

### Installing
- Clone this repo
- `npm install` to install all required dependencies
- Copy `config\config.sample.yaml` to `config\config.yaml`
  - See [Configuring the PowerForm Web App](/documentation/configuration-files.md) to configure this file.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Authors
- **Scott R. Tucker** - [srtucker](https://github.com/srtucker)

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments
- **[Nathan Nguyen](https://github.com/NathanNguyen345) @ Adobe** create created the initial versions of the "Dynamic Workflow" project that this project was based on
