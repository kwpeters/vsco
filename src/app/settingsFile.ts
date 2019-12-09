import {File} from "../depot/file";

export class SettingsFile {
    
    private _vscodeFile: File;
    private _backupFile: File;

    public constructor(vsCodeFile: File, backupFile: File)
    {
        this._vscodeFile = vsCodeFile;
        this._backupFile = backupFile;
    }


    public get vscodeFile(): File
    {
        return this._vscodeFile;
    }


    public get backupFile(): File
    {
        return this._backupFile;
    }

}
