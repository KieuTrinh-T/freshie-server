const mongoose = require('mongoose');
const crypto = require('crypto');
require('dotenv').config()
const jwt = require('jsonwebtoken')

const MONGODB_URI = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { dbName: 'cosmetic' });

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    hash: String,
    salt: String,
    email: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    street: {
        type: String,
        default: ''
    },
    apartment: {
        type: String,
        default: ''
    },
    zip: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    is_active: {
        type: Boolean,
        default: true,
    }

}, { timestamps: true });

UserSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

UserSchema.set('toJSON', {
    virtuals: true,
});


// Method to set salt and hash the password for a user
// setPassword method first creates a salt unique for every user
// then it hashes the salt with user password and creates a hash
// this hash is stored in the database as user password
UserSchema.methods.setPassword = function(password) {

    // Creating a unique salt for a particular user
    this.salt = crypto.randomBytes(16).toString('hex');

    // Hashing user's salt and password with 1000 iterations,64 length and sha512 digest
    this.hash = crypto.pbkdf2Sync(password, this.salt,
        1000, 64, `sha512`).toString(`hex`);
};

// Method to check the entered password is correct or not
// valid password method checks whether the user
// password is correct or not
// It takes the user password from the request
// and salt from user database entry
// It then hashes user password and salt
// then checks if this generated hash is equal
// to user's hash in the database or not
// If the user's hash is equal to generated hash
// then the password is correct otherwise not
UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password,
        this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.hash === hash;
};

// Exporting module to allow it to be imported in other files
var User = mongoose.model('User', UserSchema, 'users');
module.exports = User;