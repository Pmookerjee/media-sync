
## usage

`node media-sync-start.js [--options]`


                              *** OPTIONS ***                                                                                    

**    --source, --s   Source IP address (STRING) -Default: 192.168.2.14:27017           **

**    --dest, --d   Destination IP address (STRING) -Default: localhost:27017           **

**    --database, --db  Database name (STRING) -Default: HeadlightFS                    **

**    --time_start_days, --time   Number of days ago (NUMBER) -Default: 7               **

**    --concurrency, --con   Limit of files pulled at one time (STRING) -Default: 10    **

**                                                                                      **

******************************************************************************************


### Defaults

source: '192.168.2.14:27017'

dest: '192.168.2.11:27017'

database: 'HeadlightFS'

time_start_days: 7

concurrency: '10'
