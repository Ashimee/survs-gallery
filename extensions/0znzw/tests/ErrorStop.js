/**!
 * @author 0znzw https://scratch.mit.edu/users/0znzw
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * @borrows Thread & _StackFrame classes from {VM}
 * @fileoverview Error Stop extension
 * @description Stop errors from extensions from pausing block execution!
 * Do not remove this comment
 */
(function (Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error(`"Error Stop" extension must run unsandboxed.`);
    }

    /**
     * Checks if a object has a key.
     * @param {Object} object 
     * @param {String} key 
     * @returns {Boolean}
     */
    const hasOwn = function(object, key) {
        return Object.prototype.hasOwnProperty.call(object, key);
    };

    /**
     * Recycle bin for empty stackFrame objects
     * @type Array<_StackFrame>
     */
    const _stackFrameFreeList = [];

    /**
     * A frame used for each level of the stack. A general purpose
     * place to store a bunch of execution context and parameters
     * @param {boolean} warpMode Whether this level of the stack is warping
     * @constructor
     * @private
     */
    class _StackFrame {
        constructor(warpMode) {
            /**
             * Whether this level of the stack is a loop.
             * @type {boolean}
             */
            this.isLoop = false;

            /**
             * Whether this level is in warp mode.  Is set by some legacy blocks and
             * "turbo mode"
             * @type {boolean}
             */
            this.warpMode = warpMode;

            /**
             * Reported value from just executed block.
             * @type {Any}
             */
            this.justReported = null;

            /**
             * The active block that is waiting on a promise.
             * @type {string}
             */
            this.reporting = '';

            /**
             * Persists reported inputs during async block.
             * @type {Object}
             */
            this.reported = null;

            /**
             * Name of waiting reporter.
             * @type {string}
             */
            this.waitingReporter = null;

            /**
             * Procedure parameters.
             * @type {Object}
             */
            this.params = null;

            /**
             * A context passed to block implementations.
             * @type {Object}
             */
            this.executionContext = null;

            /**
             * Internal block object being executed. This is *not* the same as the object found
             * in target.blocks.
             * @type {object}
             */
            this.op = null;
        }

        /**
         * Reset all properties of the frame to pristine null and false states.
         * Used to recycle.
         * @return {_StackFrame} this
         */
        reset() {
            this.isLoop = false;
            this.warpMode = false;
            this.justReported = null;
            this.reported = null;
            this.waitingReporter = null;
            this.params = null;
            this.executionContext = null;
            this.op = null;

            return this;
        }

        /**
         * Reuse an active stack frame in the stack.
         * @param {?boolean} warpMode defaults to current warpMode
         * @returns {_StackFrame} this
         */
        reuse(warpMode = this.warpMode) {
            this.reset();
            this.warpMode = Boolean(warpMode);
            return this;
        }

        /**
         * Create or recycle a stack frame object.
         * @param {boolean} warpMode Enable warpMode on this frame.
         * @returns {_StackFrame} The clean stack frame with correct warpMode setting.
         */
        static create(warpMode) {
            const stackFrame = _stackFrameFreeList.pop();
            if (typeof stackFrame !== 'undefined') {
                stackFrame.warpMode = Boolean(warpMode);
                return stackFrame;
            }
            return new _StackFrame(warpMode);
        }

        /**
         * Put a stack frame object into the recycle bin for reuse.
         * @param {_StackFrame} stackFrame The frame to reset and recycle.
         */
        static release(stackFrame) {
            if (typeof stackFrame !== 'undefined') {
                _stackFrameFreeList.push(stackFrame.reset());
            }
        }
    }

    /**
     * A thread is a running stack context and all the metadata needed.
     * @param {?string} firstBlock First block to execute in the thread.
     * @constructor
     */
    class Thread {
        constructor(firstBlock) {
            /**
             * ID of top block of the thread
             * @type {!string}
             */
            this.topBlock = firstBlock;

            /**
             * Stack for the thread. When the sequencer enters a control structure,
             * the block is pushed onto the stack so we know where to exit.
             * @type {Array.<string>}
             */
            this.stack = [];

            /**
             * Stack frames for the thread. Store metadata for the executing blocks.
             * @type {Array.<_StackFrame>}
             */
            this.stackFrames = [];

            /**
             * Status of the thread, one of three states (below)
             * @type {number}
             */
            this.status = 0; /* Thread.STATUS_RUNNING */

            /**
             * Whether the thread is killed in the middle of execution.
             * @type {boolean}
             */
            this.isKilled = false;

            /**
             * Target of this thread.
             * @type {?Target}
             */
            this.target = null;

            /**
             * The Blocks this thread will execute.
             * @type {Blocks}
             */
            this.blockContainer = null;

            /**
             * Whether the thread requests its script to glow during this frame.
             * @type {boolean}
             */
            this.requestScriptGlowInFrame = false;

            /**
             * Which block ID should glow during this frame, if any.
             * @type {?string}
             */
            this.blockGlowInFrame = null;

            /**
             * A timer for when the thread enters warp mode.
             * Substitutes the sequencer's count toward WORK_TIME on a per-thread basis.
             * @type {?Timer}
             */
            this.warpTimer = null;

            this.justReported = null;

            this.triedToCompile = false;

            this.isCompiled = false;

            // compiler data
            // these values only make sense if isCompiled == true
            this.timer = null;
            /**
             * The thread's generator.
             * @type {Generator}
             */
            this.generator = null;
            /**
             * @type {Object.<string, import('../compiler/compile').CompiledScript>}
             */
            this.procedures = null;
            this.executableHat = false;
        }

        /**
         * Thread status for initialized or running thread.
         * This is the default state for a thread - execution should run normally,
         * stepping from block to block.
         * @const
         */
        static get STATUS_RUNNING() {
            return 0; // used by compiler
        }

        /**
         * Threads are in this state when a primitive is waiting on a promise;
         * execution is paused until the promise changes thread status.
         * @const
         */
        static get STATUS_PROMISE_WAIT() {
            return 1; // used by compiler
        }

        /**
         * Thread status for yield.
         * @const
         */
        static get STATUS_YIELD() {
            return 2; // used by compiler
        }

        /**
         * Thread status for a single-tick yield. This will be cleared when the
         * thread is resumed.
         * @const
         */
        static get STATUS_YIELD_TICK() {
            return 3; // used by compiler
        }

        /**
         * Thread status for a finished/done thread.
         * Thread is in this state when there are no more blocks to execute.
         * @const
         */
        static get STATUS_DONE() {
            return 4; // used by compiler
        }

        /**
         * @param {Target} target The target running the thread.
         * @param {string} topBlock ID of the thread's top block.
         * @returns {string} A unique ID for this target and thread.
         */
        static getIdFromTargetAndBlock(target, topBlock) {
            // & should never appear in any IDs, so we can use it as a separator
            return `${target.id}&${topBlock}`;
        }

        getId() {
            return Thread.getIdFromTargetAndBlock(
                this.target,
                this.topBlock,
            );
        }

        /**
         * Push stack and update stack frames appropriately.
         * @param {string} blockId Block ID to push to stack.
         */
        pushStack(blockId) {
            this.stack.push(blockId);
            // Push an empty stack frame, if we need one.
            // Might not, if we just popped the stack.
            if (this.stack.length > this.stackFrames.length) {
                const parent =
                    this.stackFrames[this.stackFrames.length - 1];
                this.stackFrames.push(
                    _StackFrame.create(
                        typeof parent !== 'undefined' && parent.warpMode,
                    ),
                );
            }
        }

        /**
         * Reset the stack frame for use by the next block.
         * (avoids popping and re-pushing a new stack frame - keeps the warpmode the same
         * @param {string} blockId Block ID to push to stack.
         */
        reuseStackForNextBlock(blockId) {
            this.stack[this.stack.length - 1] = blockId;
            this.stackFrames[this.stackFrames.length - 1].reuse();
        }

        /**
         * Pop last block on the stack and its stack frame.
         * @return {string} Block ID popped from the stack.
         */
        popStack() {
            _StackFrame.release(this.stackFrames.pop());
            return this.stack.pop();
        }

        /**
         * Pop back down the stack frame until we hit a procedure call or the stack frame is emptied
         */
        stopThisScript() {
            let blockID = this.peekStack();
            while (blockID !== null) {
                const block = this.target.blocks.getBlock(blockID);
                if (
                    (typeof block !== 'undefined' &&
                        block.opcode === 'procedures_call') ||
                    this.peekStackFrame().waitingReporter
                ) {
                    break;
                }
                this.popStack();
                blockID = this.peekStack();
            }

            if (this.stack.length === 0) {
                // Clean up!
                this.requestScriptGlowInFrame = false;
                this.status = Thread.STATUS_DONE;
            }
        }

        /**
         * Get top stack item.
         * @return {?string} Block ID on top of stack.
         */
        peekStack() {
            return this.stack.length > 0
                ? this.stack[this.stack.length - 1]
                : null;
        }

        /**
         * Get top stack frame.
         * @return {?object} Last stack frame stored on this thread.
         */
        peekStackFrame() {
            return this.stackFrames.length > 0
                ? this.stackFrames[this.stackFrames.length - 1]
                : null;
        }

        /**
         * Get stack frame above the current top.
         * @return {?object} Second to last stack frame stored on this thread.
         */
        peekParentStackFrame() {
            return this.stackFrames.length > 1
                ? this.stackFrames[this.stackFrames.length - 2]
                : null;
        }

        /**
         * Push a reported value to the parent of the current stack frame.
         * @param {*} value Reported value to push.
         */
        pushReportedValue(value) {
            this.justReported = typeof value === 'undefined' ? null : value;
        }

        /**
         * Initialize procedure parameters on this stack frame.
         */
        initParams() {
            const stackFrame = this.peekStackFrame();
            if (stackFrame.params === null) {
                stackFrame.params = {};
            }
        }

        /**
         * Add a parameter to the stack frame.
         * Use when calling a procedure with parameter values.
         * @param {!string} paramName Name of parameter.
         * @param {*} value Value to set for parameter.
         */
        pushParam(paramName, value) {
            const stackFrame = this.peekStackFrame();
            stackFrame.params[paramName] = value;
        }

        /**
         * Get a parameter at the lowest possible level of the stack.
         * @param {!string} paramName Name of parameter.
         * @return {*} value Value for parameter.
         */
        getParam(paramName) {
            for (let i = this.stackFrames.length - 1; i >= 0; i--) {
                const frame = this.stackFrames[i];
                if (frame.params === null) {
                    continue;
                }
                if (frame.params.hasOwnProperty(paramName)) {
                    return frame.params[paramName];
                }
                return null;
            }
            return null;
        }

        getAllparams() {
            const stackFrame = this.peekStackFrame();
            return stackFrame.params;
        }

        /**
         * Whether the current execution of a thread is at the top of the stack.
         * @return {boolean} True if execution is at top of the stack.
         */
        atStackTop() {
            return this.peekStack() === this.topBlock;
        }

        /**
         * Switch the thread to the next block at the current level of the stack.
         * For example, this is used in a standard sequence of blocks,
         * where execution proceeds from one block to the next.
         */
        goToNextBlock() {
            const nextBlockId = this.target.blocks.getNextBlock(
                this.peekStack(),
            );
            this.reuseStackForNextBlock(nextBlockId);
        }

        /**
         * Attempt to determine whether a procedure call is recursive,
         * by examining the stack.
         * @param {!string} procedureCode Procedure code of procedure being called.
         * @return {boolean} True if the call appears recursive.
         */
        isRecursiveCall(procedureCode) {
            let callCount = 5; // Max number of enclosing procedure calls to examine.
            const sp = this.stackFrames.length - 1;
            for (let i = sp - 1; i >= 0; i--) {
                const block = this.target.blocks.getBlock(
                    this.stackFrames[i].op.id,
                );
                if (
                    block.opcode === 'procedures_call' &&
                    block.mutation.proccode === procedureCode
                ) {
                    return true;
                }
                if (--callCount < 0) return false;
            }
            return false;
        }

        /**
         * Attempt to compile this thread.
         */
        tryCompile() {
            console.warn('Ignore the NEXT block error if there is one.\nThis is so we can compile stuff');
            const comp = vm.runtime._pushThread('invalid_block_id_here&&&""', vm.runtime._editingTarget).tryCompile.bind(this);
            comp();
        }
    }

    class ThreadTryStart extends Thread {
        constructor(...args) {
            super(...args);
        }
        spawnedDead = false;
    }

    class ThreadTrySpawn extends Thread {
        constructor(...args) {
            super(...args)
        }
        inTryCatch = false;
        /**
         * @type {ThreadTryStart}
         */
        tryCatchMain = new ThreadTryStart('');
        stackClick = false;
        updateMonitor = false;
    }

    /**
     * @type {VM}
     */
    // @ts-expect-error
    var vm = window.vm;

    class errorHandling {
        /**
         * @param {Boolean} gofHandling 
         * @param {Boolean} normalHandling 
         */
        constructor(gofHandling, normalHandling) {
            this.gofHandling = gofHandling;
            this.normalHandling = normalHandling;
        }
        set(gofHandle, normalHandle) {
            this.gofHandling = gofHandle;
            this.normalHandling = normalHandle;
        }
    }

    var runtime = vm.runtime;

    var handling = new errorHandling(false, false);

    const performDlog = false;

    // @ts-expect-error
    runtime.setErrorHandling = handling.set;

    /**
     * Formatted "block errored" log.
     * @param {String} o Opcode
     * @param {String} e Error Text
     * @param {Array}  a ...args
     */
    function dLog(o, e, a) {
        /* Enable this if you want to see the full details but be warned it makes it seem like it failed to catch the error. */
        if (performDlog) console.log(`block has errored [type: ${o}]:\n  Err: ${e}\n  ...args:`, ...a);
    }

    /* ok, for now we will not use GOF as it is not supported in the interpreter, BUT I will leave the code here <3 */
    const gof = runtime.getOpcodeFunction.bind(runtime);
    runtime.getOpcodeFunction = function(opcode) {
        const aFn = gof(opcode);
        if (!handling.gofHandling) return aFn;
        const fn = function(...args) {
            try {
                if (typeof aFn === 'function') return aFn(...args);
                return aFn;
            } catch(err) {
                dLog(this.opcode, err, args);
                return '';
            }
        }.bind({ opcode });
        return fn;
    }.bind(runtime);

    var _p = runtime._primitives;
    const eMap = {};

    function injectIntoPrims() {
        Object.keys(_p).forEach(eBk => {
            if (hasOwn(eMap, eBk)) return;
            const fn = _p[eBk];
            eMap[eBk] = fn;

            _p[eBk] = function(...args) {
                const mFn = eMap[this.eBk];

                /**
                 * @type {ThreadTrySpawn}
                 */
                var thread = new Proxy(args[1].thread, {
                    /**
                     * @param {ThreadTrySpawn} target 
                    */
                    get(target, prop, receiver) {
                        target.isKilled = !vm.runtime.isActiveThread(target);
                        if (target.isKilled && target.inTryCatch) target.tryCatchMain.spawnedDead = true;
                        return target[prop];
                    }
                });

                thread.inTryCatch = thread.inTryCatch ?? false;

                function errThread($thread, err) {
                    $thread.threwError = true;
                    $thread.errorThrown = err;
                    $thread.throwTime = Date.now();
                }

                try {
                    return mFn(...args);
                } catch(err) {
                    dLog(this.eBk, err, args);
                    errThread(thread, err);
                    if (thread.inTryCatch) errThread(thread.tryCatchMain, err);
                    if (handling.normalHandling && !thread.inTryCatch) {
                        throw new Error(err)
                    }
                    return '';
                }
            }.bind({ eBk });
        })
    }

    runtime.on('EXTENSION_ADDED', injectIntoPrims);

    class ext {
        getInfo() {
            return {
                id: '0znzwTry',
                name: 'Error Stop',
                color1: '#FF3104',
                blocks: [{
                        func: 'help',
                        blockType: Scratch.BlockType.BUTTON,
                        text: 'F.A.Q'
                    },
                    {
                        opcode: 'enable',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'enable error wrapping'
                    },
                    {
                        opcode: 'disable',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'disable error wrapping'
                    },
                    {
                        opcode: 'enabled',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'error wrapping enabled?'
                    },
                    {
                        opcode: 'test',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'test error'
                    }, '---', {
                        opcode: 'trycatch',
                        blockType: Scratch.BlockType.CONDITIONAL,
                        text: ['try', 'catch'],
                        branchCount: 2
                    }]
            };
        }

        /**
         * Resets the getOpcodeFunction in the runtime.
         */
        RESET_GOF() {
            runtime.getOpcodeFunction = gof;
        }

        async until(conditionFunction) {
            const poll = (resolve) => {
                if (conditionFunction()) resolve();
                else vm.runtime.once('AFTER_EXECUTE', (_) => poll(resolve));
            };
            return new Promise(poll);
        }

        /**
         * Creates a fake thread with the specified parameters.
         * @returns {Thread}
         */
        thread(blkId, target, stackClick, overrideThread) {
            let thread = overrideThread ?? new Thread(blkId);
            thread.stack = [];
            thread.stack.push(blkId);
            thread.blockContainer = target.blocks;
            thread.target = target;
            thread.stackClick = stackClick;
            thread.updateMonitor = false;
            thread.timer = 0;
            thread.topBlock = blkId;
            thread.stackFrames = [];
            thread.stackFrames.push(
                new _StackFrame(false),
            );
            thread.getId = thread.getId ?? function() {
                return thread.topBlock;
            }
            return thread;
        }

        /**
         * Clones a object as much as possible using structuredClone.
         * @param {Object} old 
         * @returns {Object}
         */
        cloneObject(old) {
            const $new = {};
            Object.keys(old).forEach(k => {
                const fn = old[k];
                try {
                    $new[k] = structuredClone(fn);
                } catch {
                    if (typeof fn === 'function') {
                        $new[k] = fn.bind($new);
                    } else $new[k] = fn;
                }
            });
            return $new;
        }

        help() {
            alert('This blocks can enable / disable blocks throwing errors.\nIf it is enabled any block that would freeze a script from an error will not error.\nIf it is disabled it will act as normal.\n\nIts disabled by default.');
        }

        enable() {
            handling.set(handling.gofHandling, true);
        }

        disable() {
            handling.set(handling.gofHandling, false);
        }
        
        enabled() {
            return handling.normalHandling;
        }
        
        async trycatch(args, util) {
            /**
             * @type {Thread}
             */
            var thread = util.thread;
            const myId = thread.peekStack();

            /**
             * @type {VM.RenderedTarget}
             */
            const target = thread.target;
            const blocks = target.blocks;

            // @ts-ignore Not typed yet.
            const tryBranch = blocks.getBranch(myId, 1);
            if (!!!tryBranch) return 0;
            var tryThread = runtime._pushThread(tryBranch, target, { stackClick: true, updateMonitor: false });

            await this.until(_ => hasOwn(tryThread, 'throwTime') || !runtime.isActiveThread(tryThread));

            if (hasOwn(tryThread, 'throwTime')) {
                util.startBranch(2, false);
                return 2;
            }
        }

        test(args, util) {
            const blah = 6+6;
            if (typeof blah === 'number') {/* blah */}
            throw new Error('uh oh how did this happen?');
            return 'idk blah!';
        }
    }

    // @ts-ignore This happens sometimes.
    Scratch.extensions.register(new ext());
})(Scratch);