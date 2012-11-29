"use strict"; 


// Manually set the environment to be production. Prevents it getting forgotten.
process.env.NODE_ENV = 'production';

// Run the server as normal
require('./server');
