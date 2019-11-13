/**
 * Insert test data to database.
 */
require('../app-bootstrap')
const models = require('./models')
const logger = require('./common/logger')
const componentData = require('../data/component.json')
const problemData = require('../data/problem.json')

const Component = models.Component
const Problem = models.Problem

logger.info('Insert test data into database.')

const insertData = async () => {
  for (const element of problemData.data) {
    await Problem.create({
      problemId: element.problem_id,
      name: element.name,
      statusId: element.status_id,
      problemText: element.problem_text,
      proposedDivisionId: element.proposed_division_id,
      problemTypeId: element.problem_type_id,
      proposedDifficultyId: element.proposed_difficulty_id,
      createDate: element.create_date,
      modifyDate: element.modify_date,
      acceptedSubmissions: element.accept_submissions
    })
  }
  for (const element of componentData.data) {
    const component = {
      componentId: element.component_id,
      problemId: element.problem_id,
      resultTypeId: element.result_type_id,
      methodName: element.method_name,
      className: element.class_name,
      defaultSolution: element.default_solution,
      componentTypeId: element.component_type_id,
      componentText: element.component_text,
      statusId: element.status_id
    }
    if (!isNaN(new Date(element.modify_date))) {
      component.modify_date = new Date(element.modify_date)
    }
    await Component.create(component)
  }
}

if (!module.parent) {
  insertData().then(() => {
    logger.info('Done!')
    process.exit()
  }).catch((e) => {
    logger.logFullError(e)
    process.exit(1)
  })
}

module.exports = {
  insertData
}
