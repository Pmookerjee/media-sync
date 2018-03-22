'use strict';

const fs = require('fs');
const _ = require('underscore');
const libAsync = require('async');

const queryCollections = require('./lib/media-query');
const copyData = require('./lib/media-copy');

//get CL args
let args = require('./lib/cl_args')();

let source_url = args.source;
let dest_url = args.dest;
let db_name = args.database;
let days_ago = args.time_start_days;
let limit = args.concurrency;

let source_files = [];
let dest_files = [];

queryCollections(source_url, db_name, days_ago)
  .then(data => {
    source_files = data;
    return queryCollections(dest_url, db_name, days_ago);
  })
  .then(data => {    
    let dest_files = data;
    console.log('source_files is ', source_files.length);    
    console.log('dest_files is ', dest_files.length);
    let coll = _.filter(source_files, (file) => { return !_.findWhere(dest_files, {filename: file.filename}); });    
    console.log('coll length is ', coll.length);
    return coll;
  })
  .then(coll => {
    let test = [
      {
        _id : "5ab3d5b2512d2368f350d5c7",
        filename : "bkjkjlkj",
        contentType : "binary/octet-stream",
        length : 276,
        chunkSize : 261120,
        uploadDate : "2017-12-06T01:49:06.969Z",
        aliases : null,
        metadata : null,
        md5 : "43594686d549294b1e4fbbb0f1b92844"
    }
    ]

    libAsync.eachLimit(test, limit, ((file, cb) => {
      copyData(file, source_url, dest_url, db_name, cb);
      }), (err) => {
        if(err) {
          console.log("Error: ", err);
          process.exit(1);
        }
    })
  })
  .catch(err => { console.log('Error in catch (media-sync-script.js:45):', err); process.exit(1); });

  
