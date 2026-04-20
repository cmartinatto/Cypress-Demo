import { defineConfig } from "cypress";
import * as fs from "fs";
import * as path from "path";
import * as grepPlugin from "@cypress/grep/plugin";

type EnvName = "dev" | "qa" | "prod";

interface EnvConfig {
  baseUrl: string;
  apiUrl: string;
}

function loadEnvConfig(envName: string): EnvConfig {
  const validEnvs: EnvName[] = ["dev", "qa", "prod"];
  const env = validEnvs.includes(envName as EnvName) ? envName : "dev";
  const configPath = path.resolve(__dirname, `cypress/config/${env}.json`);
  return JSON.parse(fs.readFileSync(configPath, "utf-8")) as EnvConfig;
}

export default defineConfig({
  allowCypressEnv: false,
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    configFile: "reporter-config.json",
  },
  e2e: {
    setupNodeEvents(_on, config) {
      const envName = (config.env.ENV as string) ?? "dev";
      const envConfig = loadEnvConfig(envName);

      config.baseUrl = envConfig.baseUrl;
      config.env["API_URL"] = envConfig.apiUrl;

      grepPlugin.plugin(config);
      return config;
    },
  },
});
