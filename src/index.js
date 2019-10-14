const baseServer = require('@server-state/server-base');
const raw = require('@server-state/raw-module');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const myServer = new baseServer();

myServer.addModule('raw', raw, ['who', 'pwd', 'uname -a']);
myServer.addModule('raw2', raw, ['ls']);

myServer.init(app);

app.disable('etag');
app.listen(8080);
