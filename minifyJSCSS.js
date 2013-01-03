var compressor = require('node-minify');
var fs = require('fs');

var baseJSPath =  "./static/js/", destJSPath = './static/js/min/';
var jsConfig = require('./config/js');

for(name in jsConfig){
    var tmpInputFiles = jsConfig[name], inputFiles = [];
    for(i=0;i<tmpInputFiles.length;i++){
        inputFiles.push(baseJSPath + tmpInputFiles[i]);
    }
    console.log(inputFiles);
    // Using YUI Compressor for JS
    new compressor.minify({
        type: 'yui-js',
        fileIn: inputFiles,
        fileOut: destJSPath+name+'.js',
        callback: function(err){
            console.log(err);
        }
    });
}

var baseCSSPath =  "./static/css/", destCSSPath = './static/css/min/';

var cssConfig = require('./config/css');
for(name in cssConfig){
    var tmpInputFiles = cssConfig[name], inputFiles = [];
    for(i=0;i<tmpInputFiles.length;i++){
        inputFiles.push(baseCSSPath + tmpInputFiles[i]);
    }
    console.log(inputFiles);
    // Using YUI Compressor for JS
    new compressor.minify({
        type: 'yui-css',
        fileIn: inputFiles,
        fileOut: destCSSPath+name+'.css',
        callback: function(err){
            console.log(err);
        }
    });
}