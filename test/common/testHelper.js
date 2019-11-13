/**
 * This file defines helper methods
 */

const models = require('../../src/models')
const expect = require('chai').expect

const Component = models.Component
const Problem = models.Problem

let errorLogs

/**
 * Initialize the errorLogs
 */
function initLogs (logs) {
  errorLogs = logs
}

/**
 * Clear the errorLogs
 */
function clearLogs () {
  while (errorLogs.length > 0) {
    errorLogs.pop()
  }
}

/**
 * Assert Joi validation error
 * @param err the error
 * @param message the message
 */
function assertValidationError (err, message) {
  expect(err.isJoi).to.equal(true)
  expect(err.name).to.equal('ValidationError')
  expect(err.details.map(x => x.message)).to.include(message)
  expect(errorLogs).to.include(err.stack)
}

/**
 * Assert error which is not thrown by Joi
 * @param err the error
 * @param message the message
 */
function assertError (err, message) {
  expect(err.message).to.equal(message)
  expect(errorLogs).to.include(err.stack)
}

/**
 * Insert test data.
 */
async function insertData () {
  await Problem.create({
    problemId: 99999997,
    name: 'test1'
  })
  await Problem.create({
    problemId: 99999998,
    name: 'test2'
  })
  await Component.create({
    componentId: 11111111,
    problemId: 99999998,
    resultTypeId: 1,
    methodName: 'test',
    className: 'test'
  })
}

module.exports = {
  assertError,
  assertValidationError,
  initLogs,
  clearLogs,
  insertData
}
