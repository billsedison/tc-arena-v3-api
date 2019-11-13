/**
 * Controller for Problem endpoints
 */

const service = require('../services/ProblemService')
const helper = require('../common/helper')

/**
 * Search problems.
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function searchProblems (req, res) {
  const result = await service.searchProblems(req.query)
  helper.setResHeaders(req, res, result)
  res.send(result.result)
}

/**
 * Get problem by id.
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function getProblem (req, res) {
  const result = await service.getProblem(req.params.problemId)
  res.send(result)
}

module.exports = {
  searchProblems,
  getProblem
}
