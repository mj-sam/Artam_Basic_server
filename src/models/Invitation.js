import {
  INTEGER,
  STRING,
} from 'sequelize'
import {
  Configs
} from '../utilities'

const InvitationModel = Configs.Mysql.define('invitation', {
  id: {
    type          : INTEGER,
    primaryKey    : true,
    allowNull     : false,
    autoIncrement : true,
    unique        : true
    },
  CallerId: {
    type          : INTEGER,
    allowNull     : false
    },
  InvitedId: {
    type          : INTEGER,
    allowNull     : false
  },
  Name: {
    type          : STRING(60),
    allowNull     : false,}
})


export default InvitationModel
