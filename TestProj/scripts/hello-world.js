// JavaScript Document

var pictureSource;
var destinationType;
var fileName;
// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() {    
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
}

function refreshProjects(){
    $("#ddlDirection").data("kendoDropDownList")
}

function ddlProjectsOnChange(){      
    document.getElementById("divPhoto").style.display = "block";
    var portalKey = $("#ddlProjects").val();
    $("#ddlDirection").kendoDropDownList({
        dataTextField: "Direction",
        dataValueField: "DirectionKey",
        optionLabel: "Select a Direction...",
        dataSource: {
            transport: {
                read: {
                    url: "http://monoservicetest.trihydro.com/MobilePhoto/PhotoService.svc/GetDirections",
                    data: {portalKey: portalKey},
                    datatype: "json",
                }
            },
            schema: {
                data: "d"
            }
        }
    });
}

function UploadData(){
    var upload = $("#fileUpload").data("kendoUpload");
    if(validator.validate()){
        var largeImage = document.getElementById('largeImage');
        var opts = {img: 'Images/ajax-loader.gif', hide: true, height: 48, width: 48, position: 'center'};
        var img1 = $("#tabstrip-uiinteraction");
        img1.spinner(opts);
        
        var imgStr = largeImage.src.toString();
        
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = imgStr.substring(imgStr.lastIndexOf("/") + 1);
        options.mimeType = "image/jpeg";
        fileName = imgStr.substring(imgStr.lastIndexOf("/") + 1) + ".jpg";    
        var ft = new FileTransfer();
        ft.upload(imgStr, "http://monoservicetest.trihydro.com/MobilePhoto/PhotoUpload.aspx", win, onFail, options);
    }
    else{
        alert('The required fields are not filled in correctly');
    }
}

function getPhoto(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
        destinationType: destinationType.FILE_URI,
        sourceType: source });
    } 

function onPhotoURISuccess(imageURI) { 
    var largeImage = document.getElementById('largeImage');
    largeImage.src = imageURI;
    largeImage.style.display = "block";
}

function win(r){
    var projectKey = $("#ddlProjects").val();
    var directionKey = $("#ddlDirection").val();
    var photographer = document.getElementById('photographer').value;
    var descrip = document.getElementById('description').value;
    var date = $("#datePicker").val();
    
    $.ajax({
        type: "GET",
        url: "http://monoservicetest.trihydro.com/MobilePhoto/PhotoService.svc/UploadPhoto",
        data: { projectKey: projectKey, directionKey: directionKey, photographer: photographer, description: descrip, filename: fileName, token: token, date: date },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(){
            var img1 = $("#tabstrip-uiinteraction");
            img1.spinner('remove');
            alert("Your photo was successfully uploaded!");
            
            var largeImage = document.getElementById('largeImage');
            largeImage.src = "";
            largeImage.style.display="none";
            $("#description").val("");
            $("#ddlDirection").val("").data("kendoDropDownList").text("Select a Direction...");
            $("#datePicker").data("kendoDatePicker").value(null);
            
        },
        error: function(){
            alert("there was an error");
        },
    })
}

function onFail(message) {
      alert('Failed because: ' + message);
}