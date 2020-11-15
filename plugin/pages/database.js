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
 
// Fast Access to Thunderbird Accounts
function tbUsersItr(onUser, onFinish) 
{
	browser.storage.local.get(["host"/*, "port", "user", "upwd"*/]).then(prefs => 
	{
		if (!prefs) {
			onFinish("ABL is not configured! Go to the options page, and configure it.");
			return;
		}
		
		browser.accounts.list().then(users => 
		{
			try {
				// For-each user...
				for (var i = 0; i < users.length; i++) {
					var ids = users[i].identities;
					
					// For-each user's mail account...
					for (var j = 0; j < ids.length; j++) {
						onUser(prefs, ids[j].email);
					}
				}
				
				onFinish(null);
			}
			catch (ex) {
				onFinish(ex);
			}
		});
	});
}

// -------------------------------------------------------------------------------------
// Functions to send the e-mail to the blacklist
// Credits: https://github.com/mbemvieira/plugin-antispam
// -------------------------------------------------------------------------------------

function createCORSRequest(method, url, sync) 
{
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, sync);
    } 
	else if (typeof XDomainRequest != "undefined") {
        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } 
	else {
        // Otherwise, CORS is not supported by the browser.
        xhr = null;
    }
	
    return xhr;
}

function getUrlPage(url, page) {
	if (!url.endsWith("/")) {
		url += "/";
	}
	
	url += page;
	return url;
}

function executePOST(url, page, args) {
	url = getUrlPage(url, page);
	var xhr = createCORSRequest("POST", url, true);

    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Content-length", args.length);
	xhr.setRequestHeader("Connection", "close");

    if (!xhr) {
		throw new Error('CORS not supported');        
    } 
	else {
		xhr.send(args);
    }
}

function database_add(url, user, spamMail) {
	executePOST(url, "abl_insert.php", "spam=" + spamMail + "&user=" + user)
}

function database_remove(url, user, spamMail) {
	executePOST(url, "abl_remove.php", "spam=" + spamMail + "&user=" + user)
}

function database_list(url, user) 
{
    url = getUrlPage(url, "abl_list.php") + "?user=" + user;
    var xhr = createCORSRequest("GET", url, false);

    if (!xhr) {
        throw new Error('CORS not supported');        
    } 
	else {
    	xhr.send(null);
        if (xhr.status === 200) {
            return xhr.responseText;
        }
    }
	
	return null;
}