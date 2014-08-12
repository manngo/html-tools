/*  beautify.js
	================================================ */

	function beautify(event) {
		var parms = {inn: null, out: null};

		switch(event.target.id) {
			case 'jsbeautify':
				window.openDialog('chrome://html-tools/content/beautify/xul/jsbeautify.xul','jsBeautify','chrome,centerscreen,modal',parms);
				break;
			case 'cssbeautify':
				window.openDialog('chrome://html-tools/content/beautify/xul/cssbeautify.xul','cssBeautify','chrome,centerscreen,modal',parms);
				break;
			case 'htmlbeautify':
				window.openDialog('chrome://html-tools/content/beautify/xul/htmlbeautify.xul','htmlBeautify','chrome,centerscreen,modal',parms);
				break;
			default: alert('oops');
		}
	}
