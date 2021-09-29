import _ from 'lodash'

import {
  UserModel,
  LegalUserModel,
  RealUserModel,
  InvitationModel,
  LegalAco,
  RealAco,
  AccessTokenModel
} from '../models'
import {
  Images
} from '../middlewares'
import {
  Helper,
  Constants
} from '../utilities'
import * as fs from 'fs';
//import * as fs from 'fs';


var UserController = {
    tockenValidation : async (req , res) => {
        try {
            if(!res.locals.userId) res.status(404).send()
            if(res.locals.userId) res.status(204).send()
        } catch (error) {
            console.log("===========================")
            console.log(error)
            return res.status(500).json(error)
        }
    },
    getProfileAdmin : async (req, res) => {
      console.log("============================")
      console.log("get profile Admin")
      try {
        if(!req.params.userId) res.status(400).send()
        UserModel.findOne({
          where: {
            id: req.params.userId
          },
            }).then( (user) => {
                if(user){
                    console.log("============================")
                    console.log(user.legalUser)
                    if(user.legalUser == true){
                        LegalUserModel.findOne({
                            where : {UserId : req.params.userId},
                            include: [LegalAco]
                            }).then((legaluser) => {
                                if(legaluser.legal.profile){
                                    let image = fs.readFileSync(__dirname+'/../../images/users/'+legaluser.legal.profile)
                                    //
                                    image = new Buffer(image).toString('base64')
                                    legaluser.dataValues.invitationCount = user.invitations.length
                                    legaluser.dataValues.profile = image
                                }
                                res.status(200).json(legaluser);
                                }).catch(
                                    (error) => {
                                        return res.status(500).send('legal user not found')}
                                )
                    } else {
                        RealUserModel.findOne({
                            where : {UserId : req.params.userId},
                            include: [RealAco]
                            }).then((realuser) => {
                                if(realuser.real.profile){
                                    let image = fs.readFileSync(__dirname+'/../../images/users/'+realuser.real.profile)
                                    image = new Buffer(image).toString('base64')
                                    realuser.dataValues.profile = image
                                }
                                res.status(200).json(realuser);
                                }).catch(
                                    (error) => {
                                        return res.status(500).send('real user not found')}
                                )
                    }
                } else {
                    return res.status(404).send()
                }
        })
      } catch (e) {
        console.log("===========================")
        console.log(e)
        return res.status(500).json(e)
      }
    },
    getProfile : async (req, res) => {
        console.log("============================")
        console.log("get profile")
        try {
        if(!res.locals.userId) res.status(400).send()
            console.log(res.locals.userId)
          UserModel.findOne({
            where: {
              id: res.locals.userId
            },
            include: [{ model: InvitationModel}]
              }).then( (user) => {
                  if(user){
                      if(user.legalUser == true){
                            LegalUserModel.findOne({
                                where : {UserId : res.locals.userId},
                                include: [LegalAco]
                                }).then((legaluser) => {
                                    if(legaluser.legal.profile){
                                        let image = fs.readFileSync(__dirname+'/../../images/users/'+legaluser.legal.profile)
                                        //
                                        image = new Buffer(image).toString('base64')
                                        legaluser.dataValues.invitationCount = user.invitations.length
                                        legaluser.dataValues.profile = image
                                    }
                                    res.status(200).json(legaluser);
                                  }).catch(
                                      (error) => {
                                          return res.status(500).send('legal user not found')}
                                  )
                      } else {
                          RealUserModel.findOne({
                              where : { UserId : res.locals.userId},
                              include: [RealAco]
                              }).then((realuser) => {
                                    if(realuser.real.profile){
                                        let image = fs.readFileSync(__dirname+'/../../images/users/'+realuser.real.profile)
                                        image = new Buffer(image).toString('base64')
                                        realuser.dataValues.profile = image
                                    }
                                    res.status(200).json(realuser);
                                  }).catch( (error) => {
                                      console.log(error)
                                          return res.status(500).send(error)}
                                  )
                      }
                  } else {
                      return res.status(404).send()
                  }
          })
        } catch (e) {
          console.log("===========================")
          console.log(e)
          return res.status(500).json(e)
        }
    },
    getInvited : async (req, res) => {
        console.log("============================")
        console.log("get invited")
        try {
          if(!res.locals.userId) res.status(400).send()
          let User = await UserModel.findOne({ 
              where: { id: res.locals.userId },
              attributes: ['id'],
              include: [{ model: InvitationModel}], 
                })
          if(!User) res.status(404).send("user not found")
          return res.status(200).json(User)
        } catch (e) {
          console.log("===========================")
          console.log(e)
          return res.status(500).json(e)
        }
    },
    getInvitedAdmin : async (req, res) => {
        console.log("============================")
        console.log("get invited")
        try {
            if(!req.params.userId) res.status(400).send()
            let User = await UserModel.findOne({ 
              where: { id: req.params.userId },
              attributes: ['id'],
              include: [{ model: InvitationModel}], 
                })
          if(!User) res.status(404).send("user not found")
          return res.status(200).json(User)
        } catch (e) {
          console.log("===========================")
          console.log(e)
          return res.status(500).json(e)
        }
    },
    editProfile : async (req, res) => {
        console.log("============================")
        console.log("edit post")
        try {
            if(!res.locals.userId) res.status(400).send()
            UserModel.findOne({
              where: {
                id: res.locals.userId
              },
                }).then( (user) => {
                    if(user){
                        console.log("============================")
                        console.log(user.legalUser)
                        if(user.legalUser == true){
                            LegalUserModel.findOne({
                                where : {UserId : res.locals.userId},
                                include: [LegalAco]
                                }).then((legaluser) => {
                                    let legalValidParams = _.pick(req.body,[
                                        'CEO',
                                        'activityArea',
                                        'firmActivityArea',
                                        'name',])
                                    _.assign(legaluser, legalValidParams)
                                    if(legaluser.legal.email !== req.body.legal.email) {
                                        let userValidParams = _.pick(req.body.legal,[
                                            'email'])
                                        legaluser.legal.emailVerified = false
                                        _.assign(legaluser.legal, userValidParams)
                                    }

                                    legaluser.save().then((legalUserEdited) => {
                                        res.status(200).json(legalUserEdited);
                                        }).catch((error) => {
                                            return res.status(500).send('error in updatig record')})
                                    }).catch(
                                        (error) => {
                                            return res.status(500).send('legal user not found')}
                                    )
                        } else {
                            RealUserModel.findOne({
                                where : {UserId : res.locals.userId},
                                include: [RealAco]
                                }).then((realuser) => {
                                    let legalValidParams = _.pick(req.body,[
                                        'firstName',
                                        'lastName',
                                        'nNational',
                                        'work',
                                        'birthDate',
                                        '',
                                    ])
                                    _.assign(realuser, legalValidParams)
                                    if(realuser.legal.email !== req.body.legal.email) {
                                        let userValidParams = _.pick(req.body.legal,[
                                            'email'])
                                        realuser.legal.emailVerified = false
                                        _.assign(realuser.legal, userValidParams)
                                    }
                                    
                                    realuser.save().then((realUserEdited) => {
                                        res.status(200).json(realUserEdited);
                                        }).catch((error) => {
                                            return res.status(500).send('error in updatig record')})
                                    }).catch(
                                        (error) => {
                                            return res.status(500).send('legal user not found')}
                                    )
                        }
                    } else {
                        return res.status(404).send()
                    }
            })
          } catch (e) {
          console.log("===========================")
          console.log(e)
          return res.status(500).json(e)
        }
    },
    getAllUsers : async (req, res) => {
        console.log("============================")
        console.log("get users")
        try {
            let limit = 5;   // number of records per page
            let offset = 0;
            UserModel.findAndCountAll().then((data) => {
                let page = req.params.page;      // page number
                let pages = Math.ceil(data.count / limit);
                    offset = limit * (page - 1);
                    UserModel.findAll({
                        attributes: [
                            'id'        ,
                            'username' ,
                            "email"  ,
                            "emailVerified"  ,
                            "phone"    ,
                            "credit"   ,
                            "legalUser" ,
                            "roles"  ],
                        limit: limit,
                        offset: offset,
                        $sort: { id: 1 },
                        }).then((users) => {
                            return res.status(200).json({
                                                            'result': users, 
                                                            'count' : data.count,
                                                            'pages' : pages,
                                                        });
                                

                            }).catch(
                                (error) => {
                                    return res.status(500).json(error)//send('page error')
                                }
                            )
              }).catch((error) => {
                return res.status(500).send('Internal Server Error')
                });
        } catch(e){
            console.log("===========================")
            console.log(e)
            return res.status(500).json(e)
        }
    },
    searchUser : async (req, res) => {
        console.log("============================")
        console.log("get users")
        try {
            console.log(req.body)
            if(!req.body.userName &&
                !req.body.email &&
                !req.body.phone &&
                !req.body.referral  ) res.status(400).send()

            if(!req.body.userName) req.body.userName = ''
            if(!req.body.email) req.body.email = ''
            if(!req.body.phone) req.body.phone = ''
            if(!req.body.referral) req.body.referral = ''

            UserModel.findAll({
                where :{ 
                    username: { $like: '%' + req.body.userName + '%' },
                    email: { $like: '%' + req.body.email + '%' },
                    phone: { $like: '%' + req.body.phone + '%' },
                    referralLink: { $like: '%' + req.body.referral + '%' },
                },
                attributes: [
                    'id'        ,
                    'username' ,
                    "referralLink",
                    "email"  ,
                    "emailVerified"  ,
                    "phone"    ,
                    "credit"   ,
                    "legalUser" ,
                    "roles"  ],
                $sort: { id: 1 },
                }).then((users) => {
                    return res.status(200).json({'result': users })
                    }).catch( (error) => { return res.status(500).json(error)} )
        } catch(e){
            console.log("=========== ERROR ================")
            console.log(e)
            return res.status(500).json(e)
        }
    },
    SetRoles : async (req, res) => {
        console.log("============================")
        console.log(" set Admin ")
        try {
            if(!req.params.userId) return res.status(400).send()
            //if(!req.body.newrole) res.status(400).send()
            UserModel.findOne({
                where : { id : req.params.userId }
            }).then((user) => {
                //console.log("============================")
                //console.log(req.body.newrole)
                //console.log(JSON.parse(req.body.newrole ))
                user.roles = ['user','admin']
                user.save().then((updatedUser)=> {
                    return res.status(201).json(updatedUser)
                }).catch((error)=> {
                    return res.status(500).send('can not edit record')
                })
                
            }).catch((error) => {return res.status(404).send()})
        } catch(e){
            console.log("===========================")
            console.log(e)
            return res.status(500).json(e)
        }
    },
    TakeAdmin : async (req, res) => {
        console.log("============================")
        console.log(" set Admin ")
        try {
            if(!req.params.userId) return res.status(400).send()
            //if(!req.body.newrole) res.status(400).send()
            UserModel.findOne({
                where : { id : req.params.userId }
            }).then((user) => {
                //console.log("============================")
                //console.log(req.body.newrole)
                //console.log(JSON.parse(req.body.newrole ))
                user.roles = ['user']
                user.save().then((updatedUser)=> {
                    return res.status(201).json(updatedUser)
                }).catch((error)=> {
                    return res.status(500).send('can not edit record')
                })
                
            }).catch((error) => {return res.status(404).send()})
        } catch(e){
            console.log("===========================")
            console.log(e)
            return res.status(500).json(e)
        }
    },    
    getLegalUsers : async (req, res) => {
        console.log("============================")
        console.log("get users")
        try {
            let limit = 10;   // number of records per page
            let offset = 0;
            LegalUserModel.findAndCountAll().then((data) => {
                let page = req.params.page;      // page number
                let pages = Math.ceil(data.count / limit);
                    offset = limit * (page - 1);
                    LegalUserModel.findAll({
                        /*
                        attributes: [
                            'id'        ,
                            'firstName' ,
                            "lastName"  ,
                            "username"  ,
                            "points"    ,
                            "profile"   ,
                            "bio"   ],
                        */
                        limit: limit,
                        offset: offset,
                        $sort: { id: 1 },
                        include: [LegalAco]
                        }).then((users) => {
                            res.status(200).json({
                                'result': users, 
                                'count': data.count,
                                'pages': pages});
                            }).catch(
                                (error) => {
                                    return res.status(500).send('page error')}
                            )
              }).catch((error) => {
                return res.status(500).send('Internal Server Error')
                });
        } catch(e){
            console.log("===========================")
            console.log(e)
            return res.status(500).json(e)
        }
    },
    getRealUsers : async (req, res) => {
        console.log("============================")
        console.log("get users")
        try {
            let limit = 10;   // number of records per page
            let offset = 0;
            RealUserModel.findAndCountAll().then((data) => {
                let page = req.params.page;      // page number
                let pages = Math.ceil(data.count / limit);
                    offset = limit * (page - 1);
                    RealUserModel.findAll({
                        /*
                        attributes: [
                            'id'        ,
                            'firstName' ,
                            "lastName"  ,
                            "username"  ,
                            "points"    ,
                            "profile"   ,
                            "bio"   ],
                        */
                        limit: limit,
                        offset: offset,
                        $sort: { id: 1 },
                        include: [RealAco]
                        }).then((users) => {
                            res.status(200).json({
                                'result': users, 
                                'count': data.count,
                                'pages': pages});
                            }).catch(
                                (error) => {
                                    return res.status(500).send('page error')}
                            )
              }).catch((error) => {
                return res.status(500).send('Internal Server Error')
                });
        } catch(e){
            console.log("===========================")
            console.log(e)
            return res.status(500).json(e)
        }
    },
    askVerifyEmail :  async (req, res) => {
        if(!res.locals.userId) return res.status(400).send()
        try {
            UserModel.findOne({
                where: {
                    id: res.locals.userId
                },}).then((user) => {
                    if(user.emailVerified == false){
                        let data = {
                            userId: res.locals.userId,
                            expires: Date.now() + (1000 * 60 * 60 * 1)
                          }
                        const encoded = Helper.encrypt(data, Constants.SECRET_KEY.PASSWORD)
                        /*
                        Helper.sendEmail(
                            `Your Token: ${encoded}`,
                            'Reset Password',
                            User.email,
                            (errEmail) => {
                              if (errEmail) return res.status(500).send("can not connect to email server")
                              return res.status(204).send()
                          })
                        */
                        console.log("====================================")
                        console.log(encoded)
                       return res.status(204).send()
                    } else {
                        return res.status(500).send('Email is Already verified')
                    }
                })
        } catch(e) {
          return res.status(500).json(e)
        }
    },
    verifyEmail :  async (req, res) => {
        try {
            if(!req.get('x-user-info')) return res.status(400).send()
            try {
                var decrypted = Helper.decrypt(
                req.get('x-user-info'),
                Constants.SECRET_KEY.PASSWORD,
                res)
            } catch (error) {
                return res.status(406).send()
            }
            console.log(decrypted)
            UserModel.findOne({
                where: {
                    id: decrypted.userId
                },}).then((user) => {
                        user.emailVerified = true
                        user.save().then((user)=>{
                            return res.status(204).send('email successfuly verified')
                        }).catch((error) => {
                            return res.status(500).send('can not update record')
                        })
                        
                    }).catch((error)=> {
                        return res.status(406).send('Not valid')
                    })
        } catch(e) {
          return res.status(500).json(e)
        }
    },
    SendInvitation : async (req, res) => {
        console.log("============================")
        console.log("invite user post")
        try {
            console.log("invitation send",req.body)
            if(!res.locals.userId) res.status(400).send()
            UserModel.findOne({
              where: {
                id: res.locals.userId
              },
                }).then( (user) => {
                    if(user){
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
                        )
                        */
                       return res.status(204).send()
                    } else {
                        return res.status(404).send()
                    }
            })
          } catch (e) {
          console.log("===========================")
          console.log(e)
          return res.status(500).json(e)
        }
    },
    signOut : async (req, res) => {
        if(!res.locals.userId) return res.status(400).send()
        try {
            let user = await UserModel.findOne({
                where: {
                  id: res.locals.userId,
                },
                attributes: ['id', 'accessToken']
              })
            
            if (!user) return res.status(404).send()
            AccessTokenModel.delToken(user.accessToken)
            user.accessToken = null
            user.save().then( (newuser) => {return res.status(201).send()}
            ).catch( (e) => res.status(500).send(e))

        } catch(e) {
          return res.status(500).json(e)
        }
    },
}
export default UserController