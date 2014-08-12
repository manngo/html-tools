/*	HTML Form Routines
	=========================================================
	Common code snippets for dialog boxes
	========================================================= */

/* exported dialogInit, doOK, doCancel, init, setSetDestination */

/*	Global Variables
	========================================================= */

		var source=null;
		var destination=null;
		var copy;
		var accept;
		var cancel;

/*	Init
	========================================================= */

	function dialogInit() {
		accept=document.documentElement.getButton('accept');
		cancel=document.documentElement.getButton('cancel');

		if(document.getElementById('help-destination')) destination=document.getElementById('help-destination');
		if(document.getElementById('help-source')) source=document.getElementById('help-source');

		if(destination) {
			setSetDestination(['id','class']);
			setDestination();
		}

		if(source) {
			source.onkeydown=function(e) {
				if(e.keyCode==9) {
					var pos=this.selectionStart;
					this.value=this.value.substr(0,pos)+'\t'+this.value.substr(pos);
					this.selectionStart=this.selectionEnd=pos+1;
					e.preventDefault();
				}
			};
			setSetDestination(['help-source']);
			setSource();
		}

		if(document.getElementById('copy')) {
			copy=document.getElementById('copy');
			copy.onclick=setAccept;
		}

		setAccept();
	}

	function initMore() {
		//	Dummy Stub for below
	}

	function setSetDestination(id) {
		for(var i=0; i<id.length; i++) {
			if(document.getElementById(id[i])) document.getElementById(id[i]).onchange=setDestination;
		}
	}

	function getSource() {
		//	return source.value;
		return source.textContent;
	}
	function putSource(content) {
		//	source.value=content;
		source.textContent=content;
	}
	function getDestination() {
		//	return source.value;
		return destination.textContent;
	}
	function putDestination(content) {
		//	source.value=content;
		destination.textContent=content;
	}

/*	Stubs
	========================================================= */

	function init() {
		dialogInit();
		initMore();
	}

	function setSource() {
		source.value = '';
	}
	function setDestination() {
		destination.textContent='';
	}
	function setAccept() {
		if (document.getElementById('copy')) accept.label=document.getElementById('copy').checked?'Copy':'OK';
		else accept.label='OK';
	}

/*	OK & Cancel
	========================================================= */

	function doOK() {
		window.arguments[0].out = getParms();
		return true;
	}
	function doCancel() {
		return true;
	}

/*	Copy Text
	========================================================= */

	function copyText (button) {
		xtk.include('clipboard');
		var text;
		switch(button.id) {
			case 'copy-source':
				text=getSource();
				break;
			case 'copy-destination':
				text=getDestination();
				break;
			default:
				text='Missing Selection';
		}
		var transferable = xtk.clipboard.addTextDataFlavor('text/unicode', text);
		xtk.clipboard.copyFromTransferable(transferable);
	}


function say(message) {
	document.getElementById('status').textContent+=message+'\n';
//	alert(message);
}
