function validateUsername(username) {
	var validCharsRegex = /^[\w\.]+$/;
    var length = username.length;
    var validChars = validCharsRegex.test(username);
    return (length >= 3) && (length <= 20) && validChars;
}

function validatePassword(password, passConfirm) {
    var length = password.length;
    return (length >=6) && (length <= 30) && (password === passConfirm);
}

function signupValidator(username, password, passConfirm) {
	return validateUsername(username) && validatePassword(password, passConfirm);
}

module.exports = {
    'signupValidator': signupValidator
}