'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("likes",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          reference: {
            model: "users",
            key: "id"
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE"
        },
        photo_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          reference: {
            model: "photos",
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
    return queryInterface.dropTable("likes");
  }
};
