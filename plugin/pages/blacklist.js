/*
 * Copyright (C) 2020 - GEPESC - Universidade Federal de Itajuba
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
	// get arguments
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const mail = urlParams.get('mail');
		
	// add arguments to the list
	document.getElementById("address_list").value = mail.replaceAll("^", "\n");
	
	// click event
	document.querySelector("#send_button").addEventListener("click", () => {
		sendToBlacklist(mail.split("^"));
	});
})();

function closeWindow() {
	browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT})
		.then(tabs => browser.tabs.remove(tabs[0].id));
}

// Send the selected e-mails to blacklist
function sendToBlacklist(mails) 
{
	// using functions from "database.js"		
	tbUsersItr
	(
		(prefs, user) => {
			console.log("host = " + prefs.host);
			for (var k = 0; k < mails.length; k++) {
				database_add(prefs.host, user, mails[k]);
			}
		}, 
		finish => {
			if (finish == null) {
				alert("Blacklisted!");
				closeWindow();
			} else {
				alert("Failed… Exception: " + finish);
			}
		}
	);
}