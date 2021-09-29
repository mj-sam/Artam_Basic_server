import _ from 'lodash'
import {
  AccessTokenModel,
  UserModel,
  InvitationModel,
  LegalUserModel,
  RealUserModel,
  LegalAco,
  RealAco
} from '../models'
import {
  Helper,
  Configs,
  Constants
} from '../utilities'
var Kavenegar = require('kavenegar');

var AuthController = {
  signin : async (req, res) => {
    if (!_.has(req.body, 'input') ||
        !_.has(req.body, 'type') ||
        !_.has(req.body, 'password')) return res.status(400).send()

    if (!_.includes(['username', 'phone', 'email'], req.body.type)) return res.status(400).send()
    try {
      let user = await UserModel.findOne({
                    where: {
                      username: req.body.input,
                      password: req.body.password
                    },
                    attributes: ['id', 'accessToken','roles']
                  })
      if (!user) return res.status(404).send()
      let redisVal = await AccessTokenModel.getTokenAsync(user.accessToken)
      let result
      if (!user.accessToken || !redisVal){ 
        result = await Helper.generateNewAccessToken(user)
      } else {
        let {uid , roles } = JSON.parse(redisVal)
        result = { token: user.accessToken, id: uid }
    }
      return res.status(200).set('x-access-key', result.token).json({ id: result.id })
    } catch (e) {
      console.log("===========================")
      console.log(e)
      return res.status(500).json(e)
    }
  },
  checkUser : async (req, res) => {
    try {
      if (!req.get('x-user-info')) return res.status(400).send()
      let userValidity = await UserModel.findOne({ where : {username : req.get('x-user-info')} })
      if(userValidity) return res.status(409).send()
      return res.status(204).send()
    } catch(e) {
      console.log("===========================")
      console.log(e)
      return res.status(500).json(e)
    }
  },
  checkPhone :async (req, res) => {
    try {
      if (!req.get('x-user-info')) return res.status(400).send()
      let phoneValidity = await UserModel.findOne({ where : {phone   : req.get('x-user-info'),} })
      if(phoneValidity) return res.status(409).send()
      return res.status(204).send()
    } catch(e) {
      console.log("===========================")
      console.log(e)
      return res.status(500).json(e)
    }
  },
  signup : async (req, res) => {
    try {
      if (!_.has(req.body, 'username') ||
          !_.has(req.body, 'phone') ||
          !_.has(req.body, 'password'
            )) return res.status(400).send()
      const code = Helper.generatePhoneCode()
      if(req.body.phone.length === 11) req.body.phone = req.body.phone.slice(1)
      let userValidity = await UserModel.findOne({ where : {username : req.body.username} })
      let phoneValidity = await UserModel.findOne({ where : {phone   : req.body.phone,} })
      
      if(userValidity) return res.status(409).send('user')
      if(phoneValidity) return res.status(409).send('phone')
      if(req.body.referral){
      let referralUser = await UserModel.findOne({where : {referralLink : req.body.referral} })
      if(!referralUser) return res.status(404).send("referral link not valid")
      }
      
      let data = {
          username: req.body.username,
          password: req.body.password,
          phone   : req.body.phone,
          code    : code,
          referral: req.body.referral ? req.body.referral :'n',
          expires : Date.now() + (1000 * 60 * 60 * 1),
          resend  : Date.now() + (1000 * 60 * 1)
        }
      
      const encoded = Helper.encrypt(data, Constants.SECRET_KEY.REGISTER)
      const msg = `${code}`
      var api = Kavenegar.KavenegarApi({apikey: Constants.SMS_PANEL.API_KEY});
      api.Send({
        message: msg,
        receptor: req.body.phone
      });
      console.log("===========================")
      console.log(code)
      console.log(encoded)
      console.log("===========================")
      res.status(204).set('x-user-info', encoded).send()
    } catch (e) {
      console.log("===========================")
      console.log(e)
      return res.status(500).json(e)
    }
  },
  signOut : async (req, res) => {
    console.log("================================")
    console.log("signOut")
    //if (!_.has(req.body, 'code') || !req.get('x-user-info')) return res.status(400).send()
    try {
      if(!req.params.userId) return res.status(400).send()
      if (decrypted.code   !=  req.body.code) return res.status(406).send()
      if (Date.now()   >   decrypted.expires) return res.status(403).send()
      decrypted.phoneValid = true
      const encoded = Helper.encrypt(decrypted, Constants.SECRET_KEY.REGISTER)
      return res.status(204).set('x-user-info', encoded).send()
    } catch(e) {
      console.log("===========================")
      console.log(e)
      return res.status(500).json(e)
    }
  },
  verify : async (req, res) => {
    console.log("================================")
    console.log("verify")
    console.log(req.body.code)
    console.log(req.get('x-user-info'))
    //if (!_.has(req.body, 'code') || !req.get('x-user-info')) return res.status(400).send()
    try {
      if (
        !_.has(req.body, 'code') || !req.get('x-user-info') ) return res.status(400).send()
      let decrypted = Helper.decrypt(
                        req.get('x-user-info'),
                        Constants.SECRET_KEY.REGISTER,
                        res)
      if (decrypted.code   !=  req.body.code) return res.status(406).send()
      if (Date.now()   >   decrypted.expires) return res.status(403).send()
      decrypted.phoneValid = true
      const encoded = Helper.encrypt(decrypted, Constants.SECRET_KEY.REGISTER)
      return res.status(204).set('x-user-info', encoded).send()
    } catch(e) {
      console.log("===========================")
      console.log(e)
      return res.status(500).json(e)
    }
  },
  final : async (req, res) => {
    console.log("================================")
    console.log("final")
    try {
      if (
        !_.has(req.body, 'email') ||
        !_.has(req.body, 'legalUser') ||
        !req.get('x-user-info')
        ) return res.status(400).send()
      
      let decrypted = Helper.decrypt(
                      req.get('x-user-info'),
                      Constants.SECRET_KEY.REGISTER,
                      res)

      if (!decrypted.phoneValid) return res.status(403).send()
      
      let refrral = Helper.randomRefrralLink()
      let referralUser = null
      
      
      let configFile = await AccessTokenModel.getTokenAsync('webConfigs')

      configFile = JSON.parse(configFile)
      
      let user = null
      let newId = null
      let newName = null
      
      if( req.body.legalUser == '1'){
        if (
            !_.has(req.body, 'name') ||
            !_.has(req.body, 'nSubmit') ||
            !_.has(req.body, 'nNational') ||
            !_.has(req.body, 'submitDate')
          ) return res.status(400).send()

          user = await  LegalUserModel.create({
                              name            : req.body.name,
                              nSubmit         : req.body.nSubmit,
                              nNational       : parseInt(req.body.nNational),
                              submitDate      : req.body.submitDate,
                              CEO             : req.body.CEO ? req.body.CEO : '',
                              activityArea    : req.body.activityArea ? req.body.activityArea : '',
                              firmActivityArea: req.body.firmActivityArea ? req.body.firmActivityArea : '',
                              legal: {
                                username      : decrypted.username,
                                password      : decrypted.password,
                                referralLink  : refrral,
                                legalUser     : true,
                                email         : req.body.email ? req.body.email : '',
                                phone         : decrypted.phone,
                                credit        : configFile.credit,
                                profile       : res.req.file ? res.req.file.filename : '',
                              }
                            }, {
                              include: [ LegalAco ]
                            })
          if(!user) return res.status(500).send("cant create new user")
          newId   = user.legal.id
          newName = req.body.name
      } else {
        if (
          !_.has(req.body, 'firstName') ||
          !_.has(req.body, 'lastName') ||
          !_.has(req.body, 'nNational')
        ) return res.status(400).send()

        user = await  RealUserModel.create({
                            firstName     : req.body.firstName,
                            lastName      : req.body.lastName,
                            nNational     : parseInt(req.body.nNational),
                            work          : req.body.work ? req.body.work : '',
                            workPlace     : req.body.workPlace ? req.body.workPlace : '',
                            birthDate     : req.body.birthDate ? req.body.birthDate : '',
                            real: {
                              username      : decrypted.username,
                              password      : decrypted.password,
                              referralLink  : refrral,
                              legalUser     : false,
                              email         : req.body.email ? req.body.email : '',
                              phone         : decrypted.phone,
                              credit        : configFile.credit,
                              profile       : res.req.file ? res.req.file.filename : '',
                            }
                          }, {
                            include: [ RealAco ]
                          })
          if(!user) console.log("CANT :::: ")
          if(!user) res.status(500).send("cant create new user")
          newId   = user.real.id
          newName = req.body.firstName+" "+req.body.lastName
      }
      console.log(decrypted.referral)
      if(decrypted.referral != 'n'){
        referralUser = await UserModel.findOne({where : {referralLink : decrypted.referral} })
        referralUser.credit = parseInt(referralUser.credit) + parseInt(configFile.referral)
        await referralUser.save()
        let invitation = await InvitationModel.create({
          CallerId  : referralUser.id , 
          InvitedId : newId ,
          Name      : newName,
        })
      }
      return res.status(200).json(user)
    } catch(e) {
      console.log("================================");
      console.log(e);
      return res.status(500).json(e)
    }
  },
  fakeLegal : async (req,res) => {
    let refrral = Helper.randomRefrralLink()
    LegalUserModel.create({
      name            : req.body.name,
      nSubmit         : req.body.nSubmit,
      nNational       : req.body.nNational,
      submitDate      : req.body.submitDate,
      CEO             : req.body.CEO,
      activityArea    : req.body.activityArea ? req.body.activityArea : '',
      firmActivityArea: req.body.firmActivityArea ? req.body.firmActivityArea : '',
      legal: {
        username      : req.body.username,
        password      : req.body.password,
        referralLink  : refrral,
        legalUser     : true,
        email         : req.body.email,
        phone         : req.body.phone,
        credit        : req.body.credit ? req.body.credit : '',
        profile       : res.req.file ? res.req.file.filename : '',
      }
    }, {
      include: [ LegalAco ]
    }).then( (user) => {
        return res.status(200).json(user)
    }).catch( (error) => {
        return res.status(500).json(error)
    })
  },
  resend :  async (req, res) => {
    console.log("================================")
    console.log("resend")
    if (!req.get('x-user-info')) return res.status(400).send()
    try {
      let decrypted = Helper.decrypt(
                    req.get('x-user-info'),
                    Constants.SECRET_KEY.REGISTER,
                    res)
      if (Date.now() < decrypted.resend) return res.status(403).send()
      decrypted.resend = Date.now() + (1000 * 60 * 1)
      const encoded = Helper.encrypt(decrypted, Constants.SECRET_KEY.REGISTER)
      const msg = `${decrypted.code}`
      var api = Kavenegar.KavenegarApi({apikey: Constants.SMS_PANEL.API_KEY});
      api.Send({
        message: msg,
        receptor: decrypted.phone,
      });
      return res.status(201).send()
      console.log("===========================")
      console.log(msg)
      console.log(encoded)
      console.log("===========================")
    } catch(e) {
      console.log("===========================")
      console.log(e)
      return res.status(500).json(e)
    }
  },
  change : async (req, res) => {
    if (!req.get('x-user-info') || !_.has(req.body, 'phone')) return res.status(400).send()
    try {
      let decrypted = Helper.decrypt(
                req.get('x-user-info'),
                Constants.SECRET_KEY.REGISTER,
                res)
      if (Date.now() > decrypted.expires) return res.status(403).send()
      const code = Helper.generatePhoneCode()
      decrypted.phone = req.body.phone
      decrypted.code = code
      decrypted.expires = Date.now() + (1000 * 60 * 60 * 1)
      const encoded = Helper.encrypt(decrypted, Constants.SECRET_KEY.REGISTER)
      const msg = `${code}`
      /*
      Helper.sendSms(
        msg,
        req.body.phone,
        (errSms, statusCode, body) => {
              if (errSms || statusCode != 200) return res.status(500).send()
              if (body.RetStatus == 1) return res.status(204).set('x-user-info', encoded).send()
              if (body.RetStatus == 5) return res.status(400).send()
              return res.status(500).send()
              }
      )*/
      console.log("===========================")
      console.log(msg)
      console.log(encoded)
      console.log("===========================")
    } catch(e) {
      console.log("===========================")
      console.log(e)
      console.log("===========================")
      return res.status(500).json(e)
    }
  },
  resetPass :  async (req, res) => {
    if (!_.has(req.body, 'input') || !_.has(req.body, 'type')) return res.status(400).send()
    if (!_.includes(['username', 'phone', 'email'], req.body.type)) return res.status(400).send()
    try {
      let User = null
      console.log(req.body)
      switch (req.body.type) {
        case 'username':
          User = await UserModel.findOne({ where : {'username' : req.body.input} })
          break;
        case 'phone':
          User = await UserModel.findOne({ where : {'phone' : req.body.input} })
          break;
        case 'email':
          User = await UserModel.findOne({ where : {'email' : req.body.input} })
          if (!User.email || !User.emailVerified) return res.status(403).send()
          break;
        default:
          return res.status(400).send()
      }
      
      if (!User) return res.status(404).send()
      let data = {
        userId: User.id,
        expires: Date.now() + (1000 * 60 * 60 * 1),
        random : Helper.generatePhoneCode()
      }
      const encoded = Helper.encrypt(data, Constants.SECRET_KEY.PASSWORD)
      console.log(encoded)
      AccessTokenModel.setResetToken(encoded)
      /*
        Helper.sendEmail(
          `Your Token: ${encoded}`,
          'Reset Password',
          User.email,
          (errEmail) => {
            if (errEmail) return res.status(500).send()
            return res.status(204).send()
        })
      */
      return res.status(204).send()
    } catch(e) {
      console.log("===========================")
      console.log(e)
      return res.status(500).json(e)
    }
  },
  verifyPass : async (req, res) => {
    if (!req.get('x-user-info')) return res.status(400).send()
    try {
      let validity = await AccessTokenModel.getTokenAsync(req.get('x-user-info'))
      if(!validity) return res.status(403).send()
      let decrypted = Helper.decrypt(
                req.get('x-user-info'),
                Constants.SECRET_KEY.PASSWORD,
                res)
      if (Date.now() > decrypted.expires) return res.status(403).send()
  
      return res.status(204).send()
    } catch(e) {
      console.log("==========================")
      console.log(e)
      return res.status(500).json(e)
    }
  },
  submitPass : async (req, res) => {
    if (!_.has(req.body, 'token') || !_.has(req.body, 'password')) return res.status(400).send()
    try {
      let validity = await AccessTokenModel.getTokenAsync(req.body.token)
      if(!validity) return res.status(403).send()
      let decrypted = Helper.decrypt(
                      req.body.token,
                      Constants.SECRET_KEY.PASSWORD,
                      res)
      if (Date.now() > decrypted.expires) return res.status(403).send()
      let User = await UserModel.findById(decrypted.userId)
      User.password = req.body.password
      User = await User.save({ fields: ['password'] })
      AccessTokenModel.delToken(req.body.token)
      return res.status(204).send()
    } catch(e) {
      console.log("=================================")
      console.log(e)
      return res.status(500).json(e)
    }
  }

}
export default AuthController