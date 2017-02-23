File describing how to set up auth.js and database.js

[Google - Auth.js](https://scotch.io/tutorials/easy-node-authentication-google)

// auth.js
module.exports = {

    'googleAuth' : {
        'clientID'      : 'CLIENT_ID',
        'clientSecret'  : 'CLIENT_SECRET',
        'callbackURL'   : 'CALLBACK_URL'
    }
    // Different from scotch tutorial
    'memcache_url'  : 'MEMCACHE_URL', // Free 30 mb from redis.io
    'secret'        : 'secret'
};

[MongoDB - database.js](https://scotch.io/tutorials/easy-node-authentication-setup-and-local)

// database.js
module.exports = {

    'url' : 'url_here' // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot

};
