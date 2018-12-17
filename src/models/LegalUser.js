import _ from 'lodash'
import {
  STRING,
} from 'sequelize'
import {
  Configs,
} from '../utilities'

const LegalUserModel = Configs.Mysql.define('legalUser', {
    name        :{  type     : STRING(20),
                    allowNull: false, 
                    unique   : true, 
                    validate : { len: [4, 20] } },

    nSubmit     :{  type     : STRING(50), 
                    allowNull: false },

    nNational   :{  type: STRING(50)    ,
                    allowNull   : false },

    submitDate  :{  type: STRING(50)    , 
                    allowNull   : false },

    CEO         :{  type: STRING(50), 
                    allowNull   : false },

    activityArea:{  type: STRING(50)    , 
                    allowNull   : true },
    firmActivityArea:{  type: STRING(50)    , 
                        allowNull   : true },
}, {
    hooks: {}
})

export default LegalUserModel
