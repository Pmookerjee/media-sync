const mongoose = require('mongoose'); 
const Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;

module.exports = (file, source_url, dest_url, db_name, fDone) => {

  console.log('@@@@@File is: ', file);

  const sourceDB = mongoose.createConnection(`mongodb://${source_url}/${db_name}`);
  const destDB = mongoose.createConnection(`mongodb://${dest_url}/${db_name}`);

  const connSourceDB = sourceDB;
  const connDestDB = destDB;

  connDestDB.once('open', (err) => {
    if(err) {
      throw err;
    }
    console.log(`Connection to ${dest_url}/${db_name} open`);
    let gfs = Grid(connDestDB.db);

    let writestream = gfs.createWriteStream({
      filename: 'joe mama',
      mode: 'w'
    });

    let readstream = gfs.createReadStream({'_id': file._id});
    console.log('readstream is ', readstream)
    readstream.pipe(writestream);

    writestream.on('error', () => {
      console.log('Error during writestream: ', error)
    })

    writestream.on('close', (test) => {
      console.log(test.filename + ' written to DB');
      connDestDB.close();
      return fDone();
    });
  });
};
