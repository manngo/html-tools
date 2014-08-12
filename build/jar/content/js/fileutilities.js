/*	File Utilities
	================================================
	See https://developer.mozilla.org/en-US/Add-ons/Code_snippets/File_I_O
	================================================ */

	var fileUtilities={};

/*	Get FileName
	================================================
	https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/nsIFilePicker
	================================================ */

		fileUtilities.ask=function (options) {
			options=options||{};
			options.filter=options.filter||{ "title": "HTML Compatible FIles", "filter": "*.html; *.htm; *.txt"};
			options.message=options.message||'Select a File';

			var file='';

			//	File Picker
				var nsIFilePicker = Components.interfaces.nsIFilePicker;
				var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);

			fp.appendFilter(options.filter.title,options.filter.filter);

			fp.init(window, options.message, nsIFilePicker.modeOpen);
			var result=fp.show();
			if (result != nsIFilePicker.returnCancel) {
				file = fp.file.path;
//				file = relative(file,window.arguments[0].inn.cwd);
			}
			return file;
		};

/*	Read File
	================================================ */

		fileUtilities.read=function(file,callback) {
			//	function callback(status,data);
			file='file://'+file;
			Components.utils.import("resource://gre/modules/NetUtil.jsm");

			//	var channel = NetUtil.newChannel(file);
			//	channel.contentType = "application/json";

			NetUtil.asyncFetch(file, function(inputStream, status) {
				if (!Components.isSuccessCode(status)) callback(status,null);
				else callback(0,NetUtil.readInputStreamToString(inputStream, inputStream.available()));
			});
		};


/*	Read File Asynchronously
	================================================ */

	fileUtilities.readAsync=function(file) {
		Components.utils.import("resource://gre/modules/FileUtils.jsm");
		file = new FileUtils.File(file);
		if(!file.exists()) return null;
		var data = "";
		var fstream = Components.classes["@mozilla.org/network/file-input-stream;1"].
				createInstance(Components.interfaces.nsIFileInputStream);
		var cstream = Components.classes["@mozilla.org/intl/converter-input-stream;1"].
				createInstance(Components.interfaces.nsIConverterInputStream);
		fstream.init(file, -1, 0, 0);
		cstream.init(fstream, "UTF-8", 0, 0); // you can use another encoding here if you wish

		let (str = {}) {
			let read = 0;
			do {
				read = cstream.readString(0xffffffff, str); // read as much as we can and put it in str.value
				data += str.value;
			} while (read !== 0);
		}
		cstream.close();
		return data;
	}
