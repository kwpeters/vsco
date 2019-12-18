import { Directory } from "../depot/directory";
import { File } from "../depot/file";
import { DiffDirFileItemActionType, DiffDirFileItem } from "../depot/diffDirectories";
import { getHomeDir, getOs, OperatingSystem } from "./os";


const os = getOs();
const homeDir = getHomeDir();


const homeToVscodeSettingsWindows = ["AppData", "Roaming", "Code", "User"];
const homeToVscodeSettingsMac     = ["Library", "Application Support", "Code", "User"];


export const filePathIgnoreRegExps = [
    /^globalStorage\//,
    /^workspaceStorage\//
];


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


export function diffDirFileItemRepresentation(fileItem: DiffDirFileItem, actionIndex: number): string
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
            const sep = "❌    ";
            const leftStr = fileItem.leftFile!.toString();
            const rightStr = "";
            return leftStr + sep + rightStr;
        }
        else if (actionType === DiffDirFileItemActionType.DELETE_RIGHT) {
            const sep = "    ❌";
            const leftStr = "";
            const rightStr = fileItem.rightFile!.toString();
            return leftStr + sep + rightStr;
        }
        else if (actionType === DiffDirFileItemActionType.DELETE_BOTH) {
            const sep = "❌   ❌";
            const leftStr = fileItem.leftFile!.toString();
            const rightStr = fileItem.rightFile!.toString();
            return leftStr + sep + rightStr;
        }
        else if (actionType === DiffDirFileItemActionType.SKIP) {
            const sep = "     ";
            const leftStr = fileItem.leftFile ? fileItem.leftFile!.toString() : "";
            const rightStr = fileItem.rightFile ? fileItem.rightFile!.toString() : "";
            return leftStr + sep + rightStr;
        }
        else {
            throw new Error(`Unsupported action type ${actionType}.`);
        }

    }
}


// export function getActionSeparator(action: DiffDirFileItemActionType)
// {
//     switch (key) {
//         case DiffDirFileItemActionType.COPY_LEFT:
//             return " <-- ";

//         case DiffDirFileItemActionType.COPY_RIGHT:
//             return " --> ";


//         case DiffDirFileItemActionType.DELETE_LEFT:
//             return "❌    ";

//         case DiffDirFileItemActionType.DELETE_RIGHT:
//             return "    ❌";
//             break;

//         case DiffDirFileItemActionType.DELETE_BOTH:
//             return "❌   ❌";

//         case DiffDirFileItemActionType.SKIP:
//             return "     ";

//         default:
//             break;
//     }
// }
