const mongoose = require('mongoose'); 
const Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;

module.exports = (file, count, sourceDB, destDB, fDone) => {

  let sourceData;

  let getSourceFile = (sourceDB) => {

    return new Promise((resolve, reject) => {

      let readstream;
      let gfsSource = Grid(sourceDB.db);
    
      sourceDB.collection('fs.files').find({'_id': file._id})
        .toArray((err, data) => {
          if (err) console.log('Mongo Error: ', err);
          if(data.length) {
            readstream = gfsSource.createReadStream({_id: data[0]._id});
            sourceData = data[0];
            resolve(readstream)
          } 
          else reject('File not found in source!!');
        }); 
    })
  }
  
  let copyFileToDest = (readstream, destDB, count) => {

    return new Promise((resolve) => {
    
      let gfsDest = Grid(destDB.db);
  
      let writestream = gfsDest.createWriteStream({
          filename: `Observation ${count}`,
          mode: 'w',
          contentType: file.contentType
      })

      readstream.pipe(writestream);
  
      writestream.on('error', () => {
        console.log('Error during writestream: ', error)
      })
  
      writestream.on('close', (test) => {
        console.log(test.filename + ' written to DB');
        resolve();
      });
    });
  }
  
  getSourceFile(sourceDB)
    .then(readstream => {
      return copyFileToDest(readstream, destDB, count)
    })
    .then(() => {
      return fDone();
    })
    .catch(err => console.log(err));
};