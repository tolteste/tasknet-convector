# tasknetConvector - taskManager

This project is a part of a thesis implementation made by Štefan Töltési. Thesis is called Distributed Tamper Proof Task Manager and it was created for University of Southern Denmark. Project can be also found in <a href="https://github.com/tolteste/tasknet-convector" target="_blank">Github repository</a>. Following instructions are written for Linux based operating system.

## Prerequisites 
To run the project Hyperledger Fabric's prerequisites have to be installed. Instalation guide can be found on <a href="https://hyperledger-fabric.readthedocs.io/en/release-1.4/prereqs.html">Hyperldger website</a>.

Another prerequisites are npm and node.js.

## Start

```
# Install dependencies - From the root of your project
npm i
# Create a new development blockchain network  - From the root of your project
npm run env:restart
# Install smart contract onto the blockchain network
npm run cc:start
# Make a testing call to create a record in the ledger
# Beware that the first call may fail with a timeout! Just happens the first time
# Chaincode can be invoked with hurl
hurl invoke taskManager taskManager_create "{ parameters }"
```

Running `env:restart` command downloads Hyperledger Fabric docker images and creates organization and participants according to the .config.json files in the root folder. Created files are by default saved into a `$HOME/hyperledger-fabric-network` folder.

## Docker
```
# When blockchain network has been started, Hyperledger's nodes can be seen running in Docker
docker ps
# To see nodes log output run following command
docker logs $(docker ps -qa | head -n 1) -f
```

## Run chaincode unit tests

```
npm run test
```

## Starting TaskManager Node.js application
```
# First the application has to be compiled
npx lerna run compile --scope taskManager-app
# Now run the application
npx lerna run start --scope taskManager-app --stream
```

Server is now running and an interactive API can be accessed on http://localhost:3001/. By default an identity of an admin from org1 is used. To use a different identity application has to be supplied with a defferent certificate in `.env` file located in `taskManager-app` folder.

##View transactions and blocks
To see validated transaction and individual blocks of the blockchain, user can utilise byzantine-browser available from [GitHub](https://github.com/worldsibu/byzantine-browser)
