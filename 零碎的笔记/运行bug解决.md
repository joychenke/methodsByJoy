1. cnpm run dev 跑vue项目时，虽然成功，但是提示：No parser and no file path given
    + 这里出现的问题是因为prettier， 一个vue-cli的依赖，把一个feature 的移除当作次版本发布。 这个导致npm install 到的@vue/component-compiler-utils 的runtime 出错导致。
    + 解决方法：
        1. 删掉node_modules下的`_prettier`开头的文件夹
        2. 重新安装`prettier`，即 ` cnpm install --save-dev prettier@1.12.0`
        3. 重启`cnpm run dev`

2. vue项目出现了报错信息：`the "scope" attribute for scoped slots have been deprecated and replaced by`
    + 这是因为，"scope"标签自Vue 2.5版本后被遗弃，替代的新标签是"slot-scope"
    + 解决方法是：把scope=“scope”更换为slot-scope="scope"