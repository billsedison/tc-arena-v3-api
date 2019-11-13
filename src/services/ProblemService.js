/**
 * This service provides operations of Problem.
 */

const _ = require('lodash')
const Joi = require('@hapi/joi')
const helper = require('../common/helper')
const logger = require('../common/logger')
const errors = require('../common/errors')
const models = require('../models')
const { ProblemStatus, ProblemType, ComponentType } = require('../../app-constants')

const Problem = models.Problem
const Component = models.Component

/**
 * Populate additional fields on problem entity
 * @returns {Object} the problem entity
 */
function populateFields (problem) {
  if (problem.statusId) {
    problem.status = ProblemStatus[problem.statusId]
  }
  if (problem.problemTypeId) {
    problem.problemType = ProblemType[problem.problemTypeId]
  }
  delete problem.problemText
  return problem
}

/**
 * Search problems
 * @param {Object} criteria the search criteria, only pagination currently
 * @returns {Object} the search result, contain total/page/perPage and result array
 */
async function searchProblems (criteria) {
  const countResult = await Problem.findOne({
    attributes: [[models.Sequelize.fn('COUNT', models.Sequelize.col('problem_id')), 'total']],
    raw: true
  })

  const result = await Problem.findAll({
    order: [['problemId', 'ASC']],
    limit: criteria.perPage,
    offset: (criteria.page - 1) * criteria.perPage,
    raw: true
  })

  return {
    total: countResult.total,
    page: criteria.page,
    perPage: criteria.perPage,
    result: helper.clearObject(_.map(result, populateFields))
  }
}

searchProblems.schema = {
  criteria: Joi.object().keys({
    page: Joi.page(),
    perPage: Joi.perPage()
  }).required()
}

/**
 * Get problem by id
 * @param {Number} problemId the problem id
 * @returns {Object} the problem
 */
async function getProblem (problemId) {
  const problem = await Problem.findByPk(problemId, {
    include: [{
      model: Component,
      as: 'component'
    }]
  })
  if (problem) {
    const result = problem.dataValues

    if (result.component) {
      result.component = result.component.dataValues
      if (result.component.componentTypeId) {
        result.component.componentType = ComponentType[result.component.componentTypeId]
      }
      delete result.component.resultTypeId
      result.component = helper.clearObject(result.component)
    }

    return helper.clearObject(populateFields(result))
  } else {
    throw new errors.NotFoundError(`Problem with id: ${problemId} doesn't exist`)
  }
}

getProblem.schema = {
  problemId: Joi.number().integer().required()
}

module.exports = {
  searchProblems,
  getProblem
}

logger.buildService(module.exports)
