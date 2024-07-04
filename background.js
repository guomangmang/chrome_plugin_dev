chrome.commands.onCommand.addListener(async (command) => {
    if (command === "doocr") {
        // 执行你希望的操作
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const tabId = tabs[0].id;
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['lib/html2canvas.min.js', 'content-script.js']
            }, () => {
                chrome.tabs.sendMessage(tabId, { type: 'screenshot_operation' });
            });
        });
    } else if (command === "doocr_current") {
        // 执行你希望的操作
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const tabId = tabs[0].id;
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['lib/html2canvas.min.js', 'content-script.js']
            }, () => {
                chrome.tabs.sendMessage(tabId, { type: 'screenshot_operation_current' });
            });
        });
    } else if (command === "doocr_capture_viewport") {
        // 执行你希望的操作
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'screenshot_capture_viewport' });
            // const tabId = tabs[0].id;
            // chrome.scripting.executeScript({
            //     target: { tabId: tabId },
            //     files: ['lib/html2canvas.min.js', 'content-script.js']
            // }, () => {
            //     chrome.tabs.sendMessage(tabId, { type: 'screenshot_capture_viewport' });
            // });
        });
    }
});



// 监听content-script.js 的截图操作
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    if (request.type === "capture_visible") {
        // 对页面截图
        chrome.tabs.captureVisibleTab(null, { format: "png", quality: 10 }, (dataUrl) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                sendResponse({ error: chrome.runtime.lastError.message });
            } else {
                sendResponse({ image: dataUrl });
            }
        })
    }
    // 这里要返回 true 不然接收端收不到信息
    return true;
});











