import { Router } from 'express'

import { AuthMW ,Brute} from '../middlewares'  

import { UserController } from '../controller'

const router = Router()

router.post('/askverifyemail',
            Brute.AccLimiter,
            AuthMW.checkTokenValidation,
            UserController.askVerifyEmail)

router.post('/signout',
            Brute.AccLimiter,
            AuthMW.checkTokenValidation,
            UserController.signOut)

router.post('/sendInvitation',
            Brute.InvLimiter,
            AuthMW.checkTokenValidation,
            UserController.SendInvitation)

router.post('/verifyEmail', 
            Brute.AccLimiter,
            UserController.verifyEmail)

            
router.post('/search', 
            Brute.Limiter,
            AuthMW.checkTokenValidation,
            AuthMW.checkAdminPermission,
            UserController.searchUser)

router.get('/tockenvalidation',
            AuthMW.checkTokenValidation,
            UserController.tockenValidation)

router.get('/getinvited/:userId', 
            Brute.Limiter,
            AuthMW.checkTokenValidation, 
            AuthMW.checkAdminPermission,           
            UserController.getInvitedAdmin)

router.get('/getinvited',
            Brute.Limiter,
            AuthMW.checkTokenValidation,            
            UserController.getInvited)

router.get('/getprofile/:userId', 
            Brute.Limiter,
            AuthMW.checkTokenValidation,
            AuthMW.checkAdminPermission,          
            UserController.getProfileAdmin)

router.get('/getprofile',
            Brute.Limiter,
            AuthMW.checkTokenValidation,
            UserController.getProfile)

router.get('/getallusers/:page',
            Brute.Limiter,
            AuthMW.checkTokenValidation,
            AuthMW.checkAdminPermission,
            UserController.getAllUsers)

router.get('/getlegalusers/:page',
            Brute.Limiter,
            AuthMW.checkTokenValidation,
            AuthMW.checkAdminPermission,
            UserController.getLegalUsers)

router.get('/getrealusers/:page', 
            Brute.Limiter,
            AuthMW.checkTokenValidation,
            AuthMW.checkAdminPermission,
            UserController.getRealUsers)

router.put('/setAdmin/:userId',
            Brute.AccLimiter,
            AuthMW.checkTokenValidation,
            AuthMW.checkAdminPermission,
            UserController.SetRoles)

router.put('/takeAdmin/:userId',
            Brute.AccLimiter,
            AuthMW.checkTokenValidation,
            AuthMW.checkAdminPermission,
            UserController.TakeAdmin)

router.put('/edituser' ,
            Brute.AccLimiter,
            AuthMW.checkTokenValidation,
            AuthMW.checkAdminPermission,
            UserController.editProfile)

export default router
/*
let X = {"id":1,
    "name":"alire",
    "nSubmit":"reza",
    "nNational":"samery@gmail.com",
    "submitDate":"23435234",
    "CEO":"this is me",
    "activityArea":"tst",
    "firmActivityArea":"tsets",
    "createdAt":"2018-10-25T18:03:04.000Z",
    "updatedAt":"2018-10-25T18:03:04.000Z",
    "UserId":1,
    "legal":{"id":1,
            "username":"user1",
            "password":"user1",
            "accessToken":null,
            "referralLink":"to_be_created",
            "email":"asdad@asdasd.com",
            "emailVerified":false,
            "phone":"9125536268",
            "roles":["admin","user"],
            "credit":"133.0",
            "profile":"483af25f1d1540490584655.jpeg",
            "legalUser":true,
            "createdAt":"2018-10-25T18:03:04.000Z",
            "updatedAt":"2018-10-25T18:03:04.000Z"}
        }
*/