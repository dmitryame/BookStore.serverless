import Sequelize from 'sequelize'
import { sequelize } from '../../../config/consts'

const Book = sequelize.define('Book', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  uuid: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  location: {
    type: Sequelize.GEOMETRY('POINT'),
    allowNull: false,
  },
  likes: {
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
  active: {
    allowNull: false,
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
}, {
  getterMethods: {
    getImgUrl() {
      return `https://s3.amazonaws.com/${process.env.IMAGE_BUCKET}/${this.id}`
    },
    getThumbUrl() {
      return `https://s3.amazonaws.com/${process.env.IMAGE_BUCKET}/${this.id}-thumb`
    },
  },
})

// Adding a class level method

// Adding an instance level method

export default Book
