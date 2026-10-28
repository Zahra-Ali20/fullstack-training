'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'password', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM('user', 'manager', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'role');
    await queryInterface.removeColumn('users', 'password');
  },
};