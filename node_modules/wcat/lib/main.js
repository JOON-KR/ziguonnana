#!/usr/bin/env node

// get the kat module and call the kat function right away with the filename first cliarg
// var path = require('path');
// var fs = require('fs');
// var lib = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');
// require(lib + '/main.js');
//untested
//require("./kat").kat(process.argv[2]);
var filename = process.argv[2];
//console.log(filename);
var wcat = require("./wcat");
//console.log(kat);
wcat.wcat(filename);




