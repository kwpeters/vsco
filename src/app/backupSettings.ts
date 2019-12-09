import * as _ from "lodash";
import * as BBPromise from "bluebird";
import { Argv, Arguments } from "yargs";
import { Directory } from "../depot/directory";
import { getSettingsFiles } from "./settingsFiles";

export const command = "backup-settings <settingsRepoDir>";
export const describe = "Backs up VSCode setting to the specified settings repository.";


export function builder(argv: Argv): Argv {
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


export async function handler(args: Arguments): Promise<void> {
    const settingsFiles = await getSettingsFiles(args.settingsRepoDir);
    const promises = _.map(settingsFiles, curSettingsFile => {
        return curSettingsFile.vscodeFile.copy(curSettingsFile.backupFile);
    });

    return BBPromise.all(promises)
        .then(() => { });
}