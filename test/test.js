var request = require('supertest'),
    express = require('express');

var app = require('../app.js');
/*
describe('POST', function(){
    this.timeout(15000);
  it('responds with a json success message', function(done){
    request(app)
    .post('/appointments')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({'notes': 'test'})
    .expect(200, done);
  });
});*/

describe('GET', function(){
    this.timeout(15000);
  it('responds with a list of todo items in JSON', function(done){
    request(app)
    .get('/appointments')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});
/*
describe('GET', function(){
    this.timeout(15000);
  it('responds with a single todo item in JSON based on the author', function(done){
    request(app)
    .get('/appointments/test')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});*/