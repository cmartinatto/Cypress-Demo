/**
 * @script inject-metadata.ts
 * @description Injects a fixed bottom banner into cypress/reports/html/index.html
 *              with run metadata (workflow, environment, branch, actor, timestamp).
 *              Reads context from environment variables set by the calling workflow.
 *
 * @env
 *   META_WORKFLOW  GitHub workflow name
 *   META_ENV       Target environment (dev | qa | prod)
 *   META_BRANCH    Branch name
 *   META_ACTOR     GitHub username that triggered the run
 *   META_RUN_URL   Direct URL to the GitHub Actions run
 *
 * @usage
 *   npx tsx scripts/inject-metadata.ts
 */
import fs from "fs";
import path from "path";

const env = (key: string): string => process.env[key] ?? "unknown";

const workflow = env("META_WORKFLOW");
const runEnv   = env("META_ENV");
const branch   = env("META_BRANCH");
const actor    = env("META_ACTOR");
const runUrl   = process.env["META_RUN_URL"] ?? "#";

const ts = new Date()
  .toISOString()
  .replace("T", " ")
  .slice(0, 16) + " UTC";

const reportPath = path.join("cypress", "reports", "html", "index.html");

if (!fs.existsSync(reportPath)) {
  console.error(`Error: ${reportPath} not found`);
  process.exit(1);
}

let html = fs.readFileSync(reportPath, "utf-8");

const style = [
  "<style>",
  "#report-meta{position:fixed;bottom:0;left:0;right:0;z-index:9999;",
  "background:#2d3748;color:#e2e8f0;text-align:center;",
  "padding:6px 12px;font-size:12px;font-family:monospace;",
  "border-top:2px solid #4a5568;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
  "body{padding-bottom:38px!important}",
  "</style>",
].join("");

const div = [
  '<div id="report-meta">',
  `<b>${workflow}</b>`,
  ` &nbsp;|&nbsp; env: <b>${runEnv}</b>`,
  ` &nbsp;|&nbsp; branch: <b>${branch}</b>`,
  ` &nbsp;|&nbsp; by: ${actor}`,
  ` &nbsp;|&nbsp; <a href="${runUrl}" style="color:#90cdf4">view run</a>`,
  ` &nbsp;|&nbsp; ${ts}`,
  "</div>",
].join("");

html = html.replace("</head>", `${style}</head>`);
html = html.replace(/(<body[^>]*>)/, `$1${div}`);

fs.writeFileSync(reportPath, html, "utf-8");
console.log(`Metadata injected: ${workflow} | ${runEnv} | ${branch} | ${actor} | ${ts}`);
