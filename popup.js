


document.addEventListener('DOMContentLoaded', function () {
    // 获取每个截图选项的 DOM 元素
    var currentArea = document.getElementById('currentArea');
    var fullPage = document.getElementById('fullPage');
    var customArea = document.getElementById('customArea');

    // 添加点击事件监听器
    currentArea.addEventListener('click', function () {
        // 处理截取当前可视区域的操作
        console.log('截取当前可视区域');
        chrome.runtime.sendMessage({ type: "capture_visible" }, (response) => {
            if (response && response.image) {
                // 创建下载链接
                const downloadLink = document.createElement('a');
                downloadLink.href = response.image;
                downloadLink.download = 'screenshot.png';
                downloadLink.click();
            } else {
                console.error('No image received');
            }
        })

        // const downloadLink = document.createElement('a');
        // downloadLink.href = screen_image.image;
        // downloadLink.download = 'visible_screenshot.png';
        // document.body.appendChild(downloadLink);
        // downloadLink.click();
        // document.body.removeChild(downloadLink);

        // chrome.runtime.sendMessage({ type: 'capture_visible' }, (response) => {
        //     console.log(response.status);
        // });
        // 关闭弹出页面
        window.close();
    });

    fullPage.addEventListener('click', function () {
        // 处理截取整个页面的操作
        console.log('截取整个页面');
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'screenshot_operation' });
        });
        // 关闭弹出页面
        window.close();
    });

    customArea.addEventListener('click', function () {
        // 处理截取自定义区域的操作
        console.log('截取自定义区域');
        // 这里可以编写你的截图功能代码
    });
});
