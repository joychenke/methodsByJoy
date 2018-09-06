##.gitignore使用<br/>
[相关地址1](https://www.cnblogs.com/kevingrace/p/5690241.html)

###问题：
1. .gitignore中，如何过滤掉指定文件和文件夹？<br/>
    + 不track所有的fold文件  fold/
    + 不track所有.zip文件   *.zip

2. .gitignore中，如何指定某些文件或文件夹必须上传<br/>
    前面加一个感叹号即可。<br/>
    /mtk/<br/>
    !/mtk/one.txt<br/>
    上面两行代码的意思是，只管理mtk下的one.txt文件

3. .gitignore配置的一些语法：
    + 斜杠 / 表示目录
    + 星号 * 通配多个字符
    + 问号 ？ 通配单个字符
    + 方括号 [] 包含单个字符的匹配列表
    + 感叹号 ！ 表示不忽略匹配到的文件or目录


4. 使用gitignore时注意的地方<br/>
    + .gitignore是按行从上往下匹配
    + 如果你不慎在创建.gitignore文件之前就push了项目，那么即使你在.gitignore文件中写入新的过滤规则，这些规则也不会起作用，Git仍然会对所有文件进行版本管理。
    + 出现这种问题的原因就是Git已经开始管理这些文件了，所以你无法再通过过滤规则过滤它们。因此一定要养成在项目开始就创建.gitignore文件的习惯，否则一旦push，处理起来会非常麻烦。


