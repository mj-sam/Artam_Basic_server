import _ from 'lodash'
import {
  AccessTokenModel,
  UserModel,
  PostModel,
  //PostAco,
} from '../models'
import sharp from 'sharp'
import {
  Helper,
  Constants
} from '../utilities'

var PostController = {
  createPost : async (req, res) => {
      console.log("============================")
      console.log("create post")
      try {
        if (!_.has(req.body, 'title') ||
            !_.has(req.body, 'content') ||
            !_.has(req.body, 'brief')  ) return res.status(400).send()
        
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
        //resizing the reciived picture
        if(res.req.file){
          sharp(__dirname+'/../../images/posts/'+res.req.file.filename)
          .resize(500,350)
          .toFile(__dirname+'/../../images/posts/'+res.req.file.filename)
        }
        const newPost = {
          title       : req.body.title,
          content     : req.body.content,
          brief       : req.body.brief,
          briefPic    : res.req.file ? res.req.file.filename : '',
          authorId    : user.id
          }
        //let post = await PostModel.create(newPost)
        PostModel.create(newPost).then(
          (post) => {return res.status(201).json(post)}
        ).catch( (e) => {
          console.log(e)
          return res.status(500).json(e)
        })
        
      } catch (e) {
        console.log("===========================")
        console.log(e)
        return res.status(500).json(e)
      }
  },
  editPost : async (req, res) => {
    console.log("============================")
    console.log("edit post")
    try {
      if (!_.has(req.body, 'id') ) return res.status(400).send()
      
      PostModel.findById(req.body.id).then(
        (post) =>{
          if(post){
            let validParams = _.pick(req.body,['title','content','brief','briefPic'])
            _.assign(post, validParams)
            post.save().then((newpost) => {
              return res.status(200).json(newpost)
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
  getAllPost : async (req, res) => {
    console.log("============================")
    console.log("get all post")
    try {
      if (!_.has(req.params, 'page') ) return res.status(400).send()
      let limit  = 5;   // number of records per page
      let offset = 0;
      PostModel.findAndCountAll().then((data) => {
        //console.log(PostAco)
          let page = req.params.page;      // page number
          let pages = Math.ceil(data.count / limit);
              offset = limit * (page - 1);
              PostModel.findAll({
                  attributes: [
                      'id'        ,
                      'title' ,
                      "content" ,
                      "brief"
                    ],
                  limit: limit,
                  offset: offset,
                  $sort: { id: 1 },
                  include : [{ model: UserModel ,as: 'author' ,  attributes: ['id','username']}]
                  }).then((users) => {
                      res.status(200).json({
                          'result': users, 
                          'count': data.count,
                          'pages': pages});
                      }).catch(
                          (error) => {
                              return res.status(500).send(error)
                            }
                      )
          }).catch((error) => {
            return res.status(500).send('Internal Server Error IN Page')
            });  
    } catch (e) {
      console.log("===========================")
      console.log(e)
      return res.status(500).json(e)
    }
  },
  getLastBrief : async (req, res) => {
    console.log("============================")
    console.log("get First")
    try {
      let posts = await PostModel.findAll({
                          limit: 6,
                          attributes: [
                            'id'    ,
                            'title' ,
                            "brief" ,
                            "briefPic"
                          ],
                          order: [ [ 'createdAt', 'DESC' ]],
                          include : [{ model: UserModel ,as: 'author' ,  attributes: ['id','username']}] })
      return res.status(200).json(posts)
    } catch (e) {
      console.log("===========================")
      console.log(e)
      return res.status(500).json(e)
    }
  },
  getPost : async (req, res) => {
    console.log("============================")
    console.log("get First")
    try {
      let post = await PostModel.findOne({
                          where :{
                            id : req.params.id
                          },
                          include : [{ model: UserModel ,as: 'author' ,  
                                       attributes: ['id','username']}] })
      if(post){
        return res.status(200).json(post)
      } else {
        return res.status(404).send()
      }
    } catch (e) {
      console.log("===========================")
      console.log(e)
      return res.status(500).json(e)
    }
  },
  getAllBrief : async (req, res) => {
    console.log("============================")
    console.log("get all post")
    try {
      let limit  = 10;   // number of records per page
      let offset = 0;
      PostModel.findAndCountAll().then((data) => {
          let page = req.params.page ? req.params.page : 1 ;      // page number
          let pages = Math.ceil(data.count / limit);
              offset = limit * (page - 1);
              PostModel.findAll({
                  attributes: [
                    'id'    ,
                    'title' ,
                    "brief" ,
                    "briefPic"
                  ],
                  order: [ [ 'createdAt', 'DESC' ]],
                  limit: limit,
                  offset: offset,
                  $sort: { id: 1 },
                  include : [{ model: UserModel ,as: 'author' ,  attributes: ['id','username']}]
                  }).then((users) => {
                      res.status(200).json({
                          'result': users, 
                          'count': data.count,
                          'pages': pages});
                      }).catch(
                          (error) => {
                              return res.status(500).send(error)
                            }
                      )
          }).catch((error) => {
            return res.status(500).send('Internal Server Error IN Page')
            });  
    } catch (e) {
      console.log("===========================")
      console.log(e)
      return res.status(500).json(e)
    }
  },
  deletePost : async (req, res) => {
    console.log("============================")
    console.log("delete post")
    try {
      if (!_.has(req.body, 'id') ) return res.status(400).send()
      
      let user = await UserModel.findOne({
        where: {
          id: res.locals.userId
        },
        attributes: ['id', 'roles']
      })
      //console.log(user.roles)
      if (user){
        if(user.roles[1] != 'admin') {
          return res.status(403).send()
        }
      }      PostModel.destroy({
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

}
export default PostController