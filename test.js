const  log = new (require('./index.js')).base('test.log');
log.log({
   process : 'huh',
   message : 'test :)'
});
log.log({
   process : 'huh',
   message : 'test :) \n '
});
