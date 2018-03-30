'use strict';

const Mongo = require('mongodb').MongoClient; 
const collection = 'fs.files';   

//connect to the source db and load media objects into array
let getMongoMediaFiles = (url, db_name, days, arr, fDone) => {
  
  Mongo.connect(`mongodb://${url}/${db_name}`, ((err, db) => {
    
    err ? console.log(err) : console.log(`Connected to ${url}/${db_name}`);  
    let dbo = db.db(db_name);
  
    let queryFilesFromXDaysAgo = (col, days_ago, fDone) => {
      dbo.collection(col).find({
        uploadDate : { 
          $lte: new Date(),
          $gte: new Date(new Date().setDate(new Date().getDate() - days_ago))},
      })
      .toArray((err, files) => {
        if (err) console.log(err);
        if (files && files.length > 0) {
          arr.push(files);
        } else {
          console.log(`${db_name} at ${url} is empty`);
        }
        return fDone();
      }); 
    };

    queryFilesFromXDaysAgo(collection, days, () => {
      db.close();
      return fDone();
    });
  }));
};
    
//Gets called from media-sync-controller as queryCollections()
module.exports = (url, db, days) => {

  return new Promise((resolve) => {

    let arr = [];

    //connect to source db and load file from x days ago
    getMongoMediaFiles(url, db, days, arr, () => {
      arr = arr[0];
      resolve(arr);     
    });
  });
};
