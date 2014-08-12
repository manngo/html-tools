/*	Library
	========================================================= */

'use strict';

	function status(message,append) {
		if(document.getElementById('status')) {
			var element=document.getElementById('status');
			if(append) element.textContent+='\n'+message;
			else element.textContent=message;
		}
	}


/*	Menu
	--------------------------------------------------------- */

	function createMenuItem(label,command) {
		const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
		var item = document.createElementNS(XUL_NS, "menuitem"); // create a new XUL menuitem
		item.setAttribute("label", label);
		//item.setAttribute('oncommand',command);
		item.addEventListener('command',command,true);
		return item;
	}

/*	Preferences
	--------------------------------------------------------- */

	function getExtenstionPrefs(extension) {
		var prefs = Components.classes["@activestate.com/koPrefService;1"].getService(Components.interfaces.koIPrefService).prefs;
		var extensionPrefs, appPrefs;

		//	Extension Prefs Section
			if (!prefs.hasPref('extensions')) {
				extensionPrefs = Components.classes["@activestate.com/koPreferenceSet;1"].createInstance();		//	Create Prefs
				prefs.setPref('extensions', extensionPrefs);													//	Save
			} else extensionPrefs = prefs.getPref('extensions');												//	Read

		//	This Extension
			if (!extensionPrefs.hasPref(extension)) {
				appPrefs = Components.classes["@activestate.com/koPreferenceSet;1"].createInstance();			//	Create Prefs
				extensionPrefs.setPref(extension, appPrefs);													//	Save
			} else appPrefs= extensionPrefs.getPref(extension);													//	Read

		return appPrefs;
	}


/*	String
	--------------------------------------------------------- */

	function sprintf(string) {
		//  Clayton's sprintf routine.
		//  Usage:      "....%s...%s ...".sprintf(var0,var1 etc)
		var part=string.split("%");
		var theResult=part[0];
		if(part.length>1) {
			for (var i=1;i<part.length;i++) {
				var c=part[i].charAt(0);
				if(c=="s") {
					if (i<=sprintf.arguments.length) theResult+= sprintf.arguments[i];
					theResult+=part[i].substring(1);
				}
			}
		}
		return theResult;
	}

	function trim(string) {
		return string.replace(/^\s+|\s+$/gm,'');
	}


/*	String Prototypte
	--------------------------------------------------------- */

	String.prototype.sprintf=function() {
		var string=this;
		for(var i=0;i<arguments.length;i++) string=string.replace(/%s/,arguments[i]);
		return string;
	};


	String.prototype.$=function() {
		var string=this;
		for(var i=0;i<arguments.length;i++) string=string.replace(/%s/,arguments[i]);
		return string;
	};

	String.prototype.interpolate=function() {
		return this.replace(/\[(.*?)\]/g,function(match) {
			return '{'+eval(match)+'}';
		});
	};

	String.prototype.trim=function() {
		return this.replace(/^\s+|\s+$/gm,'');
	};

/*	Video
	--------------------------------------------------------- */

	function greyScale(r,g,b,luminoscity) {
		if(luminoscity) return (222*r + 707*g + 71*b)/1000;
		else return (77*r + 152*g + 28*b)/256;
	}

	function repeat(character,number) {
		return new Array(number+1).join(number);
		//	return Array(number+1).join(character);
	}

	function getLocalFile() {
		var currentView = ko.views.manager.currentView;
		var cwd = currentView.koDoc.file.dirName;

		var path = ko.filepicker.openFile(cwd);
		if(path) return relative(path,cwd,true);
		else return null;
	}

	function relative(toPath,fromPath,caseInsensitive) {
		var i,l; // ,relativePath=[];
		fromPath=fromPath.replace(/\\/g,'/');
		if(caseInsensitive) fromPath=fromPath.toLowerCase();
		fromPath=fromPath.split('/');
		toPath=toPath.replace(/\\/g,'/');
		if(caseInsensitive) fromPath=fromPath.toLowerCase();
		toPath=toPath.split('/');
		for(i=0,l=Math.min(fromPath.length,toPath.length); i<l; i++)
			if(fromPath[0]==toPath[0]) {
				fromPath.shift();
				toPath.shift();
			}
			else break;
		if(fromPath) for(i=0,l=fromPath.length; i<l; i++)fromPath[i]='..';
		return fromPath.concat(toPath).join('/');
	}

	function arrayLiteral(array,delimiter,brackets) {
		delimiter=delimiter||' ';
		brackets=brackets||false;
		array=array.split(delimiter);
		array.forEach(function(element,i,a) {
			a[i]='\''+element+'\'';
		});
		return (brackets?'[':'')+array.join(',')+(brackets?']':'');
	}

	function jsString(data,quotes) {
		var tr={
			'\r':	'\\r',
			'\n':	'\\n',
			'\t':	'\\t',
			'\'':	quotes=='\''?'\\\'':'\'',
			'"':	quotes=='"'?'\\"':'"',
		}
		return data.replace(/[\r\n\t'"]/g, function (m) {
			return tr[m];
		});
	}
