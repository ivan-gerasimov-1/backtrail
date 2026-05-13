import { ConfigLoader } from "../modules/configLoader/configLoader";
import { FileSystem } from "../modules/fileSystem/fileSystem";

type TLoadCommandConfigOptions = {
  cwd: string;
  configPath?: string;
};

let configLoader = new ConfigLoader(new FileSystem());

export async function loadCommandConfig(options: TLoadCommandConfigOptions) {
  return configLoader.load(options);
}
