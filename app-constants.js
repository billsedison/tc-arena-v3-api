/**
 * App constants
 */

const Scope = {
  Read: 'read:srm_problem',
  Write: 'write:srm_problem',
  All: 'all:srm_problem'
}

const ComponentType = {
  1: 'Main Component',
  2: 'Supporting Component'
}

const ProblemStatus = {
  10: 'Proposal Pending Approval',
  20: 'Proposal Rejected',
  30: 'Proposal Approved',
  40: 'Submission Pending',
  50: 'Submission Rejected',
  60: 'Submission Approved',
  70: 'Testing',
  80: 'Ready',
  90: 'Used',
  75: 'Final Testing'
}

const ProblemType = {
  1: 'Single',
  2: 'Team',
  3: 'Long'
}

module.exports = {
  Scope,
  ComponentType,
  ProblemStatus,
  ProblemType
}
