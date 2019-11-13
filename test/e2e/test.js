/**
 * Mocha e2e tests of the SRM Problems API.
 */

process.env.NODE_ENV = 'test'
require('../../app-bootstrap')
const _ = require('lodash')
const config = require('config')
const { dropDB } = require('../../src/init-db')
const { token } = require('../common/testData')
const { insertData } = require('../common/testHelper')
const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const app = require('../../app')
const componentData = require('../../data/component.json')
const problemData = require('../../data/problem.json')

chai.use(chaiHttp)

describe('Topcoder - SRM Problems API E2E Tests', () => {
  const basePath = `${config.API_VERSION}/problems`

  before(async () => {
    await insertData()
  })

  after(async () => {
    await dropDB()
  })

  it('Unsupported http method, return 405', async () => {
    const res = await chai.request(app)
      .put(`${config.API_VERSION}/problems`)
      .send({ name: 'fail-route' })

    expect(res.status).to.equal(405)
    expect(res.body.message).to.equal('The requested HTTP method is not supported.')
  })

  it('Http resource not found, return 404', async () => {
    const res = await chai.request(app)
      .get(`${config.API_VERSION}/invalid`)

    expect(res.status).to.equal(404)
    expect(res.body.message).to.equal('The requested resource cannot be found.')
  })

  it('search problems with user token success', async () => {
    const res = await chai.request(app)
      .get(`${basePath}?page=2&perPage=2`)
      .set('Authorization', `Bearer ${token.user}`)

    const data = [_.cloneDeep(problemData.data[451]), _.cloneDeep(problemData.data[471])]

    expect(res.status).to.equal(200)
    expect(res.body.length).to.equal(2)
    for (let i = 0; i < 2; i++) {
      data[i].create_date = new Date(data[i].create_date)
      data[i].modify_date = new Date(data[i].modify_date)
      expect(res.body[i].problemId).to.equal(data[i].problem_id)
      expect(res.body[i].name).to.equal(data[i].name)
      expect(res.body[i].statusId).to.equal(data[i].status_id)
      expect(res.body[i].status).to.equal('Used')
      expect((new Date(res.body[i].modifyDate)).getTime()).to.equal(data[i].modify_date.getTime())
      expect(res.body[i].proposedDivisionId).to.equal(data[i].proposed_division_id)
      expect(res.body[i].problemTypeId).to.equal(data[i].problem_type_id)
      expect(res.body[i].problemType).to.equal('Single')
      expect(res.body[i].proposedDifficultyId).to.equal(data[i].proposed_difficulty_id)
      expect((new Date(res.body[i].createDate)).getTime()).to.equal(data[i].create_date.getTime())
      expect(res.body[i].acceptedSubmissions).to.equal(data[i].accept_submissions)
    }
  })

  it('search problems using default pagination with m2m token success', async () => {
    const res = await chai.request(app)
      .get(basePath)
      .set('Authorization', `Bearer ${token.m2m}`)

    expect(res.status).to.equal(200)
    expect(res.body.length).to.equal(20)
  })

  it('search problems with invalid page parameter', async () => {
    const res = await chai.request(app)
      .get(`${basePath}?page=abc`)
      .set('Authorization', `Bearer ${token.m2m}`)

    expect(res.status).to.equal(400)
    expect(res.body.message).to.equal('"page" must be a number')
  })

  it('search problems with invalid perPage parameter', async () => {
    const res = await chai.request(app)
      .get(`${basePath}?perPage=abc`)
      .set('Authorization', `Bearer ${token.m2m}`)

    expect(res.status).to.equal(400)
    expect(res.body.message).to.equal('"perPage" must be a number')
  })

  it('search problems without token', async () => {
    const res = await chai.request(app)
      .get(basePath)

    expect(res.status).to.equal(401)
    expect(res.body.message).to.equal('No token provided.')
  })

  it('search problems with expired token', async () => {
    const res = await chai.request(app)
      .get(basePath)
      .set('Authorization', `Bearer ${token.expired}`)

    expect(res.status).to.equal(401)
    expect(res.body.message).to.equal('Failed to authenticate token.')
  })

  it('search problems with invalid token', async () => {
    const res = await chai.request(app)
      .get(basePath)
      .set('Authorization', 'Bearer invalid')

    expect(res.status).to.equal(401)
    expect(res.body.message).to.equal('Invalid Token.')
  })

  it('search problems with invalid m2m token', async () => {
    const res = await chai.request(app)
      .get(basePath)
      .set('Authorization', `Bearer ${token.m2mInvalid}`)

    expect(res.status).to.equal(403)
    expect(res.body.message).to.equal('You are not allowed to perform this action!')
  })

  it('get problem by id with user token success', async () => {
    const res = await chai.request(app)
      .get(`${basePath}/15557`)
      .set('Authorization', `Bearer ${token.user}`)

    const data = _.cloneDeep(problemData.data[0])
    data.create_date = new Date(data.create_date)
    data.modify_date = new Date(data.modify_date)
    data.component = componentData.data[0]

    expect(res.body.problemId).to.equal(data.problem_id)
    expect(res.body.name).to.equal(data.name)
    expect(res.body.statusId).to.equal(data.status_id)
    expect(res.body.status).to.equal('Final Testing')
    expect((new Date(res.body.modifyDate)).getTime()).to.equal(data.modify_date.getTime())
    expect(res.body.proposedDivisionId).to.equal(data.proposed_division_id)
    expect(res.body.problemTypeId).to.equal(data.problem_type_id)
    expect(res.body.problemType).to.equal('Single')
    expect(res.body.proposedDifficultyId).to.equal(data.proposed_difficulty_id)
    expect((new Date(res.body.createDate)).getTime()).to.equal(data.create_date.getTime())
    expect(res.body.acceptedSubmissions).to.equal(data.accept_submissions)
    expect(res.body.component.componentId).to.equal(data.component.component_id)
    expect(res.body.component.problemId).to.equal(data.component.problem_id)
    expect(res.body.component.methodName).to.equal(data.component.method_name)
    expect(res.body.component.className).to.equal(data.component.class_name)
    expect(res.body.component.defaultSolution).to.equal(data.component.default_solution)
    expect(res.body.component.componentTypeId).to.equal(data.component.component_type_id)
    expect(res.body.component.componentText).to.equal(data.component.component_text)
    expect(res.body.component.statusId).to.equal(data.component.status_id)
    expect(res.body.component.componentType).to.equal('Main Component')
  })

  it('get problem without component using m2m token success', async () => {
    const res = await chai.request(app)
      .get(`${basePath}/99999997`)
      .set('Authorization', `Bearer ${token.m2m}`)

    expect(res.body.problemId).to.equal(99999997)
    expect(res.body.name).to.equal('test1')
    expect(res.body.component).to.be.undefined // eslint-disable-line no-unused-expressions
  })

  it('get problem with component without componentType success', async () => {
    const res = await chai.request(app)
      .get(`${basePath}/99999998`)
      .set('Authorization', `Bearer ${token.m2m}`)

    expect(res.body.problemId).to.equal(99999998)
    expect(res.body.name).to.equal('test2')
    expect(res.body.component.componentType).to.be.undefined // eslint-disable-line no-unused-expressions
  })

  it('get problem with invalid id', async () => {
    const res = await chai.request(app)
      .get(`${basePath}/abc`)
      .set('Authorization', `Bearer ${token.m2m}`)

    expect(res.status).to.equal(400)
    expect(res.body.message).to.equal('"problemId" must be a number')
  })

  it('get problem without token', async () => {
    const res = await chai.request(app)
      .get(`${basePath}/15557`)

    expect(res.status).to.equal(401)
    expect(res.body.message).to.equal('No token provided.')
  })

  it('get problem with expired token', async () => {
    const res = await chai.request(app)
      .get(`${basePath}/15557`)
      .set('Authorization', `Bearer ${token.expired}`)

    expect(res.status).to.equal(401)
    expect(res.body.message).to.equal('Failed to authenticate token.')
  })

  it('get problem with invalid token', async () => {
    const res = await chai.request(app)
      .get(`${basePath}/15557`)
      .set('Authorization', 'Bearer invalid')

    expect(res.status).to.equal(401)
    expect(res.body.message).to.equal('Invalid Token.')
  })

  it('get problem with invalid m2m token', async () => {
    const res = await chai.request(app)
      .get(`${basePath}/15557`)
      .set('Authorization', `Bearer ${token.m2mInvalid}`)

    expect(res.status).to.equal(403)
    expect(res.body.message).to.equal('You are not allowed to perform this action!')
  })

  it('get problem by id not found', async () => {
    const res = await chai.request(app)
      .get(`${basePath}/123`)
      .set('Authorization', `Bearer ${token.m2m}`)

    expect(res.status).to.equal(404)
    expect(res.body.message).to.equal('Problem with id: 123 doesn\'t exist')
  })
})
