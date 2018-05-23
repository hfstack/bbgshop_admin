### 已完成功能
+ 管理员登录
+ 商品管理
+ 商品分类
+ 品牌管理
+ 订单管理

### Build Setup

+ 安装bbgshop
[GitHub](https://gitee.com/cyh1231wp/bbgshop-node)

+ 修改api地址
src/renderer/main.js
```
Axios.defaults.baseURL = 'http://127.0.0.1:8360/admin/';  # admin/ 不可删除
```
+ 运行
``` bash
# install dependencies
npm install

# 编译成 web ，编译成功后把 dist/web 下的文件上传的http服务器的根目录下
npm run build:web

```

# 测试账号
admin
admin888
