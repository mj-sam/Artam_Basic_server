import { Router } from 'express'

import { PostImage, AuthMW ,Brute} from '../middlewares'

import { PostController } from '../controller'

const router = Router()

router.get('/getallpost/:page',
            Brute.Limiter,
            AuthMW.checkTokenValidation,
            AuthMW.checkAdminPermission,
            PostController.getAllPost)

router.get('/getbrief/:page',
            Brute.Limiter,
            PostController.getAllBrief)

router.get('/getlast',
            Brute.Limiter,
            PostController.getLastBrief)

router.get('/getpost/:id', 
            Brute.Limiter,
            PostController.getPost)

router.post('/create',
            Brute.AccLimiter,
            PostImage.ProfileUploader, 
            AuthMW.checkTokenValidation,
            AuthMW.checkAdminPermission,
            PostController.createPost)

router.post('/edit',
            Brute.AccLimiter,
            PostImage.ProfileUploader, 
            AuthMW.checkTokenValidation,
            AuthMW.checkAdminPermission,
            PostController.editPost)

router.put('/delete',
            Brute.AccLimiter,
            AuthMW.checkTokenValidation,
            AuthMW.checkAdminPermission,
            PostController.deletePost)


export default router