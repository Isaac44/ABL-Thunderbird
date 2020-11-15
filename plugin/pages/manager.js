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
	const uiList = document.getElementById("address_list");
	
	// using functions from "database.js"		
	tbUsersItr
	(
		(prefs, user) => {
			var queryResult = database_list(prefs.host, user);
			console.log("query= " + queryResult);
			uiAddAddress(uiList, queryResult);
		}, 
		finish => {
			if (finish !== null) {
				alert("Failed… Exception: " + finish);
			}
		}
	);
	
	// remove selected e-mail
	document.querySelector("#remove_button").addEventListener("click", () => {
		removeSelectedAddress(uiList);
	});
	
	// add e-mail
	document.querySelector("#add_button").addEventListener("click", () => {
		addAddress(uiList, document.getElementById("email"));
	});
	
	return;
	
	// get arguments
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const mail = urlParams.get('mail');
		
	
	// click event
	document.querySelector("#send_button").addEventListener("click", () => {
		sendToBlacklist(mail.split("^"));
	});
})();

function uiAddAddress(uiList, queryResult) {
	var arr = queryResult.split("&");
    
    for (i = 0; i < arr.length; i++) {
        if (arr[i] != "") {
			var option = document.createElement("option");
			option.text = arr[i];
			uiList.add(option); 
		}
	}
}

function removeSelectedAddress(uiList) {
	var selIndex = uiList.selectedIndex;
	var address = uiList.options[selIndex].text;
	
	// Remove from DB
	// using functions from "database.js"
	tbUsersItr
	(
		(prefs, user) => {
			database_remove(prefs.host, user, address);
		}, 
		finish => {
			if (finish !== null) {
				alert("Failed… Exception: " + finish);
			}
			else {
				uiList.remove(selIndex);
				alert("Sucess!\nThe mail was removed from the BlackList.");
			}
		}
	);
}

function addAddress(uiList, uiTextBox)
{
	var mail = uiTextBox.value;
	
	// using functions from "database.js"		
	tbUsersItr
	(
		(prefs, user) => {
			database_add(prefs.host, user, mail);
		}, 
		finish => 
		{
			if (finish !== null) {
				alert("Failed… Exception: " + finish);
			} 
			else {
				uiAddAddress(uiList, mail);
				uiTextBox.value = "";
				uiList.selectedIndex = uiList.length - 1;
				alert("Blacklisted!");
			}
		}
	);
}























