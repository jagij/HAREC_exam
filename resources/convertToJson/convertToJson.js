const SqliteToJson = require('sqlite-to-json');
const sqlite3 = require('sqlite3');
const exporter = new SqliteToJson({
  client: new sqlite3.Database('./db')
});
exporter.all(function (err, all) {
  // all your data here
  console.log(JSON.stringify(all, null, ' '));
});
