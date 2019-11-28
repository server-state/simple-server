// standard packages
const fs = require('fs');
const https = require('https');
const express = require('express');
const cors = require('cors');

// server-state packages
const baseServer = require('@server-state/server-base');
const raw = require('@server-state/raw-module');
const systemd = require('@server-state/systemd-module');
const si = require('@server-state/system-information-module');
const diskUsage = require('@server-state/disk-usage-module');

// create new express app and enable CORS (see https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
const app = express();
app.use(cors());

// create a new instance of the base server
const myServer = new baseServer({
    logToConsole: true, // Log error messages to console, ...
    logToFile: false    // ... but not to a file
});

// add modules to the created server base
myServer.addModule('raw', raw, ['who', 'pwd', 'uname -a']);
myServer.addModule('raw2', raw, ['ls']);
myServer.addModule('systemd', systemd, [
    { name: 'nftables.service' },
    { name: 'my-service' },
    { name: 'boot.mount' },
    { name: 'user.slice' },
    { name: 'proc-sys-fs-binfmt_misc.automount' },
    { name: 'logrotate.timer' },
    { name: 'dev-disk-by\x2did-dm\x2dname\x2darchGroup\x2dswap.swap' },
    { name: 'systemd-ask-password-console.path' },
    { name: 'network.target' },
    { name: 'dev-archGroup-root.device' },
    { name: 'init.scope' },
    { name: 'syslog.socket' }
]);
myServer.addModule('system-info', si, {
    cpu: [],
    mem: []
});
myServer.addModule('disk-usage', diskUsage, ['/']);
myServer.addModule('linux-raid', () => {
    return ({
        personalities: [
            'raid1',
            'raid0'
        ],
        raids: [
            {
                name: 'md126',
                state: 'active',
                access: 'rw',
                type: 'raid1',
                unique: 'myRaid',
                devices: [
                    {
                        name: 'sdb20',
                        index: 2,
                        status: 'rescue'
                    },
                    {
                        name: 'sdb2',
                        index: 1,
                        status: 'active'
                    },
                    {
                        name: 'sdb1',
                        index: 0,
                        status: 'active'
                    }
                ],
                blocks: 20954112,
                parameters: 'super 1.2',
                ideal: 2,
                current: 2,
                options: [
                    {
                        type: 'activity',
                        activityType: 'recovery',
                        progress: 74.4,
                        processed: 15600512,
                        total: 20954112,
                        finish: 3.2,
                        speed: 27496
                    }
                ]
            }
        ]
    });
});
myServer.addModule('table', () => ({
    _fields: ['fielda', 'fieldb'],
    rows: [
        {
            fielda: 'Hello world',
            fieldb: 1
        },
        {
            fielda: 'Test',
            fieldb: 2
        }
    ]
}));

// give server base instance an express app to attach modules
myServer.init(app);

// start express app with https
app.disable('etag');
https.createServer({
    key: fs.readFileSync('./key.pem'),   // snake-oil key (NOT for production use!)
    cert: fs.readFileSync('./cert.pem'), // snake-oil certificate (NOT for production use!)
    passphrase: '12345'
},
app).listen(4434);

