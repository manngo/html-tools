
function copyText (text)
{
xtk.include('clipboard');var transferable = xtk.clipboard.addTextDataFlavor('text/unicode', text);
xtk.clipboard.copyFromTransferable(transferable);}

var editor = ko.views.manager.currentView.scimoz;
var cwd = ko.projects.manager.currentProject.liveDirectory;
var parms = {inn:null, out:null};
var result;


if(result) alert(result);
if (result) alert('\x41');







switch(editor.eOLMode) {
case 0:	eol='\r\n'; break;
case 1:	eol='\r'; break;
case 2:	eol='\n'; break;
default:	eol='\r\n';
}
