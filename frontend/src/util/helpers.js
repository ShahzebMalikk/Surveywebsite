export const validateEmail = (email) => {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
};

export function setSession(token) {
    localStorage.setItem('token', token);
}          

export function getSession(token) {
    return localStorage.getItem('token', token);
}          

export function logout() {
    localStorage.removeItem("token");
}

export function isLoggedIn() {
    return localStorage.getItem('token');
}

export function isLoggedOut() {
    return !this.isLoggedIn();
}