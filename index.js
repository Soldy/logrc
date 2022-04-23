/*
 *  @Soldy\logrc\2021.02.10\GPL3
 */
'use strict';
const fs = require('fs');
const readline = require('readline');
const $setuprc = require('setuprc').base;
const _format = '.jlog';


/*
 * @param {string} logfileNameIn //name of log file
 * @prototype
 */
const logrcBase = function(settings){
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
    /* / force async write 
     * @public
     * @return {boolean}
     */
    this.writeSync = function(){
        return _writeSync();
    };
    /* / force the write if it can /
     * @public
     * @return {boolean}
     */
    this.write = async function(){
        return await _write();
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
    let _async_write_block = false;
    /*
     * @private
     * @var {boolean}
     */
    let _writing = false;
    /*
     * @private
     * @var {boolean}
     */
    let _reading = false;
    /*
     * @private
     * @var {array}
     */
    let _logs = [];
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
     *  @private
     *  @const {setuprc}
     */
    const _setup = new $setuprc(
        _setup_json
    );
    /*
     * @private
     * @return {boolean}
     */
    const _writeSync = async function (){
        if(_writing || _reading)
            throw Error('log file already open');
        fs.appendFileSync(
            _setup.get('fileName'),
            _lines()
        );
    };
    /*
     * @private
     * @return {boolean}
     */
    const _write = async function (){
        if(_async_write_block)
            return false;
        if(_writing || _reading){
            setTimeout(
                _write,
                200
            );
            return true;
        }
        if(1 > _logs.length)
            return false;
        _writing = true;
        fs.appendFile(
            _setup.get('fileName'),
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
        _reading = false;
        return out;
    };
    /*
     * @param {readline.interface} rl
     * @param {object} filter
     * @private
     * @return {array}
     */
    const _readerFilter = async function (
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
    };
    /*
     * @param {string}
     * @private
     * @return {array}
     */
    const _read = async function(filter){
        if(_reading)
            return '';
        _reading = true;
        const rl = readline.createInterface({
            input: fs.createReadStream(
                _setup.get('fileName')
            ),
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
            _setup.get('fileName')
        );
        const read = readline.createInterface({
            input: stream,
            crlfDelay: Infinity
        });
        for (let l in read)
            out++;
        return out;
    };
    /* / the next writeable log piece /
     * @private
     * @return {string}
     */
    const _line = function(){
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
        while ( _logs.length > 0 )
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
    if ( typeof settings !== 'undefined' )
        _setup.setup(settings);
};

const stamped = function(dir,file){
    let outfile = (
        dir+
        '/'+
        file+
        '.'+
        Math.round(Date.now()/1000).toString()+
        _format
    );
    return new logrcBase(outfile);
};

const dated = function(dir,file){
    let date = new Date();
    let formated = (
        date.getFullYear().toString()+
        date.getMonth().toString().padStart(2, '0')+
        date.getDate().toString().padStart(2, '0')
    );
    let outfile = (
        dir+
        '/'+
        file+
        '.'+
        formated+
        _format
    );
    return new logrcBase(outfile);
};


exports.base = logrcBase;
exports.stamped = stamped;
exports.dated = dated;

