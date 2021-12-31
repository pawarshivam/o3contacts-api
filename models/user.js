// Programatically generated model
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    minlength: 1.0,
    maxlength: 30.0,
    lowercase: true,
    trim: true,
    match: [/^[a-zA-Z]{1,30}$/i, 'First name should contain only alphabet'],
  },

  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    minlength: 1.0,
    maxlength: 30.0,
    lowercase: true,
    trim: true,
    match: [/^[a-zA-Z]{1,30}$/i, 'Last name should contain only alphabet'],
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    immutable: true,
    minlength: 3.0,
    maxlength: 320.0,
    lowercase: true,
    trim: true,
    match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i, ''],
  },

  password: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: [true, 'Phone is required'],
    unique: true,
    maxlength: 10.0,
    trim: true,
    match: [/^\d{10}$/, 'Phone should contain exactly 10 digits'],
  },

  session: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: mongoose.Types.ObjectId,
    maxlength: 24.0,
    trim: true,
  },

  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  timestamps: true,
});

UserSchema.pre('findOneAndUpdate', function pre(next) {
  this.options.runValidators = true;
  this.options.new = true;
  next();
});

UserSchema.index({
  name: 'text', email: 'text', phone: 'text',
});

// Compile model from schema
const model = mongoose.model('User', UserSchema);
module.exports = model;
