var mongoose = require('mongoose'),
    async    = require('async'),
    _        = require('underscore'),
    schemas  = require('./schemas'),
    utils    = require('./utils');
    


var connection_cache = {
    // empty to start with
};


var PopIt = (function() {

    function PopIt () {
        this._instance_name = null;
    }
    
    PopIt.prototype.set_instance = function ( name ) {
        if (!name) throw new Error("Need a instance name");
        this._instance_name = name;
        return name;
    }
    
    PopIt.prototype._get_connection = function (name) {
        if (!name) throw new Error("Need a connection_name");
        
        if ( !connection_cache[name] ) {
            var uri = utils.mongodb_connection_string(name);
            connection_cache[name] = mongoose.createConnection( uri );        
        }
        
        return connection_cache[name];
    };
    
    
    PopIt.prototype.all_db = function () {
        return this._get_connection( 'all' );
    };
    
    PopIt.prototype.instance_db = function () {
        var name = this._instance_name;
        if (!name) throw new Error("Must set_instance before calling instance_db");
        return this._get_connection( this._instance_name );
    };
    
    
    PopIt.prototype.close_db_connections = function () {
        _.each(
            _.keys( connection_cache ),
            function ( key ) {
                var connection = connection_cache[key];
                delete connection_cache[key];
                connection.close();
            }
        );
    };
    
    PopIt.prototype.schema = function ( name ) {
        return schemas[name];
    }
    
    PopIt.prototype.model = function (name) {
        var db = this.instance_db();
        var model = null;

        try {
            // perhaps we've already got one set up?
            model = db.model( name );
        } catch (e) {

            // is this the expected error about the schema not being registered yet?
            if ( e.message.match( /^Schema hasn't been registered/ ) ) {
                
                var schema = this.schema(name);
                if ( !schema )
                    throw new Error("Could not find a schema for " + name );
                
                model = db.model( name, schema );            
            } else {
                // otherwise re-throw the error
                throw e;
            }
        }

        return model;
    };


    return PopIt;

})();

module.exports = PopIt;