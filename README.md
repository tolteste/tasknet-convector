# tasknetConvector - taskManager

This project is a part of a thesis implementation made by Štefan Töltési. Thesis is called Distributed Tamper Proof Task Manager and it was created for University of Southern Denmark. Project can be also found in <a href="https://github.com/tolteste/tasknet-convector" target="_blank">Github repository</a>.

## Prerequisites 
To run the project Hyperledger Fabric's prerequisites have to be installed. Instalation guide can be found on <a href="https://hyperledger-fabric.readthedocs.io/en/release-1.4/prereqs.html">Hyperldger website</a>.

Also npm and node.js have to be installed.

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
# Server is now running and interactive API can be accessed on 
