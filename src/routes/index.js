import {
  Router
} from 'express'
import Auth 	from './Auth'
import Post   from './Post'
import User   from './User'
import Staff  from './Staff'
import WConf  from './WebConfig'

const router = Router()

router.use('/authentication', Auth)

router.use('/post'          , Post)

router.use('/user'          , User)

router.use('/staff'         , Staff)

router.use('/wconf'         , WConf)

export default router
