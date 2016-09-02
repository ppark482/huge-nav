(function() {
	var httpRequest;
	var navItems;

	function getNavBarData(url) {
		httpRequest = new XMLHttpRequest();
		if (!httpRequest) {
			console.log('could not create an XMLHTTP instance');
		}
		httpRequest.onreadystatechange = handleNavBarData;
		httpRequest.open('GET', url);
		httpRequest.send();
	}

	function handleNavBarData() {
		if (httpRequest.readyState === XMLHttpRequest.DONE) {
			if (httpRequest.status === 200) {
				formatResponse(JSON.parse(httpRequest.responseText));
			} else {
				alert(httpRequest.status, ': there was a problem with the request.');
			}
		}
	}

	function formatResponse(items) {
		if (typeof items === 'object') {
			navItems = items.items;
		}
	}

	getNavBarData('api/nav.json');

	document.querySelector('#menuToggle').onclick = toggleMenu;

	function toggleMenu() {
		document.querySelector('#slideInMenu').classList.toggle('open');
		document.querySelector('#mainBody').classList.toggle('open');
		document.querySelector('#menuToggle').classList.toggle('open');
	}

	function populateMenu() {

	}

	// utility functions
	function forEach(collection, callback, scope) {
		for (var i = 0; i < collection.length; i++) {
			callback.call(scope, collection[i], i);
		}
	}

}());