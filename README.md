# Logrc

Simple JSON log.

## install

```bash
npm i logrc

```


## Usage

```javascript

new log = new (require('logrc')).base('some.log');
log.log({
   process : 'something',
   message : 'some message'
});

log.log({
   process : 'something',
   message : 'other message'
});

```

## That's all folks !

