var UI = window.UI || {};

UI.View = new Class({

    Implements: [Options, Events],
    
    options: {
    	position: 'absolute',
    	width: '0px',
    	height: '0px',
    	top: '0px',
    	right: '0px',
    	bottom:'0px',
    	left: '0px'
    },

    initialize: function(options)
    {
        this.setOptions(options);
		
		this.element = new Element('div');
		this.element.setStyles(this.options);
    },
    
    // Some useful Mootools Element's functions
    inject:	function(elem) {this.element.inject(elem); return this},
    grab:   function(elem) {this.element.grab(elem); return this},
    
    toElement: function()
    {
    	return this.element;
    }
});

UI.Label = new Class({
	
	Extends: UI.View,
	
	options: {
		textAlign: 'center'
	},
	
	initialize: function(text, options)
	{
		this.parent(options);
		this.element.set('text', text);
	},
	
	setText: function(text)
	{
		this.element.set('text', text);
	},
	
	getText: function()
	{
		return this.element.get('text');
	}
});

// Set UI.Button css styles
(function()
{
	var style = new Element('style', {type: 'text/css'});
	style.set('text', 'button.ui-button:hover {box-shadow: #959595 0px 0px 10px}\
					   button.ui-button:active {border-color: #959595 !important; color: #959595 !important}');
	style.inject(document.head);
})();

UI.Button = new Class({
	
	Extends: UI.Label,
	
	options: {
		fontSize: '0.9em',
		fontWeight: 'bold',
		padding: '0.3em 0.5em',
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: '#454545',
		borderRadius: '4px',
		background: '#e5e5e5 -webkit-gradient(linear, 50% 0%, 50% 100%, from(whiteSmoke), to(#e5e5e5))',
	},
	
	initialize: function(text, options) 
	{
		this.setOptions(options);
		
		this.element = new Element('button.ui-button', {role: 'button'});
		this.element.setStyles(this.options);
		this.element.set('text', text);
		
		var self = this;		
		this.element.addEvent('click', function(event){
			self.fireEvent('click', event);
		});
	}
});


UI.Canvas = new Class({
	
	Extends: UI.View,
	
	options: {},
	
	context: undefined,

	initialize: function(options)
	{
		this.parent(options);
		var canvas = new Element('canvas')
		canvas.setAttribute('width', this.options.width);
		canvas.setAttribute('height', this.options.height);
		canvas.setStyles(this.options);
		this.element = canvas;
		
		this.context = canvas.getContext('2d');
	}
});