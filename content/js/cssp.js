/*	CSSP Function

	File Handling:		https://developer.mozilla.org/en-US/Add-ons/Code_snippets/File_I_O

	================================================ */

		function CSSP() {
			var document=ko.views.manager.currentView.koDoc;
			var editor=ko.views.manager.currentView.scimoz;
			var name,ext;
				[,name,ext]=document.baseName.match(/(.*)\.(.*)/);

			if(ext!='cssp') return;
			var i,data={},includes=[],key,matches;
			var file,text,regex,define,line;

			Components.utils.import("resource://gre/modules/FileUtils.jsm");
			Components.utils.import("resource://gre/modules/NetUtil.jsm");

			//	Document Text
				text=editor.text;

			//	Includes
			//  Syntax: @include "...";

				regex=/@include\s*[\'\"](.*?)[\'\"]\s*;/gm;
				while(matches=regex.exec(text)) includes.push(matches[1]);

				NetUtil.asyncFetch(file, function(inputStream, status) {
					if (!Components.isSuccessCode(status)) {
						// Handle error!
						return null;
					}
					return NetUtil.readInputStreamToString(inputStream, inputStream.available());
				});

			//	Get @define section
			//  Syntax: @define {
			//				greenish: #005247;
			//				pinkish: #ffcccc;
			//			}

				regex=/@define\s*\{([\s\S]*?)\}/m;
				define=text.match(regex);

			//	Process Variables
			//	Syntax:	color: $greenish;

				if(define && define[1]) {
					//	Get variables
						define=define[1].split(';');
//							for(i=0;i<define.length;i++) {
						for(i=define.length-1;i>-1;i--) {
							line=define[i].trim().split(':');
							key=line[0].trim();
							if(key) {
								text=text.replace('$'+key,line[1].trim(),'gi');
								data[key]=line[1].trim();
							}
						}

					//	Remove @define section
						regex=/\s*@define\s*\{([\s\S]*?)\}$/m;
						text=text.replace(regex,'');

					//	Create .css File
						file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
						file.initWithPath(document.file.dirName+'/'+name+'.'+'css');

					//	Convert to UTF-8
						var ostream = FileUtils.openSafeFileOutputStream(file);
						var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
						converter.charset = "UTF-8";
						var istream = converter.convertToInputStream(text);

					//	Save File
						NetUtil.asyncCopy(istream, ostream);
				}

		}
