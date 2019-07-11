import Sequelize from 'sequelize'
import { sequelize } from '../../../config/consts'

const Book = sequelize.define('Book', {
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

// Adding a class level method

// Adding an instance level method

export default Book
