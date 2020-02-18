'use strict';
!function () {
	/**
	 * @param {?} localStorageServiceProvider
	 * @param {!Object} ChartJsProvider
	 * @return {undefined}
	 */
	function ConfigBlock(localStorageServiceProvider, ChartJsProvider) {
		localStorageServiceProvider.setPrefix("smoothieApp");
		ChartJsProvider.setOptions({
			colours: ["#FDB45C", "#DCDCDC", "#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],
			responsive: true,
			maintainAspectRatio: false
		});
	}
	/**
	 * @param {!Object} gettextCatalog
	 * @param {!Object} localStorageService
	 * @param {!Object} editableOptions
	 * @param {?} $httpBackend
	 * @return {undefined}
	 */
	function RunBlock(gettextCatalog, localStorageService, editableOptions, $httpBackend) {
		gettextCatalog.setCurrentLanguage(localStorageService.get("currentLanguage") || "en");
		/** @type {boolean} */
		gettextCatalog.debug = true;
		/** @type {string} */
		editableOptions.theme = "bs3";
		/** @type {string} */
		editableOptions.activate = "select";
	}
	angular.module("smoothieApp", ["ui.bootstrap", "gettext", "ngSanitize", "luegg.directives", "xeditable", "LocalStorageModule", "ngFileUpload", "chart.js"]).config(ConfigBlock).run(RunBlock);
	/** @type {!Array} */
	RunBlock.$inject = ["gettextCatalog", "localStorageService", "editableOptions", "$httpBackend"];
	/** @type {!Array} */
	ConfigBlock.$inject = ["localStorageServiceProvider", "ChartJsProvider"];
}(), angular.module("gettext").run(["gettextCatalog", function (gettextCatalog) {
	gettextCatalog.setStrings("de", {
		"Language:": "Sprache:"
	});
	gettextCatalog.setStrings("pl", {
		Abort: "Przerwij",
		"auto-check every:": "sprawdzaj co:",
		Autoscroll: "Autoscroll",
		Bed: "St\u00f3\u0142",
		Clear: "Wyczy\u015b\u0107",
		Commands: "Komendy",
		Controls: "Sterowanie",
		Delete: "Usu\u0144",
		"enable second extruder": "w\u0142\u0105cz drugi ekstruder",
		Extrude: "Wyt\u0142aczaj",
		"Extruder T0": "Ekstruder T0",
		"Extruder T1": "Ekstruder T1",
		Extruders: "Ekstrudery",
		Files: "Pliki",
		"Filter temperatures": "Filtruj temperatury",
		"Get temperature": "Sprawd\u017a temperatury",
		"Heater T0": "G\u0142owica T0",
		"Heater T1": "G\u0142owica T1",
		"Language:": "J\u0119zyk:",
		"Motors off": "Wy\u0142\u0105cz",
		Name: "Nazwa",
		Options: "Opcje",
		Print: "Drukuj",
		Progress: "Post\u0119p",
		Refresh: "Od\u015bwie\u017c",
		Reverse: "Cofnij",
		sec: "sek",
		Send: "Wy\u015blij",
		"Send Command...": "Wy\u015blij polecenie",
		Settings: "Ustawienia",
		"Speed:": "Pr\u0119dko\u015b\u0107:",
		Temperatures: "Temperatury",
		Upload: "Wczytaj",
		"Value | Target": "Pomiar | Cel"
	});
}]), function () {
	/**
	 * @param {?} $scope
	 * @param {?} DataService
	 * @return {undefined}
	 */
	function CommandCtrl($scope, DataService) {
		/**
		 * @return {undefined}
		 */
		function activate() {
			DataService.registerOutput(vm);
		}
		/**
		 * @return {undefined}
		 */
		function sendCommand() {
			if (vm.command) {
				console.log("Command: " + vm.command);
				DataService.runCommand(vm.command).then(function (result_data) {
					vm.updateOutput(result_data);
					vm.cmdHistory.push(vm.command);
					vm.cmdHistory.slice(-300);
					vm.cmdHistoryIdx = vm.cmdHistory.length;
					/** @type {string} */
					vm.command = "";
				});
			}
		}
		/**
		 * @param {!Event} params
		 * @return {?}
		 */
		function handleKeyDown(params) {
			var c = params.keyCode;
			return 38 != c && 40 != c || (38 == c && vm.cmdHistory.length > 0 && vm.cmdHistoryIdx > 0 ? vm.cmdHistoryIdx-- : 40 == c && vm.cmdHistoryIdx < vm.cmdHistory.length - 1 && vm.cmdHistoryIdx++ , vm.cmdHistoryIdx >= 0 && vm.cmdHistoryIdx < vm.cmdHistory.length && (vm.command = vm.cmdHistory[vm.cmdHistoryIdx]), false);
		}
		/**
		 * @param {!Event} event
		 * @return {?}
		 */
		function handleKeyUp(event) {
			return 13 == event.keyCode && vm.sendCommand(), true;
		}
		/**
		 * @return {undefined}
		 */
		function clear() {
			/** @type {!Array} */
			vm.log = [];
			vm.updateOutput();
		}
		/**
		 * @return {undefined}
		 */
		function onFilterChange() {
			vm.updateOutput();
		}
		/**
		 * @param {string} message
		 * @return {undefined}
		 */
		function updateOutput(message) {
			if (!vm.log) {
				/** @type {!Array} */
				vm.log = [];
			}
			if (message) {
				vm.log = vm.log.concat(message);
				vm.log = vm.log.slice(-300);
			}
			/** @type {!RegExp} */
			var regex = /ok T:/g;
			/** @type {string} */
			var output = "";
			var patchLen = vm.log.length;
			/** @type {number} */
			var i = 0;
			for (; i < patchLen; i++) {
				if (!(vm.filterOutput && vm.log[i].match(regex))) {
					output = output + vm.log[i];
				}
			}
			vm.commandOutput = output;
		}
		var vm = this;
		/** @type {!Array} */
		vm.log = [];
		/** @type {string} */
		vm.command = "";
		/** @type {string} */
		vm.commandOutput = "";
		/** @type {!Array} */
		vm.cmdHistory = [];
		/** @type {number} */
		vm.cmdHistoryIdx = -1;
		/** @type {boolean} */
		vm.autoscrollEnabled = true;
		/** @type {boolean} */
		vm.filterOutput = false;
		/** @type {function(): undefined} */
		vm.sendCommand = sendCommand;
		/** @type {function(!Event): ?} */
		vm.handleKeyDown = handleKeyDown;
		/** @type {function(!Event): ?} */
		vm.handleKeyUp = handleKeyUp;
		/** @type {function(): undefined} */
		vm.clear = clear;
		/** @type {function(): undefined} */
		vm.onFilterChange = onFilterChange;
		/** @type {function(string): undefined} */
		vm.updateOutput = updateOutput;
		activate();
	}
	angular.module("smoothieApp").controller("CommandCtrl", CommandCtrl);
	/** @type {!Array} */
	CommandCtrl.$inject = ["$scope", "DataService"];
}(), function () {
	/**
	 * @param {?} DataService
	 * @return {undefined}
	 */
	function ExtruderCtrl(DataService) {
		/**
		 * @return {undefined}
		 */
		function onSecondExtruderSupportChange() {
			DataService.updateSecondExtruder();
		}
		/**
		 * @param {string} extruder
		 * @param {?} direction
		 * @return {undefined}
		 */
		function extrude(extruder, direction) {
			console.log("Extruder: " + extruder + " | length: " + vm.filamenLength + " | speed: " + vm.velocity);
			DataService.runCommand(extruder).then(function (spofHosts) {
				console.log("Extruder result: " + spofHosts);
			});
			DataService.runCommand("G91 G0 E" + vm.filamenLength * direction + " F" + vm.velocity + " G90").then(function (spofHosts) {
				console.log("Command result: " + spofHosts);
			});
		}
		var vm = this;
		vm.secondExtruder = DataService.secondExtruderState();
		/** @type {number} */
		vm.filamenLength = 5;
		/** @type {number} */
		vm.velocity = 100;
		/** @type {function(): undefined} */
		vm.onSecondExtruderSupportChange = onSecondExtruderSupportChange;
		/** @type {function(string, ?): undefined} */
		vm.extrude = extrude;
	}
	angular.module("smoothieApp").controller("ExtruderCtrl", ExtruderCtrl);
	/** @type {!Array} */
	ExtruderCtrl.$inject = ["DataService"];
}(), function () {
	/**
	 * @param {?} DataService
	 * @param {!Object} Upload
	 * @return {undefined}
	 */
	function FileCtrl(DataService, Upload) {
		/**
		 * @return {undefined}
		 */
		function activate() {
			refreshFiles();
		}
		/**
		 * @return {undefined}
		 */
		function refreshFiles() {
			console.log("RefreshFiles");
			DataService.runCommand("M20").then(function (result_data) {
				parseFilelist(result_data);
			}, function (xhr) {
				console.error(xhr.statusText);
			});
		}
		/**
		 * @param {string} rawdata
		 * @return {undefined}
		 */
		function parseFilelist(rawdata) {
			/** @type {!Array} */
			vm.fileList = [];
			var zakoni = rawdata.split("\n");
			angular.forEach(zakoni, function (path, canCreateDiscussions) {
				if (path = path.trim(), path.match(/\.g(code)?$/)) {
					var file = {
						filename: path,
						uploading: false,
						percentage: 0
					};
					vm.fileList.push(file);
				}
			});
		}
		/**
		 * @param {string} file
		 * @return {undefined}
		 */
		function print(file) {
			console.log("print file - " + file);
			DataService.runCommand("play /sd/" + file).then(function (spofHosts) {
				console.log("Result: " + spofHosts);
			});
		}
		/**
		 * @return {undefined}
		 */
		function progress() {
			DataService.runCommand("progress").then(function (result_data) {
				DataService.broadcastCommand(result_data);
			}, function (xhr) {
				console.error(xhr.statusText);
			});
		}
		/**
		 * @return {undefined}
		 */
		function abort() {
			DataService.runCommand("abort").then(function (result_data) {
				DataService.broadcastCommand(result_data);
			}, function (xhr) {
				console.error(xhr.statusText);
			});
		}
		/**
		 * @param {!Object} file
		 * @return {undefined}
		 */
		function uploadFile(file) {
			if (file) {
				DataService.broadcastCommand("Uploading: " + file.name + "\n");
				vm.currentUploadedFile = {
					filename: file.name,
					uploading: true,
					percentage: 0
				};
				vm.fileList.push(vm.currentUploadedFile);
				Upload.http({
					url: "/upload",
					headers: {
						"X-Filename": file.name
					},
					data: file
				}).then(function (canCreateDiscussions) {
					DataService.broadcastCommand("Upload successful.\n");
					/** @type {boolean} */
					vm.currentUploadedFile.uploading = false;
					vm.refreshFiles();
				}, function (testsStatus) {
					DataService.broadcastCommand("Error status: " + testsStatus.status + "\n");
				}, function (evt2) {
					/** @type {number} */
					var to = parseInt(100 * evt2.loaded / evt2.total);
					/** @type {number} */
					vm.currentUploadedFile.percentage = to;
					console.log("Progress: " + to + "%");
				});
			}
		}
		/**
		 * @param {!Node} event
		 * @return {undefined}
		 */
		function deleteFile(event) {
			DataService.runCommand("M30 " + event.filename).then(function (canCreateDiscussions) {
				DataService.broadcastCommand("Deleted file: " + event.filename + "\n");
				vm.refreshFiles();
			}, function (xhr) {
				console.error(xhr.statusText);
			});
		}
		var vm = this;
		/** @type {!Array} */
		vm.fileList = [];
		vm.currentUploadedFile = {};
		/** @type {function(): undefined} */
		vm.refreshFiles = refreshFiles;
		/** @type {function(string): undefined} */
		vm.print = print;
		/** @type {function(): undefined} */
		vm.progress = progress;
		/** @type {function(): undefined} */
		vm.abort = abort;
		/** @type {function(!Object): undefined} */
		vm.uploadFile = uploadFile;
		/** @type {function(!Node): undefined} */
		vm.deleteFile = deleteFile;
		activate();
	}
	angular.module("smoothieApp").controller("FileCtrl", FileCtrl);
	/** @type {!Array} */
	FileCtrl.$inject = ["DataService", "Upload"];
}(), function () {
	/**
	 * @param {?} gettextCatalog
	 * @param {!Object} localStorageService
	 * @return {undefined}
	 */
	function HeaderCtrl(gettextCatalog, localStorageService) {
		/**
		 * @param {string} lang
		 * @return {undefined}
		 */
		function setLanguage(lang) {
			/** @type {string} */
			vm.languages.current = lang;
			gettextCatalog.setCurrentLanguage(lang);
			localStorageService.set("currentLanguage", vm.languages.current);
		}
		/**
		 * @return {undefined}
		 */
		function updatePrinterName() {
			localStorageService.set("printerName", vm.printerName);
		}
		var vm = this;
		vm.printerName = localStorageService.get("printerName") || "Your printer name";
		vm.languages = {
			current: gettextCatalog.currentLanguage,
			available: {
				en: "English",
				pl: "Polski"
			}
		};
		/** @type {function(string): undefined} */
		vm.setLanguage = setLanguage;
		/** @type {function(): undefined} */
		vm.updatePrinterName = updatePrinterName;
	}
	angular.module("smoothieApp").controller("HeaderCtrl", HeaderCtrl);
	/** @type {!Array} */
	HeaderCtrl.$inject = ["gettextCatalog", "localStorageService"];
}(), function () {
	/**
	 * @param {?} DataService
	 * @return {undefined}
	 */
	function MotorCtrl(DataService) {
		/**
		 * @param {string} axis
		 * @return {undefined}
		 */
		function homeAxis(axis) {
			console.log("Home axis: " + axis);
		}
		/**
		 * @return {undefined}
		 */
		function motorsOff() {
			console.log("MotorsOff");
			DataService.runCommand("M18").then(function (spofHosts) {
				console.log("Motors turned off! - Result: " + spofHosts);
			}, function (xhr) {
				console.error(xhr.statusText);
			});
		}
		/**
		 * @param {string} cmd
		 * @return {undefined}
		 */
		function jogButtonClick(cmd) {
			console.log("jogButtonClick - " + cmd);
			DataService.runCommand(cmd).then(function (spofHosts) {
				console.log("Result: " + spofHosts);
			}, function (xhr) {
				console.error(xhr.statusText);
			});
		}
		/**
		 * @param {string} cmd
		 * @return {undefined}
		 */
		function jogXYClick(cmd) {
			console.log("jogXYClick - " + cmd);
			DataService.runCommand("G91 G0 " + cmd + " F" + vm.xy_velocity + " G90").then(function (spofHosts) {
				console.log("Result: " + spofHosts);
			}, function (xhr) {
				console.error(xhr.statusText);
			});
		}
		/**
		 * @param {string} cmd
		 * @return {undefined}
		 */
		function jogZClick(cmd) {
			console.log("jogZClick - " + cmd);
			DataService.runCommand("G91 G0 " + cmd + " F" + vm.z_velocity + " G90").then(function (spofHosts) {
				console.log("Result: " + spofHosts);
			}, function (xhr) {
				console.error(xhr.statusText);
			});
		}
		var vm = this;
		/** @type {string} */
		vm.elementId = "";
		/** @type {number} */
		vm.xy_velocity = 3E3;
		/** @type {number} */
		vm.z_velocity = 200;
		/** @type {function(string): undefined} */
		vm.homeAxis = homeAxis;
		/** @type {function(): undefined} */
		vm.motorsOff = motorsOff;
		/** @type {function(string): undefined} */
		vm.jogButtonClick = jogButtonClick;
		/** @type {function(string): undefined} */
		vm.jogXYClick = jogXYClick;
		/** @type {function(string): undefined} */
		vm.jogZClick = jogZClick;
	}
	angular.module("smoothieApp").controller("MotorCtrl", MotorCtrl);
	/** @type {!Array} */
	MotorCtrl.$inject = ["DataService"];
}(), function () {
	/**
	 * @param {!Object} $interval
	 * @param {?} DataService
	 * @param {!Object} localStorageService
	 * @return {undefined}
	 */
	function TempCtrl($interval, DataService, localStorageService) {
		/**
		 * @return {undefined}
		 */
		function activate() {
			if (vm.autoCheckEnabled) {
				vm.localTempInterval = $interval(vm.onTimeout, 1E3 * vm.tempInterval);
				vm.getTemperatures();
			}
		}
		/**
		 * @return {undefined}
		 */
		function onTimeout() {
			vm.getTemperatures();
		}
		/**
		 * @param {string} url
		 * @return {undefined}
		 */
		function heatOff(url) {
			switch (console.log("HeatOff - heater: " + url), url) {
				case "T0":
					/** @type {number} */
					vm.heaterT0SelectedTemp = 0;
					break;
				case "T1":
					/** @type {number} */
					vm.heaterT1SelectedTemp = 0;
					break;
				case "bed":
					/** @type {number} */
					vm.bedSelectedTemp = 0;
			}
			/** @type {boolean} */
			var closeExpr = "bed" != url;
			/** @type {number} */
			var closingExpr = closeExpr ? 104 : 140;
			/** @type {string} */
			var cmd = "M" + closingExpr + " S0";
			if (closeExpr) {
				/** @type {string} */
				cmd = cmd + (" " + url);
			}
			DataService.runCommand(cmd).then(function (canCreateDiscussions) {
				vm.getTemperatures();
			});
		}
		/**
		 * @param {string} heater
		 * @return {undefined}
		 */
		function heatSet(heater) {
			console.log("HeatSet - heater: " + heater);
			/** @type {number} */
			var selectedTemp = 0;
			switch (heater) {
				case "T0":
					selectedTemp = vm.heaterT0SelectedTemp;
					break;
				case "T1":
					selectedTemp = vm.heaterT1SelectedTemp;
					break;
				case "bed":
					selectedTemp = vm.bedSelectedTemp;
			}
			console.log("Temp: " + selectedTemp);
			/** @type {boolean} */
			var point = "bed" != heater;
			/** @type {number} */
			var x = point ? 104 : 140;
			/** @type {string} */
			var command = "M" + x + " S" + selectedTemp;
			if (point) {
				/** @type {string} */
				command = command + (" " + heater);
			}
			DataService.runCommand(command).then(function (canCreateDiscussions) {
				vm.getTemperatures();
			});
		}
		/**
		 * @param {!Event} keyEvent
		 * @param {string} heater
		 * @return {?}
		 */
		function handleKeyUp(keyEvent, heater) {
			return 13 == keyEvent.keyCode && vm.heatSet(heater), true;
		}
		/**
		 * @return {undefined}
		 */
		function onAutoCheckChange() {
			if (vm.autoCheckEnabled) {
				vm.localTempInterval = $interval(vm.onTimeout, 1E3 * vm.tempInterval);
				localStorageService.set("autoCheckEnabled", "true");
				vm.getTemperatures();
			} else {
				if (angular.isDefined(vm.localTempInterval)) {
					$interval.cancel(vm.localTempInterval);
				}
				localStorageService.set("autoCheckEnabled", "false");
			}
		}
		/**
		 * @return {undefined}
		 */
		function onTempIntervalChange() {
			localStorageService.set("tempInterval", vm.tempInterval);
			if (angular.isDefined(vm.localTempInterval)) {
				$interval.cancel(vm.localTempInterval);
			}
			vm.localTempInterval = $interval(vm.onTimeout, 1E3 * vm.tempInterval);
		}
		/**
		 * @return {undefined}
		 */
		function getTemperatures() {
			DataService.runCommand("M105").then(function (result_data) {
				DataService.broadcastCommand(result_data);
				var result;
				/** @type {!RegExp} */
				var regex_temp = /(B|T(\d*)):\s*([+]?[0-9]*\.?[0-9]+)? (\/)([+]?[0-9]*\.?[0-9]+)?/gi;
				for (; null !== (result = regex_temp.exec(result_data));) {
					/** @type {string} */
					var type = result[1];
					/** @type {string} */
					var value = result[3] + "\u00b0C";
					/** @type {string} */
					value = value + (" | " + result[5] + "\u00b0C");
					if ("T" == type) {
						/** @type {string} */
						vm.heaterT0ActualTemp = result[3];
						/** @type {string} */
						vm.heaterT0DisplayTemp = value;
					} else {
						if ("T1" == type) {
							/** @type {string} */
							vm.heaterT1ActualTemp = result[3];
							/** @type {string} */
							vm.heaterT1DisplayTemp = value;
						}
					}
					if ("B" == type) {
						/** @type {number} */
						vm.bedActualTemp = Number(result[3]);
						/** @type {string} */
						vm.bedDisplayTemp = value;
					}
				}
				if (vm.labels.length) {
					vm.labels = vm.labels.slice(1);
					vm.dataHeater[0] = vm.dataHeater[0].slice(1);
					vm.dataBed[0] = vm.dataBed[0].slice(1);
				}
				for (; vm.labels.length < 20;) {
					vm.labels.push("");
					vm.dataHeater[0].push(vm.heaterT0ActualTemp);
					vm.dataBed[0].push(vm.bedActualTemp);
				}
			}, function (xhr) {
				console.error(xhr.statusText);
			});
		}
		var vm = this;
		vm.secondExtruder = DataService.secondExtruderState();
		/** @type {!Array} */
		vm.labels = [];
		/** @type {!Array} */
		vm.seriesHeater = ["Heater T0"];
		/** @type {!Array} */
		vm.dataHeater = [[]];
		/** @type {!Array} */
		vm.heaterColours = [{
			backgroundColor: "rgba(77, 83, 96, 0.2)",
			borderColor: "rgba(77, 83, 96, 0.5)"
		}];
		/** @type {!Array} */
		vm.seriesBed = ["Bed"];
		/** @type {!Array} */
		vm.dataBed = [[]];
		/** @type {!Array} */
		vm.bedColours = [{
			backgroundColor: "rgba(247, 70, 74, 0.2)",
			borderColor: "rgba(247, 70, 74, 0.5)"
		}];
		/** @type {number} */
		Chart.defaults.global.elements.point.radius = 0;
		/** @type {string} */
		Chart.defaults.global.legend.position = "bottom";
		/** @type {number} */
		Chart.defaults.global.animation.duration = 0;
		/** @type {number} */
		Chart.defaults.global.elements.line.borderWidth = 1;
		vm.options = {
			tooltips: {
				enabled: false
			},
			scales: {
				xAxes: [{
					gridLines: {
						display: false
					}
				}]
			}
		};
		vm.localTempInterval = {};
		vm.tempInterval = localStorageService.get("tempInterval") || 3;
		/** @type {boolean} */
		vm.autoCheckEnabled = "true" == localStorageService.get("autoCheckEnabled");
		/** @type {number} */
		vm.heaterT0SelectedTemp = 0;
		/** @type {string} */
		vm.heaterT0ActualTemp = "-";
		/** @type {string} */
		vm.heaterT0DisplayTemp = "";
		/** @type {number} */
		vm.heaterT1SelectedTemp = 0;
		/** @type {string} */
		vm.heaterT1ActualTemp = "-";
		/** @type {string} */
		vm.heaterT1DisplayTemp = "";
		/** @type {number} */
		vm.bedSelectedTemp = 0;
		/** @type {string} */
		vm.bedActualTemp = "-";
		/** @type {string} */
		vm.bedDisplayTemp = "";
		/** @type {function(): undefined} */
		vm.onTimeout = onTimeout;
		/** @type {function(string): undefined} */
		vm.heatOff = heatOff;
		/** @type {function(string): undefined} */
		vm.heatSet = heatSet;
		/** @type {function(!Event, string): ?} */
		vm.handleKeyUp = handleKeyUp;
		/** @type {function(): undefined} */
		vm.onAutoCheckChange = onAutoCheckChange;
		/** @type {function(): undefined} */
		vm.onTempIntervalChange = onTempIntervalChange;
		/** @type {function(): undefined} */
		vm.getTemperatures = getTemperatures;
		activate();
	}
	angular.module("smoothieApp").controller("TempCtrl", TempCtrl);
	/** @type {!Array} */
	TempCtrl.$inject = ["$interval", "DataService", "localStorageService"];
}(), function () {
	/**
	 * @param {!Object} $http
	 * @param {!Object} localStorageService
	 * @return {?}
	 */
	function DataService($http, localStorageService) {
		/**
		 * @param {string} cmd
		 * @return {?}
		 */
		function runCommand(cmd) {
			return cmd = cmd + "\n", $http.post(url, cmd).then(function (simpleselect) {
				return simpleselect.data;
			});
		}
		/**
		 * @param {?} out
		 * @return {undefined}
		 */
		function registerOutput(out) {
			output.push(out);
		}
		/**
		 * @param {string} msg
		 * @return {undefined}
		 */
		function broadcastCommand(msg) {
			/** @type {number} */
			var index = 0;
			for (; index < output.length; ++index) {
				output[index].updateOutput(msg);
			}
		}
		/**
		 * @return {?}
		 */
		function secondExtruderState() {
			return extruderState;
		}
		/**
		 * @return {undefined}
		 */
		function updateSecondExtruder() {
			localStorageService.set("secondExtruderSupportEnabled", extruderState.supportEnabled ? "true" : "false");
		}
		/** @type {string} */
		var url = "/command";
		var extruderState = {
			supportEnabled: "true" == localStorageService.get("secondExtruderSupportEnabled")
		};
		/** @type {!Array} */
		var output = [];
		var service = {
			runCommand: runCommand,
			registerOutput: registerOutput,
			broadcastCommand: broadcastCommand,
			secondExtruderState: secondExtruderState,
			updateSecondExtruder: updateSecondExtruder
		};
		return service;
	}
	angular.module("smoothieApp").factory("DataService", DataService);
	/** @type {!Array} */
	DataService.$inject = ["$http", "localStorageService"];
}(), function (angular, undefined) {
	/**
	 * @param {?} $parse
	 * @param {string} attr
	 * @param {!Object} scope
	 * @return {?}
	 */
	function createActivationState($parse, attr, scope) {
		/**
		 * @param {boolean} initValue
		 * @return {?}
		 */
		function unboundState(initValue) {
			/** @type {boolean} */
			var activated = initValue;
			return {
				getValue: function () {
					return activated;
				},
				setValue: function (value) {
					activated = value;
				}
			};
		}
		/**
		 * @param {?} getter
		 * @param {!Object} scope
		 * @return {?}
		 */
		function oneWayBindingState(getter, scope) {
			return {
				getValue: function () {
					return getter(scope);
				},
				setValue: function () {
				}
			};
		}
		/**
		 * @param {?} getter
		 * @param {?} setter
		 * @param {!Object} scope
		 * @return {?}
		 */
		function twoWayBindingState(getter, setter, scope) {
			return {
				getValue: function () {
					return getter(scope);
				},
				setValue: function (value) {
					if (value !== getter(scope)) {
						scope.$apply(function () {
							setter(scope, value);
						});
					}
				}
			};
		}
		if ("" !== attr) {
			var getter = $parse(attr);
			return getter.assign !== undefined ? twoWayBindingState(getter, getter.assign, scope) : oneWayBindingState(getter, scope);
		}
		return unboundState(true);
	}
	/**
	 * @param {?} module
	 * @param {string} attrName
	 * @param {!Object} direction
	 * @return {undefined}
	 */
	function createDirective(module, attrName, direction) {
		module.directive(attrName, ["$parse", "$window", "$timeout", function ($parse, $window, $timeout) {
			return {
				priority: 1,
				restrict: "A",
				link: function (scope, element, attrs) {
					/**
					 * @return {undefined}
					 */
					function scrollIfGlued() {
						if (activationState.getValue() && !direction.isAttached(el)) {
							direction.scroll(el);
						}
					}
					/**
					 * @return {undefined}
					 */
					function onScroll() {
						activationState.setValue(direction.isAttached(el));
					}
					var el = element[0];
					var activationState = createActivationState($parse, attrs[attrName], scope);
					scope.$watch(scrollIfGlued);
					$timeout(scrollIfGlued, 0, false);
					$window.addEventListener("resize", scrollIfGlued, false);
					element.bind("scroll", onScroll);
					element.on("$destroy", function () {
						element.unbind("scroll", onScroll);
					});
					scope.$on("$destroy", function () {
						$window.removeEventListener("resize", scrollIfGlued, false);
					});
				}
			};
		}]);
	}
	var right = {
		isAttached: function (el) {
			return el.scrollTop + el.clientHeight + 1 >= el.scrollHeight;
		},
		scroll: function (element) {
			element.scrollTop = element.scrollHeight;
		}
	};
	var bottom = {
		isAttached: function (el) {
			return el.scrollTop <= 1;
		},
		scroll: function (p) {
			/** @type {number} */
			p.scrollTop = 0;
		}
	};
	var top = {
		isAttached: function (el) {
			return el.scrollLeft + el.clientWidth + 1 >= el.scrollWidth;
		},
		scroll: function (data) {
			data.scrollLeft = data.scrollWidth;
		}
	};
	var left = {
		isAttached: function (el) {
			return el.scrollLeft <= 1;
		},
		scroll: function (p) {
			/** @type {number} */
			p.scrollLeft = 0;
		}
	};
	var module = angular.module("luegg.directives", []);
	createDirective(module, "scrollGlue", right);
	createDirective(module, "scrollGlueTop", bottom);
	createDirective(module, "scrollGlueBottom", right);
	createDirective(module, "scrollGlueLeft", left);
	createDirective(module, "scrollGlueRight", top);
}(angular), !function (factory) {
	if ("object" == typeof exports) {
		module.exports = factory("undefined" != typeof angular ? angular : require("angular"), "undefined" != typeof Chart ? Chart : require("chart.js"));
	} else {
		if ("function" == typeof define && define.amd) {
			define(["angular", "chart"], factory);
		} else {
			if ("undefined" == typeof angular || "undefined" == typeof Chart) {
				throw new Error("Chart.js library needs to included, see http://jtblin.github.io/angular-chart.js/");
			}
			factory(angular, Chart);
		}
	}
}(function (angular, Chart) {
	/**
	 * @return {undefined}
	 */
	function ChartJsProvider() {
		var options = {
			responsive: true
		};
		var ChartJs = {
			Chart: Chart,
			getOptions: function (type) {
				var blockElements = type && options[type] || {};
				return angular.extend({}, options, blockElements);
			}
		};
		/**
		 * @param {string} type
		 * @param {string} customOptions
		 * @return {?}
		 */
		this.setOptions = function (type, customOptions) {
			return customOptions ? void (options[type] = angular.extend(options[type] || {}, customOptions)) : (customOptions = type, void (options = angular.extend(options, customOptions)));
		};
		/**
		 * @return {?}
		 */
		this.$get = function () {
			return ChartJs;
		};
	}
	/**
	 * @param {?} ChartJs
	 * @param {?} $timeout
	 * @return {?}
	 */
	function ChartJsFactory(ChartJs, $timeout) {
		/**
		 * @param {!Object} type
		 * @param {!Object} scope
		 * @param {!Object} elem
		 * @return {undefined}
		 */
		function createChart(type, scope, elem) {
			var options = getChartOptions(type, scope);
			if (hasData(scope) && canDisplay(type, scope, elem, options)) {
				var el = elem[0];
				var ctx = el.getContext("2d");
				scope.chartGetColor = getChartColorFn(scope);
				var data = getChartData(type, scope);
				destroyChart(scope);
				scope.chart = new ChartJs.Chart(ctx, {
					type: type,
					data: data,
					options: options
				});
				scope.$emit("chart-create", scope.chart);
				bindEvents(el, scope);
			}
		}
		/**
		 * @param {!Object} newVal
		 * @param {!Object} oldVal
		 * @return {?}
		 */
		function canUpdateChart(newVal, oldVal) {
			return !!(newVal && oldVal && newVal.length && oldVal.length) && (Array.isArray(newVal[0]) ? newVal.length === oldVal.length && newVal.every(function (progressiveData, name) {
				return progressiveData.length === oldVal[name].length;
			}) : oldVal.reduce(sum, 0) > 0 && newVal.length === oldVal.length);
		}
		/**
		 * @param {(Object|number)} rowGroupKey
		 * @param {!Object} colGroupKey
		 * @return {?}
		 */
		function sum(rowGroupKey, colGroupKey) {
			return rowGroupKey + colGroupKey;
		}
		/**
		 * @param {!Object} scope
		 * @param {string} action
		 * @param {boolean} triggerOnlyOnChange
		 * @return {?}
		 */
		function getEventHandler(scope, action, triggerOnlyOnChange) {
			/** @type {null} */
			var lastState = null;
			return function (evt) {
				var atEvents = scope.chart.getElementsAtEvent || scope.chart.getPointsAtEvent;
				if (atEvents) {
					var activePoints = atEvents.call(scope.chart, evt);
					if (!(triggerOnlyOnChange !== false && angular.equals(lastState, activePoints) !== false)) {
						lastState = activePoints;
						scope[action](activePoints, evt);
					}
				}
			};
		}
		/**
		 * @param {string} type
		 * @param {!Object} scope
		 * @return {?}
		 */
		function getColors(type, scope) {
			var colors = angular.copy(scope.chartColors || ChartJs.getOptions(type).chartColors || Chart.defaults.global.colors);
			/** @type {boolean} */
			var c = colors.length < scope.chartData.length;
			for (; colors.length < scope.chartData.length;) {
				colors.push(scope.chartGetColor());
			}
			return c && (scope.chartColors = colors), colors.map(convertColor);
		}
		/**
		 * @param {number} a
		 * @return {?}
		 */
		function convertColor(a) {
			return "object" == typeof a && null !== a ? a : "string" == typeof a && "#" === a[0] ? getColor(hexToRgb(a.substr(1))) : getRandomColor();
		}
		/**
		 * @return {?}
		 */
		function getRandomColor() {
			/** @type {!Array} */
			var color = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)];
			return getColor(color);
		}
		/**
		 * @param {!Array} color
		 * @return {?}
		 */
		function getColor(color) {
			return {
				backgroundColor: rgba(color, .2),
				pointBackgroundColor: rgba(color, 1),
				pointHoverBackgroundColor: rgba(color, .8),
				borderColor: rgba(color, 1),
				pointBorderColor: "#fff",
				pointHoverBorderColor: rgba(color, 1)
			};
		}
		/**
		 * @param {number} min
		 * @param {number} max
		 * @return {?}
		 */
		function getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
		/**
		 * @param {!Array} color
		 * @param {number} alpha
		 * @return {?}
		 */
		function rgba(color, alpha) {
			return o ? "rgb(" + color.join(",") + ")" : "rgba(" + color.concat(alpha).join(",") + ")";
		}
		/**
		 * @param {string} byte1
		 * @return {?}
		 */
		function hexToRgb(byte1) {
			/** @type {number} */
			var firstByte = parseInt(byte1, 16);
			/** @type {number} */
			var r = firstByte >> 16 & 255;
			/** @type {number} */
			var n = firstByte >> 8 & 255;
			/** @type {number} */
			var totalCCs = 255 & firstByte;
			return [r, n, totalCCs];
		}
		/**
		 * @param {!Object} scope
		 * @return {?}
		 */
		function hasData(scope) {
			return scope.chartData && scope.chartData.length;
		}
		/**
		 * @param {!Object} scope
		 * @return {?}
		 */
		function getChartColorFn(scope) {
			return "function" == typeof scope.chartGetColor ? scope.chartGetColor : getRandomColor;
		}
		/**
		 * @param {boolean} type
		 * @param {!Object} scope
		 * @return {?}
		 */
		function getChartData(type, scope) {
			var colors = getColors(type, scope);
			return Array.isArray(scope.chartData[0]) ? getDataSets(scope.chartLabels, scope.chartData, scope.chartSeries || [], colors, scope.chartDatasetOverride) : getData(scope.chartLabels, scope.chartData, colors, scope.chartDatasetOverride);
		}
		/**
		 * @param {!Object} labels
		 * @param {?} series
		 * @param {!Object} data
		 * @param {!Object} colors
		 * @param {string} datasetOverride
		 * @return {?}
		 */
		function getDataSets(labels, series, data, colors, datasetOverride) {
			return {
				labels: labels,
				datasets: series.map(function (instancesTypes, i) {
					var c = angular.extend({}, colors[i], {
						label: data[i],
						data: instancesTypes
					});
					return datasetOverride && datasetOverride.length >= i && angular.merge(c, datasetOverride[i]), c;
				})
			};
		}
		/**
		 * @param {!Object} id
		 * @param {string} instruction
		 * @param {?} text
		 * @param {?} args
		 * @return {?}
		 */
		function getData(id, instruction, text, args) {
			var parsedData = {
				labels: id,
				datasets: [{
					data: instruction,
					backgroundColor: text.map(function (color) {
						return color.pointBackgroundColor;
					}),
					hoverBackgroundColor: text.map(function (viewerConfig) {
						return viewerConfig.backgroundColor;
					})
				}]
			};
			return args && angular.merge(parsedData.datasets[0], args), parsedData;
		}
		/**
		 * @param {boolean} type
		 * @param {!Object} scope
		 * @return {?}
		 */
		function getChartOptions(type, scope) {
			return angular.extend({}, ChartJs.getOptions(type), scope.chartOptions);
		}
		/**
		 * @param {!Element} el
		 * @param {!Object} scope
		 * @return {undefined}
		 */
		function bindEvents(el, scope) {
			el.onclick = scope.chartClick ? getEventHandler(scope, "chartClick", false) : angular.noop;
			el.onmousemove = scope.chartHover ? getEventHandler(scope, "chartHover", true) : angular.noop;
		}
		/**
		 * @param {string} values
		 * @param {!Object} scope
		 * @return {undefined}
		 */
		function updateChart(values, scope) {
			if (Array.isArray(scope.chartData[0])) {
				scope.chart.data.datasets.forEach(function (event, id) {
					event.data = values[id];
				});
			} else {
				/** @type {string} */
				scope.chart.data.datasets[0].data = values;
			}
			scope.chart.update();
			scope.$emit("chart-update", scope.chart);
		}
		/**
		 * @param {!NodeList} value
		 * @return {?}
		 */
		function isEmpty(value) {
			return !value || Array.isArray(value) && !value.length || "object" == typeof value && !Object.keys(value).length;
		}
		/**
		 * @param {!Object} type
		 * @param {!Object} scope
		 * @param {!Object} elem
		 * @param {!Object} options
		 * @return {?}
		 */
		function canDisplay(type, scope, elem, options) {
			return !options.responsive || 0 !== elem[0].clientHeight || ($timeout(function () {
				createChart(type, scope, elem);
			}, 50, false), false);
		}
		/**
		 * @param {!Object} scope
		 * @return {undefined}
		 */
		function destroyChart(scope) {
			if (scope.chart) {
				scope.chart.destroy();
				scope.$emit("chart-destroy", scope.chart);
			}
		}
		return function (type) {
			return {
				restrict: "CA",
				scope: {
					chartGetColor: "=?",
					chartType: "=",
					chartData: "=?",
					chartLabels: "=?",
					chartOptions: "=?",
					chartSeries: "=?",
					chartColors: "=?",
					chartClick: "=?",
					chartHover: "=?",
					chartDatasetOverride: "=?"
				},
				link: function (scope, elem) {
					/**
					 * @param {string} newVal
					 * @param {!Object} oldVal
					 * @return {?}
					 */
					function watchData(newVal, oldVal) {
						if (!newVal || !newVal.length || Array.isArray(newVal[0]) && !newVal[0].length) {
							return void destroyChart(scope);
						}
						var chartType = type || scope.chartType;
						return chartType ? scope.chart && canUpdateChart(newVal, oldVal) ? updateChart(newVal, scope) : void createChart(chartType, scope, elem) : void 0;
					}
					/**
					 * @param {(Node|NodeList|string)} newVal
					 * @param {?} oldVal
					 * @return {undefined}
					 */
					function resetChart(newVal, oldVal) {
						if (!isEmpty(newVal) && !angular.equals(newVal, oldVal)) {
							var chartType = type || scope.chartType;
							if (chartType) {
								createChart(chartType, scope, elem);
							}
						}
					}
					/**
					 * @param {!NodeList} type
					 * @param {?} target
					 * @return {undefined}
					 */
					function update(type, target) {
						if (!(isEmpty(type) || angular.equals(type, target))) {
							createChart(type, scope, elem);
						}
					}
					if (o) {
						window.G_vmlCanvasManager.initElement(elem[0]);
					}
					scope.$watch("chartData", watchData, true);
					scope.$watch("chartSeries", resetChart, true);
					scope.$watch("chartLabels", resetChart, true);
					scope.$watch("chartOptions", resetChart, true);
					scope.$watch("chartColors", resetChart, true);
					scope.$watch("chartDatasetOverride", resetChart, true);
					scope.$watch("chartType", update, false);
					scope.$on("$destroy", function () {
						destroyChart(scope);
					});
					scope.$on("$resize", function () {
						if (scope.chart) {
							scope.chart.resize();
						}
					});
				}
			};
		};
	}
	/** @type {string} */
	Chart.defaults.global.multiTooltipTemplate = "<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>";
	/** @type {string} */
	Chart.defaults.global.tooltips.mode = "label";
	/** @type {number} */
	Chart.defaults.global.elements.line.borderWidth = 2;
	/** @type {number} */
	Chart.defaults.global.elements.rectangle.borderWidth = 2;
	/** @type {boolean} */
	Chart.defaults.global.legend.display = false;
	/** @type {!Array} */
	Chart.defaults.global.colors = ["#97BBCD", "#DCDCDC", "#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"];
	/** @type {boolean} */
	var o = "object" == typeof window.G_vmlCanvasManager && null !== window.G_vmlCanvasManager && "function" == typeof window.G_vmlCanvasManager.initElement;
	return o && (Chart.defaults.global.animation = false), angular.module("chart.js", []).provider("ChartJs", ChartJsProvider).factory("ChartJsFactory", ["ChartJs", "$timeout", ChartJsFactory]).directive("chartBase", ["ChartJsFactory", function (canCreateDiscussions) {
		return new canCreateDiscussions;
	}]).directive("chartLine", ["ChartJsFactory", function (ChartJsFactory) {
		return new ChartJsFactory("line");
	}]).directive("chartBar", ["ChartJsFactory", function (ChartJsFactory) {
		return new ChartJsFactory("bar");
	}]).directive("chartHorizontalBar", ["ChartJsFactory", function (ChartJsFactory) {
		return new ChartJsFactory("horizontalBar");
	}]).directive("chartRadar", ["ChartJsFactory", function (ChartJsFactory) {
		return new ChartJsFactory("radar");
	}]).directive("chartDoughnut", ["ChartJsFactory", function (ChartJsFactory) {
		return new ChartJsFactory("doughnut");
	}]).directive("chartPie", ["ChartJsFactory", function (ChartJsFactory) {
		return new ChartJsFactory("pie");
	}]).directive("chartPolarArea", ["ChartJsFactory", function (ChartJsFactory) {
		return new ChartJsFactory("polarArea");
	}]).directive("chartBubble", ["ChartJsFactory", function (ChartJsFactory) {
		return new ChartJsFactory("bubble");
	}]).name;
});
