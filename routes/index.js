var express = require('express');
var router = express.Router();
var starwars = require('../helpers/starwars');
var numeral = require('numeral');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET characters listing. */
router.get('/characters', function (req, res, next) {
  var page = 1;
  var result = [];
  var sort = req.query.sort;
  console.log(sort);

  var getCharacters50 = function() {
    starwars.getCharacters(page)
      .then(function (characters) {
        page++;
        result = result.concat(characters);
        if (page == 6) {
          console.log(result.length);
          if (sort) {
            if (sort == 'mass' || sort == 'height') {
              result.forEach(function (char) {
                char[sort] = numeral(char[sort]).value();
              });
              result = result.sort(function (char1, char2) {
                return char1[sort] - char2[sort];
            });
            } else if (sort == 'name') {
              result = result.sort(function (char1, char2) {
                var nameA = char1[sort].toUpperCase(); // ignore upper and lowercase
                var nameB = char2[sort].toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                return 0;
              });
            }
          }

          res.send(result);
        } else {
          getCharacters50();
        }
      }).catch(function (err) {
        res.send('Error in calling StarWars api');
      });
  };

  getCharacters50();
});

router.get('/character/:name', function (req, res, next) {
  var name = req.params.name;
  console.log(name);
  starwars.findCharByName(name)
    .then(function (character) {
      if (character) {
        res.render('character', character);
      }
      else {
        res.send('No character with name "' + name + '"');
      }
    }).catch(function (err) {
      res.send('Error in calling StarWars api');
    });
});

router.get('/planetresidents', function (req, res, next) {
  starwars.getPlanets()
    .then(function (planets) {
      var result = {};
      var promise = Promise.resolve();
      planets.forEach(function (planet) {
        console.log(planet.name);
        planet.residents.forEach(function (url) {
          promise = promise.then(function (resident) {
            if (resident) {
              result[planet.name] = result[planet.name] || [];
              result[planet.name].push(resident.name);
            }
            console.log(url);
            return starwars.getResource(url);
          });
        });
      });

      promise.then(function () {
        res.send(result);
      });
    }).catch(function (err) {
      res.send('Error in calling StarWars api');
    });
});

module.exports = router;
