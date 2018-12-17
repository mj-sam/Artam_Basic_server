/*
  Media Middleware
*/
import path from 'path'
import _ from 'lodash'
import multer from 'multer'
import express    from 'express'

import {
  Helper
} from '../utilities'

//const profilePath = path.join(__dirname, '..', 'images', 'users')

const profileMaxSize = 5 * 1024 * 1024

const imageFilter = (req, file, cb) => {
  if (!_.includes(['.jpg','.JPG','.Jpg','.JPEG', '.jpeg'], path.extname(file.originalname))) {
    let error = new Error('Only jpg/jpeg allowed!')
    error.code = 'LIMIT_UNEXPECTED_EXT'
    return cb(error, false)
  }
  cb(null, true)
}
//=========== Image Uploader =====================/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/users')
  },
  filename: (req, file, cb) => {
    /*const name = `${Helper.randomNameGenerator()}${Date.now()}${path.extname(file.originalname)}`
    req.uploadedFileName = name*/
    cb(null, `${Helper.randomNameGenerator()}${Date.now()}${path.extname(file.originalname)}`)
  }
})

export const ProfileUploader = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: profileMaxSize }
}).single('profile')
