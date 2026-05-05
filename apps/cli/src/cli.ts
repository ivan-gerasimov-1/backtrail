import { Command, createCommand } from "commander";

export function cli() {
  return new Command()
    .name("string-util")
    .description("CLI to some JavaScript string utilities")
    .version("0.8.0")
    .addCommand(
      createCommand("create")
        .argument("empty | adr | feature | change")
        .action((target) => console.log(target)),
    );
}
