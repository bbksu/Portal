// function to redirect to the profile page after login
function redirectToProfilePage() {	
	const profileUrl = new URL(window.location.href);
	profileUrl.pathname = "/profile";
	profileUrl.search = "";
	profileUrl.hash = "";	
	window.location.assign(profileUrl);
}

const userLoginForm = document.getElementById("loginForm");

// event listener for when the submit button is pressed on the login page
userLoginForm.addEventListener("submit", async (listener) => {
	listener.preventDefault();
	const username = userLoginForm.elements["username"].value;
	const password = userLoginForm.elements["password"].value;

	const loginCredentials = { username: username, password: password };
	const requestProperties = {
		method: "POST",
		credentials: "include",
		body: JSON.stringify(loginCredentials),
		headers: {
			"Content-type": "application/json",
		},
	};
	// Send request with the form and login credentials
	try {
		var apiResponse = await fetch(
		"https://localhost:8443/api/v2/users/login",
		requestProperties,
	);
	} catch (error) {
		var apiResponse = await fetch(
		"https://backend-portal-43q8.onrender.com/api/v2/users/login",
		requestProperties,
	);	
	}
	// Response checking and Error message formatting
	const reseponseJson = await apiResponse.json();
	if (apiResponse.status === 400 || apiResponse.status === 404) {
		document.getElementById("errorMessage").textContent = reseponseJson.message;
		return;
	} else {
		document.getElementById("errorMessage").textContent = "";
	}

	redirectToProfilePage();
});
