'use strict';

const mongoose = require('mongoose'); 
const _ = require('underscore');

const queryCollections = require('./lib/media-query');
const sendDiff = require('./lib/media-send');

module.exports = (args) => {

  //command line arguments
  let source_url = args.source;
  let dest_url = args.dest;
  let db_name = args.database;
  let days_ago = args.time_start_days;
  let limit = args.concurrency;

  //Mongodb connection options
  const options = {
    autoReconnect: true, //Reconnect if disconnected
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 20, // Maintain up to 20 socket connections
    socketTimeoutMS: Number.MAX_VALUE,
    connectTimeoutMS: Number.MAX_VALUE,
  };

  //Open connections to source and destination databases
  let sourceDB = mongoose.createConnection(`mongodb://${source_url}/${db_name}`, options);
  let destDB = mongoose.createConnection(`mongodb://${dest_url}/${db_name}`, options);

  sourceDB.once('open', (err) => { if(err) throw err; });
  destDB.once('open', (err) => { if(err) throw err; });

  let source_files = [];

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
    .catch(err => { console.log('Error in catch (media-sync-controller.js:51):', err); process.exit(1); });
};
