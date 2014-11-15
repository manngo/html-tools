/*	Komodo Edit Prefs
	================================================================================================================

//	http://community.activestate.com/faq/komodo-profile-structure
//	http://community.activestate.com/faq/komodo-file-locations
//	http://community.activestate.com/faq/getting-setting-komodo-preference
//	http://svn.openkomodo.com/openkomodo/view/openkomodo/trunk/src/prefs/prefs.p.xml
//	http://community.activestate.com/forum/where-does-komodo-store-file-preferences
//	http://grok.openkomodo.com/source/xref/openkomodo/trunk/src/prefs/koIPrefs.idl#114
//	http://www.koders.com/javascript/fid7B93638BF3D5E6E8BFE1DCD0FBE3A837AA6C2B58.aspx?s=firefox
//	http://community.activestate.com/node/8422
//	http://community.activestate.com/tags/komodo-preference-set

	================================================================================================================ */

	function defaultKOPrefs() {
		return {
			mruProjectSize:					{	type: 'long',		value: 15 },
			mruFileSize:					{	type: 'long',		value: 40 },
			show_start_page:				{	type: 'boolean',	value: 0 },

			codeintelAutoInsertEndTag:		{	type: 'boolean',	value: 1 },

			showWhitespace:					{	type: 'boolean',	value: 0 },
			showEOL:						{	type: 'boolean',	value: 0 },
			showLineNumbers:				{	type: 'boolean',	value: 1 },
			editShowMinimap:				{	type: 'boolean',	value: 0 },
			editEnableMouseZoom:			{	type: 'boolean',	value: 1 },


				useTabs:					{	type: 'boolean',	value: 1 },
				editElectricBrace:			{	type: 'boolean',	value: 1 },
				showIndentationGuides:		{	type: 'boolean',	value: 1 },
				indentWidth:				{	type: 'long',		value: 4 },
				tabWidth:					{	type: 'long',		value: 4 },

				enableAutoAbbreviations:	{	type: 'boolean',	value:  0 },

				cleanLineEnds:				{	type: 'boolean',	value: 1 },
				ensureFinalEOL:				{	type: 'boolean',	value: 1 },
				autoSaveSeconds:			{	type: 'long',		value: 0 },

			encodingEnvironment:			{	type: 'boolean',	value: 0 },
			encodingDefault:				{	type: 'string',		value: 'utf-8'},

			primaryLanguages:				{	type: 'array',		value: ['Text','HTML','HTML5','CSS','JavaScript','PHP','SQL','MySQL'] },
			secondaryLanguages:				{	type: 'array',		value: ['Apache','Bash','JSON','Komodo Snippet','Less','XML','XSLT'] },

			browser:						{	type: 'string',		value: '' },
			browser_preview_method:			{	type: 'string',		value: 'in-tab-other-group' },

//			showAllFiles:					{	type: 'boolean',	value: 1 },
		};
	}


	function getKOPrefs() {
		var prefs = Components.classes['@activestate.com/koPrefService;1'].getService(Components.interfaces.koIPrefService).prefs;
		var prefset = prefs.QueryInterface(Components.interfaces.koIPreferenceSet);

//		var langprefs = prefset.getPref('languages');
		var result = {
			mruProjectSize:					{	type: 'long',		value: prefset.getLongPref('mruProjectSize') },
			mruFileSize:					{	type: 'long',		value: prefset.getLongPref('mruFileSize')},
			show_start_page:				{	type: 'boolean',	value: prefset.getBooleanPref('show_start_page')},

			codeintelAutoInsertEndTag:		{	type: 'boolean',	value: prefset.getBooleanPref('codeintelAutoInsertEndTag')},

			showWhitespace:					{	type: 'boolean',	value: prefset.getBooleanPref('showWhitespace')},
			showEOL:						{	type: 'boolean',	value: prefset.getBooleanPref('showEOL')},
			showLineNumbers:				{	type: 'boolean',	value: prefset.getBooleanPref('showLineNumbers')},
			editShowMinimap:				{	type: 'boolean',	value: prefset.getBooleanPref('editShowMinimap')},
			editEnableMouseZoom:			{	type: 'boolean',	value: prefset.getBooleanPref('editEnableMouseZoom')},


				useTabs:					{	type: 'boolean',	value: prefset.getBooleanPref('useTabs')},
				editElectricBrace:			{	type: 'boolean',	value: prefset.getBooleanPref('editElectricBrace')},
				showIndentationGuides:		{	type: 'boolean',	value: prefset.getBooleanPref('showIndentationGuides')},
				indentWidth:				{	type: 'long',		value: prefset.getLongPref('indentWidth')},
				tabWidth:					{	type: 'long',		value: prefset.getLongPref('tabWidth')},

				enableAutoAbbreviations:	{	type: 'boolean',	value: prefset.getBooleanPref('enableAutoAbbreviations')},

				cleanLineEnds:				{	type: 'boolean',	value: prefset.getBooleanPref('cleanLineEnds')},
				ensureFinalEOL:				{	type: 'boolean',	value: prefset.getBooleanPref('ensureFinalEOL')},
				autoSaveSeconds:			{	type: 'long',		value: prefset.getLongPref('autoSaveSeconds')},

			encodingEnvironment:			{	type: 'boolean',	value: prefset.getBooleanPref('encodingEnvironment')},
			encodingDefault:				{	type: 'string',		value: prefset.getStringPref('encodingDefault')},

			browser:						{	type: 'string',		value: prefset.getStringPref('browser')},
			browser_preview_method:			{	type: 'string',		value: prefset.getStringPref('browser_preview_method')},
		};
		return result;
	}



	function setKOPrefs(thePrefs) {
		var i;
		var prefs = Components.classes['@activestate.com/koPrefService;1'].getService(Components.interfaces.koIPrefService).prefs;
		var prefset = prefs.QueryInterface(Components.interfaces.koIPreferenceSet);
		var langprefs = prefset.getPref('languages');

	/*	Key Bindings
		================================================================================================================ */

//		ko.keybindings.manager._add_keybinding_sequences({
//			'cmd_lineDuplicate':	['Meta+E']
//		});

	/*	Appearance
		================================================================================================================ */

		prefset.setLongPref('mruProjectSize',thePrefs['mruProjectSize']);		//	Number of Projects
		prefset.setLongPref('mruFileSize',thePrefs['mruFileSize']);			//	Number of Files
		prefset.setBooleanPref('show_start_page',thePrefs['show_start_page']);	//	Hide Start Page

	/*	Code Intelligence
		================================================================================================================ */

		prefset.setBooleanPref('codeintelAutoInsertEndTag',thePrefs['codeintelAutoInsertEndTag']);	//	HTML End Tags

	/*	Editor (General)
		================================================================================================================ */

			prefset.setBooleanPref('showWhitespace',thePrefs['showWhitespace']);		//	Show White Space characters
			prefset.setBooleanPref('showEOL',thePrefs['showEOL']);			//	Show end-of-line characters
			prefset.setBooleanPref('showLineNumbers',thePrefs['showLineNumbers']);	//	Show line numbers
			prefset.setBooleanPref('editShowMinimap',thePrefs['editShowMinimap']);	//	Hide MiniMap
			prefset.setBooleanPref('editEnableMouseZoom',thePrefs['editEnableMouseZoom']);	//	Hide MiniMap
			prefset.setBooleanPref('codeintelAutoInsertEndTag',thePrefs['codeintelAutoInsertEndTag']);	//	Hide MiniMap

	/*		Indentation
			============================================================================================================ */

			prefset.setBooleanPref('useTabs',thePrefs['useTabs']);				//	Prefer Tab characters over spaces
			prefset.setBooleanPref('editElectricBrace',thePrefs['editElectricBrace']);		//	Auto Adjust Closing Brace ?
			prefset.setBooleanPref('showIndentationGuides',thePrefs['showIndentationGuides']);	//	Indentation Guides
			prefset.setLongPref('indentWidth',thePrefs['indentWidth']);				//	Number of spaces per indent
			prefset.setLongPref('tabWidth',thePrefs['tabWidth']);					//	Width of each Tab character
			//	Per Language Indentation Settings:	See below

	/*		Smart Editing
			============================================================================================================ */
			prefset.setBooleanPref('enableAutoAbbreviations',thePrefs['enableAutoAbbreviations']);	//	Disable Auto Abbreviation

	/*		Save Options
			============================================================================================================ */
			prefset.setBooleanPref('cleanLineEnds',thePrefs['cleanLineEnds']);		//	Clean trailing white space and EOL markers
			prefset.setBooleanPref('ensureFinalEOL',thePrefs['ensureFinalEOL']);		//	Ensure file ends with EOL marker
			prefset.setLongPref('autoSaveSeconds',thePrefs['autoSaveSeconds']);		//	Auto-save every  seconds

	/*	Fonts and Colors
		================================================================================================================ */

		//	Common Syntax
			//	Choose a colour for your comments, and turn off italics.


	/*	Internationization
		================================================================================================================ */
			prefset.setBooleanPref('encodingEnvironment',thePrefs['encodingEnvironment']);	//	Use Encoding Defined in Environment: ?
			prefset.setStringPref('encodingDefault',thePrefs['encodingDefault']);	//	Encoding
			//Language-Specific Default Encoding: See Below
			//Signature (BOM): See Below

	/*	Show All Files
		============================================================================================================ */
			if(thePrefs['showAllFiles']) {
				prefset.setStringPref('import_exclude_matches','');
				prefset.setStringPref('import_include_matches','');

			}

	/*	Web & Browser
		================================================================================================================ */

//		prefset.setStringPref('browser','');									//	Which browser should Komodo use when opening URLs?
//		prefset.setStringPref('browser_preview_method','in-tab-other-group');	//	Which method should be used to preview files in browser?
//																				//	in-tab-same-group
//																				//	external

	/*	Languages
		================================================================================================================ */

		if(thePrefs['setPrimary']) setLanguagePrefs(thePrefs['setSecondary']);

	}

	function getPrimaryLanguages() {
		var Cc=Components.classes,Ci=Components.interfaces;
		var langRegistry=Cc['@activestate.com/koLanguageRegistryService;1'].getService(Ci.koILanguageRegistryService);
		var languages=[];

		//	Get Languages
			var languageNames = {};
			langRegistry.getLanguageNames(languageNames , {}); // second {} needed to keep xpcom happy
			languageNames = languageNames.value;

		languageNames.forEach(function(name) {
			var koLanguage = langRegistry.getLanguage(name);
			if(koLanguage.primary) languages.push(name);
		});
		return languages;
	}


	function listPrimaryLanguages() {
		var primaries = ['Text','HTML','HTML5','CSS','JavaScript','PHP','SQL','MySQL'];
		var secondaries = ['Apache','Bash','JSON','Komodo Snippet','Less','XML','XSLT'];
		return [primaries,secondaries];
	}


/*	Language Settings: Set Primary Languages
	================================================ */
	function setLanguagePrefs(useSecondary) {
		var [primaries,secondaries]=listPrimaryLanguages();
		if(useSecondary) primaries=primaries.concat(secondaries);

//		const {classes: Cc, interfaces: Ci} = Components;
//		var langRegistry=Cc["@activestate.com/koLanguageRegistryService;1"].getService(Ci.koILanguageRegistryService);

		var Cc=Components.classes,Ci=Components.interfaces;
		var langRegistry=Cc['@activestate.com/koLanguageRegistryService;1'].getService(Ci.koILanguageRegistryService);

		//	Get Languages
			var languageNames = {};
			langRegistry.getLanguageNames(languageNames , {}); // second {} needed to keep xpcom happy
			languageNames = languageNames.value;

		//	Get Language Prefs

			var langPrefs;
			if (!ko.prefs.hasPrefHere('languages')) {	//	create prefs
				langPrefs = Cc['@activestate.com/koPreferenceSet;1'].createInstance();
				ko.prefs.setPref("languages", langPrefs);
			} else {									//	prefs already exists
				langPrefs = ko.prefs.getPref("languages");
				var ids = {};
				langPrefs.getPrefIds(ids, {});
			}

		//	Set Primary Languages

			var madeChange = false;
			languageNames.forEach(function(name) {
				var koLanguage = langRegistry.getLanguage(name);
				var shouldBePrimary = primaries.indexOf(name) >= 0;

				if (koLanguage.primary != shouldBePrimary) {
					koLanguage.primary = shouldBePrimary;
					madeChange = true;

					var langPrefName = "languages/" + name;
					var langPref = !langPrefs.hasPref(langPrefName) ? Cc["@activestate.com/koPreferenceSet;1"].createInstance() : langPrefs.getPref(langPrefName);

					langPref.setBooleanPref("primary", shouldBePrimary);
					if (!langPrefs.hasPref(langPrefName)) langPrefs.setPref(langPrefName, langPref);
				}
			});

			if (madeChange) {
				var obsSvc = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
				obsSvc.notifyObservers(null, 'primary_languages_changed', '');
			}

/*	Language Settings: Other
	================================================ */

		for(i=0;i<primaries.length;i++) {
			langPrefs.setStringPref(primaries[i]+'/newEncoding','utf-8');
			langPrefs.setBooleanPref(primaries[i]+'/newBOM',0);
			langPrefs.getPref('languages/'+primaries[i]).setLongPref('tabWidth',4);
			langPrefs.getPref('languages/'+primaries[i]).setBooleanPref('useTabs',1);
		}

	}
