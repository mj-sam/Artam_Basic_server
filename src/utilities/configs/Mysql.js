import Sequelize from 'sequelize'
import {
  MYSQL
} from '../Constants'

const sequelize = new Sequelize(`mysql://${MYSQL.USERNAME}:${MYSQL.PASSWORD}@${MYSQL.HOST}/${MYSQL.DATABASE}`, {
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci'
  }
})

sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.')
  })
  .catch(err => {
    console.log('Unable to connect to the database:', err)
  })

export default sequelize
