/**
 * Contains all routes
 */
const constants = require('../app-constants')

module.exports = {
  '/problems': {
    get: {
      controller: 'ProblemController',
      method: 'searchProblems',
      auth: 'jwt',
      scopes: [constants.Scope.Read, constants.Scope.All]
    }
  },
  '/problems/:problemId': {
    get: {
      controller: 'ProblemController',
      method: 'getProblem',
      auth: 'jwt',
      scopes: [constants.Scope.Read, constants.Scope.All]
    }
  }
}
