//wcat.js
exports.wcat = function(filename){

	if(!filename){
		console.log("Please supply a filename as a command line argument.");
		process.exit(0);
	}

	var fs = require("fs");
	var through = require("through");
	var split = require("split");
	var lineNum = 0;
	var prependLineWithNumber = function(buf){
		lineNum++;
		this.queue( lineNum + "\t " + buf.toString() + "\n");
	}
	var readable = fs.createReadStream(filename)
		.pipe(split())
		.pipe(through(prependLineWithNumber))
		.pipe(process.stdout);

}