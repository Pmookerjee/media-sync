'use strict';

const Mongo = require('mongodb').MongoClient;
const Grid = require('gridfs-stream');
const fs = require('fs');
// const eachOfLimit = require('./internal/eachOfLimit');
// const withoutIndex = require('./internal/withoutIndex');
// const wrapAsync = require('./internal/wrapAsync');
// const difference = require('underscore');

const parseArgs = require('./lib/cl_args');

//get cl args
let args = parseArgs.run();

let host = args.source;
let dest = args.dest;
let source_db = args.collection;

let source_files =[];
let dest_files = [];

//connect to the source db and load file ids into an array
let getFiles = ((host, current_db, arr) => {

  Mongo.connect(`mongodb://${host}/${current_db}`, function(err, db) {
    
    err ? console.dir(err) : console.log(`Connected to ${host}/${current_db}`);
    
    let dbo = db.db(current_db);
  
    let queryCollection = (col, fDone) => {
      dbo.collection(col).distinct('_id', {}, {}, function (err, result) {
        if (err) {
          console.log(err);
        } else if (result.length > 0) {
          arr.push(result);
          fDone();
        }
      });
    };
      
    queryCollection('fs.files', function(){
      console.log('Files: ', arr);
    });
  
    db.close();
  });
});

// getFiles(host, source_db, source_files);
getFiles(dest, source_db, dest_files);

//connect to the dest db and load file ids into an array


//get diff between source and dest collections using underscore
//load into coll

//coll is the diff
//limit = concurrency 
//iteratee = function to get media from x days back
// export default function eachLimit(coll, limit, iteratee, callback) {
//   eachOfLimit(limit)(coll, withoutIndex(wrapAsync(iteratee)), callback);
// }

// db = connect()