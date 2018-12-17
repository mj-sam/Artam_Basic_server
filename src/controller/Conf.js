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

import * as fs from 'fs';

//import multer from 'multer'
//import path from 'path'
fs.readFile(__dirname+'/WebConfig.json', (err, dataIn) => {
  if (err) throw new Error('Cant load Config file');
  let configFile = JSON.parse(dataIn);
  AccessTokenModel.setConfigs(configFile)
  });

var confController = {
  set : async (req, res) => {
    try {
      if (!_.has(req.body, 'configs') ) return res.status(400).send()
      var FilePath = __dirname +'/WebConfig.json' 
      fs.readFile( FilePath, (err, dataIn) => {
          if (err) return res.status(500).json("can not read config file");
          let configFile = JSON.parse(dataIn);
          
          if(req.body.configs.credit) configFile.credit = req.body.configs.credit
          if(req.body.configs.referral) configFile.referral = req.body.configs.referral

          let dataOut = JSON.stringify(configFile)
          fs.writeFile(FilePath, dataOut, (err) => {  
              if (err) return res.status(500).json("can not write to config file");
              AccessTokenModel.resetConfigs(configFile)
              return res.status(204).send()
          });
        });
      } catch (e) {
        console.log("===========================")
        console.log(e)
        return res.status(500).json(e)
      }
  },
  get : async (req, res) => {
    try {
      let result = await AccessTokenModel.getTokenAsync('webConfigs')
      if(result){
        result = JSON.parse(result)
        return res.status(200).json(result)
      } else {
        return res.status(500).json('cant load configs from redis')
      }
    } catch (e) {
      console.log("===========================")
      console.log(e)
      return res.status(500).json(e)
    }
  },
}
export default confController

/*
fs.readFile(__dirname+'/test.jpeg', (err, dataInImage) => {
                if (err) return res.status(500).json(err);
                let image = {bin : dataInImage}
                let response = {image , configFile}
                return res.status(200).json(response)
              })
*/