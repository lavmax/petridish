var UI = window.UI || {};

UI.ViewController = new Class({
	
	Implements: [Options, Events],
	
	options: {
	},
	
	view: undefined,
	
	initialize: function(options)
	{
		this.setOptions(options);
		this.view = new UI.View();
	},
	
	loadView: function(superview)
	{
	},
	
});

