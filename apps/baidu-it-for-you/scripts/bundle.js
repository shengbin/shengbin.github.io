// Copyright (c) Jim Garvin (http://github.com/coderifous), 2008.
// Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses.
// Written by Jim Garvin (@coderifous) for use on LMGTFY.com.
// http://github.com/coderifous/jquery-localize
// Based off of Keith Wood's Localisation jQuery plugin.
// http://keith-wood.name/localisation.html

(function($) {
  $.localize = function(pkg, options) {
    var $wrappedSet          = this;
    var intermediateLangData = {};
    options = options || {};
    var saveSettings = {async: $.ajaxSettings.async, timeout: $.ajaxSettings.timeout};
    $.ajaxSetup({async: false, timeout: (options && options.timeout ? options.timeout : 500)});

    function loadLanguage(pkg, lang, level) {
      level = level || 1;
      var file;
      if (options && options.loadBase && level == 1) {
        intermediateLangData = {};
        file = pkg + '.json';
        jsonCall(file, pkg, lang, level);
      }
      else if (level == 1) {
        intermediateLangData = {};
        loadLanguage(pkg, lang, 2);
      }
      else if (level == 2 && lang.length >= 2) {
        file = pkg + '-' + lang.substring(0, 2) + '.json';
        jsonCall(file, pkg, lang, level);
      }
      else if (level == 3 && lang.length >= 5) {
        file = pkg + '-' + lang.substring(0, 5) + '.json';
        jsonCall(file, pkg, lang, level);
      }
      else {
        notifyDelegateFinished(intermediateLangData);
      }
    }

    function jsonCall(file, pkg, lang, level) {
      if (options.pathPrefix) file = options.pathPrefix + "/" + file;
      $.getJSON(file, null, function(d){
        $.extend(intermediateLangData, d);
        notifyDelegateLanguageLoaded(intermediateLangData);
        loadLanguage(pkg, lang, level + 1);
      });
    }

    function defaultCallback(data) {
      if($.localize.data[pkg] === undefined) $.localize.data[pkg] = {};
      $.extend(true, $.localize.data[pkg], data);
      var keys, value;
      $wrappedSet.each(function(){
        elem = $(this);
        key = elem.attr("rel").match(/localize\[(.*?)\]/)[1];
        value = valueForKey(key, data);
        if (!value) {
          return;
        }
        else if (elem.is("input")) {
          elem.val(value);
        }
        else {
          elem.html(value);
        }
      });
    }

    function notifyDelegateLanguageLoaded(data) {
      if (options.callback) {
        // pass the defaultCallback so it can be used in addition to some custom behavior
        options.callback(data, defaultCallback);
      }
      else {
        defaultCallback(data);
      }
    }

    function notifyDelegateFinished(data) {
      if (options.finish) options.finish(data);
    }

    function valueForKey(key, data){
      var keys  = key.split(/\./);
      var value = data;
      while (keys.length > 0) {
        if(value){
          value = value[keys.shift()];
        }
        else{
          return null;
        }
      }
      return value;
    }

    function regexify(string_or_regex_or_array){
      if (typeof(string_or_regex_or_array) == "string") {
        return "^" + string_or_regex_or_array + "$";
      }
      else if (string_or_regex_or_array.length) {
        var matchers = [];
        var x = string_or_regex_or_array.length;
        while (x--) {
          matchers.push(regexify(string_or_regex_or_array[x]));
        }
        return matchers.join("|");
      }
      else {
        return string_or_regex_or_array;
      }
    }

    var lang = normaliseLang(options && options.language ? options.language : $.defaultLanguage);

    if (options.skipLanguage && lang.match( regexify(options.skipLanguage) )) {
      notifyDelegateFinished(intermediateLangData);
      return;
    }
    loadLanguage(pkg, lang, 1);

    $.ajaxSetup(saveSettings);
  };

  $.fn.localize = $.localize;

  // Storage for retrieved data
  $.localize.data = {};

  // Retrieve the default language set for the browser.
  $.defaultLanguage = normaliseLang(navigator.language
    ? navigator.language       // Mozilla
    : navigator.userLanguage   // IE
  );

  // Ensure language code is in the format aa-AA.
  function normaliseLang(lang) {
   lang = lang.replace(/_/, '-').toLowerCase();
   if (lang.length > 3) {
     lang = lang.substring(0, 3) + lang.substring(3).toUpperCase();
   }
   return lang;
  }
})(jQuery);
// proMarket plugin - easy insert promarket tracking snippet with site id and keyword
// By James Garvin (coderifous)
// Copyright 2009 - License: MIT

(function($) {
  $.proMarket = function(siteId, keyWords) {
    $("body").proMarket(siteId, keyWords);
  };

  $.fn.proMarket = function(siteId, keyWords) {
    this.append(
      '<IFRAME WIDTH="1" HEIGHT="1" MARGINWIDTH="0" MARGINHEIGHT="0" HSPACE="0" ' +
      'VSPACE="0" FRAMEBORDER="0" SCROLLING="no" ' +
      'SRC="http://pbid.pro-market.net/engine?site=' + siteId.toString() +
      ';size=1x1;kw=' + keyWords + '"></IFRAME>');
    return this;
  };
})(jQuery);
// QueryString Engine v1.0.1 (modified)
// By James Campbell (modified by coderifous)
(function($) {
  $.querystringvalues = $.queryStringValues = $.QueryStringValues = $.QueryStringvalues = $.queryStringValues = $.queryStringvalues = $.querystringValues = $.getqueryString = $.queryString = $.querystring = $.QueryString = $.Querystring = $.getQueryString = $.getquerystring = $.getQuerystring  = function(options)
  {
    defaults = { defaultvalue: null };
    options = $.extend(defaults , options);
    qs = location.search.substring(1, location.search.length);
    if (qs.length == 0) return options.defaultvalue;
      qs = qs.replace(/\+/g, ' ');
      var args = qs.split('&');
      for (var i = 0; i < args.length; i ++ )
      {
        var value;
        var pair = args[i].split('=');
        var name = gentlyDecode(pair[0]);

      if (pair.length == 2)
      {
        value = gentlyDecode(pair[1]);
      }
      else
      {
        value = name;
      }
      if (name == options.id || i == options.id-1)
      {
          return value;
      }
      }
    return options.defaultvalue;
  };
})(jQuery);

(window,document,jQuery);$.fn.copyButton = function(input, callback) {
  var self = this;
  self.css("visibility", "hidden");

  var clip = new ZeroClipboard.Client();
  var loaded = function () {
    self.css("visibility", "visible");
  };
  var hovered = function() {
    clip.setText($(input).val().trim());
  };
  clip.setHandCursor(true);
  clip.addEventListener("load", loaded);
  clip.addEventListener("mouseOver", hovered);
  clip.addEventListener("complete", callback);
  clip.glue(self.get(0));
  return self;
};

$.fn.centerOver = function(element, topOffset, leftOffset) {
  topOffset = topOffset || 0;
  leftOffset = leftOffset || 0;
  var self = this;
  self.css({
    top: (element.position().top + element.outerHeight()/2 - self.height()/2 + topOffset).px(),
    left: (element.position().left + element.outerWidth()/2 - self.width()/2 + leftOffset).px()
  });
  return self;
};

$.fn.sponsor = function(programFile, callback) {
  var self = this;
  $.getJSON(programFile, function(program) {
    var sponsor = program.slots[rand(program.slots.length)];
    var id = sponsor.id;
    var anchor = self.find("a");
    anchor.attr("href", sponsor.url);
    anchor.find("img").attr("src", sponsor.image);
    anchor.find("p").html(sponsor.message);
    if (pageTracker) {
      pageTracker._trackPageview("/sponsor/" + id);
      anchor.unbind("click");
      anchor.click(function() { pageTracker._trackPageview("/outgoing/sponsor/" + id); });
    }
    if (callback) callback.call(self);
  });
  return self;
};

function rand(max) {
  return Math.floor(Math.random() * max);
}

Number.prototype.px = function(){ return this.toString() + "px"; };

function gentlyEncode(string) {
  return ( encodeURIComponent
           ? encodeURIComponent(string).replace(/%20(\D)?/g, "+$1").replace(/'/g, escape("'"))
           : escape(string).replace(/\+/g, "%2B").replace(/%20/g, "+") );
}

function gentlyDecode(string) {
  return decodeURIComponent ? decodeURIComponent(string) : unescape(string);
}
// Simple Set Clipboard System
// Author: Joseph Huckaby

var ZeroClipboard = {
	
	version: "1.0.7",
	clients: {}, // registered upload clients on page, indexed by id
	moviePath: 'ZeroClipboard.swf', // URL to movie
	nextId: 1, // ID of next movie
	
	$: function(thingy) {
		// simple DOM lookup utility function
		if (typeof(thingy) == 'string') thingy = document.getElementById(thingy);
		if (!thingy.addClass) {
			// extend element with a few useful methods
			thingy.hide = function() { this.style.display = 'none'; };
			thingy.show = function() { this.style.display = ''; };
			thingy.addClass = function(name) { this.removeClass(name); this.className += ' ' + name; };
			thingy.removeClass = function(name) {
				var classes = this.className.split(/\s+/);
				var idx = -1;
				for (var k = 0; k < classes.length; k++) {
					if (classes[k] == name) { idx = k; k = classes.length; }
				}
				if (idx > -1) {
					classes.splice( idx, 1 );
					this.className = classes.join(' ');
				}
				return this;
			};
			thingy.hasClass = function(name) {
				return !!this.className.match( new RegExp("\\s*" + name + "\\s*") );
			};
		}
		return thingy;
	},
	
	setMoviePath: function(path) {
		// set path to ZeroClipboard.swf
		this.moviePath = path;
	},
	
	dispatch: function(id, eventName, args) {
		// receive event from flash movie, send to client		
		var client = this.clients[id];
		if (client) {
			client.receiveEvent(eventName, args);
		}
	},
	
	register: function(id, client) {
		// register new client to receive events
		this.clients[id] = client;
	},
	
	getDOMObjectPosition: function(obj, stopObj) {
		// get absolute coordinates for dom element
		var info = {
			left: 0, 
			top: 0, 
			width: obj.width ? obj.width : obj.offsetWidth, 
			height: obj.height ? obj.height : obj.offsetHeight
		};

		while (obj && (obj != stopObj)) {
			info.left += obj.offsetLeft;
			info.top += obj.offsetTop;
			obj = obj.offsetParent;
		}

		return info;
	},
	
	Client: function(elem) {
		// constructor for new simple upload client
		this.handlers = {};
		
		// unique ID
		this.id = ZeroClipboard.nextId++;
		this.movieId = 'ZeroClipboardMovie_' + this.id;
		
		// register client with singleton to receive flash events
		ZeroClipboard.register(this.id, this);
		
		// create movie
		if (elem) this.glue(elem);
	}
};

ZeroClipboard.Client.prototype = {
	
	id: 0, // unique ID for us
	ready: false, // whether movie is ready to receive events or not
	movie: null, // reference to movie object
	clipText: '', // text to copy to clipboard
	handCursorEnabled: true, // whether to show hand cursor, or default pointer cursor
	cssEffects: true, // enable CSS mouse effects on dom container
	handlers: null, // user event handlers
	
	glue: function(elem, appendElem, stylesToAdd) {
		// glue to DOM element
		// elem can be ID or actual DOM element object
		this.domElement = ZeroClipboard.$(elem);
		
		// float just above object, or zIndex 99 if dom element isn't set
		var zIndex = 99;
		if (this.domElement.style.zIndex) {
			zIndex = parseInt(this.domElement.style.zIndex, 10) + 1;
		}
		
		if (typeof(appendElem) == 'string') {
			appendElem = ZeroClipboard.$(appendElem);
		}
		else if (typeof(appendElem) == 'undefined') {
			appendElem = document.getElementsByTagName('body')[0];
		}
		
		// find X/Y position of domElement
		var box = ZeroClipboard.getDOMObjectPosition(this.domElement, appendElem);
		
		// create floating DIV above element
		this.div = document.createElement('div');
		var style = this.div.style;
		style.position = 'absolute';
		style.left = '' + box.left + 'px';
		style.top = '' + box.top + 'px';
		style.width = '' + box.width + 'px';
		style.height = '' + box.height + 'px';
		style.zIndex = zIndex;
		
		if (typeof(stylesToAdd) == 'object') {
			for (addedStyle in stylesToAdd) {
				style[addedStyle] = stylesToAdd[addedStyle];
			}
		}
		
		// style.backgroundColor = '#f00'; // debug
		
		appendElem.appendChild(this.div);
		
		this.div.innerHTML = this.getHTML( box.width, box.height );
	},
	
	getHTML: function(width, height) {
		// return HTML for movie
		var html = '';
		var flashvars = 'id=' + this.id + 
			'&width=' + width + 
			'&height=' + height;
			
		if (navigator.userAgent.match(/MSIE/)) {
			// IE gets an OBJECT tag
			var protocol = location.href.match(/^https/i) ? 'https://' : 'http://';
			html += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="'+protocol+'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="'+width+'" height="'+height+'" id="'+this.movieId+'" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="'+ZeroClipboard.moviePath+'" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="'+flashvars+'"/><param name="wmode" value="transparent"/></object>';
		}
		else {
			// all other browsers get an EMBED tag
			html += '<embed id="'+this.movieId+'" src="'+ZeroClipboard.moviePath+'" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="'+width+'" height="'+height+'" name="'+this.movieId+'" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="'+flashvars+'" wmode="transparent" />';
		}
		return html;
	},
	
	hide: function() {
		// temporarily hide floater offscreen
		if (this.div) {
			this.div.style.left = '-2000px';
		}
	},
	
	show: function() {
		// show ourselves after a call to hide()
		this.reposition();
	},
	
	destroy: function() {
		// destroy control and floater
		if (this.domElement && this.div) {
			this.hide();
			this.div.innerHTML = '';
			
			var body = document.getElementsByTagName('body')[0];
			try { body.removeChild( this.div ); } catch(e) {;}
			
			this.domElement = null;
			this.div = null;
		}
	},
	
	reposition: function(elem) {
		// reposition our floating div, optionally to new container
		// warning: container CANNOT change size, only position
		if (elem) {
			this.domElement = ZeroClipboard.$(elem);
			if (!this.domElement) this.hide();
		}
		
		if (this.domElement && this.div) {
			var box = ZeroClipboard.getDOMObjectPosition(this.domElement);
			var style = this.div.style;
			style.left = '' + box.left + 'px';
			style.top = '' + box.top + 'px';
		}
	},
	
	setText: function(newText) {
		// set text to be copied to clipboard
		this.clipText = newText;
		if (this.ready) this.movie.setText(newText);
	},
	
	addEventListener: function(eventName, func) {
		// add user event listener for event
		// event types: load, queueStart, fileStart, fileComplete, queueComplete, progress, error, cancel
		eventName = eventName.toString().toLowerCase().replace(/^on/, '');
		if (!this.handlers[eventName]) this.handlers[eventName] = [];
		this.handlers[eventName].push(func);
	},
	
	setHandCursor: function(enabled) {
		// enable hand cursor (true), or default arrow cursor (false)
		this.handCursorEnabled = enabled;
		if (this.ready) this.movie.setHandCursor(enabled);
	},
	
	setCSSEffects: function(enabled) {
		// enable or disable CSS effects on DOM container
		this.cssEffects = !!enabled;
	},
	
	receiveEvent: function(eventName, args) {
		// receive event from flash
		eventName = eventName.toString().toLowerCase().replace(/^on/, '');
				
		// special behavior for certain events
		switch (eventName) {
			case 'load':
				// movie claims it is ready, but in IE this isn't always the case...
				// bug fix: Cannot extend EMBED DOM elements in Firefox, must use traditional function
				this.movie = document.getElementById(this.movieId);
				if (!this.movie) {
					var self = this;
					setTimeout( function() { self.receiveEvent('load', null); }, 1 );
					return;
				}
				
				// firefox on pc needs a "kick" in order to set these in certain cases
				if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
					var self = this;
					setTimeout( function() { self.receiveEvent('load', null); }, 100 );
					this.ready = true;
					return;
				}
				
				this.ready = true;
				this.movie.setText( this.clipText );
				this.movie.setHandCursor( this.handCursorEnabled );
				break;
			
			case 'mouseover':
				if (this.domElement && this.cssEffects) {
					this.domElement.addClass('hover');
					if (this.recoverActive) this.domElement.addClass('active');
				}
				break;
			
			case 'mouseout':
				if (this.domElement && this.cssEffects) {
					this.recoverActive = false;
					if (this.domElement.hasClass('active')) {
						this.domElement.removeClass('active');
						this.recoverActive = true;
					}
					this.domElement.removeClass('hover');
				}
				break;
			
			case 'mousedown':
				if (this.domElement && this.cssEffects) {
					this.domElement.addClass('active');
				}
				break;
			
			case 'mouseup':
				if (this.domElement && this.cssEffects) {
					this.domElement.removeClass('active');
					this.recoverActive = false;
				}
				break;
		} // switch eventName
		
		if (this.handlers[eventName]) {
			for (var idx = 0, len = this.handlers[eventName].length; idx < len; idx++) {
				var func = this.handlers[eventName][idx];
			
				if (typeof(func) == 'function') {
					// actual function reference
					func(this, args);
				}
				else if ((typeof(func) == 'object') && (func.length == 2)) {
					// PHP style object + method, i.e. [myObject, 'myMethod']
					func[0][ func[1] ](this, args);
				}
				else if (typeof(func) == 'string') {
					// name of function
					window[func](this, args);
				}
			} // foreach event handler defined
		} // user defined handler for event
	}
	
};
// default lang necessities
$.localize.data.lmgtfy = {
  setup: {
    type_question: "输入你的问题, 点击搜索按钮",
    share_link:    "拷贝以下链接用于分享",
    or:            "或者"
  },

  play: {
    step_1: "第一步: 输入你的问题",
    step_2: "第二步: 点击搜索按钮",
    pwnage: "有那么难吗？",
    nice:   "搜索其实很简单"
  },

  link: {
    creating:  "正在生成...",
    fetching:  "正在获取...",
    copied:    "链接已拷贝到剪切板",
    shortened: "短网址已拷贝到剪切板"
  },

  urls: {
    logo: "",
    search: "http://www.baidu.com/s?wd=",
    lucky_search: "http://baike.baidu.com/search?word="
  }
};

$.fn.countDown = function() {
  var self       = this;
  var targetDate = dbDate(this.attr("data-ends-at"));

  recurseDurationCountdown();

  function recurseDurationCountdown() {
    var seconds = parseInt((targetDate - new Date()) / 1000);
    self.text(formatDuration(seconds));
    if (seconds > 0) {
      setTimeout(recurseDurationCountdown, 1000);
    }
  }

  function formatDuration(seconds) {
    var hh, mm, ss, days;
    if (seconds <= 0) {
      return "--:--:--";
    }
    else if (seconds > 60 * 60 * 24) {
      days = parseInt(seconds / 60 / 60 / 24);
      var suffix = days > 1 ? "s" : "";
      return days.toString() + " day" + suffix;
    }
    else {
      ss = seconds % 60;
      mm = parseInt(seconds / 60 % 60);
      hh = parseInt(seconds / 60 / 60);
      return hh + ":" + twoDigits(mm) + ":" + twoDigits(ss);
    }
  }

  function twoDigits(n) {
    var prefix = n < 10 ? "0" : "";
    return prefix + n;
  }

  function dbDate(str) {
    var s = $.trim(str);
    s = s.replace(/-/,"/").replace(/-/,"/");
    return new Date(s);
  }
};

$.fn.trackClickEvent = function() {
  return this.each(function() {
    $(this).click(function(e) {
      e.stopPropagation();
      if (pageTracker) {
        var category = $(this).attr("data-tracking-category");
        var trackingLabel = $(this).attr("data-tracking-label");
        pageTracker._trackEvent(category, "click", trackingLabel);
      }
    });
  });
};

$.fn.loadDeferredImageSource = function() {
  return this.find("img[data-deferred-src]").each(function(i, n) {
    $(n).attr("src", $(n).data("deferred-src"));
  });
};

$(function(){
  var searchString = $.getQueryString({ id: "q" });
  var inputField   = $("input[type=text]:first");
  var fakeMouse    = $("#fake_mouse");
  var instructions = $("#instructions");
  var button       = ($.getQueryString({ id: "l" }) == "1") ? $("#lucky") : $("#search");
  var inputLink    = $("#link input.link");
  var linkButtons  = $("#link_buttons");
  var linkMessage  = $("#link_message");

  initializeLocalization();
  initializeAboutLink();
  initializeControls();

  if (searchString) {
    initGoogleItForThem();
    if (location.hash == "#seen") {
      explainIt();
    } else {
      googleItForThem();
    }
  }
  else {
    getTheSearchTerms();
  }

  function initializeAboutLink() {
    $("a[name=about]").click(function() {
      $("#about").toggle();
      $("html,body").animate({ scrollTop: $("#about").offset().top }, 1000);
      return false;
    });
    linkifyAbout();
  }

  function initializeControls() {
    inputLink.click(function() { $(this).select(); });
    $("#link").one("mouseover", function(){ $.event.trigger({ type: "callout:show" }); });
    $("#go").click(function(){ window.location.href = inputLink.val(); return false; });
    $("#reset").click(function(){ resetTheUrl($(this).attr("url")); return false; });
    $("#shorten").click(function(){
      linkStatus("link.fetching", 0, true);
      $.getJSON("http://api.bitly.com/v3/shorten?format=json&login=lmgtfy&apiKey=R_f0a33bc297052f6faea2a898b80662f0&longUrl=" + gentlyEncode(inputLink.val()), function(data) {
        inputLink.val(data.data.url).focus().select();
        linkStatus("link.fetching", 1500);
      });
      $(this).hide();
      $("#reset").show();
      return false;
    });
    $("#language select").change(function(e){
      var l = window.location;
      var hostnameMinusSubdomain = l.hostname.match(/[^.]+\.(?:[^.]+)$/)[0];
      var url = l.protocol + "//" + $(this).val() + "." + hostnameMinusSubdomain + l.pathname;
      window.location.href = url;
    });
    $("[data-tracking-category]").trackClickEvent();

    $(document).bind("callout:show", function(){
      var shirts = [
        "http://cdn.shopify.com/s/files/1/0215/0706/products/girl-logo-blue_1_medium.png?144",
        "http://cdn.shopify.com/s/files/1/0215/0706/products/girl-logo-green_1_medium.png?144",
        "http://cdn.shopify.com/s/files/1/0215/0706/products/girl-logo-red_1_medium.png?144",
        "http://cdn.shopify.com/s/files/1/0215/0706/products/girl-logo-gold_1_medium.png?144",
        "http://cdn.shopify.com/s/files/1/0215/0706/products/boy-logo-blue_1_medium.png?144",
        "http://cdn.shopify.com/s/files/1/0215/0706/products/boy-logo-green_1_medium.png?144",
        "http://cdn.shopify.com/s/files/1/0215/0706/products/logo-gold_1_medium.png?144",
        "http://cdn.shopify.com/s/files/1/0215/0706/products/boy-logo-red_1_medium.png?144"
      ];
      var rotateShirt = function() {
        var shirt = shirts[Math.floor(Math.random()*shirts.length)];
        $("#shirt-callout img#shirt").attr("src", shirt);
        setTimeout(function(){ rotateShirt() }, 1000);
      }
      rotateShirt(0);
      $("#shirt-callout").show();
    });
  }

  function initializeLocalization() {
    setTimeout(function(){$("#logo").css("opacity", 1); }, 2000); // failsafe to ensure logo is shown even if some crazy fail happens with localization callbacks.
    var localize_opts = {
      pathPrefix: "lang",
      skipLanguage: /^en-US/,
      callback: function(data, defaultCallback) {
        defaultCallback(data);
        linkifyAbout();
        if (data.lucky_button === null) $("#lucky").parent().parent().hide();
      },
      finish: function(data){
        if (data.urls && data.urls.logo) {
          $("#logo").load(function(){
            $(this).css("opacity", 1);
          }).attr("src", data.urls.logo);
        }
        else {
          $("#logo").css("opacity", 1);
        }
      }
    };
    var lang = $.getQueryString({ id: "lang" }) || sniffUrlForLanguage();
    if (lang) localize_opts.language = lang;
    $("[rel*=localize]").localize("lmgtfy", localize_opts);
  }

  function sniffUrlForLanguage() {
    return sniffSubdomainForLanguage() || sniffDomainForLanguage();
  }

  function sniffSubdomainForLanguage() {
    var first = window.location.hostname.split(".")[0];
    var match = first.match(/^[a-z]{2}(?:-[a-z]{2})?$/i);
    return match ? match[0] : null;
  }

  function sniffDomainForLanguage() {
    var domainLanguageOverrides = {
      "klingon":   "xx-KL",
      "images":    "en-IM",
      "image":     "en-IM",
      "maps":      "en-MP",
      "map":       "en-MP",
      "videos":    "en-VD",
      "video":     "en-VD",
      "news":      "en-NW",
      "shopping":  "en-SH",
      "products":  "en-SH",
      "product":   "en-SH",
      "photos":    "en-PC",
      "photo":     "en-PC",
      "picasaweb": "en-PC",
      "picasa":    "en-PC",
      "plus":      "en-PS",
      "profiles":  "en-PF",
      "profile":   "en-PF",
      "books":     "en-BK",
      "book":      "en-BK",
      "finance":   "en-FI",
      "scholar":   "en-SC",
      "bing":      "en-BI",
      "lmbtfy":    "en-BI",
      "snopes":    "en-SN",
      "wiki":      "en-WI",
      "wikipedia": "en-WI"
    };

    for (var domain in domainLanguageOverrides) {
      if (window.location.hostname.match(domain)) {
        return domainLanguageOverrides[domain];
      }
    }
    return null;
  }

  function langString(langkey) {
    var keys = langkey.split(/\./);
    return keys.length == 1 ? $.localize.data.lmgtfy[keys[0]] : $.localize.data.lmgtfy[keys[0]][keys[1]];
  }

  function linkifyAbout() {
    $("#about p").each(function() {
      $(this).html($(this).text().replace(/(@([a-zA-Z0-9_]+))/g, '<a href="http://twitter.com/$2">$1</a>'));
    });
  }

  function instruct(langkey) {
    instructions.html(langString(langkey));
  }

  function linkStatus(langkey, millis, stuck, callback) {
    millis = millis || 2500;
    linkMessage.html(langString(langkey)).show().centerOver(inputLink);
    if (!stuck) {
      setTimeout(function(){ linkMessage.fadeOut(millis/4*3, callback); }, millis/4);
    }
  }

  function getTheSearchTerms() {
    // $("#alert").show();
    $("form.search").submit(function(){ $("#search").click(); return false; });
    instruct("setup.type_question");
    inputField.focus().select();

    $("input[type=button]").click(function(e){
      instruct("setup.share_link");

      var l   = window.location;
      var url = l.protocol + "//" + l.hostname + l.pathname + "?";
      var searchString = gentlyEncode(inputField.val());

      $.proMarket("120083", searchString);

      strings = [ "q=" + searchString ];
      if (this.id == "lucky") strings.push("l=1");

      url += strings.join("&");

      showTheUrl(url);
    });
  }

  function showTheUrl(url) {
    resetTheUrl(url);

    $("#link").centerOver($("#link_placeholder")).show();
    linkStatus("link.creating", 1500, false, function() {
      linkButtons.fadeIn();
      linkButtons.centerOver(inputLink, 28);
      $("#copy").copyButton(inputLink, function() {
        linkStatus("link.copied", 1500);
      });
    });

    inputLink.focus().select();
  }

  function resetTheUrl(url) {
    $("#shorten").show();
    $("#reset").attr("url", url).hide();
    inputLink.val(url).focus().select();
  }

  function explainIt() {
    location.hash = "";
    $("#already-seen a.again").click(function(e) { e.stopPropagation(); $.fancybox.close(); });
    $("#already-seen").loadDeferredImageSource();
    $.fancybox.open(
      { href: "#already-seen" },
      { afterClose: googleItForThem, autoSize: false, width: 728, height: 376, closeBtn: false }
    );
    if (pageTracker) {
      pageTracker._trackEvent("Ads", "popup", "Already seen");
    }
  }

  function initGoogleItForThem() {
    $.proMarket("120083", gentlyEncode(searchString));
    switchMouseCursor();
    instruct("play.step_1");
  }

  function switchMouseCursor() {
    var agent = navigator.userAgent;
    if (agent.indexOf("Windows NT 5") >= 0) {
      fakeMouse.attr("src", "/images/mouse_arrow_windows.png");
    } else if (agent.indexOf("Mac OS X") >= 0) {
      fakeMouse.attr("src", "/images/mouse_arrow_mac.png");
    }
  }

  function googleItForThem() {
    if ($.getQueryString({ id: "fwd" })) redirect();

    $("body").css("cursor", "wait");
    fakeMouse.show();
    fakeMouse.animate({
      top:  (inputField.position().top  + 15).px(),
      left: (inputField.position().left + 10).px()
    }, 1500, "swing", function(){
      inputField.focus();
      fakeMouse.animate({ top: "+=18px", left: "+=10px" }, "fast", function() { fixSafariRenderGlitch(); });
      type(searchString, 0);
    });

    function type(string, index){
      var val = string.substr(0, index + 1);
      inputField.attr("value", val);
      if (index < string.length) {
        setTimeout(function(){ type(string, index + 1); }, Math.random() * 240);
      }
      else {
        doneTyping();
      }
    }

    function doneTyping(){
      instruct("play.step_2");
      fakeMouse.animate({
        top:  (button.position().top  + 10).px(),
        left: (button.position().left + 30).px()
      }, 2000, "swing", function(){
        var key = $.getQueryString({ id: "n" }) == 1 ? "play.nice" : "play.pwnage";
        instruct(key);
        button.addClass("active");
        setTimeout(redirect, 2000);
        location.hash = "seen";
      });
    }

    function easterEgg(){
      if (searchString == "funny sarah jessica parker movie") {
        return "/movie-not-found.html";
      } else if (searchString.match(/(can|will) ron paul win/i)) {
        return "http://canronpaulwin.com";
      } else if (searchString.match(/(can|will) ron paul lose/i)) {
        return "http://canronpaullose.com";
      } else {
        return false;
      }
    }

    function redirect(){
      if ($.getQueryString({ id: "debug" })) return;

      var google = $.localize.data.lmgtfy.urls.search;
      if (button.attr("id") == $("#lucky").attr("id")) {
        google = $.localize.data.lmgtfy.urls.lucky_search;
      }

      var egg = easterEgg();
      if (egg) {
        page = egg;
      } else {
        page = google + gentlyEncode(searchString);
      }

      window.location.href = page;
    }

    function fixSafariRenderGlitch() {
      if ($.browser.safari) inputField.blur().focus();
    }
  }
});
