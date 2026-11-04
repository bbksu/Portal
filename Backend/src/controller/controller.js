import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";
import bcrypt from "bcrypt";

const registerUser = async (request, response) => {
	try {
		const { username, password } = request.body;

		if (!username) {
			return response.status(400).json({ message: "Username required" });
		}
		if (!password) {
			return response.status(400).json({ message: "Password required" });
		}

		const userExists = await userModel.findOne({ username: username });
		if (userExists) {
			return response.status(400).json({ message: "The user already exists" });
		}
		const salt = 10
		const hashedPassword = await bcrypt.hash(password, salt);

		const userDetails = { username: username, password: hashedPassword };
		await userModel.create(userDetails);
		return response
			.status(201)
			.json({ message: `${username} is now registered.` });
	} catch (error) {
		console.log(`Cant register the user for some reason: ${error}`);
		return response.status(500).json({ message: "Internal server error" });
	}
};

// function that runs when the user tries to login
const loginUser = async (request, response) => {
	try {
		var { username, password } = request.body;

		if (!username) {
			return response.status(400).json({ message: "Username required" });
		}
		if (!password) {
			return response.status(400).json({ message: "Password required" });
		}

		var foundUser = await userModel.find({ username: username }).exec(); // get iterable back

		// check if a user exists
		if (foundUser.length == 0) {
			return response.status(404).json({ message: "User not found." });
		}

		// Check if the password matches the hashed password
		const isHashedPassword = await bcrypt.compare(
			password,
			foundUser[0]["password"],
		);
		// 

		if (!isHashedPassword) {
			return response.status(400).json({ message: "Invalid password." });
		}

		// user payload
		const payload = {
			id: foundUser[0]["_id"],
			username: foundUser[0]["username"],
		};

		// generate jwt token
		const token = jwt.sign(payload, process.env.SECRET_KEY);

		// Send token and user in cookies back to the browser
		response.cookie("sessionToken", token, {
			httpOnly: true,
			sameSite: "lax",
			secure: true,
			path: "/",
			maxAge: 43200000,
		});
		response.cookie("username", username, {
			httpOnly: true,
			sameSite: "lax",
			secure: true,
			path: "/",
			maxAge: 43200000,
		});
		
		response.status(200).json({ message: "Login successful" });
	} catch (error) {
		response.status(500).json({ message: "Server error" });		
	}
};

// get user data using cookies
const getUser2Cookie = async (request, response) => {
	

	// get cookie from header
	const cookies = request.cookies;
	// read token and username from cookies
	const token = cookies["sessionToken"];
	const username = cookies["username"];

	try {
		// compare token in cookie using a key
		const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
		
		const decodedUser = decodedToken["username"];
		
		var userMissmatch = String(username).trim() === String(decodedUser).trim();
				
		if (!userMissmatch) {			
			return response.status(404).json({ message: "User not found." });
		}
	} catch (error) {
		return response.status(404).json({ message: "User not found." });
	}

	var foundUser = await userModel
		.find({ username: username })
		.select("-password")
		.exec(); // get iterable back
	if (foundUser.length == 0) {
		return response.status(404).json({ message: "User not found." });
	}
	
	// format user data from database before sending back
	const userData = {
		username: foundUser[0]["username"],
		email: foundUser[0]["email"] || "",
		phone: foundUser[0]["phone"] || "",
		dob: foundUser[0]["dob"] || "",
	};

	response.status(200).json(userData);
};

// Method that runs when updating the user data
const updateUser = async (request, response) => {
	const { email, dob, phone } = request.body;
	const cookies = request.cookies;
	const token = cookies["sessionToken"];
	const username = cookies["username"];

	try {
		// compare token in cookie using a key
		const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
		const decodedUser = decodedToken["username"];
		var userMissmatch = String(username).trim() === String(decodedUser).trim();
		if (!userMissmatch) {
			return response.status(404).json({ message: "User not found." });
		}
	} catch (error) {
		return response.status(404).json({ message: "User not found." });
	}
	const userExists = await userModel
		.findOne({ username: username })
		.select("-password");
	if (!userExists) {
		return response.status(404).json({ message: "The user does not exist" });
	}
	// details used to update user data
	const updates = { email: email, phone: phone, dob: dob };
	// update user data based on the username
	var filter = { username: username };
	var setUpdate = { $set: updates };
	try {
		await userModel.updateOne(filter, setUpdate);
		response.status(200).json({ message: "Profile Updated." });
	} catch (error) {
		// console.log(`Update failed because of: ${error}`);
		return response.status(500).json({ message: "Server Error" });
	}
};

export { registerUser, loginUser, updateUser, getUser2Cookie };
