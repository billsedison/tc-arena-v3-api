/**
 * The Component model.
 */
const config = require('config')

module.exports = (sequelize, DataTypes) => {
  const Component = sequelize.define('Component', {
    componentId: { type: DataTypes.BIGINT, field: 'component_id', allowNull: false, primaryKey: true },
    problemId: { type: DataTypes.BIGINT, field: 'problem_id', allowNull: false },
    resultTypeId: { type: DataTypes.INTEGER, field: 'result_type_id', allowNull: false },
    methodName: { type: DataTypes.STRING, field: 'method_name', allowNull: false },
    className: { type: DataTypes.STRING, field: 'class_name', allowNull: false },
    defaultSolution: { type: DataTypes.TEXT, field: 'default_solution', allowNull: true },
    componentTypeId: { type: DataTypes.INTEGER, field: 'component_type_id', allowNull: true },
    componentText: { type: DataTypes.TEXT, field: 'component_text', allowNull: true },
    statusId: { type: DataTypes.INTEGER, field: 'status_id', allowNull: true },
    modifyDate: { type: DataTypes.DATE, field: 'modify_date', allowNull: true }
  }, {
    schema: config.DB_SCHEMA_NAME,
    tableName: 'component',
    timestamps: false
  })

  /* Component.associate = (models) => {
    Component.belongsTo(models.Problem, { foreignKey: 'problemId' })
  } */

  return Component
}
