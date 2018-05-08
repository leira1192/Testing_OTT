//inicializar Variables
video_play();
console.log('Ya valimos mil madres');
loadApiContent();
var actualTime;
var keys = {};
var content_api = [];
var click_item_focus_testing = 0;
var successCallback = function () {
	console.log('successCallback its ok');
};
var errorCallback = function () {
	console.log('errorCallback hubo un error');
};
window.onload = function () {
	//Create video object
	console.log('hemos llegado hasta acá exitosamente');
	var objElem = document.createElement('object');
	objElem.type = 'application/avplayer';
	objElem.style.width = '1920px';
	objElem.style.height = '1080px';
	//Insert video object as a div child
	document.getElementById('video_visible').appendChild(objElem);
	document.getElementById('video_visible').style.display = 'none';
	//prepare library avplay
	webapis.avplay.open('https://www.w3schools.com/html/mov_bbb.mp4');
	webapis.avplay.setListener(listener);
	webapis.avplay.setDisplayMethod('PLAYER_DISPLAY_MODE_LETTER_BOX');
	webapis.avplay.prepare();
	webapis.avplay.prepareAsync(successCallback, errorCallback);
	//functions controller buttoms actions
	registerKeys();
	bindEvents();
};

var listener = {
	onbufferingstart: function (percent) {
		console.log('Buffering start.' + percent);
	},
    
	onbufferingprogress: function (percent) {
		console.log('Buffering progress data : ' + percent);
	},

	onbufferingcomplete: function () {
		console.log('Buffering complete.');
	},
	onstreamcompleted: function () {
		console.log('Stream Completed');
		document.getElementById('video_visible').style.display = 'none';
		webapis.avplay.stop();
	},

	oncurrentplaytime: function (currentTime) {
		console.log('Current playtime: ' + currentTime);
		actualTime = currentTime;
	},

	onerror: function (eventType) {
		console.log('event type error : ' + eventType);
	},

	onevent: function (eventType, eventData) {
		console.log('event type: ' + eventType + ', data: ' + eventData);
	},

	onsubtitlechange: function (duration, text, data3, data4) {
		console.log('subtitleText: ' + text);
	},
	ondrmevent: function (drmEvent, drmData) {
		console.log('DRM callback: ' + drmEvent + ', data: ' + drmData);
        }
};
 

function registerKeys() {
	var supportedKeys = tizen.tvinputdevice.getSupportedKeys(), i = 0;
	for (i = 0; i < supportedKeys.length; i++) {
		try {
			tizen.tvinputdevice.registerKey(supportedKeys[i].name);
		} catch (e) {
			console.error('failed to register' + supportedKeys[i].name, e);
		}
		keys[supportedKeys[i].code] = supportedKeys[i].name;
		console.log('registro ' + i + ': complete' + keys + ',  keys storage: name:' + keys[supportedKeys[i].code] + ', code: ' + supportedKeys[i].code);
	}
	console.log('keys registers');
	for (var j = 0; j < keys.length; j++) {
		console.log(keys[j]);
	}

}

//Initialize function
var init = function () {
    // TODO:: Do your initialization job
    console.log('init() called');
    
    document.addEventListener('visibilitychange', function() {
        if(document.hidden){
            // Something you want to do when hide or exit.
        } else {
            // Something you want to do when resume.
        }
    });
 
    // add eventListener for keydown
    document.addEventListener('keydown', function(e) {
    	switch(e.keyCode){
    	case 37: //LEFT arrow
    		console.log('LEEEEEEEFT');
    		break;
    	case 38: //UP arrow
    		break;
    	case 39: //RIGHT arrow
    		break;
    	case 40: //DOWN arrow
    		break;
    	case 13: //OK button
    		break;
    	case 10009: //RETURN button
    		console.log('vamonos');
		tizen.application.getCurrentApplication().exit();
    		break;
    	default:
    		console.log('Key code : ' + e.keyCode);
    		break;
    	}
    });
};
// window.onload can work without <body onload="">
window.onload = init;

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('divbutton1').innerHTML='Current time: ' + h + ':' + m + ':' + s;
    setTimeout(startTime, 10);
}

function checkTime(i) {
    if (i < 10) {
        i='0' + i;
    }
    return i;
}
