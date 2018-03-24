'use strict';

const libAsync = require('async');
const copyData = require('./media-copy');
const mongoose = require('mongoose');

module.exports = (coll, limit, sourceDB, destDB) => {

  let count = 0;
  let total = coll.length;
 
  libAsync.eachLimit(coll, limit, ((file, cb) => {

    ++count;

    copyData(file, count, total, sourceDB, destDB, cb);
    }), (err) => {
      if(err) { console.log("Error: ", err); }
      console.log(`\n${coll.length} files were copied to destination`);
      mongoose.disconnect();
  })
}

