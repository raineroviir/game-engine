var r = require('rethinkdb');
// var connection = null;
// r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
//   if (err) throw err;
//   connection = conn;
// });

var dbConfig = {
  host: process.env.RDB_HOST || 'localhost',
  port: parseInt(process.env.RDB_PORT) || 28015,
  db: process.env.RDB_DB || 'chat',
  tables: {
    'users': 'id'
  }
};

// export function setup() {
module.exports.setup = function() {
  r.connect({ host: dbConfig.host, port: dbConfig.port }), function(err, connection) {
    if (err) throw err;
    r.dbCreate(dbConfig.db).run(connection, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log('RethinkDB Database "%s" created', dbConfig.db);
      }

      for (var tbl in dbConfig.tables) {
        (function (tableName) {
          r.db(dbConfig.db).tableCreate(tableName, {primaryKey: dbConfig.tables[tbl]}).run(connection, function(err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log('RethinkDB table "%s" created', tableName);
            }
          });
        })(tbl);
      }
    })
  }
}

module.exports.findUserByEmail = function(mail, callback) {
  onConnect(function (err, connection) {
    console.log("[INFO ][%s][findUserByEmail] Login {user: %s, pwd: 'you really thought I'd log it?'}", connection['_id'], mail);
    r.db(dbConfig.db).table('users').filter({'mail': mail}).limit(1).run(connection, function(err, cursor) {
      if (err) {
        console.log("[ERROR][%s][findUserByEmail][collect] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
        callback(err);
      } else {
        cursor.next(function(err, row) {
          if (err) {
            console.log("[ERROR][%s][findUserByEmail][collect] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
            callback(null, null);
          } else {
            callback(null, row);
          }
          connection.close();
        });
      }
    });
  });
}

module.exports.saveUser = function(user, callback) {
  onConnect(function(err, connection) {
    r.db(dbConfig.db).table('users').insert(user).run(connection, function(err, result) {
      if (err) {
        console.log(err);
        callback(err);
      } else {
        if (result.inserted === 1) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      }
      connection.close();
    });
  });
}

function onConnect(callback) {
  r.connect({
    host: dbConfig.host,
    port: dbConfig.port
  }, function(err, connection) {
    if (err) throw err;
    connection['_id'] = Math.floor(Math.random()*10001);
    callback(err, connection);
  });
}
