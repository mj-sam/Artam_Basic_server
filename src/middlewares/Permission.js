import {
  UserModel
} from '../models'

const checkPermission = async (userId, role) => {
  try {
    let user = await UserModel.findById(userId)
    if (!user) return { errStatus: 404 }
    if (!_.includes(user.roles, role)) return { errStatus: 403 }
    return { user }
  } catch (e) {
    return { errStatus: 500 }
  }
}

export const checkAdminPermission = async (req, res, next) => {
  console.log("PERMISION CHECK")
  const { errStatus, user } = await checkPermission(res.locals.userId, 'admin')
  if (errStatus) return res.status(errStatus).end()
  res.locals.user = user
  console.log("PERMISION CHECK")
  next()
}

export const checkOperatorPermission = async (req, res, next) => {
  const { errStatus, user } = await checkPermission(res.locals.userId, 'operator')
  if (errStatus) return res.status(errStatus).end()
  res.locals.user = user
  next()
}
