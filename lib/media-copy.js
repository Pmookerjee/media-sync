const mongoose = require('mongoose'); 
const Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
const ProgressBar = require('ascii-progress');


let bar = new ProgressBar({
  schema: ':current/:total :file :percent eta: :eta downloading ',
  width: 80
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
        // console.log(test.filename + ' written to DB');
        resolve();
      });
    });
  }
  
  getSourceFile(sourceDB)
    .then(readstream => {
      return copyFileToDest(readstream, destDB, count)
    })
    .then(() => {
      bar.tick();
      return fDone();
    })
    .catch(err => console.log(err));
};


