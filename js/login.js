var form = document.forms[0].elements;
var logInButton = document.getElementById('logInButton');

var onButtonClickHandler = function() {
	if(form.nickname === '' || form.password === '') {
		return;
	}
	var user = {
		nickname: form.nickname.value,
		password: form.password.value
	};
	sender('/login', user);
};

logInButton.onclick = onButtonClickHandler;