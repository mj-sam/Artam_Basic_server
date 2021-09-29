import _ from 'lodash'
import {
  STRING,
  DECIMAL,
  BOOLEAN,
  JSON
} from 'sequelize'
import {
  Configs,
  Constants
} from '../utilities'

const StaffModel = Configs.Mysql.define('staff', {
  firstName         : { type: STRING(30)    ,},
  lastName          : { type: STRING(30)    ,},
  email             : { type: STRING(50)    , unique      : true, validate: { isEmail: true } },
  profile           : { type: STRING(50)    ,},
  bio               : { type: STRING(100)   ,},
})

export default StaffModel
