var dust = require('../../lib/dust/dust.js');(function(){dust.register("layout",body_0);function body_0(chk,ctx){return chk.write("<!DOCTYPE html><html lang=\"en\" class=\"en\"><head><title>Photo Aggregator / Home </title><meta name=\"application-name\" content=\"Pinterest\" /><meta name=\"msapplication-TileColor\" content=\"#ffffff\" /><meta name=\"msapplication-TileImage\" content=\"http://passets-ec.pinterest.com/images/logo_trans_144x144.png\" /><link rel=\"icon\" href=\"http://passets-lt.pinterest.com/images/favicon.png\" type=\"image/x-icon\" /><link rel=\"apple-touch-icon-precomposed\" href=\"http://passets-ec.pinterest.com/images/ipad_touch_icon.png\" /><link rel=\"stylesheet\" href=\"").section(ctx.get("loadCss"),ctx,{},{"name":"base"}).write("\" type=\"text/css\" media=\"all\"/><script type=\"text/javascript\" src=\"").section(ctx.get("loadJs"),ctx,{},{"name":"lib"}).write("\"></script><meta property=\"fb:app_id\" content=\"274266067164\"/><meta property=\"og:site_name\" content=\"Pinterest\"/><meta property=\"og:url\" content=\"http://pinterest.com\"/><meta property=\"og:title\" content=\"Pinterest\"/><meta property=\"og:description\" content=\"Pinterest is an online pinboard.\"/><meta property=\"og:image\" content=\"http://passets-ec.pinterest.com/images/about/logos/Logo.png\"/><meta property=\"og:type\" content=\"website\"/><script>var ctx = \"http://127.0.0.1:8081/\";</script></head><noscript><div id=\"NoScript\"><h1>You need to enable Javascript.</h1></div></noscript><body><div>header here</div>").block(ctx.getBlock("content"),ctx,{"block":body_1},null).write("<div>Footer here</div></body></html>");}function body_1(chk,ctx){return chk;}return body_0;})();