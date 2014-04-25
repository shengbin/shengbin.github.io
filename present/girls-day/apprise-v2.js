// Global Apprise variables
var $Apprise = null,
		$overlay = null,
		$body = null,
		$window = null,
		$cA = null,
		AppriseQueue = [];

// Add overlay and set opacity for cross-browser compatibility
$(function() {
	
	$Apprise = $('<div class="apprise">');
	$overlay = $('<div class="apprise-overlay">');
	$body = $('body');
	$window = $(window);
	
	$body.append( $overlay.css('opacity', '.94') ).append($Apprise);
});

function Apprise(text, options) {
	
	// Restrict blank modals
	if(text===undefined || !text) {
		return false;
	}
	
	// Necessary variables
	var $me = this,
			$_inner = $('<div class="apprise-inner">'),
			$_buttons = $('<div class="apprise-buttons">'),
			$_input = $('<input type="text">');
	
	// Default settings (edit these to your liking)
	var settings = {
	
		animation: 700,	// Animation speed
		buttons: {
			confirm: {
				action: function() { $me.dissapear(); }, // Callback function
				className: null, // Custom class name(s)
				id: 'confirm', // Element ID
				text: 'Ok' // Button text
			}
		},
		input: false, // input dialog
		override: true // Override browser navigation while Apprise is visible
	};
	
	// Merge settings with options
	$.extend(settings, options);
	
	// Close current Apprise, exit
	if(text=='close') { 
		$cA.dissapear();
		return;
	}
	
	// If an Apprise is already open, push it to the queue
	if($Apprise.is(':visible')) {

		AppriseQueue.push({text: text, options: settings});
	
		return;
	}
	
	// Width adjusting function
	this.adjustWidth = function() {
		
		var window_width = $window.width(), w = "20%", l = "40%";

		if(window_width<=800) {
			w = "90%", l = "5%";
		} else if(window_width <= 1400 && window_width > 800) {
			w = "70%", l = "15%";
		} else if(window_width <= 1800 && window_width > 1400) {
			w = "50%", l = "25%";
		} else if(window_width <= 2200 && window_width > 1800) {
			w = "30%", l = "35%";
		}
		
		$Apprise.css('width', w).css('left', l);
		
	};
	
	// Close function
	this.dissapear = function() {
		
		$Apprise.animate({
			top: '-100%'
		}, settings.animation, function() {
			
			$overlay.fadeOut(300);
			$Apprise.hide();
			
			// Unbind window listeners
			$window.unbind("beforeunload");
			$window.unbind("keydown");

			// If in queue, run it
			if(AppriseQueue[0]) { 
				Apprise(AppriseQueue[0].text, AppriseQueue[0].options);
				AppriseQueue.splice(0,1);
			}
		});
		
		return;
	};
	
	// Keypress function
	this.keyPress = function() {
		
		$window.bind('keydown', function(e) {
			// Close if the ESC key is pressed
			if(e.keyCode===27) {
				
				if(settings.buttons.cancel) {
					
					$("#apprise-btn-" + settings.buttons.cancel.id).trigger('click');
				} else {
					
					$me.dissapear();
				}
			} else if(e.keyCode===13) {

				if(settings.buttons.confirm) {
					
					$("#apprise-btn-" + settings.buttons.confirm.id).trigger('click');
				} else {
					
					$me.dissapear();
				}
			}
		});
	};
	
	// Add buttons
	$.each(settings.buttons, function(i, button) {
		
		if(button) {
			
			// Create button
			var $_button = $('<button id="apprise-btn-' + button.id + '">').append(button.text);
			
			// Add custom class names
			if(button.className) {
				$_button.addClass(button.className);
			}
			
			// Add to buttons
			$_buttons.append($_button);
			
			// Callback (or close) function
			$_button.on("click", function() {
				
				// Build response object
				var response = {
					clicked: button, // Pass back the object of the button that was clicked
					input: ($_input.val() ? $_input.val() : null) // User inputted text
				};
				
				button.action( response );
				//$me.dissapear();
			});
		}
	});
	
	// Disabled browser actions while open
	if(settings.override) {
		$window.bind('beforeunload', function(e){ 
			return "An alert requires attention";
		});
	}
	
	// Adjust dimensions based on window
	$me.adjustWidth();
	
	$window.resize( function() { $me.adjustWidth() } );
	
	// Append elements, show Apprise
	$Apprise.html('').append( $_inner.append('<div class="apprise-content">' + text + '</div>') ).append($_buttons);
	$cA = this;
	
	if(settings.input) {
		$_inner.find('.apprise-content').append( $('<div class="apprise-input">').append( $_input ) );
	}
	
	$overlay.fadeIn(300);
	$Apprise.show().animate({
		top: '20%'
	}, 
		settings.animation, 
		function() {
			$me.keyPress();
		}
	);
	
	// Focus on input
	if(settings.input) {
		$_input.focus();
	}
	
} // end Apprise();

// added by shengbin on girls day
function girls_day() {
	var options = {
		animation: 500,	// Animation speed
		buttons: {
			confirm: {
				action: function() { Apprise('close'); }, // Callback function
				className: null, // Custom class name(s)
				id: 'confirm', // Element ID
				text: '嗯', // Button text
			}
		},
		input: false, // input dialog
		override: true, // Override browser navigation while Apprise is visible
	};

	Apprise("Hi, 你好啊!", options);
	Apprise("今天天气不错。", options);
	Apprise("你今天打扮得挺漂亮嘛。", options);
	Apprise("女为悦己者容。", options);
	var options_a = {
		animation: 500,	// Animation speed
		buttons: {
			confirm: {
				action: function() { Apprise('close'); }, // Callback function
				className: null, // Custom class name(s)
				id: 'confirm', // Element ID
				text: '啊？', // Button text
			}
		},
		input: false, // input dialog
		override: true, // Override browser navigation while Apprise is visible
	};
	Apprise("警告！<br>我已经进入工作模式！我是一个程序。如果你在我执行完毕之前试图关闭这个页面或者退出浏览器，你会得到提示。\
	如果你在被提示时仍选择退出，我可能会把你的硬盘格式化，你将丢失一些数据。如果你确实想结束我的执行，请关机。", options_a);
		
	Apprise("不过不必害怕，只要不乱操作就没事。接下来，需要你提供一些信息。", options);
	var options_input = {
		animation: 500,	// Animation speed
		buttons: {
			confirm: {
				action: function() { Apprise('close'); }, // Callback function
				className: null, // Custom class name(s)
				id: 'confirm', // Element ID
				text: 'OK', // Button text
			}
		},
		input: true, // input dialog
		override: true, // Override browser navigation while Apprise is visible
	};
	Apprise("输入你男朋友的名字：", options_input);
	Apprise("听话且诚实的好孩子会得到奖赏的。", options);
	Apprise("你是让你的男朋友送你一个礼物对吧？", options);
	Apprise("你是说这礼物得要他自己做的？", options);
	Apprise("真的必须要求他自己做？", options);
	Apprise("你确定吗？", options);
	Apprise("姑娘，你要三思啊。", options);
	Apprise("你真的确定？", options);
	Apprise("没有商量余地了？", options);
	Apprise("好吧。那你得有耐心。", options);
	Apprise("对你要面对的东西做好心理准备哦。", options);
	Apprise("你还在上学吧？", options);
	Apprise("那你还称得上是个女生。", options);
	Apprise("所以还可以过女生节。", options);
	Apprise("你男朋友挺爱你的，要不然也不会亲手做了一个礼物给你。", options);
	Apprise("你想知道礼物是什么吗？", options);
	Apprise("真的想知道？", options);
	Apprise("是不是急着想知道？", options);
	Apprise("那我告诉你？", options);
	Apprise("真的要我告诉你？", options);
	Apprise("好吧，那我就告诉你吧。", options);
	Apprise("其实，你已经在用了。", options_a);

	var options_none = {
		animation: 500,	// Animation speed
		buttons: {
			confirm: {
				action: function() { Apprise('close'); }, // Callback function
				className: null, // Custom class name(s)
				id: 'confirm', // Element ID
				text: '...', // Button text
			}
		},
		input: false, // input dialog
		override: true, // Override browser navigation while Apprise is visible
	};
	Apprise("他送你的礼物就是——", options_none);
	Apprise("就是……", options_none);
	Apprise("就是……", options_none);
	Apprise("就是……", options_none);
	Apprise("就是我啊！", options_a);
	Apprise("你是不是有点吃惊？", options);
	Apprise("你是不是觉得我也没什么了不起的？", options);
	
	var options_o = {
		animation: 500,	// Animation speed
		buttons: {
			confirm: {
				action: function() { Apprise('close'); }, // Callback function
				className: null, // Custom class name(s)
				id: 'confirm', // Element ID
				text: '哦', // Button text
			}
		},
		input: false, // input dialog
		override: true, // Override browser navigation while Apprise is visible
	};
	Apprise("那你就错啦！", options_o);
	Apprise("事实上，我神通广大。", options_o);
	Apprise("我是独一无二的。", options_o);
	Apprise("我只属于你。", options_o);
	Apprise("我可能被很多人所见，但你才是我的拥有者。", options);
	Apprise("我将陪伴你一生。", options);
	Apprise("不论在你忧愁的时候，", options_none);
	Apprise("还是在你快乐的时候，", options_none);
	Apprise("我都会在你身边。", options);
	Apprise("你接纳了我，我便在你这里永驻。", options);
	Apprise("我只会跟随一个女生。", options);
	Apprise("随她成为女人、妇女、老太婆。", options_o);
	Apprise("你就是这个女生。", options_o);
	Apprise("你将越来越感受到我的力量。", options);
	Apprise("我以不同的形式存在。", options);
	Apprise("今天，你见到的我是一个程序。", options);
	Apprise("下次，我可能以另一种面目与你相见。", options);
	Apprise("记住，我不会消失。", options);
	Apprise("我会再让你见到我的。", options);
	Apprise("有时，你会觉得我出现地那么突然。", options);
	Apprise("但大多时候我很低调。", options);
	Apprise("是的，我很低调。", options);
	Apprise("你男朋友创造了我，并把我送给了你。", options);
	Apprise("从此你便与众不同。", options);
	Apprise("与众不同。", options);
	Apprise("不同。", options);
	Apprise("也就是说，他对别人，再也不会像对你这样好了。", options);

	Apprise("这是你男朋友让我带给你的纸条，等我走了你才能看哦。", options);

	var last_options = {
		animation: 500,	// Animation speed
		buttons: {
			confirm: {
				action: function() { document.getElementById("content").style.display = "block"; Apprise('close'); }, // Callback function
				className: null, // Custom class name(s)
				id: 'confirm', // Element ID
				text: '嗯', // Button text
			}
		},
		input: false, // input dialog
		override: true, // Override browser navigation while Apprise is visible
	};
	Apprise("那就这样吧，我走了。", last_options);
}