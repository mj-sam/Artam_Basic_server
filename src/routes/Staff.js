import { Router } from 'express'
import { StaffController } from '../controller'
import { AuthMW ,Brute} from '../middlewares'
import multer from 'multer'
import path from 'path'
import {
    Helper
  } from '../utilities'

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/staffs')
    },
    filename: function (req, file, cb) {
      cb(null,  `${Helper.randomNameGenerator()}${Date.now()}${path.extname(file.originalname)}`)
    }
  })
const upload = multer({
    storage,
    limits: {fileSize: 10000000, files: 4},
    fileFilter:  (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg)$/)) {
            return callback(new Error('Only Images are allowed !'), false)
        }
        callback(null, true);
    }
}).fields([ {name : 'profile' , maxCount : 1}, ])

const router = Router()

router.post('/create',
            Brute.Limiter,
            AuthMW.checkTokenValidation,
            AuthMW.checkAdminPermission,
            upload,StaffController.createStaff)

router.put('/delete',
            Brute.Limiter,
            AuthMW.checkTokenValidation,
            AuthMW.checkAdminPermission,
            StaffController.deleteStaff)

router.put('/edit',
            Brute.Limiter,
            AuthMW.checkTokenValidation,
            AuthMW.checkAdminPermission,
            StaffController.editStaff)

router.get('/getall',
            Brute.Limiter,
            StaffController.getAllStaff)

export default router