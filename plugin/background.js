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

function onCreated() 
{
	if (browser.runtime.lastError) {
		console.log(`Error: ${browser.runtime.lastError}`);
	} else {
		console.log("Item created successfully");
	}
};

// Add an "option" on the selected messages's ContextMenu 
browser.menus.create(
	{
		id: "addSenderToBlackList_action",
		title:browser.i18n.getMessage("add_to_blacklist"), 
		contexts: ["message_list"]
	}
, onCreated);

// When an item of the ContextMenu is clicked, 
// check if is the "add to blacklist" item
browser.menus.onClicked.addListener((info, tab) => 
{
	switch (info.menuItemId) 
	{
		case "addSenderToBlackList_action": {
			createWindow(info.selectedMessages.messages);
			break;
		}
	}
})

// When an item of the BrowserAction is clicked, 
// check if is the "add to blacklist" item
browser.browserAction.onClicked.addListener(() => 
{
	browser.windows.create({
		url: "pages/manager.html",
		type: "panel",
		height: 415,
		width: 550
	});
})

// Some emails formatted as:
// "Person Name <user@domain.com>"
// Others are onlye the mail:
// "<user@domain.com>"
// This function gets the relevante part
function getPureAddress(author) {
	var matches = author.match(/<(.*?)>/);
	return matches ? matches[1] : author;
}

// Create the arguments to execute a GET call
function getEmailAsUrlArguments(messages) {
	
	if (messages.length == 0) {
		return null;
	}
		
	args = "?mail=" + getPureAddress(messages[0].author);
	
	for (var i = 1; i < messages.length; i++) 
	{
		// prevent repetition
		var arg = getPureAddress(messages[i].author);
		if (args.indexOf(arg) == -1) {
			args += "^" + arg;
		}
	}
	
	return args;
}

// Create a TAB with the selected e-mails to send to the BlackList
// TODO: Improve this method using "POST" instead of "GET"
function createWindow(messages) {
	var args = getEmailAsUrlArguments(messages);
	if (args == null) {
		alert("Something went wrong. Try again!")
		return;
	}
		
	browser.windows.create({
		url: "pages/blacklist.html" + args,
		type: "panel",
		height: 245,
		width: 550
	});
}