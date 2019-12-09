import * as os from "os";
import { Directory } from "../depot/directory";


/**
 * An enumeration of operating systems supported by this tool.
 */
export enum OperatingSystem
{
    UNKNOWN = "UNKNOWN",
    MAC     = "MAC",
    WINDOWS = "WINDOWS"
}


/**
 * Gets the current OS.
 * @return The current OS
 */
export function getOs(): OperatingSystem
{
    if (os.platform().startsWith("win")) {
        return OperatingSystem.WINDOWS;
    }
    // TODO: Add a check of OS X here.
    else {
        return OperatingSystem.UNKNOWN;
    }
}


/**
 * Gets the current user's home directory
 * @return The current user's home directory
 */
export function getHomeDir(): Directory
{
    const dirStr = os.homedir();
    return new Directory(dirStr);
}
