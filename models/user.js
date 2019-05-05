var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: "{VALUE} is not a valid role."
};

var userSchema = new Schema({
    name: {type: String, required: [true, 'Name is required'] },
    email: {type: String, unique: true, required: [true, 'Email is required'] },
    password: {type: String, required: [true, 'Password is required'] },
    img: {type: String, required: false },
    role: {type: String, required: true, default: 'USER_ROLE', enum: validRoles },
});

userSchema.plugin(uniqueValidator, { message: '{path} is already in use.' });
module.exports = mongoose.model('User', userSchema);
