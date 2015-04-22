'use strict';

var Client = require('../');
var assert = require('chai').assert;
var account_info = require('./fixtures/account_info')();
var errorFixture = require('./fixtures/get_notification').error;
var success = require('./fixtures/get_notification').success;

describe('Ripple REST Client Get Notification', function() {
  var client;
  var payments;

  beforeEach(function(done) {
    client = new Client({
      account: account_info.source_account
    });

    client.getPayments(null, function(error, payment_array) {
      payments = payment_array;
      done();
    });
  });

  afterEach(function(done) {
    client = undefined;
    done();
  });

  it('should get NO notification', function(done) {
    client.getNotification(null, function(error, response) {
      if (error) {
        return done(error);
      }
      assert(!response, 'Response should be null');
      assert(error);
      assert.deepEqual(errorFixture(), error.response.body);
      done();
    });
  });

  // Given the hash for the second last payment, the response should contain the
  // hashes of last payment and third last payment.
  it('should get a notification', function(done) {
    client.getNotification(payments[1].hash, function(error, response) {
      if (error) {
        return done(error);
      }
      assert(!error);
      assert(response);
      assert.deepEqual(success(response), response);
      done();
    });
  });
});
