export function getActivaTab(id?: number): Promise<chrome.tabs.Tab | null> {
    console.log('id?: ', id);
    return new Promise((res) => {
        chrome.tabs.query({}, function (tabs) {
            // tabs 数组包含了当前窗口中所有激活的标签页
            if (tabs.length > 0) {
                // 第一个标签页就是当前激活的标签页
                if (id) {
                    res(tabs.find((tab) => tab.id === id))
                } else {
                    var activeTab = tabs[0];
                    res(activeTab)
                }
            } else {
                console.log('没有激活的标签页。');
                res(null)
            }
        });
    })
}