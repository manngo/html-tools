/*  UI
	================================================ */

	function setIndentLabel() {
		var spaces=document.getElementById('indent_char').value==32;
		document.getElementById('indent_label').textContent=spaces ? 'spaces per indent' : 'tabs per indent';
		document.getElementById('indent_size').value=spaces ? 4 : 1;
	}

