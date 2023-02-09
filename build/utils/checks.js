"use strict";
function checkForNode() {
    if (!process || process == undefined) {
        throw new Error("Not a Node Process ");
    }
    if (!process.send) {
        throw new Error("Ipc not connected");
    }
}
exports = {
    checkForNode
};
