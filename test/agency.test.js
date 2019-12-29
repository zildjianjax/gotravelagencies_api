let mongoose = require("mongoose");
let Agency = require("../models/Agency");

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);
//Our parent block
describe("Agencies", async () => {
  beforeEach(async () => {
    //Before each test we empty the database test
    return Agency.deleteMany({});
  });
  describe("Sample Test", async () => {
    it("should pass by default", done => {
      expect(1).to.equal(1);
      done();
    });
  });
});
