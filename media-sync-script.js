'use strict';

const fs = require('fs');
const _ = require('underscore');

// const eachOfLimit = require('./internal/eachOfLimit');
// const withoutIndex = require('./internal/withoutIndex');
// const wrapAsync = require('./internal/wrapAsync');
const queryCollections = require('./lib/media-query');
const copyData = require('./lib/media-copy');

//get CL args
let args = require('./lib/cl_args')();

let source_url = args.source;
let dest_url = args.dest;
let db_name = args.database;
let days_ago = args.time_start_days;

let source_files = [];
let dest_files = [];
let coll = [];

queryCollections(source_url, db_name, days_ago)
  .then(data => {
    source_files = data;
    return queryCollections(dest_url, db_name, days_ago);
  })
  .then((data) => {    
    let dest_files = data;
    console.log('source_files is ', source_files.length);    
    console.log('dest_files is ', dest_files.length);
    // console.log('source_files[0] is ', source_files[0]);
    // let coll = [];
    // coll.push(source_files[0]);
    let coll = _.filter(source_files, (file) => { return !_.findWhere(dest_files, {filename: file.filename}); });    
    console.log('coll length is ', coll.length);
    // fs.writeFile('./files', coll, (err) => { 
    //   if(err) console.log('err is ', err); });
    return coll;
  })
  .then(coll => {
    setTimeout( ()=> {
      console.log('DONE')
    }, 5000);
    copyData(dest_url, db_name);
  })
  .catch(err => { console.log('Error is ', err); process.exit(1); });

  // create or use an existing mongodb-native db instance
// let mongo = require('mongodb');
// let Grid = require('gridfs-stream');
  
// let db = new mongo.Db(db_name, new mongo.Server('192.168.2.11', 27017));
// let gfs = Grid(db, mongo);

// db.open(function (err) {
//   if (err) console.log('Error opening database: ', err);
//   gfs = Grid(db, mongo);
// });
// streaming to gridfs
// let writestream = gfs.createWriteStream({filename: 'my_file.txt'});
// fs.createReadStream(coll).pipe(writestream);

// // streaming from gridfs
// var readstream = gfs.createReadStream({});

// //error handling, e.g. file does not exist
// readstream.on('error', function (err) {
//   console.log('An error occurred!', err);
//   throw err;
// });

// readstream.pipe();

// db.close();



  // export default function eachLimit(coll, limit, iteratee, callback) {
//   eachOfLimit(limit)(coll, withoutIndex(wrapAsync(iteratee)), callback);
// }
