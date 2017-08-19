const pg = require('pg');
const config = {
	"user": "abkqttfnvdbkyi",
	"password": "2e0e89d1e55bafaf04a9eea0045827e5fc0724e8d865796e7796ac3b79534b41",
	"database": "dcccv3fip4tsjm",
	"port": 5432,
	"host": "ec2-107-22-211-182.compute-1.amazonaws.com",
	"ssl": true
}

function checkUsername(username, cb) {
	const client = new pg.Client(config);
	client.connect((error) => {
		if (error) {
			console.log(error);
		}
	});
	client.query("SELECT * FROM Users WHERE Username = '" + username + "';", (error, result) => {
		if (error) {
			console.log(error);
		} else {
			if (parseInt(result.rowCount) > 0) {
				cb(true);
			} else {
				cb(false);
			}
		}
		client.end();
	});
}

module.exports =  {checkUsername};
