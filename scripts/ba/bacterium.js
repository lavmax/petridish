try {module} catch (e) {module = {}};

var Bacterium = module.exports = new Class({

    Implements: [Options],
    
    options: {
        volume: 10,     // volume to divide
        membrane: 1     // thickness
    },
    
    genome: undefined, // ???
    generation: 0, // ???
    volume: 0,
    direction: 0,
    mutationProbability: 1, // 0 to 1
        
    initialize: function(genome)
    {
        this.setOptions(genome);

        this.generation = 1;
        this.genome = this.options;
        this.volume = this.genome.volume / 2;
    },
    
    eat: function()
    {
        var pi = Math.PI;
        
        var radius = ((3 * this.volume) / (4 * pi)) ^ (1/3);
        var surface = 4 * pi * radius * radius;
        var eatenVolume = 0.1 * surface * (1 / this.genome.membrane);
        this.volume += eatenVolume;
        
        // Check if needs to divide
        if (this.volume < this.genome.volume) return undefined;
        
        this.volume = this.genome.volume / 2;
        
        var offspring = new Bacterium(this.genome);
        offspring.generation = this.generation + 1;
        offspring.direction = Number.random(1, 9);

        if (this.mutationProbability && Number.random(1, 1 / this.mutationProbability) === 1)
        {
            offspring.genome.volume *= 1 + 0.01 * (Number.random(0, 1) ? 1 : -1);
            offspring.genome.membrane *= 1 + 0.01 * (Number.random(0, 1) ? 1 : -1);
        }

        return offspring;
    },
    
    archive: function()
    {
        return {generation: this.generation, volume: this.volume, genome: {volume: this.genome.volume, membrane: this.genome.membrane}};
    },
    
    unarchive: function(json)
    {
        this.generation = json.generation;
        this.volume = json.volume;
        this.genome = json.genome;
        
        return this;
    }
});