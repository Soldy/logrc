
const fs = require('fs');


const logBase = function(logFileNameIn){
    this.log = function(object){
        log = object;
        write();
    }
    this.add = function(name, value){
        log[name]=value;
        return true;
    }
    this.write = function(){
        write();
    }
    let writing = false;
    let log = {};
    let logFile = logFileNameIn;
    let write = async function (){
        writing = true;
        log.timestamp = (+new Date);
        fs.appendFile(
            logFile,
            log,
            function(){
                log={};
                writing = false;
            }
         );
    };
    let prepare = function(message, subject){
        if (typeof message !== 'string')
            return false;
        let new_log = {
            'timestamp':(+new Date)
        }
        if (typeof subject === 'string')
            new_log['subject']=subject.replace(/[\r\n]+/gm, "");
        new_log.message = message.replace( /[\r\n]+/gm, ""); 
        return JSON.stringify(new_log);
    };
}
