//Inicializar Variables
console.log('Iniciando');
var video_player;
var actualTime;
var keys = {};
var content_api = [];
var click_item_focus_testing = 0;
loadApiContent();

//DO ALL WHILE WINDOW ON
window.onload = function () {
	video_player = document.getElementById('new_video');
	video_load_();
	registerKeys();
	bindEvents();
};

//REGISTRO DE KEYS SUPPORTED
function registerKeys() {
	var supportedKeys = tizen.tvinputdevice.getSupportedKeys(), i = 0;
	for (i = 0; i < supportedKeys.length; i++) {
		try {
			tizen.tvinputdevice.registerKey(supportedKeys[i].name);
		} catch (e) {
			console.error('failed to register' + supportedKeys[i].name, e);
		}
		keys[supportedKeys[i].code] = supportedKeys[i].name;
	}
	if (keys.length !== 0) {
		console.log('Keys Cargadas y Online');
	}

}

//LISTENING EVENT
function bindEvents() {
	window.addEventListener('keydown', onKeyDownPress);
}
//RUN EVENT KEYDOWN
function onKeyDownPress(e) {
	console.log('press key: ' + e.keyCode);
	switch (e.keyCode) {
		// No es necesario controlar botones de volumen y mute
		case this.tvKey.VOL_UP: // 448
			//				if (tizen.tvaudiocontrol.getVolume() === 100) {
			//					console.log('volume 100');
			//				} else {
			//					tizen.tvaudiocontrol.setVolumeUp();
			//					console.log(tizen.tvaudiocontrol.getVolume());
			//				}
			break;
		case this.tvKey.VOL_DOWN: // 447
			//				if (tizen.tvaudiocontrol.getVolume() === 0) {
			//					console.log('volume 0');
			//				} else {
			//					tizen.tvaudiocontrol.setVolumeDown();
			//				}
			break;
		case this.tvKey.MUTE: // 449
			//				if (tizen.tvaudiocontrol.isMute()) {
			//					tizen.tvaudiocontrol.setMute(false);
			//					console.log('no muted');
			//				} else {
			//					tizen.tvaudiocontrol.setMute(true);
			//					console.log('muted');
			//				}
			break;
		case this.tvKey.ENTER: // 13
			console.log('Enter');
			loadinfo_actual(this.click_item_focus_testing);
			this.document.getElementById('new_video').style.display = 'none';
			break;
		case this.tvKey.RETURN: //10009
			var salir = confirm('Want to exit from this app?');
			console.log(salir);
			if (salir) {
				window.tizen.application.getCurrentApplication().exit();
			} else {
			}
			console.log('return');
			break;
		case this.tvKey.UP: //38
			console.log('Up');
			break;
		case this.tvKey.DOWN: //40
			console.log('Down');
			break;
		case this.tvKey.LEFT: //37
			console.log('Left');
			if (this.click_item_focus_testing === 0) {
				console.log('No hay más items a la izquierda');
			} else {
				click_item_focus_testing -= 1;
				loadinfo_actual(this.click_item_focus_testing);
			}
			break;
		case this.tvKey.RIGHT: //39
			console.log('Right');
			if (this.click_item_focus_testing === this.content_api.length - 1) {
				console.log('No hay más items a la derecha');
			} else {
				click_item_focus_testing += 1;
				loadinfo_actual(this.click_item_focus_testing);
			}
			break;
		case this.tvKey.REWIND: //412
			document.getElementById('new_video').style.display = 'block';
			document.getElementById('main').style.display = 'none';
			this.video_player.currentTime -= 5;
			this.video_player.play();
			console.log('Rewind');
			break;
		case this.tvKey.FASTFORWARD: //417
			document.getElementById('new_video').style.display = 'block';
			document.getElementById('main').style.display = 'none';
			this.video_player.currentTime += 5;
			this.video_player.play();
			console.log('Fastforward');
			break;
		case this.tvKey.STOP: //413
			if (document.getElementById('new_video').style.display === 'block') {
				document.getElementById('new_video').style.display = 'none';
				document.getElementById('main').style.display = 'block';
				this.video_player.pause();
				this.video_player.currentTime = '0.0';
				console.log('Stop');
			} else {
			}
			break;
		case this.tvKey.PLAY: // 415
			if (document.getElementById('new_video').style.display === 'none') {
				document.getElementById('new_video').style.display = 'block';
				document.getElementById('main').style.display = 'none';
				this.video_player.play();
				console.log('Play');
			} else {
				this.video_player.play();
				console.log(video_player.currentTime + 'seconds');
				console.log('Play');
			}
			break;
		case this.tvKey.PAUSE: // 19
			this.video_player.pause();
			console.log('Pause');
			break;
		default:
			console.log('no supported key');
			break;
	}
}

//CARGAR API JSON, ORDENAR E INSERTAR EN ESTRUCTURA
function loadApiContent() {
	var xhr = new XMLHttpRequest();
	var url = 'http://api.tvmaze.com/shows/1/episodes';
	xhr.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
		}
	};
	xhr.open('GET', url, true);
	xhr.send();
	xhr.onload = function () {
		if (this.status === 200) {
			var content = JSON.parse(this.responseText);
			content.forEach(function (elemento) {
				var structure_api = {
					id: '',
					url: '',
					name: '',
					season: '',
					number: '',
					airdate: '',
					airtime: '',
					airstamp: '',
					runtime: '',
					image_medium: '',
					image_original: '',
					summary: '',
					link_episode: ''
				};
				structure_api.id = elemento.id;
				structure_api.url = elemento.url;
				structure_api.name = elemento.name;
				structure_api.season = elemento.season;
				structure_api.number = elemento.number;
				structure_api.airdate = elemento.airdate;
				structure_api.airtime = elemento.airtime;
				structure_api.airstamp = elemento.airstamp;
				structure_api.runtime = elemento.runtime;
				structure_api.image_medium = elemento.image.medium;
				structure_api.image_original = elemento.image.original;
				structure_api.summary = elemento.summary;
				structure_api.link_episode = elemento._links.self.href;
				this.content_api.push(structure_api);
			});
			if (content_api.length !== 0) {
				console.log('API cargado');
			}
		}
	};
}

//FUNCION PARA IMPRIMIR CADA ELEMENTO DEL API JSON
function print_api_structure() {
	console.log(content_api);
}

//FUNCION PARA IMPRIMIR CADA KEY ENCONTRADA Y CON SOPORTE
function print_keys_supported() {
	console.log(keys);
}

//SHOW FOCUS INFO
function loadinfo_actual(item_focus) {
	document.getElementById('main_info_name').innerHTML = content_api[item_focus].name;
	document.getElementById('main_info_season_chapter').innerHTML = 'Season: ' + content_api[item_focus].season + ' Chapter: ' + content_api[item_focus].number;
	document.getElementById('main_info_aditional').innerHTML = '     Duration: ' + content_api[item_focus].runtime + 'Aviable: ' + content_api[item_focus].airdate;
	document.getElementById('main_info_summary').innerHTML = 'Summary </br>' + content_api[item_focus].summary;
	var setBackground_ = 'url(\'';
	setBackground_ += content_api[item_focus].image_original;
	setBackground_ += '\')';
	document.getElementById('main_api').style.backgroundImage = setBackground_;
	console.log('Show Content Actualizado');
}

//CREATE ANOTHER VIDEO
function video_load_() {
	document.getElementById('new_video').style.display = 'none';
	if (Hls.isSupported()) {
		var hls = new Hls();
		// bind them together
		// hls.loadSource('https://freeform.azureedge.net/showms/2018/96/ed13e7ee-4ace-465e-ade9-7fbe3623e93d.m3u8');
		hls.loadSource('https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8');
		// hls.loadSource('https://www.w3schools.com/html/mov_bbb.mp4');
		hls.attachMedia(video_player);
		hls.on(Hls.Events.MANIFEST_PARSED, function () {
			console.log('Load video complete, ready to play');
		});
	} else if (video_player.canPlayType('application/vnd.apple.mpegurl')) {
		// video_player.src = 'https://freeform.azureedge.net/showms/2018/96/ed13e7ee-4ace-465e-ade9-7fbe3623e93d.m3u8';
		video_player.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
		// video_player.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
		video_player.addEventListener('canplay', function () {
			console.log('Load video complete, ready to play, version src');
		});
	}
}

//LLAMADO EXITOSO
var successCallback = function () {
};

//ERROR EN CALLBACK
var errorCallback = function () {
	console.log('errorCallback hubo un error');
};