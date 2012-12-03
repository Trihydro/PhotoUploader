// JavaScript Document

var pictureSource;
var destinationType;
var fileName;
// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() {
    getLocation();
    
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
}

function getLocation() {
    navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError);
}

//=======================Login Page Operations=======================//
function UploadData(){
    var upload = $("#fileUpload").data("kendoUpload");
    alert("uploading!");
}

function getPhoto(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
        destinationType: destinationType.FILE_URI,
        sourceType: source });
    } 

function onPhotoURISuccess(imageURI) {
    var imgStr = imageURI.toString();
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imgStr.substring(imgStr.lastIndexOf("/") + 1);
    options.mimeType = "image/jpeg";
    
    fileName = imgStr.substring(imgStr.lastIndexOf("/") + 1) + ".jpg";    
    var ft = new FileTransfer();
    ft.upload(imageURI, "http://monoservicetest.trihydro.com/MobilePhoto/PhotoUpload.aspx", win, onFail, options);  
    
}

function win(r){
    var largeImage = document.getElementById('largeImage');
    var projectKey = $("#ddlProjects").val();
    var directionKey = $("#ddlDirection").val();
    var photographer = document.getElementById('photographer').value;
    var descrip = document.getElementById('description').value;
    
    
    $.ajax({
        type: "GET",
        url: "http://monoservicetest.trihydro.com/MobilePhoto/PhotoService.svc/UploadPhoto",
        data: { projectKey: projectKey, directionKey: directionKey, photographer: photographer, description: descrip, filename: fileName },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(){
            alert("Your photo was successfully uploaded!");
        },
        error: function(){
            alert("there was an error");
        },
    })
}

function onFail(message) {
      alert('Failed because: ' + message);
    }


//=======================Say Hello (Page 1) Operations=======================//
function sayHello() {
    var sayHelloInputElem = document.getElementById('helloWorldInput');
    var sayHelloTextElem = document.getElementById('helloWorldText');
    var inputText = document.getElementById('txtName');

    sayHelloTextElem.innerHTML = 'Hello, ' + inputText.value + '!';
    sayHelloTextElem.style.display = 'block';
    sayHelloInputElem.style.display = 'none';
}

function sayHelloReset() {
    var sayHelloInputElem = document.getElementById('helloWorldInput');
    var sayHelloTextElem = document.getElementById('helloWorldText');
    var inputText = document.getElementById('txtName');

    inputText.value = '';
    sayHelloTextElem.style.display = 'none';
    sayHelloInputElem.style.display = 'block';
}

//=======================Geolocation Operations=======================//
// onGeolocationSuccess Geolocation
function onGeolocationSuccess(position) {
    // Use Google API to get the location data for the current coordinates
    var geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    geocoder.geocode({ "latLng": latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if ((results.length > 1) && results[1]) {
                $("#myLocation").html(results[1].formatted_address);
            }
        }
    });

    // Use Google API to get a map of the current location
    // http://maps.googleapis.com/maps/api/staticmap?size=280x300&maptype=hybrid&zoom=16&markers=size:mid%7Ccolor:red%7C42.375022,-71.273729&sensor=true
    var googleApis_map_Url = 'http://maps.googleapis.com/maps/api/staticmap?size=300x300&maptype=hybrid&zoom=16&sensor=true&markers=size:mid%7Ccolor:red%7C' + latlng;
    var mapImg = '<img src="' + googleApis_map_Url + '" />';
    $("#map_canvas").html(mapImg);
}

// onGeolocationError Callback receives a PositionError object
function onGeolocationError(error) {
    $("#myLocation").html("<span class='err'>" + error.message + "</span>");
}