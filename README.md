# BigchainDB
## Install prerequisites

Before we start, make sure to install these following requirements:
* Docker Desktop
* Git
* Node.js
* npm
* Express

## How to run

* First, pull the BigchainDB server repository from the following link https://github.com/bigchaindb/bigchaindb.

* After pulling the repository, there are 2 folders "PrimaryInformation" and "SecondaryInformation". Each folder is connected to the respetive BigchainDB nodes which are 9984 for PrimaryInfo and 9986 for SecondaryInfo. 

* Next, Run "docker-compose up" from the BigchainDB repository to start the BigchainDB server with Tendermint and MongoDB.

* Then coming to this BigchainDB application, run a command "npm install" to install all the node modules (Do this is both the folders).

* Finally, start our application run "node server". This will coonect our application to the BigchainDB server, ensure that the BigchainDB server is up and running without any errors.
