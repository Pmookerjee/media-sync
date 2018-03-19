'use strict';

const Mongo = require('mongodb').MongoClient; 
const collection = 'fs.files';   

//connect to the source db and load file ids into an array
let getMongoMediaFiles = (url, db_name, days, arr, fDone) => {
  
  Mongo.connect(`mongodb://${url}/${db_name}`, ((err, db) => {
    
    err ? console.dir(err) : console.log(`Connected to ${url}/${db_name}`);  
    let dbo = db.db(db_name);
  
    let queryFilesFromXDaysAgo = (col, days_ago, fDone) => {

      dbo.collection(col).find({
        uploadDate : { 
          $lte: new Date(),
          $gte: new Date(new Date().setDate(new Date().getDate() - days_ago))},
      })
      .toArray((err, files) => {
        if (err) console.log(err);
        console.log('files: ', files)        
        if (files.length > 0) {
          arr.push(files);
        } else {
          console.log('No files found')
        }
          return fDone();
      }); 
    };
    console.log('hiiiiiii')
    queryFilesFromXDaysAgo(collection, days, () => {
      return fDone();
    });
    db.close();
  }));
};
    
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
