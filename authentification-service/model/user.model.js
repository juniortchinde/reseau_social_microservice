const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
      
        name:{
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 55,
            unique: true,
            trim: true
        },
        
        password:{
            type: String,
            required: true,
            max: 1024,
            minlength: 6,
        },

        avatar:{
            type: String,
            default: "https://thumbs.dreamstime.com/z/vecteur-d-ic%C3%B4ne-de-profil-avatar-par-d%C3%A9faut-image-sociale-utilisateur-m%C3%A9dias-social-182145777.jpg?ct=jpeg"
        }

    },

    {
        timestamps: true,
    }
);

const UserModel =  mongoose.model('users',userSchema);
module.exports = UserModel;

