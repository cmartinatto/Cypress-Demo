/**
 * @script clean-reports.ts
 * @description Recursively deletes all contents inside the `cypress/reports/` directory.
 *              Leaves the directory itself intact. Designed to be run before a new test
 *              execution to avoid stale report artifacts.
 *
 * @usage
 *   npx ts-node scripts/clean-reports.ts
 *   npm run report:clean
 *
 * @arguments
 *   None.
 *
 * @example
 *   npm run report:clean
 *
 * @output
 *   Prints "Reports cleaned." on success.
 *   Prints a warning for each file/folder that could not be deleted (e.g. locked files).
 *
 * @sideEffects
 *   Permanently deletes all files and subdirectories under cypress/reports/.
 */
import fs from 'fs';
import path from 'path';

const reportsDir = path.join(__dirname, '..', 'cypress', 'reports');

function deleteContents(dirPath: string): void {
  if (!fs.existsSync(dirPath)) return;

  for (const entry of fs.readdirSync(dirPath)) {
    const fullPath = path.join(dirPath, entry);
    try {
      const stat = fs.lstatSync(fullPath);
      if (stat.isDirectory()) {
        deleteContents(fullPath);
        fs.rmdirSync(fullPath);
      } else {
        fs.unlinkSync(fullPath);
      }
    } catch (err) {
      console.warn(`Skipped: ${fullPath} (${(err as NodeJS.ErrnoException).code})`);
    }
  }
}

deleteContents(reportsDir);
console.log('Reports cleaned.');
