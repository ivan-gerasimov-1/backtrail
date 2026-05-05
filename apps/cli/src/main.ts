#!/usr/bin/env node

import { cli } from "#/cli";

function main() {
  try {
    cli().parse();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown CLI error";

    console.error(message);

    process.exitCode = 1;
  }
}

main();
