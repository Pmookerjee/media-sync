var mongo = require('mongodb');
var Grid = require('gridfs-stream');
 
const parseArgs = require('./lib/cl_args');

//get cl args
let args = parseArgs.run();

let host = args.source;
let dest = args.dest;
let source_db = args.collection;

// create or use an existing mongodb-native db instance 
var db = new mongo.Db(source_db, new mongo.Server(host, 27017));
var gfs = Grid(db, mongo);
 
// streaming from gridfs 
var readstream = gfs.createReadStream({
  _id: '5a271a8e105573004d8d9818',
});
 
//error handling, e.g. file does not exist 
readstream.on('error', function (err) {
  console.log('An error occurred!', err);
  throw err;
});
 let arr = [];
readstream.pipe(arr);
console.log(arr)