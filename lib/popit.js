var mongoose = require('mongoose'),
    async    = require('async'),
    _        = require('underscore'),
    schemas  = require('./schemas'),
    utils    = require('./utils'),
    config   = require('config');
    


var connection_cache = {
    // empty to start with
};


var settings_cache = {
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
    
    PopIt.prototype.set_as_master = function () {
        return this.set_instance( config.MongoDB.master_name );
    }
    
    PopIt.prototype.is_master = function () {
        return this._instance_name === config.MongoDB.master_name;
    }
    
    PopIt.prototype._get_connection = function (name) {
        if (!name) throw new Error("Need a connection_name");
        
        if ( !connection_cache[name] ) {
            var uri = utils.mongodb_connection_string(name);
            connection_cache[name] = mongoose.createConnection( uri );        
        }
        
        return connection_cache[name];
    };
    
    
    PopIt.prototype.master_db = function () {
        return this._get_connection( config.MongoDB.master_name );
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
    
    
    // settings

    PopIt.prototype._get_cached_settings = function clear_stored_settings () {
        var settings = settings_cache[ this._instance_name ];        

        if ( ! settings ) 
            throw new Error("Settings not loaded - have you called load_settings?");

        return settings;
    }
    
    PopIt.prototype.clear_cached_settings = function clear_stored_settings () {
        settings_cache = {};
        return true;
    }
    
    PopIt.prototype.load_settings = function load_settings ( cb ) {
        var instance_name = this._instance_name;

        // If settings already loaded then return
        if ( settings_cache[ instance_name ] ) {
            cb(null);
            return;
        }
        
        // load settings from db, store in hash
        var Setting = this.model('Setting');
        Setting.find( {}, function (err, docs) {
            if ( err ) throw cb(err);

            var loaded_settings = {};
            
            _.each( docs, function (doc) {
               loaded_settings[doc.key] = doc.value;
            });
            
            settings_cache[ instance_name ] = loaded_settings;
            cb(null);
        })
    };

    PopIt.prototype.set_setting = function set_setting (key, value, cb) {
        var settings = this._get_cached_settings();        
        var Setting = this.model('Setting');
        
        Setting.update(
            { key: key },
            { value: value},
            { upsert: true },
            function (err) {
                if ( ! err ) settings[key] = value;
                cb(err);
            }
        );
    }
    
    PopIt.prototype.setting = function setting (key) {
        var settings = this._get_cached_settings();        
        return settings[key] || config.default_settings[key];
    };

    return PopIt;

})();

module.exports = PopIt;