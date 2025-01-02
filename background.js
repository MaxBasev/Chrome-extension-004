// Enable side panel on extension install
chrome.runtime.onInstalled.addListener(() => {
	chrome.sidePanel.setOptions({
		enabled: true
	});
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
	chrome.sidePanel.open({ windowId: tab.windowId });
}); 