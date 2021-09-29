import {
    Router
  } from 'express'

import {
    Images,
    Brute,
  } from '../middlewares'
  
import {AuthController} from '../controller'

const router = Router()

router.post('/register/signin', Brute.AccLimiter ,AuthController.signin)

router.post('/register/signup', Brute.Limiter, AuthController.signup)

router.post('/register/verify', Brute.Limiter, AuthController.verify)

router.post('/register/final',Images.ProfileUploader, Brute.AccLimiter ,AuthController.final)

router.post('/register/fakelegal',Images.ProfileUploader, Brute.AccLimiter ,AuthController.fakeLegal)

router.post('/register/resend', Brute.AccLimiter ,AuthController.resend)

router.post('/password/reset', Brute.AccLimiter ,AuthController.resetPass)

router.put('/password/submit', Brute.AccLimiter , AuthController.submitPass)

router.put('/register/change', AuthController.change)

router.get('/register/checkuser', Brute.Limiter , AuthController.checkUser)

router.get('/register/checkphone', Brute.Limiter, AuthController.checkPhone)

router.get('/password/verify', Brute.Limiter, AuthController.verifyPass)



export default router
