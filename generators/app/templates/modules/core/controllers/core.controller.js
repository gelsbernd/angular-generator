(function(){ 
	'use strict';

	var coreController = function(){
		var ctrl = this;

		ctrl.message = 'Welcome to the Machine.';

		return ctrl;
	};

	angular.module('core')
		.controller('MainCtrl', [coreController]);
}());