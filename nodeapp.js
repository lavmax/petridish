require('./libs/mootools-server.js');

var Petridish = require('./scripts/ba/petridish.js');
var Bacterium = require('./scripts/ba/bacterium.js');
var common = require('./scripts/ba/common.js');

var petridish = common.newPetridish(this);
petridish.reset();
common.seedPetridish(petridish);
petridish.run();

module.exports.petridishIterationFinished = function(stats)
{
    console.log(new Date(), 'i:', stats.iteration, 'pts:', stats.points, 'pop:', stats.population, 'gen:', stats.generation.min + '/' + stats.generation.max, 'g-vol:', (stats.g.volume.sum / stats.population).round(2), 'g-mem:', (stats.g.membrane.sum / stats.population).round(2));
}