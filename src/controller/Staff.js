import _ from 'lodash'
import {
  Router
} from 'express'
import {
  AccessTokenModel,
  UserModel,
  StaffModel
} from '../models'
import {
  Images
} from '../middlewares'
import {
  Helper,
  Constants
} from '../utilities'


var staffController = {
  createStaff : async (req, res) => {
    try {
      //if(!res.locals.userId) res.status(404).send()
      if (!_.has(req.body, 'email') ||
          !_.has(req.body, 'bio') ||
          !_.has(req.body, 'firstName') ||
          !_.has(req.body, 'lastName')
          ) return res.status(400).send()
      
      console.log(req.body)
      console.log(res.req.files.profile[0].filename)
      const newStaff = {
        email       : req.body.email,
        bio         : req.body.bio,
        firstName   : req.body.firstName,
        lastName    : req.body.lastName,
        profile     : res.req.files.profile[0].filename,
      }
      
      StaffModel.create(newStaff).then(
        (staff) => {
          console.log("============================================")
          return res.status(201).json(staff)
        }).catch( (e) => {
          return res.status(500).json(e)
      })
    } catch (e) {
      console.log("============================================")
      console.log(e)
      console.log("============================================")
      return res.status(500).json(e)
    }
  },
  deleteStaff : async (req, res) => {
    try {
      if (!_.has(req.body, 'id') ) return res.status(400).send()
      let user = await UserModel.findOne({
        where: {
          id: res.locals.userId
        },
        attributes: ['id', 'roles']
      })
      if (user){
        if(user.roles[1] != 'admin') {
          return res.status(403).send()
        }
      }
      
      StaffModel.destroy({
        where: {
            id : req.body.id
        }
        }).then( (result) =>{
            if(result == 1) return res.status(204).send()
            else return res.status(404).send()
          })

    } catch (e) {
      console.log("===========================")
      console.log(e)
      return res.status(500).json(e)
    }
  },
  editStaff : async (req, res) => {
    console.log("============================")
    console.log("edit staff")
    try {
      if (!_.has(req.body.staff, 'id') ) return res.status(400).send()
      
      let user = await UserModel.findOne({
        where: {
          id: res.locals.userId
        },
        attributes: ['id', 'roles']
      })

      if (user){
        if(user.roles[1] != 'admin') {
          return res.status(403).send()
        }
      }
      StaffModel.findById(req.body.staff.id).then(
        (staff) =>{
          if(staff){
            let validParams = _.pick(req.body.staff,['firstName',
            'lastName','bio','email'])
            _.assign(staff, validParams)
            staff.save().then((newstaff) => {
              return res.status(200).json(newstaff)
            })
          } else {
            return res.status(404).send()
          }
        }
      )
      
    } catch (e) {
      console.log("===========================")
      console.log(e)
      return res.status(500).json(e)
    }
  },
  getAllStaff : async (req, res) => {
    try {
      StaffModel.findAll({
        attributes: ["id","firstName","lastName" ,"bio","email","profile",],
        $sort: { id: 1 }
        }).then((staff) => {
            res.status(200).json({staff});
            }).catch(
                (error) => {
                    return res.status(500).send('Smth Wrong')
                  }
            )  
    } catch (e) {
      console.log("===========================")
      console.log(e)
      return res.status(500).json(e)
    }
  },
}

export default staffController