/**
 * Host-half smoke test for zkb-codex-pet.
 *
 * Boots the plugin's HTTP handler in-process against a THROWAWAY data dir
 * (your real ~/.dsh/codex-pet is never touched) and exercises the config
 * round-trip, including the roaming fields.
 *
 *   node test-host.mjs
 */
import { cpSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHost } from "./lib/index.js";

const HERE = new URL(".", import.meta.url).pathname;
const REAL_PETS = join(process.env.HOME, ".dsh", "codex-pet", "pets");

const dataRoot = mkdtempSync(join(tmpdir(), "zkb-pet-test-"));
try {
  cpSync(REAL_PETS, join(dataRoot, "pets"), { recursive: true });
} catch {
  console.log("(no custom pets to copy - continuing)");
}

const host = await createHost({ root: HERE, dataRoot, skillRoot: join(HERE, "skills") });

function call(method, url, payload) {
  const chunks = payload === undefined ? [] : [Buffer.from(JSON.stringify(payload))];
  const req = {
    method,
    url,
    headers: {
      host: "127.0.0.1:3080",
      ...(payload === undefined
        ? {}
        : { "x-dsh-pet": "1", "content-type": "application/json", origin: "http://127.0.0.1:3080" })
    },
    async *[Symbol.asyncIterator]() {
      for (const chunk of chunks) yield chunk;
    }
  };
  const out = { status: 0, body: "", type: "" };
  const res = {
    headersSent: false,
    writeHead(code, headers) {
      out.status = code;
      out.type = headers?.["content-type"] ?? "";
      this.headersSent = true;
    },
    end(payload) {
      out.body = payload ?? "";
      if (Buffer.isBuffer(payload)) out.type = out.type || "buffer";
    }
  };
  return host.handler(req, res).then(() => {
    try {
      out.json = JSON.parse(out.body);
    } catch {
    }
    return out;
  });
}

let failures = 0;
function check(ok, label, detail = "") {
  console.log((ok ? "  ok   " : "  FAIL ") + label + (ok ? "" : "  <- " + detail));
  if (!ok) failures++;
}

const state = await call("GET", "/dsh-codex-pet/api/state");
check(state.status === 200, "GET /api/state -> 200", String(state.status));
const ids = (state.json?.pets ?? []).map((p) => p.id);
check(ids.includes("custom:bluewhale"), "custom pet is listed", JSON.stringify(ids));
check(
  (state.json?.pets ?? []).every((p) => p.source === "custom"),
  "no built-in pets remain",
  JSON.stringify(ids)
);
check(state.json?.config?.roam === false, "config.roam defaults to false", JSON.stringify(state.json?.config));
check(state.json?.config?.roamSpeed === 48, "config.roamSpeed defaults to 48", JSON.stringify(state.json?.config));

const on = await call("POST", "/dsh-codex-pet/api/config", { roam: true, roamSpeed: 96 });
check(on.status === 200, "POST roam:true speed:96 -> 200", JSON.stringify(on.json));

const after = await call("GET", "/dsh-codex-pet/api/state");
check(after.json?.config?.roam === true, "roam persisted", JSON.stringify(after.json?.config));
check(after.json?.config?.roamSpeed === 96, "roamSpeed persisted", JSON.stringify(after.json?.config));

const onDisk = JSON.parse(readFileSync(join(dataRoot, "config.json"), "utf8"));
check(onDisk.roam === true && onDisk.roamSpeed === 96, "config.json on disk carries both fields", JSON.stringify(onDisk));

const tooFast = await call("POST", "/dsh-codex-pet/api/config", { roamSpeed: 999 });
check(tooFast.status === 400 && /8/.test(tooFast.json?.error ?? ""), "roamSpeed 999 rejected", JSON.stringify(tooFast.json));

const badType = await call("POST", "/dsh-codex-pet/api/config", { roam: "yes" });
check(badType.status === 400, "roam:\"yes\" rejected", JSON.stringify(badType.json));

const sizeBad = await call("POST", "/dsh-codex-pet/api/config", { size: 999 });
check(sizeBad.status === 400, "existing size validation still works", JSON.stringify(sizeBad.json));

const untouched = await call("GET", "/dsh-codex-pet/api/state");
check(untouched.json?.config?.size === 120, "rejected writes changed nothing", JSON.stringify(untouched.json?.config));

const updateGet = await call("GET", "/dsh-codex-pet/api/update");
check([404, 405].includes(updateGet.status), "update route gone (GET)", String(updateGet.status));
const updatePost = await call("POST", "/dsh-codex-pet/api/update", {});
check(updatePost.status === 404 && updatePost.json?.error, "update route gone (POST -> unknown op)", JSON.stringify(updatePost.json));

const asset = await call("GET", "/dsh-codex-pet/asset/custom%3Abluewhale");
check(asset.status === 200 && asset.type === "image/png", "pet spritesheet still served", JSON.stringify(asset.type));

const builtinAsset = await call("GET", "/dsh-codex-pet/asset/codex");
check(builtinAsset.status === 400 || builtinAsset.status === 404, "built-in asset gone", String(builtinAsset.status));

console.log(failures ? `\n${failures} check(s) failed` : "\nall checks passed");
process.exit(failures ? 1 : 0);
