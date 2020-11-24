const  log = new (require('./index.js')).logBase('test.log');
log.log({
   process : 'huh',
   message : 'test :)'
});
log.log({
   process : 'huh',
   message : 'test :) \n '
});
