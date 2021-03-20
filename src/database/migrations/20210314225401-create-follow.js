'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("follows",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        user_from: {
          type: Sequelize.INTEGER,
          allowNull: false,
          reference: {
            model: "users",
            key: "id"
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE"
        },
        user_to: {
          type: Sequelize.INTEGER,
          allowNull: false,
          reference: {
            model: "users",
            key: "id"
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE"
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false
        }
      });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("follows");
  }
};
