<div align="center">

# DSH Blue Whale Pet

**一只陪你处理 DeepSeek Harness 任务的蓝鲸桌宠**

[English](README.md) · [Apache-2.0](LICENSE)

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)
[![DSH Web Plugin](https://img.shields.io/badge/DSH%20Web-Plugin-0f766e.svg)](https://github.com/15372010668-dot/dsh-bluewhale-pet)
[![Node.js 22.19+](https://img.shields.io/badge/Node.js-22.19%2B-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org/)

</div>

<p align="center">
  <img src="assets/screenshots/bluewhale-running.png" alt="蓝鲸桌宠在 DSH 页面中运行的效果" width="360">
</p>

**dsh-bluewhale-pet** 是一款运行在 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）中的页内桌宠插件。工作时让一头蓝鲸陪在页面角落，随时查看任务进展、处理需要你关注的请求。

## 功能概览

- **页内陪伴**：蓝鲸常驻 DSH 页面角落，陪你工作。
- **多会话动态**：查看运行中、完成、出错和待处理的任务；没有通知时只安静地待着。
- **就近处理**：从通知直接打开对应会话、停止当前轮次，或处理审批、问题和计划请求。
- **全屏漫游**：任务运行时，蓝鲸会在整个页面里自由游走；任务结束再游回原位停下（可在设置中开关、调节速度）。
- **内置蓝鲸**：随包附带一只像素风小蓝鲸，装好即可直接用；`~/.dsh/codex-pet/pets` 下的自定义宠物也会一并显示。
- **轻量互动**：拖动移动、双击跳跃、右键打开宠物菜单。

## 使用

打开 **设置 → 宠物**，也可以从蓝鲸的右键菜单进入设置。

| 目标 | 操作 |
| --- | --- |
| 选择伙伴 | 在设置中选择宠物并调整大小。 |
| 移动与互动 | 拖动宠物移动，双击跳跃。 |
| 查看任务动态 | 阅读通知气泡；多个任务需要关注时展开列表。 |
| 继续会话 | 点击通知或回复按钮，打开对应的 DSH 任务。 |
| 处理请求 | 展开请求详情，处理支持的审批、问题或计划。 |
| 停止任务轮次 | 点击对应运行中通知的停止按钮。 |
| 关闭提醒 | 点击通知关闭按钮，任务仍继续运行。 |
| 收起或恢复宠物 | 使用右键菜单或宠物设置。 |

### 创建自定义宠物

1. 打开宠物设置，点击 **创建**，描述想要的伙伴。
2. 点击 **在 DSH 中创建**，插件会打开独立任务并发送随包 Skill 指令。
3. 在该任务中查看进展，创建使用 DSH 当前配置的模型和图像工具。
4. 宠物文件生成并保存后，刷新宠物库并选择新伙伴。

> 创建宠物需要先在 DSH 中配置图像生成工具。

## 安装

本插件是一个个人 fork，**没有发布到 npm**，通过 **`link:` 本地依赖**的方式装入 DSH profile。

1. 克隆本仓库：

   ```bash
   git clone https://github.com/15372010668-dot/dsh-bluewhale-pet.git
   cd dsh-bluewhale-pet
   ```

2. 在你的 DSH profile 中的 `package.json` 里把它加为 link 依赖（示例使用 `web` profile）：

   ```json
   {
     "dependencies": {
       "dsh-bluewhale-pet": "link:/绝对/路径/dsh-bluewhale-pet"
     },
     "dsh": {
       "profile": {
         "bundles": ["...", "dsh-bluewhale-pet"]
       }
     }
   }
   ```

3. 重启 DSH，再打开 **设置 → 宠物**。

## 许可证

本项目采用 [Apache License 2.0](LICENSE) 授权。更多信息见 [NOTICE](NOTICE)。
