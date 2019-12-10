import * as _ from "lodash";
import { SettingsFile } from "./settingsFile";
import { getHomeDir, getOs, OperatingSystem } from "./os";
import { Directory } from "../depot/directory";
import { File } from "../depot/file";

const homeDir = new Directory(getHomeDir());
const os = getOs();


export async function getSettingsFiles(backupRepoDir: Directory): Promise<Array<SettingsFile>>
{
    let settingsFiles: Array<SettingsFile> = [];

    if (os === OperatingSystem.WINDOWS)
    {
        //
        // Settings
        //
        settingsFiles.push(
            new SettingsFile(
                new File(homeDir, "AppData", "Roaming", "Code", "User", "settings.json"),
                new File(backupRepoDir, "windows", "home", "AppData", "Roaming", "Code", "User", "settings.json")
            )
        );

        //
        // Keybindings
        //
        settingsFiles.push(
            new SettingsFile(
                new File(homeDir, "AppData", "Roaming", "Code", "User", "keybindings.json"),
                new File(backupRepoDir, "windows", "home", "AppData", "Roaming", "Code", "User", "keybindings.json")
            )
        );

        //
        // All of the snippets files
        //
        const codeSnippetsDir = new Directory(homeDir, "AppData", "Roaming", "Code", "User", "snippets");
        const snippetsDirContents = await codeSnippetsDir.contents(false);

        settingsFiles = _.concat(settingsFiles, _.map<File, SettingsFile>(snippetsDirContents.files, (curFile) => {
            return new SettingsFile(
                curFile,
                new File(backupRepoDir, "windows", "home", "AppData", "Roaming", "Code", "User", "snippets", curFile.fileName)
            );
        }));
    }
    else if (os === OperatingSystem.MAC)
    {
        //
        // Settings
        // ~/Library/Application Support/Code/User/settings.json
        //
        settingsFiles.push(
            new SettingsFile(
                new File(homeDir, "Library", "Application Support", "Code", "User", "settings.json"),
                new File(backupRepoDir, "mac", "home", "Library", "Application Support", "Code", "User", "settings.json")
            )
        );

        //
        // Keybindings
        // ~/Library/Application Support/Code/User/keybindings.json
        //
        settingsFiles.push(
            new SettingsFile(
                new File(homeDir, "Library", "Application Support", "Code", "User", "keybindings.json"),
                new File(backupRepoDir, "mac", "home", "Library", "Application Support", "Code", "User", "keybindings.json")
            )
        );

        //
        // Snippet files
        // example:
        // ~/Library/Application Support/Code/User/snippets/typescript.json
        //
        const codeSnippetsDir = new Directory(homeDir, "Library", "Application Support", "Code", "User", "snippets");
        const snippetsDirContents = await codeSnippetsDir.contents(false);

        settingsFiles = _.concat(settingsFiles, _.map<File, SettingsFile>(snippetsDirContents.files, (curFile) => {
            return new SettingsFile(
                curFile,
                new File(backupRepoDir, "mac", "home", "Library", "Application Support", "Code", "User", "snippets", curFile.fileName)
            );
        }));
    }
    
    return settingsFiles;
}
