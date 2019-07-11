module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      author: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      tags: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
      .then(() => queryInterface.addIndex('Books', ['title']))
      .then(() => queryInterface.addIndex('Books', ['author']))
      .then(() => queryInterface.addIndex('Books', ['tags']))
      .then(() => queryInterface.addIndex('Books', ['createdAt'])),
  down: (queryInterface, Sequelize) => // eslint-disable-line no-unused-vars
    queryInterface.dropTable('Books'),
}
