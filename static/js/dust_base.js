var dust = require('../../lib/dust/dust.js');
function dust_base(){
var base = dust.makeBase({
    loadJs: function(chunk, context, bodies, params){
        var initConfig = require("../../config/init");
        var jsFiles = require("../../config/js");
        if(!initConfig.production){
            var files = jsFiles[params["name"]];
            for(i=0;i<files.length;i++){
                chunk.write('<script type="text/javascript" src="js/' + files[i] + '"></script>');
            }

        }else{
            chunk.write('<script type="text/javascript" src="js/min/' + params["name"] + '.js"></script>');
        }

    },
    loadCss: function(chunk, context, bodies, params){
        var initConfig = require("../../config/init");
        var jsFiles = require("../../config/css");
        if(!initConfig.production){
            var files = jsFiles[params["name"]];
            for(i=0;i<files.length;i++){
                chunk.write('<link rel="stylesheet" href="css/' + files[i] + '" type="text/css" media="all"/>');
            }

        }else{
            chunk.write('<link rel="stylesheet" href="css/min' + params["name"] + '.css" media="all" />');
        }

    },
    ctx : function(chunk, context, bodies, params) {
        return ctx;//From layout.dust
    }
});
    return base;
}
exports.dust_base = dust_base;