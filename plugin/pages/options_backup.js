function getValue(id) {
	return document.querySelector("#" + id).value;
}

function setValue(id, v) {
	document.querySelector("#" + id).value = v || "";
}

function saveOptions(e) {
	// e.preventDefault();
	
	browser.storage.local.set(
	{
		host: getValue("host"),
		port: getValue("port"),
		user: getValue("user"),
		upwd: getValue("upwd")
	});
}

function restoreOptions() {
	console.log("restore options");
	

	function setCurrentChoice(result) {
		console.log("setCurrent");
		setValue("host", result.host);
		setValue("port", result.port);
		setValue("user", result.user);
		setValue("upwd", result.upwd);
	}

	function onError(error) {
		console.log(`Error: ${error}`);
	}

	console.log("before getting");
	let getting = browser.storage.local.get(['host', 'port', 'user', 'upwd']);
	
	console.log("before then");
	getting.then(setCurrentChoice, onError);
}

console.log("add event listener: DOM");

document.addEventListener("DOMContentLoaded", restoreOptions);

console.log("before query form");

document.querySelector("form").addEventListener("submit", saveOptions);

//console.log("args[0~] = " + window.arguments[0]);
//console.log("args.length = " + window.arguments.length);






























