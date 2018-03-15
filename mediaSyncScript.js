const libAsync = require('async');
const libFS = require('fs');
const libMongoose = require('mongoose');
const libGridFS = require('gridfs-stream');
libGridFS.mongo = libMongoose.mongo;
 
let parseArgs = require('./lib/cl_args');

//get cl args
let args = parseArgs.run();

let host = args.source;
let dest = args.dest;
let source_db = args.collection;

let _GridMediaFS = false;
let arr = [];

// create or use an existing mongodb-native db instance 
let newDBMediaConnection = libMongoose.createConnection(`mongodb://${host}/${source_db}`);

newDBMediaConnection.on('open', function ()
{
  _GridMediaFS = libGridFS(newDBMediaConnection.db);
  console.log('Connection open')
});
_GridMediaFS.find({_id: '5a271a8e105573004d8d9818'})
  .toArray(function (err, result) {
    if (err) console.log(err);
    else if (result.length > 0) {
      arr.push(result);
      console.log(arr);
    }
  }); 

newDBMediaConnection.on('error', function (err)
{
  console.error(`MongoDB connection error: ${err}`);
});

newDBMediaConnection.on('close', function()
{
  console.log(`MongoDB connection closed!`);
});




 
