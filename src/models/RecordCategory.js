import {
  INTEGER,
} from 'sequelize'
import {
  Configs
} from '../utilities'

const RecordCategoryModel = Configs.Mysql.define('recordcategory', {
  id: {
    type: INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    unique: true
    },
  PostId: {
    type: INTEGER,
    references: 'post',
    referencesKey: 'id',
    allowNull: false
    },
  CategoryId: {
    type: INTEGER,
    references: 'category',
    referencesKey: 'id',
    allowNull: false
  },
})


export default RecordCategoryModel
