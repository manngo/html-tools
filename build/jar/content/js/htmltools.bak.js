/*	HTML Routines
	=========================================================

	These routines are called by the calling functions above.
	This allows easier maintenance and modification.

	========================================================= */

/* qjshint unused: false */
'use strict';
/* exported makeParagraphs,makeHeading,makeList,makeTable,makeAnchors,addImage,wrapTag,addComment,entify,smartQuotes,collapse,collapseText */

/*	Make Paragraphs
	--------------------------------------------------------- */

	function makeParagraphs(text,parms,eol) {
		var id = parms.id ? ' id="%s"'.sprintf(parms.id) : '';
		var className = parms.className ? ' class="%s"'.sprintf(parms.className) : '';

		var br = parms.xhtml ? '<br/>' : '<br>';

		var pattern=/^(\s*)(.*?)\s*$/;
		var data;
		eol = eol || '\n';

		var p=[];
		if(parms.br) {
			text=text.split(/\r\n\r\n|\n\n|\r\r/);
			for(var i=0;i<text.length;i++) {
				var q=[];
				if(text[i]) {
					text[i]=text[i].split(/\r\n|\n|\r/);
					for(var j=0;j<text[i].length;j++) {
						data=text[i][j].match(pattern);
						if(data[2]) q.push(data[2]);
					}
					if(q.length) p.push('<p%s%s>%s</p>'.sprintf(id,className,q.join(br+eol)));
				}
			}
		}
		else {
			text=text.split(/\r\n|\n|\r/);
			for(var i=0;i<text.length;i++) {
				if(text[i]) {
					data=text[i].match(pattern);
					if(data[2]) p.push('%s<p%s%s>%s</p>'.sprintf(data[1],id,className,data[2]));
				}
			}
		}
		return p.join(eol)+eol;
	}
/*	Make Heading
	--------------------------------------------------------- */

	function makeHeading(text,parms,eol) { // level,id,className) {
		var id = parms.id ? ' id="%s"'.sprintf(parms.id) : '';
		var className = parms.className ? ' class="%s"'.sprintf(parms.className) : '';
		var pattern=/^(\s*)(.*?)\s*$/;
		var data;
		var level = parms.level || 2;
		eol = eol || '\n';

		var h=[];
		text=text.split(/\r\n|\n|\r/);
		for(var i=0;i<text.length;i++) {
			if(text[i]) {
				data=text[i].match(pattern);
				if(data[2]) h.push('%s<h%s%s%s>%s</h%s>'.sprintf(data[1],level,id,className,data[2],level));
			}
		}

		return h.join(eol);
	}

/*	Make Ordered or Unordered List
	--------------------------------------------------------- */

	function makeList(text,parms,eol) {
		parms=parms || {};

		eol=eol || '\n';

		switch(parms.type) {
			case 'ul':
			case 'ol':
				if(parms.nested) return makeNestedList(text,parms,eol);
				else return makeSimpleList(text,parms,eol);
				break;
			case 'dl':
				if(parms.nested) return makeIndentedDefinitionList(text,parms,eol);
				else return makeDefinitionList(text,parms,eol);
		}
	}

	//	Simple List

	function makeSimpleList(text,parms,eol) { // type,id,className,span,indents) {
		var id = parms.id ? ' id="%s"'.sprintf(parms.id) : '';
		var className = parms.className ? ' class="%s"'.sprintf(parms.className) : '';
		var type =	parms.type || 'ul'; if(type!='ol') type='ul';
		var span =	!!parms.span;
		var li = span ? '%s\t<li><span>%s</span></li>' : '%s\t<li>%s</li>';

		eol = eol || '\n';
		var pattern=/^(\s*)(.*?)\s*$/;

		var indent,data;

		var t=[];
		text=text.split(/\r\n|\n|\r/);
		for(var i=0;i<text.length;i++) {
			[,indent,data]=text[i].match(pattern);
			if(data) t.push(li.sprintf(indent,data));
		}
		return '%s<%s%s%s>\n%s\n%s</%s>\n'.sprintf(indent,type,id,className,t.join('\n'),indent,type).replace('\n',eol);
	}

	//	Nested List

	function makeNestedList(text,parms,eol) { // type,id,className,span) {
		var id = parms.id ? ' id="%s"'.sprintf(parms.id) : '';
		var className = parms.className ? ' class="%s"'.sprintf(parms.className) : '';
		var type =	parms.type || 'ul'; if(type!='ol') type='ul';
//		var pattern=/^(\s*)(.*?)\s*$/;
//		var data;

		//	var span =	!!parms.span;
		eol = eol || '\n';
//		id = id ? ' id="'+id+'"' : '';
//		className = className ? ' class="'+className+'"' : '';

		function level(text) { return text ? text.match(/^(\t)*/g).toString().length : 0; }

		var test=text.split(/\r\n|\n|\r/m);
		var i,j,l,t,n,item;
		var items=[];
		var list=[];

		for(i=0;i<test.length;i++)
			if(test[i].match(/^\t*\S*/)) items.push(test[i]);	//	only keep non-empty lines

		//	New Version
		for(i=0;i<items.length;i++) {
			l=level(items[i]);
			t=new Array((l+1)*2).join('\t');

			n=level(items[i+1]);
			item=items[i].replace(/^\t*/,'');
//			if(data[i]===undefined) alert(i);
			if(n>l) {							//	has contents
				list.push(t+'<li>'+item);
				list.push(t+'\t<'+type+'>');
			}
			else if(l==level(items[i+1])) {	//	same level
				list.push(t+'<li>'+item+'</li>');
			}

			else if(n<l)	{	//	finished contents
				list.push(t+'<li>'+item+'</li>');
				for(j=0;j<l-n;j++) {
					list.push(new Array((l-j)*2+1).join('\t')+'</'+type+'>');
					list.push(new Array((l-j)*2).join('\t')+'</li>');
				}
			}
		}
		return '<%s%s%s>\n%s\n</%s>'.sprintf(type,id,className,list.join('\n'),type).replace('\n',eol);
	}

/*	Make Definition Lists
	--------------------------------------------------------- */

	//	Simple

	function makeDefinitionList(text,parms,eol) { // id,className,eol) {
		var id = parms.id ? ' id="%s"'.sprintf(parms.id) : '';
		var className = parms.className ? ' class="%s"'.sprintf(parms.className) : '';
		eol = eol || '\n';

		var dl=[];
		var i,l;
		text=text.split(/\r\n|\n|\r/);
		for(i=0,l=text.length;i<l;i++) {
			text[i]=text[i].replace(/\r\n|\n|\r/gm,'');
			if(text[i]) {
				if(i%2) dl.push('\t\t<dd>'+text[i]+'</dd>');
				else    dl.push('\t<dt>'+text[i]+'</dt>');
			}
		}
		return '<dl%s%s>\n%s\n</dl>'.sprintf(id,className,dl.join('\n')).replace('\n',eol);
	}

	//	Nested

	function makeIndentedDefinitionList(text,parms,eol) { // text,id,className) {
		var id = parms.id ? ' id="%s"'.sprintf(parms.id) : '';
		var className = parms.className ? ' class="%s"'.sprintf(parms.className) : '';
		eol = eol || '\n';

		var dl=[];
		var i,l;
		text=text.split(/\r\n|\n|\r/);
		for(i=0,l=text.length;i<l;i++) {
			text[i]=text[i].replace(/(\r\n|\n|\r)/gm,'');
			if(text[i]) {
				if(text[i].charAt(0)=='\t') dl.push('\t\t<dd>'+text[i].substr(1)+'</dd>');
				else    dl.push('\t<dt>'+text[i]+'</dt>');
			}
		}
		return '<dl%s%s>\n%s\n</dl>'.sprintf(id,className,dl.join('\n')).replace('\n',eol);
	}

/*	Make Table
	--------------------------------------------------------- */

	function makeTable(text,parms,eol) {
		var id = parms.id ? ' id="%s"'.sprintf(parms.id) : '';
		var className = parms.className ? ' class="%s"'.sprintf(parms.className) : '';
		var sections =		!!parms.sections;
		var header =		!!parms.header;
		var footer =		!!parms.footer;
		var delimiter =		parms.delimiter || 'tab';
		var combine =		!!parms.combine;
		eol = eol || '\n';
		switch(delimiter) {
			case 'comma':
				delimiter=combine ? /,+/g : /,/g;
				break;
			default:
				delimiter=combine ? /\t+/g : /\t/g;
		}

		function cell(text,type) {
				text=text.replace(/\r\n|\n|\r/gm,'');
				return '%s<tr><%s>%s</%s></tr>'.sprintf(sections?'\t':'',type,text.replace(delimiter,'</%s><%s>'.sprintf(type,type)),type);
		}
		var t=[];
		var i=0;
		text=text.split(/\r\n|\n|\r/);
		var l=text.length;
		if(header) {
			if(text[i]) {
				if(sections) t.push('\t<thead>');
				t.push('\t'+cell(text[i],'th'));
				if(sections) t.push('\t</thead>');
			}
			i++;
		}

		if(sections) t.push('\t<tbody>');
		for(i=(header?1:0);i<l-(sections&&footer?1:0);i++)  if(text[i]) t.push('\t'+cell(text[i],'td'));
		if(sections) t.push('\t</tbody>');

		if(sections && footer) {
				t.push('\t<tfoot>');
				t.push('\t'+cell(text[i],'th'));
				t.push('\t</tfoot>');
		}
		return '<table%s%s>\n%s\n</table>'.sprintf(id,className,t.join('\n')).replace('\n',eol);
	}

/*	Make Anchors
	--------------------------------------------------------- */

	function makeAnchors(text,parms,eol) {
		var reverse=parms.reverse?1:0;
		var xhtml=parms.xhtml?'/':'';
		var br=parms.br?'<br%s>'.sprintf(xhtml):'';
		eol = eol || '\n';
		//	href	text (or reverse)
		var t=[];
		var i=0;
		var indent,href,data,content;

		text=text.split(/\r\n|\n|\r/);

		var pattern = !reverse ? /(\s*)(.*?)\s*(\S*)$/ : /^(\s*)(\S*)\s*(.*)$/;
		indent = 1;
		href = !reverse ? 3 : 2;
		content = !reverse ? 2 : 3;


		for(i=0;i<text.length;i++) {
			if(text[i]) {
				data=text[i].match(pattern);
				t.push('%s<a href="%s">%s</a>'.sprintf(data[indent],data[href],data[content]));
			}
		}
		return t.join(br+eol);
	}

/*	Make Images
	--------------------------------------------------------- */

	function addImage(parms) {
		var id = parms.id ? ' id="%s"'.sprintf(parms.id) : '';
		var className = parms.className ? ' class="%s"'.sprintf(parms.className) : '';

		var src =		parms.src ?		' src="'+parms.src+'"'			:	' src=""';
		var alt =		parms.alt ?		' alt="'+parms.alt+'"'			:	' alt=""';
		var title =		parms.title ?	' title="'+parms.title+'"'		: '';
		var width =		parms.width ?	' width="'+parms.width+'"'		: '';
		var height =	parms.height ?	' height="'+parms.height+'"'	: '';

		var xhtml = parms.xhtml ? '/' : '';

		return '<img%s%s%s%s%s%s%s%s>'.sprintf(id,className,src,alt,title,width,height,xhtml);
	}

/*	Make Anchor
	--------------------------------------------------------- */

	function addAnchor(parms) {
		var id = parms.id ? ' id="%s"'.sprintf(parms.id) : '';
		var className = parms.className ? ' class="%s"'.sprintf(parms.className) : '';

		var href =		parms.href ? ' href="'+parms.href+'"' : ' href=""';
		var text =		parms.text ? parms.text : '';

		return '<a%s%s%s>%s</a>'.sprintf(id,className,href,text);
	}

/*	Linked Stylesheet or JavaScript
	--------------------------------------------------------- */

	function addLink(parms) {
		var id = parms.id ? ' id="%s"'.sprintf(parms.id) : '';
		var className = parms.className ? ' class="%s"'.sprintf(parms.className) : '';

		//	css:	rel,xhtml,media,title
		//	js:

		var link,title;

		switch(parms.type) {
			case 'css':
				link='<link%s%s rel="%s"%s type="text/css" href="%s" media="%s"%s>';
				title = parms.title ? ' title="%s"'.sprintf(parms.title) : '';
				return link.sprintf(id,className,parms.rel||'stylesheet',title,parms.href||'',parms.media||'all',parms.xhtml?'/':'');
			case 'js':
				link='<script %s%s type="text/javascript" src="%s"></script>';
				return link.sprintf(id,className,parms.href);
			default:
				return '';
		}
	}


/*	Wrap Tag around Selection
	--------------------------------------------------------- */
/*
	function doWrapTag(text) {
		var attributes=ko.interpolate.interpolateString('%(ask:tag:div);%(ask:id);%(ask:class)');
		if(!attributes) return '';

		attributes=attributes.split(';');
		if(!(tag=attributes[0])) return '';

		id=attributes[1]||'';
		className=attributes[2]||'';
		return wrapTag(text,tag,id,className);
	}

	//	Wrap element
*/
	function wrapTag(text,parms) {
		var id = parms.id ? ' id="%s"'.sprintf(parms.id) : '';
		var className = parms.className ? ' class="%s"'.sprintf(parms.className) : '';
		var element =		parms.element || 'span';
		var	eol =			parms.eol || '\n';
		var newline =		parms.newline ? eol : '';
//		return '<%s%s%s>%s</%s>%s'.sprintf(element,id,className,text.trim(),element,newline);
		switch(element) {
			case 'a':
				return '<a href="%s"%s%s>%s%s%s</a>%s'.sprintf(text,id,className,newline,text,newline,newline);
			default:
				return '<%s%s%s>%s%s%s</%s>%s'.sprintf(element,id,className,newline,text,newline,element,newline);
		}
	}

/*	Comments
	--------------------------------------------------------- */

	function addComment(text,style,block) {
		var start,end;
		block=!!block;
		switch(style) {
			case 'xml': start='<!--'; end='-->'; break;
			case 'c': start='/*'; end='*/'; break;
		}
		start = block ? eol+start+eol : start+' ' ;
		end = block ? eol+end+eol : ' '+end ;
		return start + text + end;
	}

	function removeHTMLComment(text) {

	}

/*	Entity Encoding
	--------------------------------------------------------- */

	function entify(text,numeric) {
		if(!numeric) numeric=false;
		numeric=!!numeric;
		var result=[];
		for(var i=0;i<text.length;i++) {
			var c=text[i];
			switch(c) {
				case '<':	c =	numeric?'&0x003C' :	'&lt;';		break;
				case '>':	c =	numeric?'&0x003E' :	'&gt;';		break;
				case '&':	c =	numeric?'&0x0026' :	'&amp;';	break;
				case '"':	c =	numeric?'&0x0022' :	'&quot;';	break;
				case '\'':	c =	numeric?'&0x0027' :	'&apos;';	break;
			}
			result.push(c);
		}
		return result.join('');
	}

/*	Smart Quotes
	--------------------------------------------------------- */

	function smartQuotes(text) {
		//	See also http://www.poppyware.com/dunham/smartQuotes.html
		//	Opening Quotes
		//	var quotes=/(^|[-–—([{<«\s'"“‘\]])(['"])/;

		text=text.replace(/(^|\B)(')\b/g,'‘');
		text=text.replace(/(^|\B)(")\b/g,'“');
		text=text.replace(/'/g,'’');
		text=text.replace(/"/g,'”');
		return text;

		var quotes=/(^|\B)(['"])(\b)/;

		while(text.match(quotes))
			text=text.replace(quotes,function (string,p1,p2,offset,s) {
				return p1+(p2 == '"' ? '“' : '‘');
			});
		text=text.replace(/(['"])/g,function(string,p1) {
			return p1=='"'?'”':'’';
		});
		return text;
	}

/*	Collapse Text
	--------------------------------------------------------- */

	function collapseText(text) {
		return text.replace(/\r\n/g,'\\n').replace(/\t/g,'\\t');
	}

/*	Convert to HTML5
	--------------------------------------------------------- */

	function makeHTML5(parms,eol) {
		eol = eol || '\n';
		var cv = ko.views.manager.currentView;
		var editor = cv.scimoz;
		var editor = ko.views.manager.currentView.scimoz;

		if(parms.doctype)	editor.text=editor.text.replace(/<!DOCTYPE html.*?>/igm,'<!DOCTYPE html>');
		if(parms.lang)		editor.text=editor.text.replace(/<html.*?>/gm,'<html lang="en">');
		if(parms.charset)	editor.text=editor.text.replace(/<meta http-equiv="content-type" content="text\/html;charset=utf-8">/gmi,'<meta charset="utf-8">');
		if(parms['void'])	editor.text=editor.text.replace(/ *\/>/gm,'>');
		if(parms.minimised)	editor.text=editor.text.replace(/(\S+)="\1"/gm,'$1');

		if(parms.id || parms['class']) {
			var elements=['header','footer','nav','article','aside','section','main'];
			var i,div,element,parent,selector=[];
			var parser = new DOMParser();
			var html = parser.parseFromString(editor.text, "text/html");

			for(i=0;i<elements.length;i++) {
				element=elements[i];
				if(parms.id) selector.push('#'+element);
				if(parms['class']) selector.push('.'+element);
				div=html.querySelector(selector.join(','));

				if(div) {
					parent=div.parentNode;
					element=html.createElement(element);
					element.innerHTML=div.innerHTML;
					parent.replaceChild(element,div);
				}
			}
			editor.text='<!DOCTYPE html>'+eol+html.documentElement.outerHTML;
		}
	}
