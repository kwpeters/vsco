import { Directory } from "../depot/directory";
import { getHomeDir, getOs, OperatingSystem } from "./os";


const os = getOs();
const homeDir = getHomeDir();


const homeToVscodeSettingsWindows = ["AppData", "Roaming", "Code", "User"];
const homeToVscodeSettingsMac     = ["Library", "Application Support", "Code", "User"];


export function getVscodeSettingsDir(): Directory
{
    if (os === OperatingSystem.WINDOWS) {
        return new Directory(homeDir, ...homeToVscodeSettingsWindows);
    }
    else if (os === OperatingSystem.MAC) {
        return new Directory(homeDir, ...homeToVscodeSettingsMac);
    }
    else {
        throw new Error(`Operating system ${os} not supported.`);
    }
}


export function getBackupDir(settingsRepoDir: Directory): Directory
{
    if (os === OperatingSystem.WINDOWS) {
        return new Directory(settingsRepoDir, "windows", "home", ...homeToVscodeSettingsWindows);
    }
    else if (os === OperatingSystem.MAC) {
        return new Directory(settingsRepoDir, "mac", "home", ...homeToVscodeSettingsMac);
    }
    else {
        throw new Error(`Operating system ${os} not supported.`);
    }
}
