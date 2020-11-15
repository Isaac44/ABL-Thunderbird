/*
 * Copyright (C) 2015 - GEPESC - Universidade Federal de Itajuba
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(async function() 
{
	let prefs = await browser.storage.local.get({
		host: "192.168.0.1",
		port: "36465",
		user: "admin",
		upwd: "admin",
	});

	for (let [name, value] of Object.entries(prefs)) {
		let node = document.getElementById(name);
		if (!node) {
			continue;
		}

		node.value = value;
	}

	// FUTURE: I18N
//	for (let node of document.querySelectorAll("[data-l10n-id]")) {
//		let l10nid = node.getAttribute("data-l10n-id");
//		node.textContent = browser.i18n.getMessage(l10nid);
//
//		// Set the title attribute
//		if (node.localName == "label") {
//			node = node.parentNode;
//		}
//		
//		node.title = browser.i18n.getMessage(l10nid + ".title");
//	}

	document.body.addEventListener("change", () => {
		browser.storage.local.set({
			host: getValue("host"),
			port: getValue("port"),
			user: getValue("user"),
			upwd: getValue("upwd"),
		});
	});
  
})();

function getValue(id) {
	return document.querySelector("#" + id).value;
}

























