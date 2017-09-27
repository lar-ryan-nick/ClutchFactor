const chai = require('chai');
const accountManager = require('../server/accountManager.js');

describe('accountManager', function() {
	describe('#createAccount', function() {
		it('Should return true when given a valid email address, password, firstName and lastName', function() {
			accountManager.checkPassword({email: 'ryanwiener@yahoo.com', password: 'fakePassword1', firstName: 'Ryan', lastName: 'Wiener'}, (valid) => {
				chai.expect(valid).to.equal(true);
			});
		});
		it('Should return true when given a valid email address and password without a firstName and lastName', function() {
			accountManager.checkPassword({email: 'ryanlwiener@yahoo.com', password: 'fakePassword2'}, (valid) => {
				chai.expect(valid).to.equal(true);
			});
		});
	});
	describe('#checkEmail', function() {
		it('Should return true when given a valid email address', function() {
			accountManager.checkEmail({email: 'ryanlwiener@yahoo.com'}, (valid) => {
				chai.expect(valid).to.equal(true);
			});
		});
		it('Should return false when given an invalid email address', function() {
			accountManager.checkEmail({email: 'ryanlwiener@poop.com'}, (valid) => {
				chai.expect(valid).to.equal(false);
			});
		});
		it('Should return false when given no email address', function() {
			accountManager.checkEmail({}, (valid) => {
				chai.expect(valid).to.equal(false);
			});
		});
	});
	describe('#checkPassword', function() {
		it('Should return true when given a valid email address and password', function() {
			accountManager.checkPassword({email: 'ryanwiener@yahoo.com', password: 'fakePassword1'}, (id, valid) => {
				chai.expect(valid).to.equal(true);
			});
		});
		it('Should return true when given a valid email address and password', function() {
			accountManager.checkPassword({email: 'ryanlwiener@yahoo.com', password: 'fakePassword2'}, (id, valid) => {
				chai.expect(valid).to.equal(false);
			});
		});
		it('Should return false when given an invalid email address', function() {
			accountManager.checkPassword({email: 'ryanl.wiener@poop.com', password: 'fakePassword'}, (id, valid) => {
				chai.expect(valid).to.equal(false);
			});
		});
		it('Should return false when given an invalid password', function() {
			accountManager.checkPassword({email: 'ryanlwiener@yahoo.com', password: 'fakePassword'}, (id, valid) => {
				chai.expect(valid).to.equal(false);
			});
		});
		it('Should return false when given no email address', function() {
			accountManager.checkPassword({password: 'fakePassword'}, (id, valid) => {
				chai.expect(valid).to.equal(false);
			});
		});
		it('Should return false when given no password', function() {
			accountManager.checkPassword({email: 'ryanlwiener@yahoo.com'}, (id, valid) => {
				chai.expect(valid).to.equal(false);
			});
		});
		it('Should return false when given no email or password', function() {
			accountManager.checkPassword({}, (id, valid) => {
				chai.expect(valid).to.equal(false);
			});
		});
	});
});
