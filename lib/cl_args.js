'use strict';

const minimist = require('minimist');

const parser = module.exports = {};

parser.run = () => {

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
    console.log(`\n\n************************************* OPTIONS ***************************************\n\n` +
      `**  --source, -s   Source IP address -Default: 192.168.2.14:27017                  **\n\n` +
      `**  --dest, -d   Destination IP address -Default: localhost:27017                  **\n\n` +
      `**  --database, -db  Database name -Default: HeadlightFS                           **\n\n` +
      `**  --time_start_days, -time   Number of days ago (number) -Default: 7             **\n\n` +
      `**  --concurrency, -con   Limit of files pulled at one time (String) -Default: 10  **\n\n` +
      `**  --overwrite    Overwrite media files (Bool) -Default: false                    **\n\n` +
      `*************************************************************************************\n`
    );
  } 
  if(args.version) console.log(`\nVersion 1.0.0`);

  return args;

};



