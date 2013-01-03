var http = require('http');
var dust = require('./lib/dust/dust');
var fs = require('fs');

var sourceFolderPath = __dirname + "/views/dust_src", //From where - to be complied 
	destFolderPath = __dirname + "/views/dust_compiled"; //Where to store the compiled files

var walk = function(dir, done) {
	  var results = [];
	  fs.readdir(dir, function(err, list) {
	    if (err) return done(err);
	    var i = 0;
	    (function next() {
	      var file = list[i++];
	      if (!file) return done(null, results);
	      file = dir + '/' + file;
	      fs.stat(file, function(err, stat) {
	        if (stat && stat.isDirectory()) {//If its a folder, go through the loop again
	          walk(file, function(err, res) {
	        	results = results.concat(res);
	            next();
	          });
	        } else {//If its a file
	          try{
	            	if(file.indexOf(".tmp") == -1){//Dont do anything with eclipse generated files - if there is any
	            		results.push(file);
	            		console.log("compiling file: " + file);
	            		fs.readFile(file, 'utf-8', function (err, srcfileContent) {
	            			var fileNameArr = file.split("/");
	            			var fileName = fileNameArr[fileNameArr.length-1].replace(".dust", "");//For giving the name of compiled template function 
		            		var compliedContent = dust.compile(srcfileContent, fileName);//Compile the content using dust
		            		var destFileName = file.replace(".dust", ".js").replace(sourceFolderPath, destFolderPath); //Compiled file name - ex: index.dust will be index.js
		            		
		            		var destFoldName = destFileName.replace(fileName +".js", "");//Dest folder - to check whether the folder exists or not
							if(fs.existsSync(destFoldName)){
                                var dustPath = "var dust = require('../../lib/dust/dust.js');"; //Hack to remove error for dust when loading the files
                                writeFile(destFileName, dustPath + compliedContent, file);
							}else{
								fs.mkdir(destFoldName, 0777, function (err) {
					                if (err) {
					                	console.log("Error creating directory: " + destFoldName);
					                } else {
					                	writeFile(destFileName, compliedContent, file);
					                }
					            })
							}
		            		
		            	});
	            	}
	            }catch(ex){
	            	console.log("Error compiling file: " + ex);
	            }
	          next();
	        }
	      });
	    })();
	  });
	};
	
	//Start Navigating through folders
	walk(sourceFolderPath, function(err, results) {
		  if (err) throw err;
		  console.log(results);
		});
	
	//Write the compiled template JS function to the file
	var writeFile = function (destFileName, compliedContent, file){
		fs.writeFile(destFileName, compliedContent, function(err) {
		    if(err) {
		        console.log(err);
		    } else {
		    	console.log("compiled file: " + file);
		    }
		}); 
	}