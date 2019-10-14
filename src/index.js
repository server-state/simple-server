// standard packages
const fs = require('fs');
const https = require('https');
const express = require('express');
const cors = require('cors');

// server-state packages
const baseServer = require('@server-state/server-base');
const raw = require('@server-state/raw-module');

// create new express app and enable CORS (see https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
const app = express();
app.use(cors());

// create a new instance of the base server
const myServer = new baseServer();

// add modules to the created server base
myServer.addModule('raw', raw, ['who', 'pwd', 'uname -a']);
myServer.addModule('raw2', raw, ['ls']);

// give server base instance an express app to attach modules
myServer.init(app);

// start express app with https
app.disable('etag');
https.createServer({ 
    key: fs.readFileSync('./key.pem'),   // snake-oil key (NOT for production use!)
    cert: fs.readFileSync('./cert.pem'), // snake-oil certificate (NOT for production use!)
    passphrase: '12345' }, 
app).listen(4434);

