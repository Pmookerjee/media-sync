const mongoose = require('mongoose'); 
const Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
const ProgressBar = require('ascii-progress');


let bar = new ProgressBar({
  schema: ':current/:total :file :percent eta: :eta downloading ',
  width: 80,
});

module.exports = (file, count, total, sourceDB, destDB, fDone) => {

  //Progress bar settings
  bar.total = total;
  let tokens = ':current.underline.magenta/:total.italic.green :percent.bold.yellow :elapseds.italic.blue :etas.italic.cyan';
  let iv = setInterval(() => {
  
    let completedColor = '';
    let current        = count;

    if (current < 100) {
      completedColor = 'green';
    }
  
    let schema = ' [.white:filled.' + completedColor + ':blank.grey] .white' + tokens;
    bar.setSchema(schema);
  
    if (bar.completed) {
      clearInterval(iv);
    }
  }, 500);

  let getSourceFile = (sourceDB) => {

    return new Promise((resolve, reject) => {

      let readstream;
      let gfsSource = Grid(sourceDB.db);
    
      sourceDB.collection('fs.files').find({'_id': file._id})
        .toArray((err, data) => {
          if (err) console.log('Mongo Error: ', err);
          if(data.length) {
            readstream = gfsSource.createReadStream({_id: data[0]._id});

            readstream.on('open', () => {
              //check to see that binary data exists for file
              sourceDB.collection('fs.chunks').findOne({'files_id': file._id}, (err, exists) => {
                if(exists) resolve(readstream);
                else reject(`File ${file._id} has no media and will not be copied`);
              });
            });
          } 
          else reject('File not found in source!!');
        }); 
    });
  };
  
  let copyFileToDest = (readstream, destDB) => {

    return new Promise((resolve) => {
    
      let gfsDest = Grid(destDB.db);
  
      let writestream = gfsDest.createWriteStream({
        filename: file.filename,
        mode: 'w',
        contentType: file.contentType,
      });

      readstream.pipe(writestream);
  
      writestream.on('close', () => {
        resolve();
      });
    });
  };
  
  getSourceFile(sourceDB)
    .then(readstream => {
      return copyFileToDest(readstream, destDB);
    })
    .then(() => {
      bar.tick();
      return fDone();
    })
    .catch(err => { 
      bar.tick();
      console.log(err);
      return fDone();
    });
};


