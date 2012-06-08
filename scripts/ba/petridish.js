/*
    Environment model delegate protocol. All functions implementation is optional. 
    
    petridishIterationFinished(stats) - stats is abitary object with iteration statistics
    petridishPointUpdated(x, y, volumeRatio)
    petridishReset()
*/

try {module} catch (e) {module = {}};

var Petridish = module.exports = new Class({

    Implements: [Options],
    
    options: {
        width: 100,
        height: 100,
        pointCapacity: 50,
        statsFrequency: 10
    },
    
    delegate: undefined,
    interval: undefined, // if !undefined evolution runs
    duration: undefined,
    
    database: undefined,
    lastSaveTime: 0,
    autoSaveInterval: 60000,
    
    iteration: 0,
    points: [],
    
    initialize: function(delegate, options)
    {
        this.setOptions(options);
        this.delegate = delegate;
        
        // Create and initialize database storage
        //this.database = openDatabase('population', '1.0', 'Bacteria population stamps', 10 * 1024 * 1024);
        //this.dbTransaction('CREATE TABLE IF NOT EXISTS points (x, y, i, bacterium)');
    },
    
    reset: function()
    {
        this.dbTransaction('DELETE FROM points');
        this.duration = 0;
        this.iteration = 0;
        this.points = [];
        
        for (var x = 0; x < this.options.width; x++)
        {
            this.points[x] = [];
            for (var y = 0; y < this.options.height; y++)
            {
                this.points[x][y] = [];
            }
        }

        if (this.delegate && this.delegate.petridishReset)
            this.delegate.petridishReset();
    },
    
    run: function()
    {
        this.interval = this.evolve.periodical(5, this);
    },
    
    pause: function()
    {
        clearInterval(this.interval);
        this.interval = undefined;
    },
    
    addBacterium: function(x, y, bacterium)
    {
        bacterium.iteration = this.iteration;
        this.points[x][y].push(bacterium);
    },
    
    selection: function(point)
    {
        if (point.length === 0) return;
        
        while (point.volume > this.options.pointCapacity) 
        {
            var bacterium = point.shift();
            point.volume -= bacterium.volume;
        }
    },
    
    evolve: function()
    {
        // Iteration begins
        this.iteration += 1;
        
        // Evolution
        for (var x = 0; x < this.options.width; x++)
        {
            for (var y = 0; y < this.options.height; y++)
            {
                var point = this.points[x][y];
                for (var i = 0; i < point.length; i++)
                {
                    var bacterium = point[i];
                    
                    // Skip bacteria created in this evolution iteration
                    if (bacterium.iteration == this.iteration) continue;

                    var offspring = bacterium.eat();
                    if (offspring)
                    {
                        // Place new bacterium
                        var newX = x, newY = y;
                        if      (offspring.direction === 1) {newX = x - 1; newY = y - 1;}
                        else if (offspring.direction === 2) {newX = x    ; newY = y - 1;}
                        else if (offspring.direction === 3) {newX = x + 1; newY = y - 1;}
                        else if (offspring.direction === 4) {newX = x - 1; newY = y    ;}
                        else if (offspring.direction === 5) {newX = x    ; newY = y    ;}
                        else if (offspring.direction === 6) {newX = x + 1; newY = y    ;}
                        else if (offspring.direction === 7) {newX = x - 1; newY = y + 1;}
                        else if (offspring.direction === 8) {newX = x    ; newY = y + 1;}
                        else if (offspring.direction === 9) {newX = x + 1; newY = y + 1;}
                        
                        // Check bounds
                        if (newX < 0) newX = 0; else if (newX >= this.options.width)  newX = this.options.width - 1;
                        if (newY < 0) newY = 0; else if (newY >= this.options.height) newY = this.options.height - 1;

                        this.addBacterium(newX, newY, offspring);
                    }
                }
            }
        }
        
        // Selection
        for (var x = 0; x < this.options.width; x++)
        {
            for (var y = 0; y < this.options.height; y++)
            {
                var point = this.points[x][y];
                point.volume = 0;
                for (var i = 0; i < point.length; i++)
                    point.volume += point[i].volume;

                this.selection(point);
            }
        }
        
        // Gather statistics
        if (this.iteration % this.options.statsFrequency === 0)
        {
            var pointStatsTemplate = {
                population: 0,
                volume: 0,
                generation: {
                    min: 1000000000,
                    max: 0,
                    sum: 0
                },
                g: {
                    volume: {
                        min: 1000000000,
                        max: 0,
                        sum: 0
                    },
                    membrane: {
                        min: 1000000000,
                        max: 0,
                        sum: 0
                    }
                }
            }
            
            var stats = Object.clone(pointStatsTemplate);
            stats.iteration = this.iteration;
            stats.points = 0;
            
            for (var x = 0; x < this.options.width; x++)
            {
                for (var y = 0; y < this.options.height; y++)
                {
                    var point = this.points[x][y];
                    
                    var pointStats = Object.clone(pointStatsTemplate);
                    pointStats.population = point.length;
                    pointStats.volume = point.volume;
                    
                    for (var i = 0; i < point.length; i++)
                    {
                        var bacterium = point[i];
                        
                        pointStats.generation.min = Math.min(pointStats.generation.min, bacterium.generation);
                        pointStats.generation.max = Math.max(pointStats.generation.max, bacterium.generation);
                        pointStats.generation.sum += bacterium.generation;
    
                        pointStats.g.volume.min = Math.min(pointStats.g.volume.min, bacterium.genome.volume);
                        pointStats.g.volume.max = Math.max(pointStats.g.volume.max, bacterium.genome.volume);
                        pointStats.g.volume.sum += bacterium.genome.volume;
    
                        pointStats.g.membrane.min = Math.min(pointStats.g.membrane.min, bacterium.genome.membrane);
                        pointStats.g.membrane.max = Math.max(pointStats.g.membrane.max, bacterium.genome.membrane);
                        pointStats.g.membrane.sum += bacterium.genome.membrane;
                    }
    
    
                    if (point.length) 
                    {
                        stats.points += 1;
                        stats.population += pointStats.population;
                        stats.value += pointStats.value;
    
                        stats.generation.min = Math.min(stats.generation.min, pointStats.generation.min);
                        stats.generation.max = Math.max(stats.generation.max, pointStats.generation.max);
                        stats.generation.sum += pointStats.generation.sum;
    
                        stats.g.volume.min = Math.min(stats.g.volume.min, pointStats.g.volume.min);
                        stats.g.volume.max = Math.max(stats.g.volume.max, pointStats.g.volume.max);
                        stats.g.volume.sum += pointStats.g.volume.sum;
    
                        stats.g.membrane.min = Math.min(stats.g.membrane.min, pointStats.g.membrane.min);
                        stats.g.membrane.max = Math.max(stats.g.membrane.max, pointStats.g.membrane.max);
                        stats.g.membrane.sum += pointStats.g.membrane.sum;
                    }
                    
                    if (this.delegate && this.delegate.petridishPointUpdated)
                        this.delegate.petridishPointUpdated(x, y, pointStats);
                }
            }
            
            if (this.database && this.autoSaveInterval && currentTime - this.lastSaveTime > this.autoSaveInterval)
                this.save();
            
            if (this.delegate && this.delegate.petridishIterationFinished)
                this.delegate.petridishIterationFinished(stats);
        }
    },
    
    dbTransaction: function(text, params, callback)
    {
        if (!this.database) return;
        this.database.transaction(function(transaction){transaction.executeSql(text, params, callback)});
    },
    
    save: function()
    {
        if (!this.database) return;

        // Save population to the database
        this.dbTransaction('DELETE FROM points', [], function(transaction, result)
        {
            for (var x = 0; x < this.options.width; x++)
            {
                for (var y = 0; y < this.options.height; y++)
                {
                    var point = this.points[x][y];
                    for (var i = 0; i < point.length; i++)
                    {
                        transaction.executeSql('INSERT INTO points (x, y, i, bacterium) VALUES (?, ?, ?, ?)', [x, y, i, JSON.encode(point[i].archive())]);
                    }
                }
            }
        }.bind(this));
        
        // Save general data in local KV storage
        var json = {
            options: this.options,
            iteration: this.iteration,
            duration: this.duration
        };
        localStorage.population = JSON.encode(json);

        this.lastSaveTime = new Date().getTime();
    },
    
    restore: function()
    {
        // Check if needs to restore
        var storageData = localStorage.population;
        if (!storageData) return;
        
        this.reset();
        
        // Restore general data from KV storage
        var json = JSON.decode(storageData);
        this.setOptions(json.options);
        this.iteration = json.iteration ? json.iteration : 0;
        this.duration = json.duration ? json.duration : 0;
        
        // Restore population from database
        this.dbTransaction('SELECT * FROM points', [], function(transaction, result)
        {
            for (var rowIndex = 0; rowIndex < result.rows.length; rowIndex++)
            {
                var row = result.rows.item(rowIndex)
                this.points[row.x][row.y][row.i] = new Bacterium().unarchive(JSON.decode(row.bacterium))
            }
            this.evolve(true);
        }.bind(this));
    }
});
