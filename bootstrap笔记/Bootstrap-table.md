-   bootstrap-table 中用到的方法：

    1. $('#table').bootstrapTable(tableJson); 初始化 table 2. $('#table').bootstrapTable('hideLoading'); 隐藏 table 加载时的加载提示 3. $('#table').bootstrapTable('load', tableData); load table 的内容，替换原 table 数据

-   Bootstrap 中用到的事件：

    1. onClickRow，点击某一行
    2. onClickCell，点击某一列
    3. onPageChange，页码改变

-   加操作区：
    <pre>
    {
        field: 'operate',
        title: '操作',
        align: 'center',
        valign: 'middle',
        formatter: operateFormatter, //给表格添加操作按钮
        events: operateEvents  //给操作按钮绑定事件。此事件要绑定到window对象下面
    }
    </pre>
