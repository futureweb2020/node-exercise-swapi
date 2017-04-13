var request = require('request');
var Promise = require('promise');

const api_url = 'http://swapi.co/api';

var getResource = function (url) {
  return new Promise(function (resolve, reject) {
    request.get(url, function (err, resp, body) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        var data = JSON.parse(body);
        resolve(data);
      }
    });
  });
}

var findCharByName = function (name) {
  return new Promise(function (resolve, reject) {
    request.get(api_url + '/people/?search=' + name, function (err, resp, body) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        var data = JSON.parse(body);
        if (data.count == 0)
          resolve(null);
        else
          resolve(data.results[0]);
      }
    });
  });
};

var getCharacters = function (page) {
  return new Promise(function (resolve, reject) {
    request.get(api_url + '/people/?page=' + page, function (err, resp, body) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        var data = JSON.parse(body);
        resolve(data.results);
      }
    });
  });
};

var getPlanets = function() {
  return new Promise(function (resolve, reject) {
    request.get(api_url + '/planets', function (err, resp, body) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        var data = JSON.parse(body);
        resolve(data.results);
      }
    });
  });
}

module.exports.findCharByName = findCharByName;
module.exports.getCharacters = getCharacters;
module.exports.getPlanets = getPlanets;
module.exports.getResource = getResource;
