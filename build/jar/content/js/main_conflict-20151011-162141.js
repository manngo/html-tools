/*	HTML Tools: Tools for adding or converting HTML

	Replacement Tools

	These tools replace the selected text with some HTML.
	Generally, the method is to select the text and select the function.

	================================================ */
/* jshint -W100 */

/* exported doit,test,remember */
/*global
	alert,
	smartQuotes, makeParagraphs, makeHeading, makeHeadingsParagraphs, makeList, makeTable, addImage, addAnchor, addLink, makeAnchors, wrapTag, unTag, entify, makeHTML5, CSSP, arrayLiteral,
	makeForm, makeInput, makeFieldset, makeLabel, makeNestedList,  makeSubmit, makeSelect, makeButton, makeRadiobutton, convertRadioButtons, makeCheckbox, makeTextarea, makeHTMLStructure
	makeVideo, addComment, hex2rgb, boxShadow, borderRadius, fileUtilities, htmlTemplate, jsString
	setKOPrefs
*/



'use strict';


/*	Smart Quote
	================================================ */

	function doSmartQuotesButton() {
		var editor = ko.views.manager.currentView.scimoz;
		editor.replaceSel(smartQuotes(editor.selText));
	}

/*	Support Functions
	================================================ */

	function getCWD() {
		return ko.projects.manager.currentProject?ko.projects.manager.currentProject.liveDirectory:null;
	}

	function copyText (text) {
		xtk.include('clipboard');
		var transferable = xtk.clipboard.addTextDataFlavor('text/unicode', text);
		xtk.clipboard.copyFromTransferable(transferable);
	}

	function getEol(editor) {
		if(!editor) return null;
		switch(editor.eOLMode) {
			case 0:		return	'\r\n';
			case 1:		return	'\r';
			case 2:		return	'\n';
			default:	return	'\r\n';
		}
	}

/*	Main
	================================================ */

	function doit(event) {
		var parms = { inn:null, out:null };
		var result;

		var editor=null;
		var eol=null;
		var cwd=null;
		var doc=null;

		if(ko.views.manager.currentView) {
			var cv=ko.views.manager.currentView;
			editor = cv.scimoz || null;
			eol=getEol(editor);
			doc=cv.koDoc.file;
			cwd = cv.koDoc.file ? cv.koDoc.file.dirName : getCWD();
		}

		switch(event.target.id) {
				case 'koprefs':
					window.openDialog('chrome://html-tools/content/dialog/koPrefs.xul','Web Preferences','chrome,centerscreen,modal',parms);
					if(parms.out) setKOPrefs(parms.out);
					break;

				case 'entabulate':
					window.openDialog('chrome://html-tools/content/dialog/entabulate.xul','Entabulate','chrome,centerscreen,modal',parms);
					break;
				case 'html5':
					window.openDialog('chrome://html-tools/content/dialog/html5.xul','Convert to HTML5','chrome,centerscreen,modal',parms);
					if(editor && parms.out)	makeHTML5(parms.out,eol);
					break;
				case 'cssp':
					//	window.openDialog('chrome://html-tools/content/dialog/html5.xul','Convert to HTML5','chrome,centerscreen,modal',parms);
					if(editor) CSSP();
					break;
				case 'html-template':
					//	window.openDialog('chrome://html-tools/content/dialog/html5.xul','Convert to HTML5','chrome,centerscreen,modal',parms);
					if(editor) htmlTemplate();
					break;

				case 'css-colour':
					window.openDialog('chrome://html-tools/content/dialog/css-colour.xul','CSS Colours','chrome,centerscreen,modal',parms);
					if(editor && parms.out)		editor.insertText(editor.currentPos,parms.out.colour,eol);
					break;
			//	HTML
				case 'html-structure':
					window.openDialog('chrome://html-tools/content/dialog/html-structure.xul','Generate HTML Structure','chrome,centerscreen,modal',parms);
					if(editor && parms.out)		editor.replaceSel(makeHTMLStructure(editor.selText,parms.out,eol));
					break;
				case 'webtools-makeParagraphs':
					window.openDialog('chrome://html-tools/content/dialog/html-paragraphs.xul','Convert to Paragraphs','chrome,centerscreen,modal',parms);
					if(editor && parms.out)		editor.replaceSel(makeParagraphs(editor.selText,parms.out,eol));
					break;
				case 'webtools-makeHeading':
					window.openDialog('chrome://html-tools/content/dialog/html-headings.xul','Convert to Heading','chrome,centerscreen,modal',parms);
					if(editor && parms.out)		editor.replaceSel(makeHeading(editor.selText,parms.out,eol));
					break;
				case 'webtools-makeHeadingParagraphs':
					window.openDialog('chrome://html-tools/content/dialog/html-headings-paragraphs.xul','Convert to Headings &amp; Paragraphs','chrome,centerscreen,modal',parms);
					if(editor && parms.out)		editor.replaceSel(makeHeadingsParagraphs(editor.selText,parms.out,eol));
					break;

			//	HTML Lists
				case 'webtools-makeList':
					window.openDialog('chrome://html-tools/content/dialog/html-lists.xul','Convert to List','chrome,centerscreen,modal',parms);
					if(editor && parms.out)		editor.replaceSel(makeList(editor.selText,parms.out,eol));
					break;

			//	HTML Containers
				case 'webtools-makeTable':
					window.openDialog('chrome://html-tools/content/dialog/html-tables.xul','Convert to Table','chrome,centerscreen,modal',parms);
					if(editor && parms.out) {
						if(parms.out.source=='file') {
							var data=fileUtilities.readAsync(parms.out.file);
							result=makeTable(data,parms.out,eol);
						}
						else result=makeTable(editor.selText,parms.out,eol);

						if(parms.out.copy) copyText(result);
						else editor.replaceSel(result);
					}
					break;

				case 'webtools-addLocalImage':
					if(!cwd) break;
					parms={ inn: { cwd: cwd }, out: null };
					window.openDialog('chrome://html-tools/content/dialog/html-image.xul','Make Image','chrome,centerscreen,modal',parms);
					if(editor && parms.out)		editor.insertText(editor.currentPos,addImage(parms.out),eol);
					break;
				case 'webtools-addLink':
					if(!cwd) break;
					parms={ inn: { cwd: cwd }, out: null };
					window.openDialog('chrome://html-tools/content/dialog/html-link.xul','Add Link','chrome,centerscreen,modal',parms);
					if(editor && parms.out)		editor.insertText(editor.currentPos,addLink(parms.out),eol);
					break;
				case 'webtools-addAnchor':
					if(!cwd) break;
					parms={ inn: { cwd: cwd }, out: null };
					window.openDialog('chrome://html-tools/content/dialog/html-anchor.xul','Add Anchor','chrome,centerscreen,modal',parms);
					if(editor && parms.out)		editor.insertText(editor.currentPos,addAnchor(parms.out),eol);
					break;
				case 'webtools-makeAnchors':
					window.openDialog('chrome://html-tools/content/dialog/html-anchors.xul','Make Anchors','chrome,centerscreen,modal',parms);
					if(editor && parms.out)		editor.replaceSel(makeAnchors(editor.selText,parms.out,eol));
					break;

			//	HTML Wrappers
				case 'webtools-span':
					parms={ inn:{element:'span'}, out:null };
					/*	falls through */
				case 'webtools-wrap':
					window.openDialog('chrome://html-tools/content/dialog/html-wrap.xul','Wrap Element around Selection','chrome,centerscreen,modal',parms);
					if(editor && parms.out)		editor.replaceSel(wrapTag(editor.selText,parms.out));
					break;
				case 'webtools-untag':
					if(editor)		editor.replaceSel(unTag(editor.selText));
					break;

			//	Text
				case 'webtools-entify':
					if(editor)		editor.replaceSel(entify(editor.selText,false));
					break;
				case 'webtools-smartQuotes':
					if(editor)		editor.replaceSel(smartQuotes(editor.selText));
					break;
				case 'webtools-arrayLiteral':
					if(editor)		editor.replaceSel(arrayLiteral(editor.selText));
					break;
				case 'webtools-string':
					if(editor)		editor.replaceSel(jsString(editor.selText));
					break;
			default: alert('oops');
		}
	}


function test(message) {
	alert(message.target.id);
}

function remember(data) {
	data=data||{};
	if (!('extensions' in ko)) ko.extensions = {}; // sanity check
	var addon = 'html@comparity.net' ; // something unique
	if (!(addon in ko.extensions)) ko.extensions[addon] = {};
	if (!('myapp' in ko.extensions[myExt])) ko.extensions[myExt].myapp = {};
	var myAppData = ko.extensions[myExt].myapp;
}
