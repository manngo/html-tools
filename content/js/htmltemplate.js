/*	HTML Template Function

	File Handling:		https://developer.mozilla.org/en-US/Add-ons/Code_snippets/File_I_O

	Replaces special codes with template elements:

	<template title="[Title]" ask="[Question]"/>
	<template title="[Title]" file="[file]"/>
	<template title="Title" file=""/>

	================================================ */

function message(text) {
	ko.interpolate.interpolateString('%(ask:%s)'.sprintf(text),false,'Special Message');
}

		function HTMLTemplate() {
			var document=ko.views.manager.currentView.koDoc;
			var editor=ko.views.manager.currentView.scimoz;
			var currentView=ko.views.manager.currentView;
			var cwd=null;

			cwd = currentView.koDoc.file.dirName

			var name,ext;
				[,name,ext]=document.baseName.match(/(.*)\.(.*)/);
//			if(ext!='shtml') return;

			Components.utils.import("resource://gre/modules/FileUtils.jsm");
			Components.utils.import("resource://gre/modules/NetUtil.jsm");


			text=editor.text;
			text=doHTMLTemplate(text);

			//	Create .html File
//				var question='%(ask:%s)'.sprintf('Name of New File:');
//				var name=ko.interpolate.interpolateString(question,false,'Save as New File …');

			saveAs('something.html');
		}

		function doHTMLTemplate(text,style) {

			var document=ko.views.manager.currentView.koDoc;
			var editor=ko.views.manager.currentView.scimoz;
			var currentView=ko.views.manager.currentView;
			var cwd=null;

			cwd = currentView.koDoc.file.dirName;

			Components.utils.import("resource://gre/modules/FileUtils.jsm");
//			var i,data={},templates=[],key,matches;
			var regex,cwd,data;

			//	Regex
				regex=/<!--template>(.*?)<\/template-->/gm;				//	<!--template cmd="parm"-->[to be replaced]<!--/template-->
				regex=/<template>(.*?)<\/template>/gm;					//	<template cmd="parm">[to be replaced]</template>
				regex=/<template\s*title="(.*?)"\s*(file|ask)="(.*)"\s*\/>/gm;		//	<template title="…" cmd="parm"/>

			//	The following is because files are loaded asynchronously.
			//	This reads the files first, and later replaces the text


			//	Replace
				text=text.replace(regex,function(match,title,cmd,parm) {
					if(cmd=='file') {
						if(!parm) parm=fileUtilities.ask({"message": title});
						else {
//							cwd=new FileUtils.File(ko.projects.manager.currentProject.liveDirectory);
							cwd=currentView.koDoc.file.dirName;
							cwd=new FileUtils.File(currentView.koDoc.file.dirName);
//							cwd = currentView.koDoc.file.dirName;
							cwd.append(parm);
							parm=cwd.path;
						}
						data=fileUtilities.readAsync(parm);
						return data===null ? match : data;
					}
					if(cmd=='ask') {
						var question='%(ask:%s)'.sprintf(parm);
						return ko.interpolate.interpolateString(question,false,title);
					}
					return '\nData: %s\nCmd: %s\nParm: %s'.sprintf(match,cmd,parm);
				});

			return text;
		}

		function saveAs(name) {
			var document=ko.views.manager.currentView.koDoc;
			var editor=ko.views.manager.currentView.scimoz;
			var currentView=ko.views.manager.currentView;

			Components.utils.import("resource://gre/modules/FileUtils.jsm");

			var nsIFilePicker = Components.interfaces.nsIFilePicker;
			var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
//				fp.appendFilter("HTML Files","*.html; *.txt");
			var dir=new FileUtils.File(currentView.koDoc.file.dirName);

			fp.appendFilters(nsIFilePicker.filterHTML | nsIFilePicker.filterText | nsIFilePicker.filterAll);
			fp.displayDirectory=dir;
			fp.init(window, "Save HTML File As …", nsIFilePicker.modeSave);
			fp.defaultString=name; //	+'.'+'html';

			var result=fp.show();

			if (result != nsIFilePicker.returnCancel){
				file = fp.file;
				//	Convert to UTF-8
					var ostream = FileUtils.openSafeFileOutputStream(file);
					var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
					converter.charset = "UTF-8";
					var istream = converter.convertToInputStream(text);

				//	Save File
					NetUtil.asyncCopy(istream, ostream);
			}

		}
