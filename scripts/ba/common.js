// This module is common for node.js and the browser

// For browser
var common = {};

// For node.js
try {module} catch (e) {module = {}};
module.exports = module.exports || {};
try {
    var Petridish = require('./petridish.js');
    var Bacterium = require('./bacterium.js');
} catch (e) {};

common.newPetridish = module.exports.newPetridish = function(delegate)
{
    return new Petridish(delegate, {width: 100, height: 100, pointCapacity: 50, statsFrequency: 10});
}

common.seedPetridish = module.exports.seedPetridish = function(petridish)
{
    for (var x = 0; x < petridish.options.width; x++)
    {
        for (var y = 0; y < petridish.options.height; y++)
        {
    		petridish.addBacterium(x, y, new Bacterium());
        }
    }
}
