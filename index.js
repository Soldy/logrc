/*
 *  @Soldy\logrc\2021.01.16\GPL3
 */
'use strict';
const fs = require('fs');
const readline = require('readline');


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
     * @param {object}
     * @public
     * @return {array}
     */
    this.read = async function(filter){
        return await read(filter);
    };
    /*
     * @public
     * @return {integer}
     */
    this.count = async function(){
        return await count();
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
    const write = async function (){
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
    /*
     * @param {readline.interface} rl
     * @private
     * @return {array}
     */
    const readerAll = async function (rl){
        let out = [];
        for (let l of rl)
            out.push(
                JSON.parse(l)
            );
        return out;
    }
    /*
     * @param {readline.interface} rl
     * @param {object} filter
     * @private
     * @return {array}
     */
    const readerOffset = async function (
        rl,
        filter
    ){
        if (typeof filter.offset === 'undefined')
            filter.offset = 0;
        if (typeof filter.length === 'undefined')
            filter.length = 0;
        let out = [];
        let position = 0;
        let length = 0;
        for (let l of rl){
            if (
               (position >= filter.offset) &&
               (
                   (filter.length === 0) ||
                   (filter.length > length) 
               )
            ){
                out.push(
                    JSON.parse(l)
                );
                length++;
                if (filter.length === length)
                    return out;
            }
            position++;
        }
        return out;
    }
    /*
     * @private
     * @return {array}
     */
    const read = async function(filter){
        const stream = fs.createReadStream(
            logFile
        );
        const rl = readline.createInterface({
            input: stream,
            crlfDelay: Infinity
        });
        if (typeof filter === 'undefined')
            return await readerAll(rl);
        return await readerFilter(rl, filter);
    };
    /*
     * @private
     * @return {intreger}
     */
    const count = async function(){
        let out = 0;
        const stream = fs.createReadStream(
            logFile
        );
        const read = readline.createInterface({
            input: stream,
            crlfDelay: Infinity
        });
        for (let l of read)
             out++;
        return out;
    };
    /* / the next writeable log piece /
     * @private
     * @return {string}
     */
    const line = function(){
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
