### ConsoleMe功能：
- **在手机上查看console[log|warn|error|info|debug]的输出**
- **在手机上查看JS代码运行时错误**
- **在手机上输入JS代码执行**

### 注意事项
- 可通过手动执行`window.ConsoleMe();`来运行。

### 调用方法
- 页面引用：
   - 说明：script标签中的`consoleme-run`开关会忽略所有环境检测直接运行 ConsoleMe。
   - 也可通过手动执行`window.ConsoleMe();`来运行。
```
<script consoleme-run src="./dist/consoleme.min.js"></script>
```
### 如何唤起
- 浏览器双指连续敲击页面10次

### 支持命令简写
- `UA`: navigator.userAgent

### Demo
![](https://raw.githubusercontent.com/David-CodingSerf/consoleme/master/demo.gif)
