import cryptoJS from 'crypto-js'
import {Constants} from '../utilities'
import request       from 'request'
import {
  AccessTokenModel,
  UserModel
} from '../models'
import { post } from 'axios';
var FormData = require('form-data');

/*
====== Generating phone code =====
*/
export const randomTokenGenerator = () => {
  let r = 'xxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, (c) => {
    let v = Math.random() * 16 | 0
    return v.toString(16)
  }).toLowerCase()
  let d = Date.now().toString().substring(0, 12)
  return `${r.slice(0, 10)}${d}${r.slice(10)}`
}

export const randomRefrralLink = () => {
  /*
  let r = 'xxxxxxxxxx'.replace(/[x]/g, (c) => {
    let v = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10)
    return v
  })
  */
  let r = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10)
  let d = Date.now().toString().substring(0, 10)
  return `${r.slice(0, 5)}${d}${r.slice(5)}`
}

/*
====== Generating phone code =====
*/
export const randomNameGenerator = () => {
  let r = 'xxxxxxxxxx'.replace(/[x]/g, (c) => {
    let v = Math.random() * 16 | 0
    return v.toString(16)
  }).toLowerCase()
  return `${r}`
}

/*
====== Generating phone code =====
*/

export const generateNewAccessToken = (user) => {
  const accessToken = randomTokenGenerator()
  user.accessToken = accessToken
  return user.save({ fields: ['accessToken'] })
    .then(() => {
      AccessTokenModel.setToken(accessToken, user.id ,user.roles)
      return { token: accessToken, id: user.id }
    })
    .catch(err => {
      throw err
    })
}

/*
====== Generating phone code =====
*/
export const getDateAfterDuration = (date, minutes) => {
  return new Date(date.getTime() + (minutes*60000))
}
/*
====== Generating phone code =====
*/
export const encrypt = (data, key) => {
  return encodeURIComponent(cryptoJS.AES.encrypt(JSON.stringify(data), key).toString())
}

export const decrypt = (encrypted, key, res) => {
  try {
    let bytes = cryptoJS.AES.decrypt(decodeURIComponent(encrypted), key)
    let decrypted = JSON.parse(bytes.toString(cryptoJS.enc.Utf8))
    return decrypted
  } catch (e) {
    return res.status(500).send()
  }
}
/*
====== Generating phone code =====
*/
export const generatePhoneCode = () => {
  return 'xxxxx'.replace(/[x]/g, (c) => {
    let r = Math.random() * 10 | 0
    return r.toString(10)
  })
}
/*
====== Send SMS =====
*/
//export const SmsApi = Kavenegar.KavenegarApi({apikey: '5472304B4536794875594178687057783674654D78782B4234385879326C634E'});
export const sendSms = async (msg, to) => {
  let formData = new FormData();
    formData.append('message' , encodeURIComponent(msg))
    formData.append('receptor'  , to)
  const url = 'https://api.kavenegar.com/v1/5472304B4536794875594178687057783674654D78782B4234385879326C634E/sms/send.json '
  const config = {
    headers: {
      'content-type': 'multipart/form-data' ,
    }
  }
  const response = await post(url, formData, config)
  console.log(response)
  return true
}
/*
export const sendSms = (msg, to, callback) => {
  let data = {
    'Username': Constants.SMS_PANEL.USERNAME,
    'Password': Constants.SMS_PANEL.PASSWORD,
    'To'      : to,
    'FROM'    : Constants.SMS_PANEL.FROM,
    'Text'    : msg
  }
  console.log('=====================')
  console.log(data)
  console.log('=====================')
  let options = {
    method: 'post',
    body:   data,
    json:   true,
    url:    Constants.SMS_PANEL.URL
  }

  request(options, (err, res, body) => {
    if (err) return callback(err)
    return callback(null, res.statusCode, body)
  })
}
*/
/*
====== Send SMS =====
*/
export const sendEmail = (msg, subject, to, callback) => {
  let transporter = nodemailer.createTransport({
    host: Constants.EMAIL_PANEL.HOST,
    port: Constants.EMAIL_PANEL.PORT,
    secure: false,
    auth: {
      user: Constants.EMAIL_PANEL.USER,
      pass: Constants.EMAIL_PANEL.PASSWORD
    }
  })
  let mailOptions = {
    from: Constants.EMAIL_PANEL.FROM,
    to: to,
    subject: subject,
    text: msg
  }
  transporter.sendMail(mailOptions, callback)
}
