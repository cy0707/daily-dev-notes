# 使用vscode进行Java环境基础搭建

## 下载JDK

在vscode中进行java开发，需要先到下载Oracle官网下载JDK，具体下载以及配置环境变量的方法,可参考以下链接
[Windows系统下JAVA开发环境搭建](https://www.cnblogs.com/orezero/p/5838429.html)

## 在vscode下载相关插件

    1.Java Extension Pack（安装时其他java相关插件会自动安装）
    2.Java Debug （调试代码）
    3.Java Test Runner （单元测试）

## 编写我们的第一个java程序

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("hello world");
    }
}
```

此时，我们可以在控制台，执行以下语句

```shell
# java文件编译成class字节码文件
# 此时在我们的目录下生成了 HelloWorld.class文件
javac HelloWorld.java

# 执行这个字节码文件, 不能在java命令，后面添加class后缀名，会出现错误: 仅当显式请求注释处理时才接受类名称
java HelloWorld
# java 命令后的参数是 java 类名，而不是字节码文件的文件名，也不是 java 源文件文件名，java要求你的文件和你的类名严格对应的

# 此时控制台会输出
hello world
```

## 什么是JVM

JVM是Java Virtual Machine（Java虚拟机）的缩写，JVM是一种用于计算设备的规范，它是一个虚构出来的计算机，是通过在实际的计算机上仿真模拟各种计算机功能来实现的。Java虚拟机包括一套字节码指令集、一组寄存器、一个栈、一个垃圾回收堆和一个存储方法域。 JVM屏蔽了与具体操作系统平台相关的信息，使Java程序只需生成在Java虚拟机上运行的目标代码（字节码）,就可以在多种平台上不加修改地运行。JVM在执行字节码时，实际上最终还是把字节码解释成具体平台上的机器指令执行

## JRE/JDK/JVM是什么关系

1.JRE(JavaRuntimeEnvironment，Java运行环境)，也就是Java平台。所有的Java 程序都要在JRE下才能运行。普通用户只需要运行已开发好的java程序，安装JRE即可。

2.JDK(Java Development Kit)是程序开发者用来来编译、调试java程序用的开发工具包。JDK的工具也是Java程序，也需要JRE才能运行。为了保持JDK的独立性和完整性，在JDK的安装过程中，JRE也是 安装的一部分。所以，在JDK的安装目录下有一个名为jre的目录，用于存放JRE文件。

3.JVM(JavaVirtualMachine，Java虚拟机)是JRE的一部分。它是一个虚构出来的计算机，是通过在实际的计算机上仿真模拟各种计算机功能来实现的。JVM有自己完善的硬件架构，如处理器、堆栈、寄存器等，还具有相应的指令系统。Java语言最重要的特点就是跨平台运行。使用JVM就是为了支持与操作系统无关，实现跨平台。

以上的概念来源于[面试必问之JVM原理](https://mp.weixin.qq.com/s/S9Wk0XyFqZ2p1IeP_aVzTg)

> 总结来说： 他们的关系是 JDK>JRE>JVM