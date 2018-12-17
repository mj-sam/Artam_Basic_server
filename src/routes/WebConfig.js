import { Router } from 'express'
import { AuthMW, Brute, } from '../middlewares'

import { ConfController } from '../controller'

const router = Router()

router.post('/set',             
            Brute.AccLimiter,
            AuthMW.checkTokenValidation,
            AuthMW.checkAdminPermission,
            ConfController.set)

router.get('/get',
            Brute.AccLimiter,
            ConfController.get)

export default router
