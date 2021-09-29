import _ from 'lodash'
import {
  STRING
} from 'sequelize'
import {
  Configs,
} from '../utilities'

const CategoryModel = Configs.Mysql.define('category', {
  title			  : { type: STRING(50), allowNull: false, unique: true },
})

export default CategoryModel
