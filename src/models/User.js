import _ from 'lodash'
import {
  STRING,
  DECIMAL,
  BOOLEAN,
  JSON,
} from 'sequelize'
import {
  Configs,
  Constants
} from '../utilities'

const UserModel = Configs.Mysql.define('user', {
  username      : { type: STRING(20)    ,
                    allowNull   : false,
                    unique: true,
                    validate: { len: [4, 20] } },

  password      : { type      : STRING(50)    ,
                    allowNull : false },

  accessToken   : { type      : STRING(64)    ,
                    unique    : true },

  referralLink  : { type      : STRING(20)    ,
                    allowNull : false,
                    unique    : true,
                    validate  : { len: [4, 20] } },

  email         : { type      : STRING(50),
                    unique    : true,
                    validate: { isEmail: true } },

  emailVerified : { type      : BOOLEAN ,
                    defaultValue: [false]},

  phone         : { type: STRING(11),
                    unique      : true,
                    validate    : { isNumeric: true } },

  roles         : { type        : JSON,
                    allowNull   : false,
                    defaultValue: ['user']},

  credit        : { type        : DECIMAL(10, 1),
                    allowNull   : false,
                    defaultValue: 0,
                    validate    : { min: 0 } },

  profile       : { type        : STRING(100) ,},

  legalUser     : { type        : BOOLEAN ,
                    allowNull   : false,},
}, {
    hooks: {
    beforeSave: (user, options) => {
      return new Promise((resolve, reject) => {
        let userRoles = _.intersection(user.roles, _.map(Constants.USER_ROLE, 'role'))
        user.roles = _.isEmpty(userRoles) ? ['user'] : userRoles
        resolve()
      })
    },
  }
})

export default UserModel
