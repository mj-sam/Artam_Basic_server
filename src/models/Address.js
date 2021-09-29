import {
  STRING,
  TEXT,
  DOUBLE
} from 'sequelize'
import {
  Configs
} from '../utilities'

const AddressModel = Configs.Mysql.define('address', {
  city:      { type: STRING(50), allowNull: false },
  address:   { type: TEXT('long'), allowNull: false },}
)

export default AddressModel
