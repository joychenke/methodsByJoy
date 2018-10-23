+ 使用ajax请求了新内容，再加载节点时，需要重新绑定tinymce
        [相关文章](https://www.tangshuang.net/2228.html)
    1. 初始化之前，先销毁tinymce，执行：tinymce.execCommand('mceRemoveEditor', true, 'myTextArea');
    2. 销毁之后，重新给id为myTextArea的textarea挂载tinymce tinymce.init(option)
    3. 幻灯片，瀑布流，评论框等等，也是如此

