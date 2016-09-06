var sender = function(url, object) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url);
	xhr.setRequestHeader('Content-Type', 'application/json');
	var sObject = JSON.stringify(object);
	console.log(sObject)
	xhr.send(sObject);
};