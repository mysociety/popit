var path = require('path');

module.exports = {
  public_dir: 'public',
    MongoDB: {
        popit_prefix: 'popitdev_',
    },
    
    instance_server: {
        files_dir:     path.normalize(__dirname + '/../../popitdev_files'),  
    },
    email: {
        send_by_transport: true,
        save_to_database:  true,
        print_to_console:  true,
    },
};
