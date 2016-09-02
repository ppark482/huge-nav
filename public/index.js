(function() {
	var httpRequest;

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
				afterResponse(JSON.parse(httpRequest.responseText));
			} else {
				alert(httpRequest.status, ': there was a problem with the request.');
			}
		}
	}

	function afterResponse(items) {
		if (typeof items === 'object') {
			populateMenu(items.items);
		}
	}

	getNavBarData('api/nav.json');

	document.querySelector('#menuToggle').onclick = toggleMenu;
	document.querySelector('#menuLinks').onclick = toggleSecondaryMenu;

	function toggleMenu() {
		document.querySelector('#slideInMenu').classList.toggle('open');
		document.querySelector('#mainBody').classList.toggle('open');
		document.querySelector('#menuToggle').classList.toggle('open');
		document.querySelector('#mask').classList.toggle('hidden');
	}

	function populateMenu(items) {
		console.log('items: ', items);
		var ul = '<ul>';
		forEach(items, function(item) {
			ul += generateMenuItem(item);
		});
		ul += '</ul>';
		document.querySelector('#menuLinks').innerHTML = ul;
	}

	function generateMenuItem(item) {
		if (item.items.length && item.items.length > 0) {
			var secondary = '<ul class="secondary-links">';
			forEach(item.items, function(x) {
				secondary += generateSecondaryItem(x);
			});
			secondary += '</ul>';
			return '<li class="primary-item clickable has-secondary">' + item.label + secondary + '</li>';

		} else {
			return '<li class="primary-item clickable"><a href="' + item.url + '">' + item.label + '</a></li>';
		}
	}

	function generateSecondaryItem(item) {
		return '<li class="secondary-item"><a href="' + item.url + '">' + item.label + '</a></li>';
	}

	function toggleSecondaryMenu(e) {
		e.stopPropagation();
		e.target.classList.toggle('open');
		console.log(e.target.classList);
	}

	// utility functions
	function forEach(collection, callback, scope) {
		for (var i = 0; i < collection.length; i++) {
			callback.call(scope, collection[i], i);
		}
	}

}());