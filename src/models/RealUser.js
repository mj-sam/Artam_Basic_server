import _ from 'lodash'
import {
  STRING,
  DECIMAL,
  BOOLEAN,
  JSON,
} from 'sequelize'
import {
  Configs,
} from '../utilities'

const RealUserModel = Configs.Mysql.define('realUser', {
    firstName   : { type: STRING(30)    ,},
    lastName    : { type: STRING(30)    ,},
    nNational   : { type    : STRING(11)    ,
                    unique  : true,},
    work        : { type: STRING(30)    ,},
    workPlace   : { type: STRING(30)    ,},
    birthDate   : { type: STRING(50)    ,
                    allowNull   : false },
    }, {
        hooks: {}
    })

export default RealUserModel
