/**!
 * some random code
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
/* eslint-disable */
/* @ts-ignore-file */
async trycatch_(args, util) {
    // this is the version that clones the thread ignore it
    /**
     * @type {Thread}
     */
    var thread = util.thread;
    const myId = thread.peekStack();
    const target = thread.target;
    const blocks = target.blocks;
    const tryBranch = blocks.getBranch(myId, 1);
    if (!!!tryBranch) return 0;
    const nThread = this.cloneObject(thread);
    // @ts-ignore
    thread.runTime = Date.now();
    /**
     * @type {Thread}
     */
    var tryThread = this.thread(tryBranch, target, true, nThread);
    tryThread.blockGlowInFrame = tryBranch;
    // @ts-ignore
    tryThread.inTryCatch = true;
    // @ts-ignore
    tryThread.tryCatchMain = thread;
    runtime.threads.push(tryThread);
    // @ts-ignore
    const _ = (poll) => (Object.hasOwn(thread, 'spawnedDead') || Object.hasOwn(thread, 'throwTime')&&thread.throwTime-thread.runTime>0);
    // @ts-ignore
    await this.until(_);
    // @ts-ignore
    if (_()) {
        vm.runtime._stopThread(tryThread);
        util.startBranch(2, false);
        return 2;
    }
}