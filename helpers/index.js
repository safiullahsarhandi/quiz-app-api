const fs = require("fs");

exports.calculateDurationTimes = (start, end) => {
  //create date format
  var timeStart = new Date("01/01/2007 " + start).getHours();
  var timeEnd = new Date("01/01/2007 " + end).getHours();

  var hourDiff = timeEnd - timeStart;
  if (hourDiff < 0) {
    hourDiff = 24 + hourDiff;
  }
  return hourDiff;
};

exports.delete_file = async (path) => fs.unlink(path, () => {});


exports.mt_rand = (min, max) => { // eslint-disable-line camelcase
  //  discuss at: https://locutus.io/php/mt_rand/
  // original by: Onno Marsman (https://twitter.com/onnomarsman)
  // improved by: Brett Zamir (https://brett-zamir.me)
  //    input by: Kongo
  //   example 1: mt_rand(1, 1)
  //   returns 1: 1
  const argc = arguments.length
  if (argc === 0) {
    min = 0
    max = 2147483647
  } else if (argc === 1) {
    throw new Error('Warning: mt_rand() expects exactly 2 parameters, 1 given')
  } else {
    min = parseInt(min, 10)
    max = parseInt(max, 10)
  }
  return Math.floor(Math.random() * (max - min + 1)) + min
};
exports.shuffle = (string) => {
  var parts = string.toString().split('');
  for (var i = parts.length; i > 0;) {
      var random = parseInt(Math.random() * i);
      var temp = parts[--i];
      parts[i] = parts[random];
      parts[random] = temp;
  }
  return parts.join('');
};