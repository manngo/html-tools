/*  beautify-js-script.js
		js_beautify(js_source_text);
		js_beautify(js_source_text, options);

	================================================ */

/*  Defaults
	================================================ */

	var defaults= {
		"indent_size": 4,
		"indent_char": " ",
		"indent_level": 0,
		"indent_with_tabs": false,
		"preserve_newlines": true,
		"max_preserve_newlines": 10,
		"jslint_happy": false,
		"brace_style": "collapse",
		"keep_array_indentation": false,
		"keep_function_indentation": false,
		"space_before_conditional": true,
		"break_chained_methods": false,
		"eval_code": false,
		"unescape_strings": false,
		"wrap_line_length": 0
	};

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
		var result=js_beautify(env.editor.selText,parms);
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
			preserve_newlines: document.getElementById('preserve_newlines').checked,
			max_preserve_newlines: document.getElementById('max_preserve_newlines').value,
			jslint_happy: document.getElementById('jslint_happy').checked,
			brace_style: document.getElementById('brace_style').value,
			space_before_conditional: document.getElementById('space_before_conditional').checked,
			unescape_strings: document.getElementById('unescape_strings').checked,
			wrap_line_length: document.getElementById('wrap_line_length').value,
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

