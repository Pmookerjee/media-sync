const mongoose = require('mongoose'); 
const fs = require('fs');
const Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;

let file = { _id: '5a274d4c105573004d8d9828',
  filename: 'Artifact_16000_V1',
  contentType: 'application/json',
  length: 0,
  chunkSize: 261120,
  uploadDate: '2018-03-18T20:09:09.543Z',
  aliases: null,
  metadata: null,
  md5: 'd41d8cd98f00b204e9800998ecf8427e',
};

module.exports = (dest_url, db_name) => {

  mongoose.connect(`mongodb://${dest_url}/${db_name}`);
  const conn = mongoose.connection;

  conn.once('open', () => {
    console.log(`Connection to ${dest_url}/${db_name} open`);
    let gfs = Grid(conn.db);

    let writestream = gfs.createWriteStream({
      _id: file._id,
      filename: file.filename,
      contentType: file.contentType,
      length: file.length,
      chunkSize: file.chunkSize,
      metadata: file.metadata,
    });

    fs.createReadStream(__dirname + '/file.json').pipe(writestream);

    writestream.on('close', (test) => {
      console.log(test.filename + ' written to DB');
    });
  });
};
