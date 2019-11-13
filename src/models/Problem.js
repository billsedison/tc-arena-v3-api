/**
 * The Problem model.
 */
const config = require('config')

module.exports = (sequelize, DataTypes) => {
  const Problem = sequelize.define('Problem', {
    problemId: { type: DataTypes.BIGINT, field: 'problem_id', allowNull: false, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    statusId: { type: DataTypes.INTEGER, field: 'status_id', allowNull: true },
    problemText: { type: DataTypes.TEXT, field: 'problem_text', allowNull: true },
    proposedDivisionId: { type: DataTypes.INTEGER, field: 'proposed_division_id', allowNull: true },
    problemTypeId: { type: DataTypes.INTEGER, field: 'problem_type_id', allowNull: true },
    proposedDifficultyId: { type: DataTypes.INTEGER, field: 'proposed_difficulty_id', allowNull: true },
    createDate: { type: DataTypes.DATE, field: 'create_date', allowNull: true },
    modifyDate: { type: DataTypes.DATE, field: 'modify_date', allowNull: true },
    acceptedSubmissions: { type: DataTypes.INTEGER, field: 'accept_submissions', allowNull: true }
  }, {
    schema: config.DB_SCHEMA_NAME,
    tableName: 'problem',
    timestamps: false
  })

  Problem.associate = (models) => {
    Problem.hasOne(models.Component, { as: 'component', foreignKey: 'problemId' })
  }

  return Problem
}
