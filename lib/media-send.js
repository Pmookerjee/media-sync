'use strict';
const libAsync = require('async');
const copyData = require('./media-copy');
const mongoose = require('mongoose');

module.exports = (coll, limit, sourceDB, destDB) => {

  let count = 0;

  libAsync.eachLimit(coll, limit, ((file, cb) => {

    ++count;
    copyData(file, count, sourceDB, destDB, cb);
    }), (err) => {
      if(err) {
        console.log("Error: ", err);
        process.exit(1);
      }
      console.log(`${coll.length} files were copied to ${destDB}`);
      mongoose.disconnect();
  })
}

