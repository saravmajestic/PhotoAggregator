var dust = require('../../lib/dust/dust.js');(function(){dust.register("index",body_0);var blocks={'content':body_1};function body_0(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.partial("layout",ctx,null);}function body_1(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.write("this is middle content.Hi ").reference(ctx.get("name"),ctx,"h");}return body_0;})();