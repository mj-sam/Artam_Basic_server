import {
  AccessTokenModel
} from '../models'
import _ from 'lodash'

export const checkAdminPermission = async (req, res, next) => {
  console.log("PERMISION CHECK")
  if (!_.includes(res.locals.userRolles, 'admin')) return res.status(403).send()
  console.log("PERMISION CHECK")
  next()
}

export const checkTokenValidation = async (req, res, next) => {
  if (!req.get('x-access-key')) return res.status(400).end()
  try {
    AccessTokenModel.getTokenAsync(req.get('x-access-key')).then((redisVal) => {
      console.log("============= redis val ===================")
      console.log(redisVal)
      if (!redisVal) return res.status(401).end()
      let { uid , roles} = JSON.parse(redisVal)
      res.locals.userId = uid
      res.locals.userRolles = roles
      AccessTokenModel.setToken(req.get('x-access-key'), uid, roles)
      next()
    }).catch((error) => {
      return res.status(500).end('access key is not valid')
    })
  } catch (e) {
    return res.status(500).end()
  }
}
/*
export const checkUserSignedInBeforUpload = async (req, res, next) => {
  try {
    if (req.get('x-access-key')) {
      let uid = await AccessTokenModel.getTokenAsync(req.get('x-access-key'))
      if (uid) {
        res.locals.userId = uid
        AccessTokenModel.setToken(req.get('x-access-key'), uid)
        next()
      }else {
        return res.status(403).end()
      }

    } else {
      return res.status(403).end()
    }
  } catch (e) {
    return res.status(500).end()
  }
}

export const checkUserSignedIn = async (req, res, next) => {
  try {
    if (req.get('x-access-key')) {
      let uid = await AccessTokenModel.getTokenAsync(req.get('x-access-key'))
      if (uid) {
        res.locals.userId = uid
        AccessTokenModel.setToken(req.get('x-access-key'), uid)
      }
    }
    next()
  } catch (e) {
    return res.status(500).end()
  }
}
 */