//  funciona na minha máquina
const PROXY_CONFIG = [{
    context: ['/api'],
    target: 'http://localhost:3000/',
    secure: false,
    logLevel: 'debug'
}];


/*
funciona na Simionato - bak-end 192.168.0.161 - banco 192.1168.0.251
const PROXY_CONFIG = [{
    context: ['/api'],
    target: 'http://192.168.0.161:63999/',
    secure: false,
    logLevel: 'debug'
}];
*/
module.exports = PROXY_CONFIG;