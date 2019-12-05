import * as _ from "lodash";
import { Argv, Arguments } from "yargs";
import {Directory} from "../depot/directory";

export const command = "backup-settings <settingsRepoDir>";
export const describe = "Backs up VSCode setting to the specified settings repository.";


export function builder(argv: Argv): Argv
{
    return argv
        .positional(
            "settingsRepoDir",
            {
                describe: "Directory of settings repository",
                type: "string"
            }
        )
        .check(
            (argv: Arguments) => {

                console.log("---");
                console.log(argv);
                console.log("---");

                const backupSettingsDir = new Directory(argv.settingsRepoDir);

                if (!backupSettingsDir) {
                    throw new Error(`The setting repo directory "${backupSettingsDir.toString()}" does not exist.`);
                }

                // If we got this far, everything is ok.
                return true;
            },
            false
        );
}


export function handler(args: Arguments): void
{
    console.log("hello world");
    console.log(`You are backing up to: ${args.settingsRepoDir}`);
}