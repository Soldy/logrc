# Logrc

Simple JSON log.

## install

```bash
npm i logrc

```
## Simple call

```javascript

new log = new (require('logrc')).base('some.log');

```

## Stamped call

```javascript

new log = (require('logrc')).stamped(dir, file);

```
## dated call

```javascript

new log = (require('logrc')).dated(dir, file);

```

## log 

```javascript
log.log({
   process : 'something',
   message : 'some message'
});

log.log({
   process : 'something',
   message : 'other message'
});

```

## Example

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

