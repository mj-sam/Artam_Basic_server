import {
  STRING,
  TEXT,
} from 'sequelize'
import {
  Configs
} from '../utilities'

const PostModel = Configs.Mysql.define('post', {
  title         : { type: STRING(50), allowNull: false, unique: true },
  briefPic      : { type: STRING(50), allowNull: false },
  brief         : { type: TEXT('long')  },
  content       : { type: TEXT('long')  },
})

export default PostModel
