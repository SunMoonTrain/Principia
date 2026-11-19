---
id: cs.processor.demo
title: |
  P8 输入和输出
goal: |
  编写读两个字节并输出总和的程序。
prerequisites: []
status: reviewed
minutes: 5
summary: |
  IN 和 OUT 分别操作输入和输出队列。
---

## 这一节要回答的问题

如何把两个输入字节相加？

## 讲解

IN 把下一个字节读入寄存器。

## 动手模拟

:::anim{component="cpu"}
program: |
  IN R0
  OUT R0
  HLT
input: [7]
:::

## 例题

输入 7，程序输出 7。
