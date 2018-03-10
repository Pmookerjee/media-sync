'use strict';

const mongo = require('mongodb').MongoClient;
const Grid = require('gridfs-stream');
const fs = require('fs');

const parseArgs = require('./lib/utils');

let args = parseArgs.run();

console.log(args);


// db = connect()