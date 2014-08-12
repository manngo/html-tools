/*  beautify-css-script.js
	================================================ */

/*  Init
	================================================ */

	function init() {
		setIndentLabel();
		document.getElementById('tab').onclick=document.getElementById('spaces').onclick=setIndentLabel;
	}

	var	env={};
		env.ko =		window.opener.ko;
		env.cv =		env.ko.views.manager.currentView;
		env.editor =	env.cv.scimoz;
		env.cwd =		env.ko.projects.manager.currentProject.liveDirectory;
		env.eol=['\r\n','\r','\n'][env.editor.eOLMode];


/*  Buttons
	================================================ */

		function doOK() {
			var parms=getParms();
			var result=css_beautify(env.editor.selText,parms);
			result=result.replace(/\r?\n/g,env.eol);
			env.editor.replaceSel(result);
			return true;
		}

		function doCancel() {
			return true;
		}

/*  Results
	================================================ */

	function getParms() {
		var parms = {
			indent_size: document.getElementById('indent_size').value,
			indent_char: document.getElementById('indent_char').value==32?' ':'\t',
		};
		return parms;
	}

/*  UI
	================================================ */

	function setIndentLabel() {
		var spaces=document.getElementById('indent_char').value==32;
		document.getElementById('indent_label').textContent=spaces ? 'spaces per indent' : 'tabs per indent';
		document.getElementById('indent_size').value=spaces ? 4 : 1;
	}

