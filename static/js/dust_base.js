var dust = require('../../lib/dust/dust.js');
function dust_base(){
var base = dust.makeBase({
    loadJs: function(chunk, context, bodies, params){

        chunk.write("js/min/" + params["name"] + ".js");
    },
    loadCss: function(chunk, context, bodies, params){
        chunk.write("css/min/" + params["name"] + ".css");

    },
    ctx : function(chunk, context, bodies, params) {
        return ctx;//From layout.dust
    }
});
    return base;
}
exports.dust_base = dust_base;