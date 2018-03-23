'use strict';

const mongoose = require('mongoose'); 
const _ = require('underscore');

const queryCollections = require('./lib/media-query');
const sendDiff = require('./lib/media-send');

//get CL args
let args = require('./lib/cl_args')();

let source_url = args.source;
let dest_url = args.dest;
let db_name = args.database;
let days_ago = args.time_start_days;
let limit = args.concurrency;

let source_files = [];
let dest_files = [];

let sourceDB;
let destDB;

(() => {
 
  sourceDB = mongoose.createConnection(`mongodb://${source_url}/${db_name}`);
  destDB = mongoose.createConnection(`mongodb://${dest_url}/${db_name}`);

  sourceDB.once('open', (err) => {  
    if(err) throw err;
    console.log(`Connection to source database OPEN`);
  })

  destDB.once('open', (err) => {
    if(err) throw err;
    console.log(`Connection to destination database OPEN`);
  })

})()

queryCollections(source_url, db_name, days_ago)
  .then(data => {
    source_files = data;
    return queryCollections(dest_url, db_name, days_ago);
  })
  .then(data => {    
    let dest_files = data;
    let coll = _.filter(source_files, (file) => { return !_.findWhere(dest_files, {filename: file.filename}); });    
    console.log(`${coll.length} files to upload`);
    return coll;
  })
  .then(coll => {
    sendDiff(coll, limit, sourceDB, destDB);
  })
  .catch(err => { console.log('Error in catch (media-sync-script.js:45):', err); process.exit(1); });

  
