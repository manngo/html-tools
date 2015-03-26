/*  beautify-css-script.js
	================================================ */

/*  Init
	================================================ */

	function init() {
		setIndentLabel();
		document.getElementById('tab').onclick=document.getElementById('spaces').onclick=setIndentLabel;
		document.getElementById('insert_default').onclick=insertDefault;
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
			var	env={};
			env.ko =		window.opener.ko;
			env.cv =		env.ko.views.manager.currentView;
			env.editor =	env.cv.scimoz;
			env.cwd =		env.ko.projects.manager.currentProject.liveDirectory;
			env.eol=['\r\n','\r','\n'][env.editor.eOLMode];

			var parms=getParms();
			var result=html_beautify(env.editor.selText,parms);

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
			brace_style: document.getElementById('brace_style').value,
			indent_scripts: document.getElementById('indent_scripts').value,
			max_char: document.getElementById('max_char').value,
		};
		return parms;
	}

/*  Local
	================================================ */

	function insertDefault() {
		var defaults='a,span,bdo,em,strong,dfn,code,samp,kbd,var,cite,abbr,acronym,q,sub,sup,tt,i,b,big,small,u,s,strike,font,ins,del,pre,address,dt,h1,h2,h3,h4,h5,h6';
		document.getElementById('default').value=defaults;
	}
