/**
 * 监听 background.js 发来的消息
*/
chrome.runtime.onMessage.addListener(async (req, sender, res) => {
    if (req.type === 'screenshot_operation') {
        captureAndDownloadScreenshot()
    } else if (req.type === 'screenshot_operation_current') {
        captureVisibleScreenshot()
    } else if (req.type === 'screenshot_capture_viewport') {
        document.addEventListener('keydown', startSelection);
        document.addEventListener('keyup', stopSelection);
    }

    return true
})




function captureAndDownloadScreenshot() {
    const originalBodyWidth = document.body.scrollWidth;
    const originalBodyHeight = document.body.scrollHeight;
    html2canvas(document.body, {
        useCORS: true, // Ensure cross-origin images are handled
        allowTaint: true,
        logging: true,
        width: originalBodyWidth,
        height: originalBodyHeight
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');

        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = imgData;
        downloadLink.download = 'screenshot.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Optional: Save the screenshot data URL in storage
        chrome.storage.local.set({ screenshot: imgData }, () => {
            console.log('Screenshot saved');
        });
    }).catch(error => {
        console.error('Error capturing screenshot:', error);
    });
}


// 可视区域的截图
function captureVisibleScreenshot() {

    console.log(window.innerWidth, window.innerHeight, 'window.innerHeightv');
    html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        logging: true,
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');

        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = imgData;
        downloadLink.download = 'visible_screenshot.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        chrome.storage.local.set({ screenshot: imgData }, () => {
            console.log('Screenshot saved');
        });
    }).catch(error => {
        console.error('Error capturing screenshot:', error);
    });
}









let isSelecting = false;
let startX, startY, endX, endY;
let selectionBox;

function createSelectionBox() {
    selectionBox = document.createElement('div');
    selectionBox.style.position = 'fixed';
    selectionBox.style.border = '2px dashed blue';
    // selectionBox.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
    selectionBox.style.zIndex = '10000';
    document.body.appendChild(selectionBox);
}

function updateSelectionBox(x, y) {
    selectionBox.style.left = `${Math.min(startX, x + window.scrollX)}px`;
    selectionBox.style.top = `${Math.min(startY, y + window.scrollY)}px`;
    selectionBox.style.width = `${Math.abs(x - startX)}px`;
    selectionBox.style.height = `${Math.abs(y - startY)}px`;
}

function captureSelectedArea() {
    const rect = selectionBox.getBoundingClientRect();
    html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        logging: true,
        x: rect.left + window.scrollX + 2,
        y: rect.top + window.scrollY + 2,
        width: rect.width - 4,
        height: rect.height - 4
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');

        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = imgData;
        downloadLink.download = 'selected_area_screenshot.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Optional: Save the screenshot data URL in storage
        chrome.storage.local.set({ screenshot: imgData }, () => {
            console.log('Screenshot saved');
        });

        document.body.removeChild(selectionBox);
        selectionBox = null;
    }).catch(error => {
        console.error('Error capturing screenshot:', error);
    });
}

function startSelection(event) {
    if (event.key === 'Alt') {
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('scroll', onScroll, true);
    }
}

function stopSelection(event) {
    if (event.key === 'Alt') {
        document.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('scroll', onScroll, true);
    }
}

function onMouseDown(event) {
    isSelecting = true;
    startX = event.clientX;
    startY = event.clientY;
    createSelectionBox();
}

function onMouseMove(event) {
    if (isSelecting) {
        updateSelectionBox(event.clientX, event.clientY);
    }
}

function onMouseUp(event) {
    if (isSelecting) {
        endX = event.clientX;
        endY = event.clientY;
        isSelecting = false;
        captureSelectedArea();
    }
}

function onScroll() {
    if (isSelecting) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        updateSelectionBox(mouseX, mouseY);
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'activate_custom_screenshot') {
        document.addEventListener('keydown', startSelection);
        document.addEventListener('keyup', stopSelection);
    }
});














