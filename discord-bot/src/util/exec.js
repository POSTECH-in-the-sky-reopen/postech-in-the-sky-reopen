const { exec } = require("child_process");

function execute_command(command, cwd) {
    return new Promise(function(resolve, reject) {
        exec(command, {cwd: cwd}, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout.trim());
        });
    });
}
module.exports = {
    execute_command
};
