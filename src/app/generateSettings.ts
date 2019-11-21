type Platform = "darwin" | "win";


const filesOfInterest = {
    darwin: {},
    win32: {}
};


if (require.main === module) {
    main()
    .then((exitCode) => {
        if (exitCode !== 0) {
            process.exit(exitCode);
        }
    })
    .catch((err) => {
        console.error(JSON.stringify(err, undefined, 4));
        process.exit(-1);
    });
}


function main(): Promise<number> {



}


