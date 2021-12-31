// Programatically generated model
const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

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
    match: [/^[a-zA-Z]{1,30}$/i, 'First name should contain only alphabet'],
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    minlength: 3.0,
    maxlength: 320.0,
    lowercase: true,
    trim: true,
    match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i, ''],
  },

  phone: {
    type: String,
    required: [true, 'Phone is required'],
    maxlength: 10.0,
    trim: true,
    match: [/^\d{10}$/, 'Phone should contain exactly 10 digits'],
  },
}, {
  timestamps: true,
});

ContactSchema.pre('findOneAndUpdate', function pre(next) {
  this.options.runValidators = true;
  this.options.new = true;
  next();
});

ContactSchema.index({ user: 1, email: 1 }, { unique: true });
ContactSchema.index({ user: 1, contact: 1 }, { unique: true });

ContactSchema.index({
  name: 'text', email: 'text', phone: 'text',
});

// Compile model from schema
const model = mongoose.model('Contact', ContactSchema);
module.exports = model;
