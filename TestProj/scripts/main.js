require(["../kendo/js/jquery.min", "../kendo/js/kendo.core", "../kendo/js/kendo.mobile.min", "login", "hello-world", "jquery.spinner",  "../kendo/js/kendo.list", "../kendo/js/kendo.popup", "../kendo/js/kendo.dropdownlist", "../kendo/js/kendo.upload", "../kendo/js/kendo.fx", "../kendo/js/kendo.calendar", "../kendo/js/kendo.datepicker"], function(util) {
    app = new kendo.mobile.Application(document.body, { transition: "slide", layout: "mobile-tabstrip" });
    validator = $("#divPhoto").kendoValidator().data("kendoValidator");
    
    $(document).ready(function(){
        var home = document.getElementById('tabstrip-home');
        home.style.visibility = "visible";
        app.navigate("#tabstrip-home");
    });
});