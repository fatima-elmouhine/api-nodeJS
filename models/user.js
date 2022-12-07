const  mongoose = require('mongoose');
const  Schema  = mongoose.Schema;

const UserSchema = new Schema({
    firstname: String,
    lastname: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    role: [],
    groupID: {type: mongoose.Schema.Types.ObjectId, required: false, ref: "Group"},
    token: { type: String },
  }, { timestamps: true });
  
// UserSchema.virtual('groups', {
//   ref: 'Group',
//   localField: 'groupID',
//   foreignField: '_id',
// });

module.exports =  mongoose.model('User', UserSchema)
