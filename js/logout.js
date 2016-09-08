console.log('Cookie', document.cookie);
var logOutButton = document.getElementById('logOutButton');

var onButtonClickHandler = function() {
	sender('/logout', {});
	return location.href = '/';
};

logOutButton.onclick = onButtonClickHandler;
console.log(document.cookie);