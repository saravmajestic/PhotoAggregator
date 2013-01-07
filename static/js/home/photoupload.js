Ext.Loader.setConfig({ enabled: false });
Ext.setup({
    tabletStartupScreen: 'resources/img/tablet_startup.png',
    phoneStartupScreen: 'resources/img/phone_startup.png',
    icon: 'resources/img/icon.png',
    glossOnIcon: false,

    onReady: function() {
        Ext.get("submitBtn").on("click",function(e){
            FB.init({
                appId: '270570539622525',
                status: true, // check login status
                cookie: true, // enable cookies to allow the server to access the session
                xfbml: true // parse XFBML
            });
            FB.login(function(response){console.log(response)
                if (response.authResponse) {
                    var params = response.authResponse;
Ext.get("access_token").dom.value = (params.accessToken);
                    Ext.get("photoform").dom.submit();
                }});
        });
    }
});