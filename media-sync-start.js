'use strict';

const minimist = require('minimist');

let args = minimist(process.argv.slice(2), {
  
  string: [ 'source', 'dest', 'database', 'concurrency' ],
  number: ['time_start_days'],
  boolean: [ 'overwrite' ],
  alias: { h: 'help', v: 'version', s: 'source', d: 'dest', db: 'database', time: 'time_start_days', con: 'concurrency' },
  default: { 
    source: '192.168.2.14:27017',
    dest: '192.168.2.11:27017',
    database: 'HeadlightFS',
    time_start_days: 7,
    concurrency: '10',
    overwrite: false,
  },
});

if(args.help) {
  console.log(`\n\n************************************* OPTIONS ******************************************\n\n` +
    `**                                                                                      **\n\n` +
    `**    --source, --s   Source IP address (STRING) -Default: 192.168.2.14:27017           **\n\n` +
    `**    --dest, --d   Destination IP address (STRING) -Default: 192.168.2.11:27017        **\n\n` +
    `**    --database, --db  Database name (STRING) -Default: HeadlightFS                    **\n\n` +
    `**    --time_start_days, --time   Number of days ago (NUMBER) -Default: 7               **\n\n` +
    `**    --concurrency, --con   Limit of files pulled at one time (STRING) -Default: 10    **\n\n` +
    `**                                                                                      **\n\n` +
    `******************************************************************************************\n`
  );
} 

if(args.version) console.log(`\nVersion 1.0.0`);

if(!args.help && !args.version) {
  require('./media-sync-controller')(args);
}



  



