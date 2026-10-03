# dsh-bluewhale-pet — 个人 fork

这是 `@michengai/dsh-codex-pet@0.1.7` 的**改名 fork**，装在 DSH 的 `web` profile 里。
包名已从 `@michengai/dsh-codex-pet` 改为 **`dsh-bluewhale-pet`**，所以上游发新版本
（`@michengai/dsh-codex-pet@x.y.z`）**不会再覆盖这里**——在 DSH 眼里它们是两个包。

## 与原版的差异

| 项 | 原版 | 本 fork |
| --- | --- | --- |
| 包名 / 客户端模块 id | `@michengai/dsh-codex-pet` | `dsh-bluewhale-pet` |
| 版本号 | 跟随上游 | 自有版本线（从 `1.0.0` 起） |
| 内置宠物 | 9 只（Codex / Seedy / Rocky …） | **无**，只列自定义宠物 |
| `assets/codex/`（OpenAI Codex 图集，11 MB） | 打包 | **已删除** |
| 检查更新 / 自动安装 | 有（设置页按钮 + `/api/update`） | **已移除**（UI 与路由都删了） |
| 默认选中宠物 | `codex` | `custom:bluewhale` |

上游的 GitHub / Issues 链接、LICENSE、原始版权声明**保留**（Apache-2.0 要求署名）。
改动清单同时写在 `NOTICE` 里。

## 本 fork 新增：全屏漫游

有会话处于「运行中」时（`activity.pose === "running"`），宠物会在整个页面里自己游走；
随机挑一个视口内的目标点走过去，到了再挑下一个。方向自动切换 `running-left` /
`running-right`（原画朝左，向右走时用镜像行）。

**设置位置**：设置 → 宠物 → **外观**，在「宠物大小」下面两行

| 控件 | 配置字段 | 取值 |
| --- | --- | --- |
| 任务运行时全屏漫游（开关） | `roam` | 布尔，默认 `false` |
| 漫游速度（滑杆） | `roamSpeed` | 8–240 像素/秒，默认 `48` |

行为：**任务结束 → 以同样的速度游回初始位置 → 停下**（不会停在半路）。

运动算法：鲸鱼维护一个**朝向**，每段路只做有界随机转向（±43°）并走 140–380px，
所以轨迹是弧线而不是「直线 + 急转」；撞到视口边缘是**反射**而不是硬夹；
只有水平分量 > 2px 时才翻转朝向，避免竖直移动时左右抖动。

实现要点（都在 `lib/client.js` 的 `FloatingPet` 里）：

- 用 `requestAnimationFrame` 驱动，状态更新节流到 ~30Hz，避免每帧都重渲染。
- 拖动中（`drag.current`）、菜单打开、`document.hidden`、系统开了
  `prefers-reduced-motion` 时暂停。
- 拖动结束和窗口 resize 时会把漫游内部坐标置空，让它从新位置重新接着走，
  不会「被拽回去」。
- 漫游**不写回配置**：`config.position` 保持你手动摆的位置，刷新页面后回到原位；漫游结束后它会自己游回去。
- 漫游期间**通知托盘被钉在初始锚点**（`position: fixed`），不再跟着鲸鱼满屏跑、也不会左右横跳。
- `test-roam.mjs` 会把这段 effect 的**真实代码**从 bundle 里切出来跑（假时钟 + 假 rAF），
  覆盖边界、限速、单帧位移（防瞬移）、回家、拖动/菜单冻结等 11 项断言。
- 速度上下限在客户端和主机侧各夹一次（主机侧 `normalizeConfig` 会拒绝越界值）。

主机侧新增字段校验：`roam` 必须是布尔、`roamSpeed` 必须是 8–240 的数字，
否则 `/api/config` 返回 400。`test-host.mjs` 覆盖了这些用例。

## 保留的东西

- `skills/hatch-pet/` —— 用 DSH 生成自定义宠物的 Skill，没动。
- `assets/branding/`、`assets/screenshots/` —— 插件自身素材，没动。
- 宠物数据仍在 **包外**：`~/.dsh/codex-pet/`（`config.json` + `pets/`），
  更新或重装本 fork 都不会碰它。

## 改代码

本 fork 以 `link:` 方式装进 profile，也就是说
`~/.dsh/profiles/web/node_modules/dsh-bluewhale-pet` 是指向本目录的软链接：

```
~/dsh-plugins/codex-pet/          <-- 改这里
  └── 通过 link 出现在 profile 的 node_modules 里
```

- 改 `lib/index.js`（主机侧）→ 需重启 DSH。
- 改 `lib/client.js`（浏览器侧）→ 至少刷新页面。
- 改完自查语法：`node --check lib/index.js && node --check lib/client.js`

`lib/*.js` 是 esbuild 产物（保留了 `// src/xxx.ts` 分段注释），没有源码工程；
要改 TS 就得去上游仓库 clone 后自己 build。

## 卸载 / 回退到原版

```bash
# 卸掉 fork
dsh plugin --profile web remove dsh-bluewhale-pet

# 需要时装回原版（宠物数据一直都在，不受影响）
dsh plugin --profile web add @michengai/dsh-codex-pet@0.1.7 --registry=https://registry.npmjs.org/
```

## 装法（已经装好）

在 profile 里是一条 **link 依赖**：

```json
// ~/.dsh/profiles/web/package.json
"dependencies": { "dsh-bluewhale-pet": "link:/Users/zkb/dsh-plugins/codex-pet" },
"dsh": { "profile": { "bundles": [ ..., "dsh-bluewhale-pet" ] } }
```

`node_modules/dsh-bluewhale-pet` 是指向本目录的软链接，所以**改本目录的文件 = 改正在用的插件**，不用重装。

## 三处名字必须一致（改名前务必同步）

DSH 靠这三个名字对齐，任何一个不一致都会加载失败：

| 位置 | 值 |
| --- | --- |
| `package.json` → `name` | `dsh-bluewhale-pet` |
| `cordis.patch.yml` → `insert[0].name` | `dsh-bluewhale-pet` |
| `lib/client.js` → `__ModuleLoader__.load({id:...})` | `dsh-bluewhale-pet` |

- 第 2 项错了 → Loader 找不到模块（因为 patch 里的 `name` 才是真正被 import 的 spec）。
- 第 3 项错了 → 浏览器端 boot 直接抛
  `client-modules: bundle ... loaded without registering "<name>" via __ModuleLoader__.load`。

自查：`dsh --profile web --dump-config | grep -A2 bluewhale-pet`
