'use strict';

const Mongo = require('mongodb').MongoClient;
const Grid = require('gridfs-stream');
const fs = require('fs');
const _ = require('underscore');

// const eachOfLimit = require('./internal/eachOfLimit');
// const withoutIndex = require('./internal/withoutIndex');
// const wrapAsync = require('./internal/wrapAsync');

const parseArgs = require('./lib/cl_args');

//get cl args
let args = parseArgs.run();

let source_url = args.source;
let dest_url = args.dest;
let db_name = args.database;
let days_ago = args.time_start_days;

let source_files = [];
let dest_files = [];

const collection = 'fs.files';

//connect to the source db and load file ids into an array
let getMongoMediaFiles = (url, db_name, arr, fDone) => {

  Mongo.connect(`mongodb://${url}/${db_name}`, ((err, db) => {
    
    err ? console.dir(err) : console.log(`Connected to ${url}/${db_name}`);  
    let dbo = db.db(db_name);
  
    let queryFilesFromXDaysAgo = (col, days_ago, fDone) => {

      dbo.collection(col).find({
        uploadDate : { 
          $lte: new Date(),
          $gte: new Date(new Date().setDate(new Date().getDate() - days_ago))},
      })
      .toArray((err, files) => {
        if (err) console.log(err);
        else if (files.length > 0) {
          arr.push(files);
          fDone();
        }
      }); 
    };

    queryFilesFromXDaysAgo(collection, days_ago, () => {
      fDone();
    });
  
    db.close();

  }));

};

let queryCollections = (url, db) => {

  return new Promise((resolve) => {

    let arr = [];

    //connect to source db and load file from x days ago
    getMongoMediaFiles(url, db, arr, () => {
      arr = arr[0];
      resolve(arr);     
    });
  });
};

queryCollections(source_url, db_name)
  .then(data => {
    source_files = data;
    return queryCollections(dest_url, db_name);
  })
  .then((data) => {    
    dest_files = data;
    console.log('source_files is ', source_files.length);    
    console.log('dest_files is ', dest_files.length);
    let coll = _.filter(source_files, (file) => { return !_.findWhere(dest_files, {filename: file.filename}); });    
    console.log('coll length is ', coll.length);
  })
  .catch(err => { console.log(err); process.exit(1); });

  
//iteratee = function to get media from x days back
// export default function eachLimit(coll, limit, iteratee, callback) {
//   eachOfLimit(limit)(coll, withoutIndex(wrapAsync(iteratee)), callback);
// }
