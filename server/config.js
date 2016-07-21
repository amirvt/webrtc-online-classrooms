var globalConfig = require('../src/config');

const config = {};

config.nuve_host = globalConfig.licodeIp;
config.service = {};
config.service.id = globalConfig.service.ID;
config.service.key = globalConfig.service.Key;

//config.demo_host = 'localhost:3000'; // Without "http", just the host.
config.https = false;

//config.plain = true;

module.exports.default = config;
