import * as _ from "lodash";
import * as BBPromise from "bluebird";
import { Argv, Arguments } from "yargs";
import { Directory } from "../depot/directory";
import { diffDirectories, ActionPriority } from "../depot/diffDirectories";
import { promptToContinue } from "../depot/prompts";
import {
    getVscodeSettingsDir,
    getBackupDir,
    filePathIgnoreRegExps,
    diffDirFileItemRepresentation,
    getExtensionsDir,
    getExtensionsBackupFile
} from "./util";


////////////////////////////////////////////////////////////////////////////////
// Command Configuration

export const command = "restore-settings <settingsRepoDir>";

export const describe = "Restores VSCode setting from the specified settings repository.";

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

                if (!backupSettingsDir.existsSync()) {
                    const msg = `The setting repo directory "${backupSettingsDir.toString()}" does not exist.`;
                    console.error(msg);
                    throw new Error(msg);
                }

                // If we got this far, everything is ok.
                return true;
            },
            false
        );
}


export async function handler(args: Arguments): Promise<void> {
    const vscodeSettingsDir = getVscodeSettingsDir();
    const backupDir = getBackupDir(args.settingsRepoDir);

    const diffDirItems = await diffDirectories(
        vscodeSettingsDir,
        backupDir,
        ActionPriority.R_TO_L,
        false      // Don't include identical files in results
    );

    // Remove any file differences related to ignored files.
    _.remove(diffDirItems, (curDiffDirItem) => {
        const curRelativeFilePath = curDiffDirItem.relativeFilePath;

        return _.some(filePathIgnoreRegExps, (curIgnoreRegExp: RegExp) => {
            return curIgnoreRegExp.test(curRelativeFilePath);
        });
    });

    if (diffDirItems.length === 0) {
        console.log("All settings are up-to-date.");
    }
    else {
        // Print each file and its default action that will be performed.
        _.forEach(diffDirItems, (curDiffDirItem) => {
            console.log(diffDirFileItemRepresentation(curDiffDirItem, 0));
        });

        try {
            await promptToContinue(`Perform the ${diffDirItems.length} actions?`, false, 0);

            // Perform the default action for each file.
            // Note: We do not have to worry about `actions` being a 0-length array
            // because we chose not to include identical files in the results.
            const promises = _.map(diffDirItems, (curDiffDirItem) => {
                return curDiffDirItem.actions[0].execute();
            });

            await BBPromise.all(promises);
        }
        catch {
        }
    }


    const vscodeExtensionsDir = getExtensionsDir();
    const extensionsContents = vscodeExtensionsDir.contentsSync(false);
    const installedExtensions = _.chain(extensionsContents.subdirs)
    .map((curSubDir) => curSubDir.dirName)
    .sort()
    .value();

    const extensionsFile = getExtensionsBackupFile(new Directory(args.settingsRepoDir));
    const backupExtensions: Array<string> = (extensionsFile.readJsonSync() as any).extensions;

    const needToInstall = _.difference(backupExtensions, installedExtensions);
    if (needToInstall.length === 0) {
        console.log("You have all extensions installed.");
    }
    else {
        console.log("You need to install the following extension:");
        console.log(needToInstall.join("\n"));
    }

    const extraExtensions = _.difference(installedExtensions, backupExtensions);
    if (extraExtensions.length === 0) {
        console.log("You don't have any extra extensions installed.");
    }
    else {
        console.log("You have the following extra extensions installed:");
        console.log(extraExtensions.join("\n"));
    }

}
