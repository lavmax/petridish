UI.Environment = new Class({
	
	Extends: UI.Canvas,
	
	options: {
	   dotSize: 1
	},
	
	imageData: undefined,
	
	initialize: function(options)
	{
		this.parent(options);
        this.reset();
	},
	
    drawDot: function(x, y, color)
    {
        if (typeOf(color) === 'string')
            color = new Color(color);
        
        var data = this.imageData.data;
        
        for (var xi = 0; xi < this.options.dotSize; xi++)
        {
            for (var yi = 0; yi < this.options.dotSize; yi++)
            {
                var index = (x * this.options.dotSize + xi + (y * this.options.dotSize + yi) * this.element.width) * 4;
                
                data[index + 0] = color[0];
                data[index + 1] = color[1];
                data[index + 2] = color[2];
                data[index + 3] = 255;
            }
        }
        
        return this;
    },

    update: function() 
    {
        this.context.putImageData(this.imageData, 0, 0);
    },
    
    reset: function()
    {
        this.context.clearRect(0, 0, this.element.width, this.element.height);
        this.imageData = this.context.getImageData(0, 0, this.element.width, this.element.height);
    }
});