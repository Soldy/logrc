/*
 *  @Soldy\logrc\2021.02.10\GPL3
 */
'use strict';
const fs = require('fs');
const readline = require('readline');
const $setuprc = require('setuprc');


/*
 * @param {string} logfileNameIn //name of log file
 * @prototype
 */
const logrcBase = function(logFileNameIn){
    /* / log a new thing / 
     * @param {JSONobject}
     * @public
     * @return {boolean}
     */
    this.log = function(object){
        _logs.push({
            time : Date.now(),
            data : _clean(object)
        });
        _write();
    };
    /* / force the write if it can /
     * @public
     * @return {boolean}
     */
    this.write = function(){
        return _write();
    };
    /*
     * @param {object}
     * @public
     * @return {array}
     */
    this.read = async function(filter){
        return await _read(filter);
    };
    /*
     * @public
     * @return {integer}
     */
    this.count = async function(){
        return await _count();
    };
    /*
     * @private
     * @var {boolean}
     */
    let _writing = false;
    /*
     * @private
     * @var {array}
     */
    let _logs = [];
    /*
     * @private
     * @var {string}
     */
    let _logFile = logFileNameIn;
    /*
     *  @private
     *  @const {object}
     */
    const _setup_json = {
        'fileName':{
            'type'    : 'string',
            'default' : 'log.logrc'
        }
    };
    /*
     * @private
     * @return {boolean}
     */
    const _write = async function (){
        if(_writing)
            return true;
        if(1 > _logs.length)
            return false;
        _writing = true;
        fs.appendFile(
            _logFile,
            _lines(),
            function(){
                _writing = false;
                if(_logs.length > 0)
                    return _write();
                return true;
            }
        );
    };
    /*
     * @param {readline.interface} rl
     * @private
     * @return {array}
     */
    const _readerAll = async function (rl){
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
            _logFile
        );
        const rl = readline.createInterface({
            input: stream,
            crlfDelay: Infinity
        });
        if (typeof filter === 'undefined')
            return await _readerAll(rl);
        return await _readerFilter(rl, filter);
    };
    /*
     * @private
     * @return {intreger}
     */
    const _count = async function(){
        let out = 0;
        const stream = fs.createReadStream(
            _logFile
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
            _logs.shift()
        )+'\n';
    };
    /* / the next writeable log pieces /
     * @private
     * @return {string}
     */
    let _lines = function(){
        let out = '';
        while (_logs.length > 0)
            out += _line();
        return out;
    };
    /* / clean the input object /
     * @param {JSONobject}
     * @private
     * @return {JSONobject}
     */
    let _clean = function(object){
        return JSON.parse(
            JSON.stringify(object).replace( /[\r\n]+/gm, '')
        );
    };
};

exports.base = logrcBase;
