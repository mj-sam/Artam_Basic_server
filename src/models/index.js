import { Configs }            from '../utilities'
import * as AccessTokenModel  from './AccessToken'
import UserModel              from './User'
import AddressModel           from './Address'
import CategoryModel          from './Category'
import PostModel              from './Post'
import RecordCategoryModel    from './RecordCategory'
import StaffModel             from './Staff'
import LegalUserModel         from './LegalUser'
import RealUserModel         from './RealUser'
import InvitationModel        from './Invitation'
/* Association */
//UserModel.hasMany(AddressModel)
//AddressModel.belongsTo(UserModel)

UserModel.hasMany(PostModel, { foreignKey: 'authorId' })
PostModel.belongsTo(UserModel, { as: 'author', foreignKey: 'authorId' })
//
PostModel.belongsToMany(CategoryModel, { as: 'postsId', through: { model   : RecordCategoryModel, unique  : false },foreignKey: 'PostId' });
CategoryModel.belongsToMany(PostModel, { as: 'Category',through: { model   : RecordCategoryModel, unique  : false },foreignKey: 'CategoryId'});
//
const LegalAco = LegalUserModel.belongsTo(UserModel, { as: 'legal', foreignKey: 'UserId' })
const RealAco  = RealUserModel.belongsTo(UserModel,  { as: 'real',foreignKey: 'UserId' })
//
UserModel.hasMany(InvitationModel, { foreignKey: 'CallerId' })

/* Sync */
//Configs.Mysql.sync({ force: true })
Configs.Mysql.sync()
//UPDATE users SET roles = JSON_ARRAY_APPEND(roles,'$','admin');

export {
  AccessTokenModel,
  UserModel,
  AddressModel,
  CategoryModel,
  InvitationModel,
  PostModel,
  StaffModel,
  LegalUserModel,
  RealUserModel,
  RecordCategoryModel,
  LegalAco,
  RealAco,
  //PostAco
}
