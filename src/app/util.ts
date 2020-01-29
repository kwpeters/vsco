import { Directory } from "../depot/directory";
import { File } from "../depot/file";
import { DiffDirFileItemActionType, DiffDirFileItem } from "../depot/diffDirectories";
import { getHomeDir, getOs, OperatingSystem } from "./os";


const os = getOs();
const homeDir = getHomeDir();


/**
 * The path from the user's home directory to their vscode settings directory.
 */
const homeToVscodeSettingsWindows = ["AppData", "Roaming", "Code", "User"];
const homeToVscodeSettingsMac     = ["Library", "Application Support", "Code", "User"];


/**
 * Directories and files that should always be ignored when processing the
 * user's vscode settings directory.
 */
export const filePathIgnoreRegExps = [
    /^globalStorage[\/\\]/,
    /^workspaceStorage[\/\\]/
];


/**
 * Figures out where the user's vscode settings are stored, accounting for the
 * current OS.
 * @return The diretory where the user's vscode settings are stored
 */
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


/**
 * The path from the user's home directory to where vscode installs extensions.
 */
const homeToVscodeExtensions = [".vscode", "extensions"];


/**
 * Gets the directory where extensions are installed (for the current user)
 * @return The extensions directory
 */
export function getExtensionsDir(): Directory
{
    const extensionsDir = new Directory(homeDir, ...homeToVscodeExtensions);
    return extensionsDir;
}


/**
 * Gets the backup file used to record vscode extensions.
 * @param settingsRepoDir The directory containing backed up settings
 */
export function getExtensionsBackupFile(
    settingsRepoDir: Directory
): File
{
    const extensionsFile = new File(settingsRepoDir, "extensions.json");
    return extensionsFile;
}


/**
 * Figures out the backup .../Code/User directory location given the backup
 * repo directory and accounting for the current OS.
 * @param settingsRepoDir - The directory containing backed up settings.
 * @return The backup directory corresponding to the .../Code/User directory.
 */
export function getBackupDir(
    settingsRepoDir: Directory
): Directory
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


/**
 * Creates a textual representation of the specified DiffDirFileItem for the
 * specified action.
 * @param fileItem - The DiffDirFileItem to render
 * @param actionIndex - The index of `fileItem` to render
 * @return The textual representation
 */
export function diffDirFileItemRepresentation(
    fileItem: DiffDirFileItem,
    actionIndex: number
): string
{
    if (fileItem.actions.length === 0) {
        // The files must be identical.
        const sep = " === ";
        const leftStr = fileItem.leftFile ? fileItem.leftFile!.toString() : "";
        const rightStr = fileItem.rightFile ? fileItem.rightFile!.toString() : "";
        return leftStr + sep + rightStr;

    }
    else if (actionIndex >= fileItem.actions.length) {
        throw new Error(`Illegal action index ${actionIndex}.`);
    }
    else {

        const actionType = fileItem.actions[actionIndex].type;

        if (actionType === DiffDirFileItemActionType.COPY_LEFT) {
            const sep = " <-- ";
            const leftStr = fileItem.isRightOnly ?
                new File(fileItem.leftRootDir, fileItem.relativeFilePath).directory.toString() :
                new File(fileItem.leftRootDir, fileItem.relativeFilePath).toString();
            const rightStr = fileItem.rightFile!.toString();
            return leftStr + sep + rightStr;
        }
        else if (actionType === DiffDirFileItemActionType.COPY_RIGHT) {
            const sep = " --> ";
            const leftStr = fileItem.leftFile!.toString();
            const rightStr = fileItem.isLeftOnly ?
                new File(fileItem.rightRootDir, fileItem.relativeFilePath).directory.toString() :
                new File(fileItem.rightRootDir, fileItem.relativeFilePath).toString();
            return leftStr + sep + rightStr;
        }
        else if (actionType === DiffDirFileItemActionType.DELETE_LEFT) {
            const sep = "X    ";
            const leftStr = fileItem.leftFile!.toString();
            const rightStr = "";
            return leftStr + sep + rightStr;
        }
        else if (actionType === DiffDirFileItemActionType.DELETE_RIGHT) {
            const sep = "    X";
            const leftStr = "";
            const rightStr = fileItem.rightFile!.toString();
            return leftStr + sep + rightStr;
        }
        else if (actionType === DiffDirFileItemActionType.DELETE_BOTH) {
            const sep = "X   X";
            const leftStr = fileItem.leftFile!.toString();
            const rightStr = fileItem.rightFile!.toString();
            return leftStr + sep + rightStr;
        }
        else if (actionType === DiffDirFileItemActionType.SKIP) {
            const sep = "-| |-";
            const leftStr = fileItem.leftFile ? fileItem.leftFile!.toString() : "";
            const rightStr = fileItem.rightFile ? fileItem.rightFile!.toString() : "";
            return leftStr + sep + rightStr;
        }
        else {
            throw new Error(`Unsupported action type ${actionType}.`);
        }

    }
}
