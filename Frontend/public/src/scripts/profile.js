// get the button from the DOM
const updateButton = document.getElementById("SaveButton");

const updateForm = document.getElementById("updateForm");
const userProfileURL = "https://localhost:8443/api/v2/users/account/profile";
const updateContent = document.getElementById("updateContent");

// function to get user data from the database
async function requestUserData() {
	const requestProperties = {
		method: "GET",
		credentials: "include",
		headers: {
			"Content-type": "application/json",
		},
	};
	const serverResponse = await fetch(userProfileURL, requestProperties);
	const reseponseJson = await serverResponse.json();

	return reseponseJson;
}

// function to update UI with the latest user data
const latestUserData = async () => {
	const dbRequestedUserData = await requestUserData();

	const message = dbRequestedUserData["message"];
	if (message == "User not found.") {
		updateContent.style.display = "none";
	} else {
		updateContent.style.display = "";
	}

	const username = dbRequestedUserData["username"];
	const email = dbRequestedUserData["email"];
	const phone = dbRequestedUserData["phone"];
	var dateOfBirth = dbRequestedUserData["dob"];
	dateOfBirth = new Date(dateOfBirth);
	dateOfBirth = dateOfBirth.toLocaleDateString() || "";
	if (dateOfBirth == "Invalid Date") {
		dateOfBirth = "";
	}

	const userInitials = document.getElementById("userInitials");
	userInitials.textContent = username.charAt(0).toUpperCase();

	// User details on the DOM
	var userDetailsDOM = document.getElementById("user");
	userDetailsDOM.textContent = username;
	userDetailsDOM = document.getElementById("email");
	userDetailsDOM.textContent = email;
	userDetailsDOM = document.getElementById("phone");
	userDetailsDOM.textContent = phone;
	userDetailsDOM = document.getElementById("dateOfBirth");
	userDetailsDOM.textContent = dateOfBirth;
};
// function to save new user information
const saveDetails = async () => {
	const email = updateForm.elements["emailInput"].value;
	const phone = updateForm.elements["phoneInput"].value;
	var dob = updateForm.elements["dateInput"].value;
	if (dob.length == 0) {
		dob = "";
	}
	const updateRequest = {
		email: email,
		dob: dob,
		phone: phone,
	};
	const requestProperties = {
		method: "PATCH",
		credentials: "include",
		body: JSON.stringify(updateRequest),
		headers: {
			"Content-type": "application/json",
		},
	};
	var apiResponse = await fetch(userProfileURL, requestProperties);
	var reseponseJson = await apiResponse.json();

	// Display success message after updating the profile
	document.getElementById("updateMessage").className = "text-green-500";
	document.getElementById("updateMessage").textContent =
		reseponseJson["message"];
};

// event listener for when the save changes button is pressed on the profile page page
updateButton.addEventListener("click", async () => {
	const email = updateForm.elements["emailInput"].value;
	const phone = updateForm.elements["phoneInput"].value;

	// regex used for validation
	const emailPattern =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const phoneNumberPattern = /^\+[1-9]\d{9,14}$/;
	// validate email and phone number
	var errorMessage = "";
	if (!emailPattern.test(email)) {
		errorMessage += "Email address";
	}
	if (!phoneNumberPattern.test(phone)) {
		if (errorMessage.length != 0) {
			errorMessage += " and ";
		}
		errorMessage += "Phone number";
	}
	// display error message if email or phone is not validated
	if (errorMessage) {
		var errorMessage = `Please enter a valid ${errorMessage}.`;
		document.getElementById("updateMessage").className = "text-red-500";
		document.getElementById("updateMessage").textContent = errorMessage;
		return;
	}
	saveDetails();

	setTimeout(latestUserData, 2000);
});

latestUserData();
