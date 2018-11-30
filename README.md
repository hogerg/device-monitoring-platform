# Device Monitoring Platform

* Author: Gergő Hodány (hodiger@gmail.com)
* Updated: 2018-11-30

The Device Monitoring Platform is a distributed system that allows the monitoring of device sensor measurements by providing standard HTTP interfaces. The platform runs in a Docker based environment, every subsystem has it's own container and can be replicated if needed. Load balancing is only done for the REST gateways at the moment.

## I. Prerequsities
The following are required in this project:

- Debian/Ubuntu based Linux distribution
- Git client (or direct download)
- Docker CE (e.g. Docker version 18.06.1-ce, build e68fc7a)
- Docker Compose (e.g. docker-compose version 1.22.0, build f46880fe)
- NodeJS + npm
- Gulp + Gulp-cli (Install globally: `npm i gulp-cli -g`)

## II. Build and run
Docker Compose accelerates the deployment of the platform so only one command is needed to set up the system:
- Run the following command from the root folder: `docker-compose up --build`

## III. Exposed interfaces
After the images have been built and the containers are running the following services are available:
- localhost:8080 : Northbound/REST API Gateway for device monitoring, also supports WebSocket connections for push-notifications of new measurements
- localhost:8081 : Southbound/REST API Gateway for device creation and simulation

API documentation is available through visiting the root address in a web browser.

## IV. Frontends
The Monitoring and Simulation frontends run separately from the backend services.
Install the dependencies in the `monitoring-frontend` and `simulation-frontend` folders:
- Issue the following command: `npm i`

Start up the webservers serving the frontend content:
- Command: `gulp`

The Monitoring frontend is served on port `3000` and Simulation on port `3001`.