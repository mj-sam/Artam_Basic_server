import {
  promisify
} from 'util'
import {
  Configs,
  Constants
} from '../utilities'

export const setToken = (token, uid,roles) => {
  let value = JSON.stringify({uid , roles})
  Configs.Redis.set(token, value, 'EX', Constants.AUTH_TOKEN_EXPIRES)
}
export const setResetToken = (token) => {
  Configs.Redis.set(token,true,)
}

export const setConfigs = (configs) => {
  let value = JSON.stringify(configs)
  Configs.Redis.set('webConfigs', value,)
}
export const resetConfigs = (configs) => {
  Configs.Redis.del('webConfigs')
  let value = JSON.stringify(configs)
  Configs.Redis.set('webConfigs', value,)
}

//export const setConfigsAsync = promisify(setConfigs)

export const getTokenAsync = promisify(Configs.Redis.get).bind(Configs.Redis)

export const delToken = (token) => {
  Configs.Redis.del(token)
}
