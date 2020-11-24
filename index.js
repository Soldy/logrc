/*
 *  @Soldy\logrc\2020.11.24\GPL3
 */
const fs = require('fs');


const logBase = function(logFileNameIn){
    /*
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
    /*
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
            line(),
            function(){
                writing = false;
                if(logs.length > 0)
                    return write();
                return true;
            }
        );
    };
    let line = function(){
        return JSON.stringify(
                logs.shift()
            )+'\n';
    }
    /*
     * @param {JSONobject}
     * @private
     * @return {JSONobject}
     *
     */
    let clean = function(object){
        return JSON.parse(
            JSON.stringify(object).replace( /[\r\n]+/gm, "")
        );
    };
};

exports.logBase = logBase;
