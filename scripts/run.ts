/**
 * @script run.ts
 * @description Runs Cypress tests and generates the HTML report.
 *              By default runs all tests without cleaning previous reports.
 *              Supports filtering by tag (via @cypress/grep) or by named suite
 *              (defined in cypress/suites/suites.json).
 *
 * @usage
 *   npm test [-- flags]
 *
 * @flags
 *   --clean          Delete previous report artifacts before running.
 *
 *   --env <value>    Target environment. Must match a config file in cypress/config/.
 *                    Examples: --env dev  --env qa  --env prod
 *                    Defaults to "dev" if omitted.
 *
 *   --tag <value>    Run only tests matching the given tag or test case ID.
 *                    Examples: --tag @smoke  --tag TC-UI-005
 *
 *   --keyword <text> Run only tests whose title contains the given text (partial match).
 *                    Examples: --keyword "login"  --keyword "checkout flow"
 *
 *   --suite <name>   Run a named suite from cypress/suites/suites.json.
 *                    Suites can target specific spec files and/or test titles.
 *
 *   --list-suites    List all available suites, then exit. No tests are run.
 *
 * @examples
 *   npm test
 *   npm test -- --env qa
 *   npm test -- --clean
 *   npm test -- --tag @smoke
 *   npm test -- --tag TC-UI-005
 *   npm test -- --suite smoke --env prod
 *   npm test -- --suite smoke --clean
 *   npm test -- --keyword "login"
 *   npm test -- --list-suites
 *
 * @exits
 *   0 — all tests passed and report generated successfully.
 *   1 — one or more tests failed, report generation failed, or bad arguments.
 */
import { execSync } from "child_process";
import path from "path";
import fs from "fs";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SpecEntry = string | { file: string; tests: string[] };

interface Suite {
  description: string;
  specs: SpecEntry[];
}

interface SuitesConfig {
  suites: Record<string, Suite>;
}

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

/**
 * Returns true if the given boolean flag is present in the CLI arguments.
 * @param name - The flag name, e.g. `"--clean"`.
 */
function flag(name: string): boolean {
  return args.includes(name);
}

/**
 * Returns the value of a named CLI option, or undefined if not provided.
 * Expects the value to be the argument immediately following the option name.
 * @param name - The option name, e.g. `"--env"`.
 */
function option(name: string): string | undefined {
  const idx = args.indexOf(name);
  return idx !== -1 ? args[idx + 1] : undefined;
}

const withClean = flag("--clean");
const listOnly = flag("--list-suites");
const envArg = option("--env");
const tagFilter = option("--tag");
const keyword = option("--keyword");
const suiteName = option("--suite");

console.log("--------------------------");
console.log("** Flags **");
console.log(`Clean > ${withClean}`);
console.log(`List Only > ${listOnly}`);
console.log("** Arguments **");
console.log(`Environment > ${envArg}`);
console.log(`Tags > ${tagFilter}`);
console.log(`Keyword > ${keyword}`);
console.log(`Suite > ${suiteName}`);
console.log("--------------------------");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Executes a shell command synchronously and prints it to stdout.
 * @param cmd - The command string to execute.
 * @returns `true` if the command succeeded, `false` if it threw an error.
 */
function run(cmd: string): boolean {
  console.log(`\n> ${cmd}`);
  try {
    execSync(cmd, { stdio: "inherit" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Builds the --env and --expose flags for a cypress run command.
 * ENV goes in --env (Cypress config).
 * All grep-related vars go in --expose (@cypress/grep v6 reads from config.expose).
 * Appends grepOmitFiltered=true whenever any grep filter is active.
 */
function buildEnvFlag(extra: string[] = []): string {
  const exposeParts = [...extra];
  if (keyword) exposeParts.push(`grepTitle=${keyword}`);
  const hasGrep = exposeParts.length > 0;
  if (hasGrep) exposeParts.push("grepOmitFiltered=true", "grepFilterSpecs=true");
  const envFlag = `--env "ENV=${envArg ?? "dev"}"`;
  const exposeFlag = exposeParts.length > 0 ? ` --expose "${exposeParts.join(",")}"` : "";
  return `${envFlag}${exposeFlag}`;
}

/**
 * Reads `cypress/config/` and prints the available environment names to stdout.
 * Used to guide the user when an invalid `--env` value is passed.
 */
function listEnvironments(): void {
  const configDir = path.join(__dirname, "..", "cypress", "config");
  const envs = fs
    .readdirSync(configDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));

  console.log("\nAvailable environments:\n");
  for (const env of envs) {
    console.log(`  · ${env}`);
  }
  console.log();
}

/**
 * Reads and parses `cypress/suites/suites.json`.
 * @returns The full suites configuration object.
 */
function loadSuites(): SuitesConfig {
  const suitesPath = path.join(__dirname, "..", "cypress", "suites", "suites.json");
  return JSON.parse(fs.readFileSync(suitesPath, "utf-8"));
}

/**
 * Returns a human-readable string for a spec entry.
 * Plain string entries are returned as-is; object entries show the file and its test list.
 * @param entry - A spec entry from the suite definition.
 */
function formatSpecEntry(entry: SpecEntry): string {
  if (typeof entry === "string") return entry;
  return `${entry.file} [${entry.tests.join(", ")}]`;
}

/**
 * Prints all available suites (names, descriptions, and spec details) to stdout.
 * Used for `--list-suites` and when an unknown suite name is given.
 */
function listSuites(): void {
  const { suites } = loadSuites();
  const names = Object.keys(suites);
  const maxLen = Math.max(...names.map((n) => n.length));

  console.log("\nAvailable suites:\n");
  for (const [name, suite] of Object.entries(suites)) {
    console.log(`  ${name.padEnd(maxLen + 2)} ${suite.description}`);
    for (const entry of suite.specs) {
      if (typeof entry === "string") {
        console.log(`  ${"".padEnd(maxLen + 2)} · ${entry}`);
      } else {
        console.log(`  ${"".padEnd(maxLen + 2)} · ${entry.file}`);
        for (const test of entry.tests) {
          console.log(`  ${"".padEnd(maxLen + 4)}   - ${test}`);
        }
      }
    }
    console.log();
  }
}

/**
 * Returns the paths of spec files that contain the given text.
 * @param text - The string to search for.
 * @param caseInsensitive - Whether to search case-insensitively (default: false).
 */
function specsContaining(text: string, caseInsensitive = false): string[] {
  const specDir = path.join(__dirname, "..", "cypress", "e2e");
  const needle = caseInsensitive ? text.toLowerCase() : text;
  const results: string[] = [];

  function scan(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.name.match(/\.cy\.[jt]s$/)) {
        const content = fs.readFileSync(fullPath, "utf-8");
        const haystack = caseInsensitive ? content.toLowerCase() : content;
        if (haystack.includes(needle)) results.push(fullPath);
      }
    }
  }

  scan(specDir);
  return results;
}

/**
 * Merges individual Mochawesome JSON results, processes metadata, and generates the HTML report.
 * Runs three steps in sequence: merge → process-report → marge.
 * Skips the remaining steps and returns `true` if the merged report has no results (nothing to show).
 * @returns `true` if the full report was generated successfully, `false` on any failure.
 */
function generateReport(): boolean {
  if (!run('mochawesome-merge "cypress/reports/mocha/*.json" -o cypress/reports/mochawesome.json'))
    return false;

  const reportPath = path.join(__dirname, "..", "cypress", "reports", "mochawesome.json");
  try {
    const report = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
    if (!report.results?.length) {
      console.warn("\nNo tests to report for the applied filter.");
      return true;
    }
  } catch {
    return false;
  }

  if (!run("tsx scripts/process-report.ts")) return false;
  return run("marge cypress/reports/mochawesome.json -f index -o cypress/reports/html");
}

// ---------------------------------------------------------------------------
// --list-suites
// ---------------------------------------------------------------------------

if (listOnly) {
  listSuites();
  process.exit(0);
}

// ---------------------------------------------------------------------------
// --env validation
// ---------------------------------------------------------------------------

if (envArg) {
  const configDir = path.join(__dirname, "..", "cypress", "config");
  const validEnvs = fs
    .readdirSync(configDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));

  if (!validEnvs.includes(envArg)) {
    console.error(`Error: environment "${envArg}" does not exist.\n`);
    listEnvironments();
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// --clean
// ---------------------------------------------------------------------------

if (withClean) {
  run("npm run report:clean");
}

// ---------------------------------------------------------------------------
// Run tests
// ---------------------------------------------------------------------------

let allPassed = true;

if (suiteName) {
  // --- Suite mode ---
  const { suites } = loadSuites();

  if (!suites[suiteName]) {
    console.error(`Error: suite "${suiteName}" does not exist.\n`);
    listSuites();
    process.exit(1);
  }

  const suite = suites[suiteName];
  const plainSpecs: string[] = [];
  const filteredSpecs: { file: string; grep: string }[] = [];

  for (const entry of suite.specs) {
    if (typeof entry === "string") {
      plainSpecs.push(entry);
    } else {
      filteredSpecs.push({ file: entry.file, grep: entry.tests.join(";") });
    }
  }

  console.log(`\n==========================================`);
  console.log(`Suite:       ${suiteName}`);
  console.log(`Description: ${suite.description}`);
  console.log(`Specs:       ${suite.specs.map(formatSpecEntry).join(", ")}`);
  console.log(`==========================================`);

  if (plainSpecs.length > 0) {
    if (!run(`npx cypress run --browser chrome --spec "${plainSpecs.join(",")}" ${buildEnvFlag()}`))
      allPassed = false;
  }

  for (const { file, grep } of filteredSpecs) {
    if (!run(`npx cypress run --browser chrome --spec "${file}" ${buildEnvFlag([`grep=${grep}`])}`))
      allPassed = false;
  }
} else if (tagFilter) {
  // --- Tag mode ---
  if (specsContaining(tagFilter).length === 0) {
    console.warn(`\nNo tests found with tag "${tagFilter}". Nothing to run.`);
  } else {
    console.log(`\n> Filtering by tag: ${tagFilter}`);
    if (!run(`npx cypress run --browser chrome ${buildEnvFlag([`grepTags=${tagFilter}`])}`))
      allPassed = false;
  }
} else if (keyword) {
  // --- Keyword mode ---
  if (specsContaining(keyword, true).length === 0) {
    console.warn(`\nNo tests found matching keyword "${keyword}". Nothing to run.`);
  } else {
    console.log(`\n> Filtering by keyword: ${keyword}`);
    if (!run(`npx cypress run --browser chrome ${buildEnvFlag()}`)) allPassed = false;
  }
} else {
  // --- Default: all tests ---
  if (!run(`npx cypress run --browser chrome ${buildEnvFlag()}`)) allPassed = false;
}

// ---------------------------------------------------------------------------
// Generate report
// ---------------------------------------------------------------------------

if (!generateReport()) {
  console.error("\nError generating the report.");
  process.exit(1);
}

if (!allPassed) {
  console.warn("\nTests finished with failures — check the report.");
  process.exit(1);
}
