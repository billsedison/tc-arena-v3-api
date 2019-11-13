/**
 * Mocha unit tests of the SRM Problems API.
 */

process.env.NODE_ENV = 'test'
require('../../app-bootstrap')
const _ = require('lodash')
const logger = require('../../src/common/logger')
const service = require('../../src/services/ProblemService')
const { dropDB } = require('../../src/init-db')
const { initLogs, clearLogs, assertValidationError, assertError, insertData } = require('../common/testHelper')
const expect = require('chai').expect
const componentData = require('../../data/component.json')
const problemData = require('../../data/problem.json')

describe('Topcoder - SRM Problems API Unit Tests', () => {
  const errorLogs = []
  const error = logger.error

  before(async () => {
    // inject logger with log collector
    logger.error = (message) => {
      errorLogs.push(message)
      error(message)
    }

    await insertData()
    initLogs(errorLogs)
  })

  after(async () => {
    // restore logger
    logger.error = error

    await dropDB()
  })

  beforeEach(() => {
    clearLogs()
  })

  it('search problems success', async () => {
    const data = [_.cloneDeep(problemData.data[451]), _.cloneDeep(problemData.data[471])]

    const result = await service.searchProblems({
      page: 2,
      perPage: 2
    })
    expect(result.total).to.equal(484)
    expect(result.page).to.equal(2)
    expect(result.perPage).to.equal(2)
    for (let i = 0; i < 2; i++) {
      data[i].create_date = new Date(data[i].create_date)
      data[i].modify_date = new Date(data[i].modify_date)
      expect(result.result[i].problemId).to.equal(data[i].problem_id)
      expect(result.result[i].name).to.equal(data[i].name)
      expect(result.result[i].statusId).to.equal(data[i].status_id)
      expect(result.result[i].status).to.equal('Used')
      expect(result.result[i].modifyDate.getTime()).to.equal(data[i].modify_date.getTime())
      expect(result.result[i].proposedDivisionId).to.equal(data[i].proposed_division_id)
      expect(result.result[i].problemTypeId).to.equal(data[i].problem_type_id)
      expect(result.result[i].problemType).to.equal('Single')
      expect(result.result[i].proposedDifficultyId).to.equal(data[i].proposed_difficulty_id)
      expect(result.result[i].createDate.getTime()).to.equal(data[i].create_date.getTime())
      expect(result.result[i].acceptedSubmissions).to.equal(data[i].accept_submissions)
    }
  })

  it('search problems using default pagination success', async () => {
    const result = await service.searchProblems({})
    expect(result.total).to.equal(484)
    expect(result.page).to.equal(1)
    expect(result.perPage).to.equal(20)
    expect(result.result.length).to.equal(20)
  })

  it('search problems with invalid page parameter', async () => {
    try {
      await service.searchProblems({ page: 'abc' })
      throw new Error('should not throw error here')
    } catch (err) {
      assertValidationError(err, '"page" must be a number')
    }
  })

  it('search problems with invalid perPage parameter', async () => {
    try {
      await service.searchProblems({ perPage: 'abc' })
      throw new Error('should not throw error here')
    } catch (err) {
      assertValidationError(err, '"perPage" must be a number')
    }
  })

  it('get problem by id success', async () => {
    const data = _.cloneDeep(problemData.data[0])
    data.create_date = new Date(data.create_date)
    data.modify_date = new Date(data.modify_date)
    data.component = componentData.data[0]

    const result = await service.getProblem(15557)
    expect(result.problemId).to.equal(data.problem_id)
    expect(result.name).to.equal(data.name)
    expect(result.statusId).to.equal(data.status_id)
    expect(result.status).to.equal('Final Testing')
    expect(result.modifyDate.getTime()).to.equal(data.modify_date.getTime())
    expect(result.proposedDivisionId).to.equal(data.proposed_division_id)
    expect(result.problemTypeId).to.equal(data.problem_type_id)
    expect(result.problemType).to.equal('Single')
    expect(result.proposedDifficultyId).to.equal(data.proposed_difficulty_id)
    expect(result.createDate.getTime()).to.equal(data.create_date.getTime())
    expect(result.acceptedSubmissions).to.equal(data.accept_submissions)
    expect(result.component.componentId).to.equal(data.component.component_id)
    expect(result.component.problemId).to.equal(data.component.problem_id)
    expect(result.component.methodName).to.equal(data.component.method_name)
    expect(result.component.className).to.equal(data.component.class_name)
    expect(result.component.defaultSolution).to.equal(data.component.default_solution)
    expect(result.component.componentTypeId).to.equal(data.component.component_type_id)
    expect(result.component.componentText).to.equal(data.component.component_text)
    expect(result.component.statusId).to.equal(data.component.status_id)
    expect(result.component.componentType).to.equal('Main Component')
  })

  it('get problem without component success', async () => {
    const result = await service.getProblem(99999997)
    expect(result.problemId).to.equal(99999997)
    expect(result.name).to.equal('test1')
    expect(result.component).to.be.undefined // eslint-disable-line no-unused-expressions
  })

  it('get problem with component without componentType success', async () => {
    const result = await service.getProblem(99999998)
    expect(result.problemId).to.equal(99999998)
    expect(result.name).to.equal('test2')
    expect(result.component.componentType).to.be.undefined // eslint-disable-line no-unused-expressions
  })

  it('get problem with invalid id', async () => {
    try {
      await service.getProblem('abc')
      throw new Error('should not throw error here')
    } catch (err) {
      assertValidationError(err, '"problemId" must be a number')
    }
  })

  it('get problem by id not found', async () => {
    try {
      await service.getProblem(123)
      throw new Error('should not throw error here')
    } catch (err) {
      expect(err.name).to.equal('NotFoundError')
      assertError(err, 'Problem with id: 123 doesn\'t exist')
    }
  })
})
