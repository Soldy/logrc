/*
 *  @Soldy\logrc\2021.01.16\GPL3
 */
'use strict';
const fs = require('fs');


/*
 * @param {string} logfileNameIn //name of log file
 * @prototype
 */
 
const logBase = function(logFileNameIn){
    /* / log a new thing / 
     * @param {JSONobject}
     * @public
     * @return {boolean}
     */
    this.log = function(object){
        logs.push({
            time : (+new Date),
            data : clean(object)
        });
        write();
    };
    /* / force the write if it can /
     * @public
     * @return {boolean}
     */
    this.write = function(){
        return write();
    };
    /*
     * @private
     * @var {boolean}
     */
    let writing = false;
    /*
     * @private
     * @var {array}
     */
    let logs = [];
    /*
     * @private
     * @var {string}
     */
    let logFile = logFileNameIn;
    /*
     * @private
     * @return {boolean}
     */
    let write = async function (){
        if(writing)
            return true;
        if(1 > logs.length)
            return false;
        writing = true;
        fs.appendFile(
            logFile,
            lines(),
            function(){
                writing = false;
                if(logs.length > 0)
                    return write();
                return true;
            }
        );
    };
    /* / the next writeable log piece /
     * @private
     * @return {string}
     */
    let line = function(){
        return JSON.stringify(
            logs.shift()
        )+'\n';
    };
    /* / the next writeable log pieces /
     * @private
     * @return {string}
     */
    let lines = function(){
        let out = '';
        while (logs.length > 0)
            out += line();
        return out;
    };
    /* / clean the input object /
     * @param {JSONobject}
     * @private
     * @return {JSONobject}
     */
    let clean = function(object){
        return JSON.parse(
            JSON.stringify(object).replace( /[\r\n]+/gm, '')
        );
    };
};

exports.logBase = logBase;
