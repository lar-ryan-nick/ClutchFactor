const pg = require('pg');

const config = {
	ssl: true
}

const pool = new pg.Pool(config);

pool.on("error", (error, client) => {
	console.log(error);
});

// cb returns two parameters error and result of the query
function query(text, values, cb) {
	pool.connect((error, client, done) => {
		if (error) {
			done();
			cb(error, null);
			return;
		}
		client.query(text, values, (err, result) => {
			done();
			cb(err, result);
		});
	});
}

module.exports = {query};
