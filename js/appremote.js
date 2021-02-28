((win)=>{
    function appRemote(vm){
        console.info("......appRemote vm", !!vm);
    }
    win.appRemote = appRemote;

    window.addEventListener('message.load', (event)=>{
        console.log(">>>>>>>>>>>>>>>message.load", event);
    });
})(window);
