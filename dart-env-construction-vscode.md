# 使用vscode进行Dart开发环境的搭建

## 下载JDK

[Get the Dart SDK](https://www.dartlang.org/install)
点击上面的链接，根据不同的OS提供的下载方式, 进行Dart的JDK下载, 在window上面，我选择的安装包的下载方式，[下载链接](www.gekorm.com/dart-windows/)

下载完成后，直接向其他安装包那样，一直点下一步，直到安装完成。有可能网络原因，安装不成功，此时你可以多尝试几次
就会成功。如果还是不成功的话，可以参考官网，更换其他方式安装。

配置系统的环境变量，把安装的Dart的jdk路径，配置到系统环境变量中，为了测试是否安装完成，可在terminal中输入`dart --version`命令查看是否安装成功

## vscode对Dart语言的支持

1. 下载Dart

2. 配置jdk路径，打开-文件-首选项-设置，添加如下用户设置：

```json
// 配置jdk路径，打开：文件-首选项-设置，添加如下用户设置：
"dart.sdkPath": "安装dart的jdk的路径"
```