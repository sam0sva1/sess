var form = document.forms[0].elements;
var signUpButton = document.getElementById('signUpButton');

var onButtonClickHandler = function() {
	if(form.nickname === '' || form.password === '') {
		console.log('Return')
		return;
	}
	var newUser = {
		nickname: form.nickname.value,
		password: form.password.value
	};
	console.log(newUser);
	sender('/signup', newUser);
};

signUpButton.onclick = onButtonClickHandler;