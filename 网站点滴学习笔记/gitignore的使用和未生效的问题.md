##.gitignore使用<br/>
[相关地址1](https://www.cnblogs.com/kevingrace/p/5690241.html)

###问题：
1. .gitignore中，如何过滤掉指定文件和文件夹？<br/>
    + 不track所有的fold文件  fold/
    + 不track所有.zip文件   *.zip

2. .gitignore中，如何指定某些文件或文件夹必须上传?<br/>
    前面加一个感叹号即可。<br/>
    /mtk/<br/>
    !/mtk/one.txt<br/>
    上面两行代码的意思是，只管理mtk下的one.txt文件

3. .gitignore配置的一些语法：
    + 斜杠 / 表示目录
    + 星号 * 通配多个字符
    + 问号 ？ 通配单个字符,匹配任意一个字符
    + 方括号 [] 包含单个字符的匹配列表
    + 感叹号 ！ 表示不忽略匹配到的文件or目录


4. 使用gitignore时注意的地方<br/>
    + .gitignore是按行从上往下匹配
    + 如果你不慎在创建.gitignore文件之前就push了项目，那么即使你在.gitignore文件中写入新的过滤规则，这些规则也不会起作用，Git仍然会对所有文件进行版本管理。
    + 出现这种问题的原因就是Git已经开始管理这些文件了，所以你无法再通过过滤规则过滤它们。因此一定要养成在项目开始就创建.gitignore文件的习惯，否则一旦push，处理起来会非常麻烦。
    + 如果将想要忽略的文件添加到了缓存中，可以使用rm命令，将其删除

5. 已经add过的文件需要移除<br/>
    + `git rm yichu.html` 将yichu.html从暂存区移除
    + `rm yichu.html` 将yichu.html从磁盘删除

6. 想删的东西已经上传到git仓库。如何删除？
    1. 方法一：先在远程将其删除 ，然后将远程代码pull到本地。
    2. 方法二：从本地删除这些文件，并且在gitignore中添加这些文件，然后push到远程

7. gitignore不生效的原因？
    + 在git忽略目录中，新建的文件在git中会有缓存，如果某些文件已经被纳入了版本管理中，就算是在.gitignore中已经声明了忽略路径也是不起作用的，这时候我们就应该先把本地缓存删除，然后再进行git的push。代码是（代码段1） `git rm -r --cached . ` ,`git add .` , `git commit -m 'update .gitignore'`
    + gitignore值忽略没被track的文件。如果某些文件已经被纳入了版本管理中，则修改.gitignore是无效的。

8. 之前没写gitignore就上传了一些没必要文件，后来写了，需要删掉远程仓库的文件，怎么办呢？
    +跟上面（代码段1）的方法一样，就三段代码ok。

9. git库所在文件夹的几种大致4种状态
    + Untracked 未跟踪, 此文件在文件夹中, 但并没有加入到git库, 不参与版本控制. 通过git add 状态变为Staged.
    + Unmodify  文件已经入库, 未修改, 即版本库中的文件快照内容与文件夹中完全一致. 这种类型的文件有两种去处, 如果它被修改,而变为Modified. 如果使用git rm移出版本库, 则成为Untracked文件
    + Modified  文件已修改, 仅仅是修改, 并没有进行其他的操作. 这个文件也有两个去处, 通过git add可进入暂存staged状态,使用git checkout 则丢弃修改过, 返回到unmodify状态, 这个git checkout即从库中取出文件, 覆盖当前修改
    + Staged    暂存状态. 执行git commit则将修改同步到库中, 这时库中的文件和本地文件又变为一致, 文件为Unmodify状态.执行git reset HEAD filename取消暂存, 文件状态为Modified
    + Git 状态 untracked 和 not staged的区别
        1. untrack     表示是新文件，没有被add过，是为跟踪的意思、
        2. not staged  表示add过的文件，即跟踪文件，再次修改没有add，就是没有暂存的意思