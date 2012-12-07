var token;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
    
}

//$(function() {
    //$("#form").jCryption();
//});

function LoginUser(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = mm+'/'+dd+'/'+yyyy;
    
    var userName = $("#txbUsername").val();
    var passWord = $("#txbPassword").val();
    
    $.ajax({
       type: "GET",
       url: "https://monoservicetest.trihydro.com/MobileLogin/MobileLoginService.svc/LoginUser",
       data: { userName: userName, password: passWord},
       dataType: "json",
       success: function(data){
           //Update these to real values...
           if(data.d != null && data.d != -1){
               token = data.d;
               app.navigate("#tabstrip-uiinteraction");
               
               $("#ddlProjects").kendoDropDownList({
                   change: ddlProjectsOnChange,
                   dataTextField: "PortalName",
                   dataValueField: "PortalKey",
                   optionLabel: "Select a Project...",
                   dataSource:{
                       transport: {
                           read: {
                               url: "http://monoservicetest.trihydro.com/MobilePhoto/PhotoService.svc/GetProjects",
                               data: { token: token },
                               dataType: "json",
                           }
                       },
                       schema: {
                           data: "d"
                       }
                   },
               });
               
               $("#datePicker").kendoDatePicker();
           }
           else{
               $("#txbUsername").val("");
               $("#txbPassword").val("");
               $("#divError").text("There was an error logging please try again.");
           }
               
       },
       error : function(data){
           alert("There was an error with your login, please try again.");
       }
    });
}