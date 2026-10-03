# Changelog

## [1.2.1] - fork

- **New:** the pet's right-click menu now starts with a one-line readout:
  `v1.2.1 · roaming|returning|parked · <n>px from home`. The build marker is the
  fastest way to tell whether the browser is running a freshly restarted bundle,
  and the distance makes the swim home observable (at the default 48 px/s, or
  80 px/s, a trip across the screen legitimately takes 10-20 s).
- **Test:** `test-roam.mjs` now also covers returning after every non-running
  pose (`review` / `waiting` / `failed` / `idle`) and returning across repeated
  effect restarts (state poll, menu, size change). 16 assertions.

## [1.2.0] - fork

- **New:** when the task ends the whale swims back to its home position at the
  same roaming speed, then parks and drops the run pose.
- **New:** `test-roam.mjs` drives the real roaming effect (its source is sliced
  out of `lib/client.js`) with a fake clock and rAF, asserting bounds, a speed
  ceiling, no per-frame jumps, the swim home, and that dragging / an open menu
  freeze it.
- **Fix:** the return trip stalled in a 1.5-8px dead zone and never parked.
- **Fix:** "teleport" jumps. The effect used to reset its internal position on
  every re-run (so any re-render could snap the pet), and `place()` was rebuilt
  on every state poll because it depended on the `config.position` object. It
  now keeps its position across re-runs and depends on the coordinates.
- **Fix:** erratic motion. Targets were uniformly random points, giving straight
  legs with sharp reversals. The whale now keeps a heading and extends it by a
  bounded random turn per leg (smooth curves), reflects off the viewport edges
  instead of clamping, and only flips its facing when the horizontal component
  is significant.
- **Fix:** the notification tray rode along and flipped sides as the whale
  crossed the screen. While roaming, the tray is pinned (position: fixed) to the
  whale's home anchor.
- **Fix:** the whale had no eyes when swimming right - the mirrored row drew
  eyes at unmirrored coordinates, off the body. Mirroring now flips the eye
  slots too.

## [1.1.2] - fork

- **Fix (for real this time):** the checked state is now painted as a single
  self-contained SVG image (blue rounded box + white tick) instead of relying on
  `background-color` + a separate tick image, so no host stylesheet can strip the
  fill. Verified by rasterising the markup with WebKit.
- **New:** the toggle's sub-label now also spells the state out
  (`· on` / `· off`), so the setting is readable even if a browser refuses to
  draw the control.
- **New:** the settings header shows the build (`v1.1.2`), which is the quickest
  way to tell whether the browser really loaded a freshly restarted DSH.

## [1.1.1] - fork

- **Fix:** the roaming toggle rendered as a flat, always-empty box. The row had
  reused the slider's `.dcp-size` class, whose `appearance:none` +
  `background:var(--pet-line)` killed the native checkbox tick. The toggle now
  has its own `.dcp-toggle` row and paints the tick itself (inline SVG data
  URI), so it no longer depends on native control rendering.

## [1.1.0] - fork

- **New:** screen roaming. While a session is running the pet wanders the whole
  page on its own, picking random targets inside the viewport and switching
  between `running-left` / `running-right` to face the way it moves.
- **New:** two settings under Pet settings -> Appearance: a *roam while a task
  runs* toggle (`roam`, default off) and a *roaming speed* slider
  (`roamSpeed`, 8-240 px/s, default 48). Both are validated on the host and
  persisted in `~/.dsh/codex-pet/config.json`.
- **New:** `test-host.mjs`, an in-process end-to-end test of the host handler
  (config round-trip, validation, removed update route, asset serving).

Upstream 0.1.7 and earlier is unchanged; see the end of this file.

# Changelog

## [0.1.7] - 2026-09-18

- Add compatibility with DSH `0.1.6-alpha.2` without dropping the existing supported hosts. Keep `sessions.open`, `pendingInteractions`, and legacy session snapshots on older hosts; use `uiWorkspace.openSession` and `uiSession.sessionStatus` only when those APIs are gone. Pin development types and the default e2e host to this release.
- Use a bilingual package description matching the GitHub repository.

## [0.1.6] - 2026-09-16

- Add compatibility with DSH `0.1.6-alpha.1` without dropping the existing supported hosts. Pin development types and the default e2e host to this release.

## [0.1.5] - 2026-09-12

- Keep the pet in a global Web overlay across pages while preserving interaction and letting clicks pass through empty areas.
- Showing the pet on Codex UI settings pages requires Codex UI 1.1.3 or later. The pet still works independently without Codex UI.

## [0.1.4] - 2026-09-11

- Restore compatibility with DSH `0.1.0-rc.8`, `0.1.1-rc.2`, `0.1.2-rc.1`, and `0.1.5-rc.1` while retaining `0.1.5-rc.2`. Adapt legacy session requests so pet notifications can answer questions and approvals on older hosts.

## [0.1.3] - 2026-09-11

- Support DSH Web `0.1.5-rc.2` and correct client service injection so the plugin loads with the updated host. Older DSH versions are outside the supported range.
- Known upstream limitation: stopping before the model returns an HTTP response may produce a `turn/end` serialization error and a failure notification; stopping after streaming starts is supported.

## [0.1.2] - 2026-09-09

- License original plugin code under Apache-2.0 and include LICENSE and third-party artwork NOTICE in the npm package.
- Automate npm publishing through GitHub Actions Trusted Publishing with provenance, version checks, tests, browser smoke checks, and package validation.
- Create bilingual normal GitHub Releases after npm publishing, without tarball or checksum attachments; document npm installation and publisher configuration.

## [0.1.1] - 2026-09-09

- Keep pet rendering inside DSH Web and expose a versioned consumer API for state, notifications, commands, and display handoff. Native window adaptation belongs to the consumer; remove native routes, renderer, bridge calls, and sibling-project tests.
- Use only the verified DSH CLI for npm updates, with a ten-minute timeout and an installation lock retained until process completion. Return stable localized error codes.
- Localize pet names, descriptions, settings, notifications, and menus; preserve user content. Add version and project links, shared update dialog, and Windows folder opening.
- Share library polling and publish only changed notification snapshots.
- Run independent Playwright Chromium smoke tests in temporary directories with automatic cleanup. No Electron or sibling checkout is needed.
- Pass type checking, 25 automated tests, build, and browser smoke checks. Real image generation, real-model interaction, and real npm updates still require acceptance testing.

## [0.1.0] - 2026-09-09

- Bundle nine pets, pet settings, and a DSH Skill-based entry for creating custom companions.
- Support in-page Web companions and native windows through a compatible Desktop pet bridge.
- Add multiple-task notifications, task navigation, current-turn cancellation, and approval, question, and plan request handling.
- Exclude subagent sessions to prevent subagent routing errors when opening or stopping tasks.
- Simplify the creation prompt by removing the Codex dependency disclaimer.
- Provide English and Chinese READMEs, a banner, and real plugin screenshots; keep local docs outside version control.
- Pass type checking, 17 automated tests, and the build; complete image generation, real-model interaction, and the normal Desktop installation still need end-to-end acceptance testing.
