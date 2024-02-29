/**!
 * ExtensionUtils
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function(Scratch) {
    
/**
 * @fileoverview Simple little utilities any extension can use
 */

class ExtensionUtils {
    /**
     * Constructor
     * @param {Scratch} Scratch 
     */
    constructor(Scratch) {
        this.vm = Scratch.vm;
        this.runtime = this.vm.runtime;
        this.sequencer = this.runtime.sequencer;
        // @ts-expect-error Editor only
        this.ReduxStore = window?.ReduxStore;
        this.setupObjects();
        this.setup();
    }
    waitUntil(conditionFunction) {
        const poll = resolve => {
            if(conditionFunction()) resolve();
            else this.runtime.once('AFTER_EXECUTE', _ => poll(resolve));
        }
        return new Promise(poll);
    }
    setupObjects() {
        this.__internal__ = {
            runtime: this.runtime,
            /**
             * This will cause an error, just ignore it
             */
            thread() {
                const runtime = this.runtime;
                return runtime._pushThread('""&&invalidId', runtime._editingTarget, { stackClick: false, updateMonitor: false }).constructor;
            }
        }
        /**
         * Internal object for when we override methods in another object
         */
        this.bindings = {
            sequencer: this.sequencer,
            /**
             * @type {VM.Sequencer['retireThread']}
             */
            sequencer_retireThread: this.sequencer.retireThread.bind(this.sequencer),
            ReduxStore_getState: this.ReduxStore.getState
        }
        this.classes = {
            runtime: this.runtime,
            /**
             * Internal object for fetching the classes
             */
            /**
             * Thread class
             * @type {VM.Thread}
             */
            Thread: this.__internal__.thread()
        }
        /**
         * Event related tools like registration and checking
         */
        this.events = {
            vm: this.vm,
            runtime: this.runtime,
            // @ts-ignore Not typed yet
            _: this.runtime._events,
            /**
             * An array of the events registered using this
             */
            myEvents: [],
            /**
             * Checks if a event is registered in the VM
             * @param {String} name Name of the event
             * @returns {Boolean}
             */
            has(name) {
                return !!this._[name];
            },
            /**
             * Registers a new event to be available in the VM
             * @param {String} name The name of the event
             */
            new(name) {
                if (this.has(name)) return;
                this._[name] = [];
                // @ts-ignore Not typed yet.
                this.runtime._eventsCount++;
                this.myEvents.push(name);
            },
            /**
             * Fires an event in the VM
             * @param {*} name Name of the event
             * @param  {...any} args Array of the arguments to pass
             */
            fire(name, ...args) {
                this.vm.emit(name, ...args);
            }
        }
        /**
         * Internal object for blockly related stuff
         */
        this.$BlocklyAdditions = {
            events: this.events,
            update: this.update,
            becameAvailable: false,
            /**
             * Returns the ScratchBlocks object
             * @returns {ScratchBlocks}
             */
            $ScratchBlocks() {
                /**
                 * @type {ScratchBlocks}
                 */
                return window?.ScratchBlocks;
            },
            /**
             * Calls a callback if it detects ScratchBlocks
             * @param {Function} callback Called if ScratchBlocks is detected
             * @returns {any} Whatever the callback returns
             */
            $ifScratchBlocks(callback) {
                const ScratchBlocks = this.$ScratchBlocks();
                if (ScratchBlocks) return callback(this.getBlocky());
            },
            /**
             * Returns a modified ScratchBlocks instance
             * @returns {Object}
             */
            getBlocky() {
                const ScratchBlocks = this.$ScratchBlocks() ?? {};
                return {
                    ...this,
                    ...(ScratchBlocks),
                }
            },
            /**
             * Internal function that is called when ScratchBlocks is found
             */
            $whenAvailable() {
                if (this.$BlocklyAdditions.becameAvailable) return;
                this.$BlocklyAdditions.$ifScratchBlocks((Blockly) => {
                    this.$BlocklyAdditions.becameAvailable = true;
                    this.update.blockly();
                    this.events.fire('SCRATCHBLOCKS_AVAILABLE', this.Blockly);
                });
            }
        }
        /**
         * Our blockly object
         */
        this.Blockly = this.$BlocklyAdditions.getBlockly();
        /**
         * Object with some stuff about the editor
         */
        this.editor = {
            ReduxStore: this.ReduxStore,
            bindings: this.bindings,
            oldState: false,
            /**
             * Sets the oldState
             * @param {Boolean} state
             * @returns {any}
             */
            setOldState(state) {
                this.oldState = state;
            },
            /**
             * Calls the callback if ReduxStore is found.
             * @param {Function} callback 
             * @returns {any}
             */
            $ifReduxStore(callback) {
                if (!this.ReduxStore) return;
                if (!this.ReduxStore?.getState) return;
                if (!this.ReduxStore?.getState()?.scratchGui) return;
                return callback(this.ReduxStore);
            },
            /**
             * Returns weather or not the user is currently in the editor
             * @returns {Boolean}
             */
            in() {
                return this.$ifReduxStore((ReduxStore) => {
                    return ReduxStore.getState().scratchGui.mode.isPlayerOnly
                }) ?? false;
            }
        }
        /**
         * Threading
         */
        this.threading = {
            Thread: this.classes.Thread,
            /**
             * Clones a thread
             * @param {VM.Thread} thread Thread that we need to clone
             * @returns {VM.Thread} Cloned thread
             */
            cloneThread(thread) {
                /**
                 * New thread to copy data into
                 * @type {VM.Thread}
                 */
                // @ts-expect-error Weird constructor stuff
                const nThread = new this.Thread(thread.topBlock);
                nThread.blockGlowInFrame = '';
                nThread.target = thread.target;
                nThread.blockGlowInFrame = thread.blockGlowInFrame;
                // @ts-expect-error Not normal
                nThread.executableHat = thread.executableHat;
                nThread.isCompiled = false;
                nThread.isKilled = false;
                nThread.justReported = null;
                // @ts-expect-error Not normal
                nThread.procedures = thread.procedures;
                nThread.requestScriptGlowInFrame = false;
                nThread.stack = structuredClone(thread.stack);
                nThread.stackClick = true;
                nThread.stackFrames = structuredClone(thread.stackFrames);
                nThread.status = thread.status;
                // @ts-expect-error Not normal
                nThread.timer = null;
                nThread.triedToCompile = false;
                nThread.updateMonitor = false;
                nThread.warpTimer = null;
                nThread.blockContainer = thread.target.blocks;
                Object.keys(thread).forEach((key) => {
                    if (nThread[key]) return;
                    try {
                        nThread[key] = structuredClone(thread[key]);
                    } catch {
                        nThread[key] = thread[key];
                    }
                });
                return nThread;
            }
        }
        /**
         * Update objects this class uses
         */
        this.update = {
            trace: this,
            /**
             * Updates the blockly object
             */
            blockly() {
                this.trace.Blockly = this.trace.$BlocklyAdditions.getBlocky();
            },
            /**
             * Updates the ReduxStore object
             */
            ReduxStore() {
                // @ts-expect-error Editor only
                this.trace.ReduxStore = window?.ReduxStore;
            }
        }
        /**
         * Utilities for color related stuff
         */
        this.colors = {
            Blockly: this.Blockly,
            /**
             * Base category and other colors
             */
            base: {"motion":{"primary":"#0F1E33","secondary":"#4C4C4C","tertiary":"#4C97FF","quaternary":"#4C97FF"},"looks":{"primary":"#1E1433","secondary":"#4C4C4C","tertiary":"#9966FF","quaternary":"#9966FF"},"sounds":{"primary":"#291329","secondary":"#4C4C4C","tertiary":"#CF63CF","quaternary":"#CF63CF"},"control":{"primary":"#332205","secondary":"#4C4C4C","tertiary":"#FFAB19","quaternary":"#FFAB19"},"event":{"primary":"#332600","secondary":"#4C4C4C","tertiary":"#FFBF00","quaternary":"#FFBF00"},"sensing":{"primary":"#12232A","secondary":"#4C4C4C","tertiary":"#5CB1D6","quaternary":"#5CB1D6"},"pen":{"primary":"#03251C","secondary":"#4C4C4C","tertiary":"#0fBD8C","quaternary":"#0fBD8C"},"operators":{"primary":"#112611","secondary":"#4C4C4C","tertiary":"#59C059","quaternary":"#59C059"},"data":{"primary":"#331C05","secondary":"#4C4C4C","tertiary":"#FF8C1A","quaternary":"#FF8C1A"},"data_lists":{"primary":"#331405","secondary":"#4C4C4C","tertiary":"#FF661A","quaternary":"#FF661A"},"more":{"primary":"#331419","secondary":"#4C4C4C","tertiary":"#FF6680","quaternary":"#FF6680"},"text":"rgba(255, 255, 255, .7)","workspace":"#121212","toolboxHover":"#4C97FF","toolboxSelected":"#4C4C4C","toolboxText":"#E5E5E5","toolbox":"#121212","flyout":"#121212","scrollbar":"#CECDCE","scrollbarHover":"#CECDCE","textField":"#4C4C4C","textFieldText":"#E5E5E5","insertionMarker":"#000000","insertionMarkerOpacity":0.2,"dragShadowOpacity":0.6,"stackGlow":"#FFF200","stackGlowSize":4,"stackGlowOpacity":1,"replacementGlow":"#FFFFFF","replacementGlowSize":2,"replacementGlowOpacity":1,"colourPickerStroke":"#FFFFFF","fieldShadow":"rgba(255, 255, 255, 0.3)","dropDownShadow":"rgba(0, 0, 0, .3)","numPadBackground":"#547AB2","numPadBorder":"#435F91","numPadActiveBackground":"#435F91","numPadText":"white","valueReportBackground":"#FFFFFF","valueReportBorder":"#AAAAAA","valueReportForeground":"#000000","menuHover":"rgba(255, 255, 255, 0.3)","contextMenuBackground":"#ffffff","contextMenuBorder":"#cccccc","contextMenuForeground":"#000000","contextMenuActiveBackground":"#d6e9f8","contextMenuDisabledForeground":"#cccccc","flyoutLabelColor":"#575E75","checkboxInactiveBackground":"#ffffff","checkboxInactiveBorder":"#c8c8c8","checkboxActiveBackground":"#4C97FF","checkboxActiveBorder":"#3373CC","checkboxCheck":"#ffffff","buttonActiveBackground":"#ffffff","buttonForeground":"#575E75","buttonBorder":"#c6c6c6","zoomIconFilter":"none"},
            /**
             * Registers a new "scratchblocks extension" with the name colours_{extensionId} to patch the broken colors in merge-upstream
             * @param {String} extensionId 
             * @param {Object} colours 
             * @returns 
             */
            registerExtensionColours(extensionId, colours) {
                colours = colours ?? {};
                if (!colours?.primary && !colours?.color1) throw new Error('"${extensionId}" colours must have "primary" or "color1" set.');
                colours.primary = (colours.color1 ?? colours.primary);
                colours.secondary = (colours.color2 ?? colours.secondary) ?? colours.primary;
                colours.tertiary = (colours.color3 ?? colours.tertiary) ?? colours.secondary;
                colours.quaternary = (colours.color4 ?? colours.quaternary) ?? colours.tertiary;
                const mixinId = `colours_${extensionId}`;
                this.Blockly.Extensions.register(mixinId, function() {
                    this.setColourFromRawValues_(colours.primary, colours.secondary, colours.tertiary, colours.quaternary);
                });
                return mixinId;
            }
        }
    }
    /**
     * This function currently does nothing
     */
    setup() {}
    /**
     * Setup of all the custom events this has to offer, Call this after you register the handlers
     */
    setupEvents() {
        const vm = this.vm, runtime = this.runtime;
        const events = this.events, editor = this.editor;
        events.new('THREAD_RETIRED');
        events.new('EDITOR_STATE_CHANGED');
        events.new('SCRATCHBLOCKS_AVAILABLE');
        this.sequencer.retireThread = (thread) => {
            // @ts-expect-error Custom event
            runtime.emit('THREAD_RETIRED', thread);
            return this.bindings.sequencer_retireThread(thread);
        }
        editor.$ifReduxStore((ReduxStore) => {
            const State1 = ReduxStore.getState();
            editor.setOldState(editor.in());
            ReduxStore.subscribe(() => {
                const inEditor = editor.in();
                if (inEditor !== editor.oldState) {
                    events.fire('EDITOR_STATE_CHANGED', inEditor);
                    editor.setOldState(inEditor);
                }
            });
        });
        // @ts-expect-error Custom Event
        vm.on('EDITOR_STATE_CHANGED', this.$BlocklyAdditions.$whenAvailable);
        this.$BlocklyAdditions.$whenAvailable();
    }
}

/* You can delete this vvv */
const vm = Scratch.vm, $ = new ExtensionUtils(Scratch);
$.setup();

//@ts-expect-error
vm.once('SCRATCHBLOCKS_AVAILABLE', () => {
    $.colors.registerExtensionColours('extension', $.colors.base.data_lists);
})

$.setupEvents();

class e {
    getInfo() {return{
        id: 'extension',
        name: 'extension',
        blocks: [{
            opcode: 'e',
            text: 'e',
            extensions: ['colours_extension']
        }]
    }}
    e(){}
}

// @ts-ignore
Scratch.extensions.register(new e);
})(Scratch);