#!/usr/bin/env node

import { cli } from "#/cli";

async function main() {
  try {
    await cli().parseAsync();
  } catch (error) {
    let message = error instanceof Error ? error.message : "Unknown CLI error";

    console.error(message);

    process.exitCode = 1;
  }
}

main();
