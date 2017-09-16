const {query} = require('./query.js');

class MerchandiseManager {

	constructor() {
	}
	
	getNumMerchandise(cb) {
		query("SELECT DISTINCT modelname FROM Merchandise;", [], (error, result) => {
			if (error) {
				console.log(error);
				cb("0");
				return;
			}
			cb(result.rowCount);
		});
	}
	
	getMerchandiseInfo(parameters, cb) {
		if (parameters != null && parameters.index != null) {
			query("SELECT DISTINCT modelname FROM Merchandise;", [], (error, result) => {
				if (error) {
					console.log(error);
					cb({});
					return;
				}
				if (parseInt(result.rowCount) > parameters.index) {
					query("SELECT * FROM Merchandise WHERE modelname = $1;", [result.rows[parameters.index].modelname], (err, res) => {
						if (err) {
							console.log(err);
							cb({});
							return;
						}
						if (parseInt(res.rowCount) > 0) {
							let data = res.rows[0];
							let colors = [];
							let ids = [];
							for (let i = 0; i < res.rows.length; ++i) {
								colors[i] = res.rows[i].color;
								ids[i] = res.rows[i].id;
							}
							data.colors = colors;
							data.ids = ids;
							delete data.color;
							cb(data);
						} else {
							cb({});
						}
					});
				} else {
					cb({});
				}
			});
		} else {
			cb({});
		}
	}
	
	getProductInfo(parameters, cb) {
		if (parameters != null && parameters.id != null) {
			query("SELECT * FROM Merchandise WHERE id = $1;", [parameters.id], (error, result) => {
				if (error) {
					console.log(error);
					cb({});
					return;
				}
				if (parseInt(result.rowCount) > 0) {
					query("SELECT id, color FROM Merchandise WHERE modelname = $1;", [result.rows[0].modelname], (err, res) => {
						if (err) {
							console.log(err);
							cb({});
							return;
						}
						if (parseInt(res.rowCount) > 0) {
							let data = result.rows[0];
							let colors = [];
							let ids = [];
							for (let i = 0; i < res.rows.length; ++i) {
								colors[i] = res.rows[i].color;
								ids[i] = res.rows[i].id;
							}
							data.colors = colors;
							data.ids = ids;
							cb(data);
						} else {
							cb({});
						}
					});
				} else {
					cb({});
				}
			});
		} else {
			cb({});
		}
	}
}

const merchandiseManager = new MerchandiseManager();

module.exports = {merchandiseManager};
