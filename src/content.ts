window.onload = () => {
	chrome.runtime.sendMessage({
		message: "load end",
		type: "load",
		origin: window.location.origin,
	});
};
