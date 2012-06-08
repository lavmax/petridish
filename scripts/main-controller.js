var MainController = new Class({
	
	Extends: UI.ViewController,
	
	// Outlets
	environment: undefined,		// Environment view
	startButton: undefined,
	
	environmentLabel: undefined,
	
	// Monitoring panel outlets
	iterationsLabel: undefined,
	iterationTimeLabel: undefined,
	totalTimeLabel: undefined,

	populationLabel: undefined,
	minGenerationLabel: undefined,
	maxGenerationLabel: undefined,

	volumeLabel: undefined,
	membraneLabel: undefined,
	
	petridish: undefined,	// Model
	dotSize: 4,

	loadView: function(superview)
	{
        new Element('title', {text: 'Petri dish'}).inject(document.head);
        
		this.view = new UI.View({width: 900, height: 'auto', margin: 'auto'}).inject(superview);
		
		// Header
		var header = new UI.View({width: '100%', height: 80, bottom: 'auto', border: '1px solid #444', borderTop: 'none', borderRadius: '0px 0px 4px 4px'}).inject(this.view);
		new UI.Label('Petri dish', {width: 'auto', height: 'auto', top: 10, bottom: 'auto', fontSize: 48, fontWeight: 'bold'}).inject(header);
		
		var yStart = 120;
		
		this.startButton = new UI.Button('Start', 
		{
			position: 'absolute',
			top: yStart,
			left: 600,
			width: 300,
			height: 40,
			onClick: this.startButtonClick.bind(this)
		}).inject(this.view);
		
		// Environment
		var env = {width: 400, height: 400}
		this.environment = new UI.Environment({
			width: env.width,
			height: env.height,
			dotSize: 4,
			top: yStart,
			left: 0,
			border: '2px solid black'
		}).inject(this.view);
		
		this.environmentLabel = new UI.Label('', {width: env.width, height: 20, top: yStart + env.height + 5, left: 0, fontSize: 14, fontWeight: 'bold', fontFamily: 'Verdana'}).inject(this.view);
		
		// Monitoring panel
		var headerStyle = {left: 600, width: 300, height: 30, fontSize: 20, fontWeight: 'bold', fontFamily: 'Verdana'};
		var signStyle = {left: 600, width: 200, height: 20, fontSize: 14, fontWeight: 'bold', fontFamily: 'Verdana', color: '#777777', textAlign: 'right'};
		var statStyle = {left: 810, width: 100, height: 20, fontSize: 14, fontWeight: 'normal', fontFamily: 'Verdana', textAlign: 'left'};
		
		var start = yStart + 20;
		//new UI.Label('Iterations', Object.merge(headerStyle, {top: start += 40})).inject(this.view);
		new UI.Label('iterations:', Object.merge(signStyle, {top: start += 40})).inject(this.view);
		this.iterationsLabel = new UI.Label('0', Object.merge(statStyle, {top: start})).inject(this.view);
		//new UI.Label('last iteration time:', Object.merge(signStyle, {top: start += 20})).inject(this.view);
		//this.iterationTimeLabel = new UI.Label('0', Object.merge(statStyle, {top: start})).inject(this.view);
		//new UI.Label('total time:', Object.merge(signStyle, {top: start += 20})).inject(this.view);
		//this.totalTimeLabel = new UI.Label('0', Object.merge(statStyle, {top: start})).inject(this.view);

		new UI.Label('Population', Object.merge(headerStyle, {top: start += 40})).inject(this.view);
		new UI.Label('population:', Object.merge(signStyle, {top: start += 40})).inject(this.view);
		this.populationLabel = new UI.Label('0', Object.merge(statStyle, {top: start})).inject(this.view);
		new UI.Label('min generation:', Object.merge(signStyle, {top: start += 20})).inject(this.view);
		this.minGenerationLabel = new UI.Label('0', Object.merge(statStyle, {top: start})).inject(this.view);
		new UI.Label('max generation:', Object.merge(signStyle, {top: start += 20})).inject(this.view);
		this.maxGenerationLabel = new UI.Label('0', Object.merge(statStyle, {top: start})).inject(this.view);

		new UI.Label('Fenotype', Object.merge(headerStyle, {top: start += 40})).inject(this.view);
		new UI.Label('volume to divide:', Object.merge(signStyle, {top: start += 40})).inject(this.view);
		this.volumeLabel = new UI.Label('0', Object.merge(statStyle, {top: start})).inject(this.view);
		new UI.Label('membrane thickness:', Object.merge(signStyle, {top: start += 20})).inject(this.view);
		this.membraneLabel = new UI.Label('0', Object.merge(statStyle, {top: start})).inject(this.view);

        // Footer
        var footer = new UI.View({width: 'auto', height: 40, top: yStart + env.height + 100, borderTop: '1px solid #444', fontSize: 12}).inject(this.view);
        new UI.View({top: 10, left: 7, width: 'auto', height: 'auto', bottom: 'auto'}).inject(footer)
            .element.set('html', '<a href="https://github.com/lavmax/petridish" target="_blank">Fork me on github</a>');
        new UI.View({top: 10, left: 'auto', right: 7, width: 'auto', height: 'auto', bottom: 'auto'}).inject(footer)
            .element.set('html', '<a href="http://en.wikipedia.org/wiki/MIT_License#License_terms" target="_blank">Licence MIT</a>');
        
/*         footer.set('html', '<div id="footer-left-panel"><span class="footer-text">Copyright © 2011 by Max Lavrov (<a href="mailto:lavmax@gmail.com">lavmax@gmail.com</a>)</span></div><div id="footer-right-panel"><a href="http://en.wikipedia.org/wiki/MIT_License#License_terms" target="_blank" class="footer-text">Licence MIT</a></div>') */
        
		// Catch Alt key pressed for the document
		document.addEvents({
			keydown: function(event)
			{
				if (event.key === 'alt' && this.petridish.iteration && !this.petridish.interval)
					this.startButton.setText('Restart');
			}.bind(this),
			keyup: function(event)
			{
				if (event.key === 'alt' && this.petridish.iteration && !this.petridish.interval)
					this.startButton.setText('Resume');
			}.bind(this)
		});

		// Finally create the model
		this.petridish = common.newPetridish(this);
		//this.petridish.restore();
		//if (this.petridish.iteration) this.startButton.setText('Resume');
	},
	
	// Interface event handlers
	startButtonClick: function(event)
	{
		if (this.petridish.interval) // runs
		{
			this.petridish.pause();
			this.startButton.setText('Resume');
		}
		else // run or resume
		{
            if (!this.petridish.iteration || event.alt)    // first start or restart
            {
                this.petridish.reset();
                common.seedPetridish(this.petridish);
            }
            
			this.petridish.run();
			this.startButton.setText('Pause');
		}
	},
	
	// Model delegate protocol
    petridishIterationFinished: function(stats)
    {
    	this.iterationsLabel.setText(stats.iteration);
    	//this.iterationTimeLabel.setText(stats.duration + 's');
    	//this.totalTimeLabel.setText(new Date().timeDiff(new Date().getTime() - stats.totalDuration, ' '));
    	
    	this.populationLabel.setText(stats.population);
    	this.minGenerationLabel.setText(stats.generation.min);
    	this.maxGenerationLabel.setText(stats.generation.max);

		this.volumeLabel.setText((stats.g.volume.sum / stats.population).round(3));
		this.membraneLabel.setText((stats.g.membrane.sum / stats.population).round(3));

    	this.environment.update();
    },
    
	petridishPointUpdated: function(x, y, stats)
    {
        //this.environmentLabel.setText('Population');
    	//var colorIndex = (1 - stats.volume / this.petridish.options.pointCapacity) * 255;
        //var color = [colorIndex, 255, colorIndex];
        
        this.environmentLabel.setText('Average volume to divide');
    	var colorIndex = stats.g.volume.sum / stats.population / 10 * 128;
        var color = [colorIndex, 255, colorIndex];

        this.environment.drawDot(x, y, color);
    },
    
    petridishReset: function()
    {
        this.environment.reset();
    }
});
