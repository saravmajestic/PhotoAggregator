var dust = require(ROOT_PATH + '/lib/dust/dust.js');(function(){dust.register("showphotos",body_0);var blocks={'content':body_1};function body_0(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.partial("layout",ctx,null);}function body_1(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.section(ctx.get("albums"),ctx,{"block":body_2},null).section(ctx.get("photos"),ctx,{"block":body_5},null);}function body_2(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.section(ctx.get("title"),ctx,{"block":body_3},null).write("</a><br/>");}function body_3(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.write("<a href=\"").reference(ctx.get("ctx"),ctx,"h").write("showalbum?id=").section(ctx.get("gphoto$id"),ctx,{"block":body_4},null).write("\">").reference(ctx.get("$t"),ctx,"h");}function body_4(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.reference(ctx.get("$t"),ctx,"h");}function body_5(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.write("<img src=\"").reference(ctx.getPath(false,["content","src"]),ctx,"h").write("\" width=\"100\"/>");}return body_0;})();