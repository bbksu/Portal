import mongoose, { Schema } from "mongoose";

// Database Schema
const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,		
		trim: true,
		minLength: 3,
		maxLength: 45,
	},
	password: {
		type: String,
		required: true,
		minLength: 8,
		maxLength: 255,
	},
	email: {
		type: String,
		required: false,
		unique: true,
		trim: true,
		minLength: 5,
		maxLength: 255,
	},
	phone: {
		type: String,
		required: false,
		unique: true,
		trim: true,
		minLength: 10,
		maxLength: 14,
	},
	dob: {
		type: Date,
		required: false,
	},
}, {versionKey: false});

const userModel = mongoose.model("users", userSchema);

export {userModel};