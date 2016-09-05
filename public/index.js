/*
*
* call `start` on HugeNav and pass in endpoint with nav menu data
* Ex:
* HugeNav.start(endpoint) 
* 
* To test, call `test` on HugeNav and pass in a true or false verbose tag
* Ex:
* HugeNav.test('api/nav.json', false);
*
*/

var HugeNav = (function() {
	var httpRequest;
	var testing;
	var testingRequest;

	function getNavBarData(url, callback) {
		httpRequest = new XMLHttpRequest();
		if (!httpRequest) {
			console.log('could not create an XMLHTTP instance');
			return;
		}
		if (callback && testing) {
			testingRequest = new XMLHttpRequest();
			testingRequest.onreadystatechange = callback;
			testingRequest.open('GET', url);
			testingRequest.send();
			return;	
		} else {
			httpRequest.onreadystatechange = handleNavBarData;
		}	
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

	document.querySelector('#menuToggle').onclick = toggleMenu;
	document.querySelector('#menuLinks').onclick = toggleDropdown;
	document.querySelector('#navLinks').onclick = toggleDropdown;
	document.querySelector('#mask').onclick = resetDropdowns;

	function toggleMenu() {
		document.querySelector('#slideInMenu').classList.toggle('open');
		document.querySelector('#mainBody').classList.toggle('open');
		document.querySelector('#menuToggle').classList.toggle('open');
		toggleMask();
	}

	function toggleMask() {
		document.querySelector('#mask').classList.toggle('hidden');
	}

	function populateMenu(items) {
		var ul = '<ul>';
		forEach(items, function(item) {
			ul += generateMenuItem(item);
		});
		ul += '</ul>';
		document.querySelector('#menuLinks').innerHTML = ul;
		document.querySelector('#navLinks').innerHTML = ul;
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

	function toggleDropdown(e) {
		e.stopPropagation();
		// need to close any other open dropdowns
		if (e && e.target && e.target.parentElement && e.target.parentElement.children && e.target.parentElement.children.length) {
			forEach(e.target.parentElement.children, function(item) {
				if (item.classList && item.classList.contains('open') && item !== e.target) {
					item.classList.remove('open');
				}
			});
		}
		e.target.classList.toggle('open');
		if (e.target.classList.contains('has-secondary') && e.target.classList.contains('open')) {
			document.querySelector('#mask').classList.remove('hidden');
		}
	}

	function resetDropdowns(e) {
		var mask = document.querySelector('#mask');
		if (!mask.classList.contains('hidden')) {
			mask.classList.add('hidden');
		}
		closeAllDropdowns();
	}

	function closeAllDropdowns() {
		var navLinks = document.querySelector('#navLinks > *').children;
		var menuLinks = document.querySelector('#menuLinks > *').children;
		var slideMenu = document.querySelector('#slideInMenu').classList;
		if (slideMenu.contains('open')) {
			toggleMenu();
			document.querySelector('#mask').classList.add('hidden');
		}
		function closeLink(link) {
			if (link.classList.contains('open')) {
				link.classList.remove('open');
			}
		}
		forEach(navLinks, function(link) { closeLink(link); });
		forEach(menuLinks, function(link) { closeLink(link); });
	}

	// utility functions
	function forEach(collection, callback, scope) {
		for (var i = 0; i < collection.length; i++) {
			callback.call(scope, collection[i], i);
		}
	}

	// tests
	function runTests(endpoint, verbose) {
		var failedTests = 0;
		var passedTests = 0;
		testing = true;
		console.log('----- running tests -----');
		_testType(endpoint, 'string');
		getNavBarData(endpoint, function() {
			if (testingRequest.readyState === XMLHttpRequest.DONE) {
				if (testingRequest.status === 200) {
					_testResponse(JSON.parse(testingRequest.responseText));
				}
			}
		});

		function _testType(obj, type) {
			if (typeof obj === type) {
				if (verbose) {
					console.log('Type of "', obj, ' " should be "', type + ' "', '----- PASSES');
				}
				passedTests++;
			} else if (type === 'array' && obj.constructor === Array) {
				if (verbose) {
					console.log('Type of "', obj, ' " should be "', type + ' "', '----- PASSES');
				}
				passedTests++;
			} else {
				console.error('Type of "', obj, ' " should be "', type + ' "', '----- FAILS');
				failedTests++
			}
		}

		function _testLength(obj, length) {
			if (obj.length === length) {
				if (verbose) {
					console.log('Should have ', length, ' objects ----- PASSES');
				}
				passedTests++;
			} else {
				console.error(obj, ' should have ', length, ' objects', '----- FAILS');
				failedTests++
			}
		}

		function _testURL(url) {
			if (url.split('/')[0] === '#') {
				if (verbose) {
					console.log('Valid url: ', url, '----- PASSES');
				}
				passedTests++;
			} else {
				console.error('Invalid url, must start with "#"', url, '----- FAILS');
				failedTests++;	
			}
		}

		function _testResponse(items) {
			_testType(items, 'object');
			_testLength(items.items, items.items.length);
			forEach(items.items, function(item) {
				_testType(item, 'object');
				_testType(item.label, 'string');
				_testType(item.url, 'string');
				_testURL(item.url);
				if (items.items) {
					_testType(item.items, 'array');
					forEach(item.items, function(obj) {
						_testType(obj, 'object');
						_testType(obj.label, 'string');
						_testType(obj.url, 'string');
						_testURL(obj.url);
					});
				}
			});
			_testSummary();
		}

		function _testSummary() {
			console.log('finished tests with ', passedTests, ' passing and ', failedTests, ' failing');
			testing = false;
		}

	}

	return {
		start: getNavBarData,
		test: runTests
	}

}());