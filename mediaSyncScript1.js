'use strict';

const mongo = require('mongodb');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

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

  let Schema = mongoose.Schema;
  let conn = mongoose.createConnection();

    let queryCollection = (col, fDone) => {      
     
      let db = new mongo.Db(current_db, new mongo.Server(host, 27017));  
      
      let gfs;
      
      conn.once('open', function () {
        console.log('Connection open');
        gfs = Grid(conn.db, mongoose.mongo);
      });
      // var readstream = gfs.createReadStream({
      //   uploadDate : { $lte: new Date(), $gte: new Date(new Date().setDate(new Date().getDate() -7))}
      // });
      // readstream.pipe(arr);   
      
      gfs.files.find({ uploadDate : { $lte: new Date(), $gte: new Date(new Date().setDate(new Date().getDate() -7))}
      }).toArray(function (err, result) {
        if (err) {
          throw (err);
        }
        console.log(result);
      });
  
    };

    queryCollection('fs.files', function(){
      console.log('Files: ', arr);
    });

    // gfs.files.find({
    //   uploadDate : { $lte: new Date(), $gte: new Date(new Date().setDate(new Date().getDate() -7))}
    // }).toArray(function (err, result) {
    //   if (err) {
    //     throw (err);
    //   }
    //   console.log(result);
    // });



});

// getFiles(host, source_db, source_files);
getFiles(dest, source_db, dest_files);
