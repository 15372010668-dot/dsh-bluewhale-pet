<div align="center">

# DSH Blue Whale Pet

**A blue whale companion for your DeepSeek Harness tasks**

[简体中文](README.zh-CN.md) · [Apache-2.0](LICENSE)

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)
[![DSH Web Plugin](https://img.shields.io/badge/DSH%20Web-Plugin-0f766e.svg)](https://github.com/15372010668-dot/dsh-bluewhale-pet)
[![Node.js 22.19+](https://img.shields.io/badge/Node.js-22.19%2B-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org/)

</div>

**dsh-bluewhale-pet** is an in-page companion plugin for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH). A blue whale stays in the corner of the page while you work, so you can keep an eye on your tasks and respond to anything that needs your attention.

## Features

- **In-page companion**: a blue whale lives in the corner of the DSH page while you work.
- **Multiple tasks at a glance**: see running, completed, failed, and pending tasks; when there are no notifications the pet just stays quiet.
- **Act from the notification**: open the associated conversation, stop its current turn, or handle approval, question, and plan requests.
- **Full-screen roaming**: while a task is running, the whale wanders freely around the page and swims back to its spot when the task ends (toggle and speed are configurable in settings).
- **Custom pets**: no built-in pets ship with the plugin; it shows only the custom pets in `~/.dsh/codex-pet/pets`.
- **Small interactions**: drag to move, double-click to jump, and right-click for the pet menu.

## Usage

Open **Settings → Pets**, or open settings from the pet's right-click menu.

| Goal | Action |
| --- | --- |
| Pick a companion | Select a pet in settings and adjust its size. |
| Move or play | Drag the pet to move it; double-click to jump. |
| Read task updates | Read the notification bubbles; expand the list when several tasks need attention. |
| Continue a conversation | Click its notification or reply control to open the corresponding DSH task. |
| Handle a request | Open the request details and answer the supported approval, question, or plan prompt. |
| Stop a task turn | Click the stop control on that running task's notification. |
| Dismiss a reminder | Click its close control. The task continues running. |
| Hide or restore the pet | Use the right-click menu or pet settings. |

### Create a custom pet

1. Open pet settings, click **Create**, and describe the companion.
2. Click **Create in DSH**. The plugin opens a dedicated task and sends the bundled Skill instructions.
3. Follow that task's progress. Creation uses DSH's configured model and image tools.
4. Once the pet files are saved, refresh the pet library and select the new companion.

> Creating pets requires an image-generation tool configured in DSH.

## Installation

This plugin is a personal fork and is **not published to npm**. It is installed into a DSH profile as a **`link:` local dependency**.

1. Clone this repository:

   ```bash
   git clone https://github.com/15372010668-dot/dsh-bluewhale-pet.git
   cd dsh-bluewhale-pet
   ```

2. Add it as a `link:` dependency in your DSH profile's `package.json` (example uses the `web` profile):

   ```json
   {
     "dependencies": {
       "dsh-bluewhale-pet": "link:/absolute/path/dsh-bluewhale-pet"
     },
     "dsh": {
       "profile": {
         "bundles": ["...", "dsh-bluewhale-pet"]
       }
     }
   }
   ```

3. Restart DSH, then open **Settings → Pets**.

## License

Licensed under the [Apache License 2.0](LICENSE). See [NOTICE](NOTICE) for more information.
