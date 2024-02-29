/**!
 * Switch Case V2
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function(Scratch) {

    const vm = Scratch.vm;
    const runtime = vm.runtime;
    const sequencer = runtime.sequencer;
    const toClean = [];

    // @ts-ignore Not typed yet.
    runtime._events['THREAD_RETIRED'] = [];
    // @ts-ignore Not typed yet
    runtime._eventsCount++;
    var srt = sequencer.retireThread.bind(sequencer);
    sequencer.retireThread = function(thread) {
        // @ts-expect-error Custom event
        runtime.emit('THREAD_RETIRED', thread);
        return srt(thread);
    }

    class ImpossibleUsageSkip {
        constructor() {}
    }

    class SwitchCaseV2 {
        constructor() {
            this.extId = 'SwitchCaseV2';
            this.colors = {
                color1: '#FFAB19',
                color2: '#EC9C13',
                color3: '#CF8B17',
                color4: '#CF8B17',
                quaternary: '#CF8B17'
            }
            this.switchOpcode = this.opcode('switch0');
            this.caseOpcode = this.opcode('case0');
            this.blocks = [{
                blockType: Scratch.BlockType.REPORTER,
                opcode: 'switchValue',
                text: 'switch value',
                disableMonitor: true
            }, '---', {
                blockType: Scratch.BlockType.CONDITIONAL,
                opcode: 'switch0',
                text: 'switch [value]',
                arguments: {
                    value: {
                        type: null
                    }
                }
            }, {
                blockType: Scratch.BlockType.CONDITIONAL,
                opcode: 'case0',
                text: 'case [value]',
                arguments: {
                    value: {
                        type: Scratch.ArgumentType.STRING
                    }
                }
            }, {
                blockType: Scratch.BlockType.CONDITIONAL,
                opcode: 'default0',
                text: 'default',
                isTerminal: true
            }, {
                blockType: Scratch.BlockType.COMMAND,
                opcode: 'break0',
                text: 'break switch',
                isTerminal: true
            }, '---', {
                blockType: Scratch.BlockType.COMMAND,
                opcode: 'runNextCase',
                text: 'run next case'
            }, {
                blockType: Scratch.BlockType.COMMAND,
                opcode: 'skip2case',
                text: 'skip to case [value]',
                arguments: {
                    value: {
                        type: Scratch.ArgumentType.STRING
                    }
                }
            }, {
                blockType: Scratch.BlockType.COMMAND,
                opcode: 'skip2default',
                text: 'skip to default'
            }];
            this.blocks = this.blocks.map(/** @argument {Object} block */block => (block?.extensions || typeof block !== 'object' ? block : {
                ...block,
                extensions: ['colours_control']
            }));
        }
        getInfo() {
            return {
                id: this.extId,
                name: 'Switch Case V2',
                ...this.colors,
                blocks: this.blocks,
                menus: {}
            }
        }

        /* Id management */
        stirSoup(idLength) {
            // https://github.com/TurboWarp/scratch-vm/blob/develop/src/util/uid.js
            const soup = '!#%()*+,-./:;=?@[]^_`{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const id = [];
            for (let i = 0; i < idLength; i++) {
                id[i] = soup.charAt(Math.random() * soup.length);
            }
            return id.join('');
        }

        /* Block & Thread management */
        inFlyout(thread) {
            return !thread.blockContainer.getBlock(thread.peekStack());
        }
        opcode(opcode) {
            return `${this.extId}_${opcode}`;
        }
        getBlock(id, thread) {
            return thread.blockContainer.getBlock(id);
        }
        setBlock(id, thread, json) {
            thread.blockContainer._blocks[id] = json;
        }
        getBlockData(block, thread) {
            if (!thread?.id) return -1;
            return block[thread?.id] ?? -2;
        }
        getDataViaId(id, thread) {
            return this.getBlockData(this.getBlock(id, thread), thread);
        }
        updateBlockData(block, thread, data, $delete) {
            if (!thread?.id) return;
            let state = block[thread?.id];
            if (!state) state = {};
            state = {
                ...state,
                ...data
            }
            block[thread.id] = state;
            if ($delete) delete block[thread.id];
            this.setBlock(block.id, thread, block);
        }

        /** Switch Sharing */
        shareSwitch(thread, switchId) {
            const switchSubstack = thread.blockContainer.getBranch(thread.peekStack());
            let block = this.getBlock(switchSubstack, thread), blocks = [];
            blocks.push(block);
            while (!!block?.next) {
                if (!!block?.next) {
                    block = this.getBlock(block.next, thread);
                    blocks.push(block);
                }
            };
            blocks.forEach(block => {
                if (!block || block.opcode === this.switchOpcode) return;
                this.updateBlockData(block, thread, { switchId });
            });
        }
        ascendUntilSwitch(thread) {
            let block = this.getBlock(thread.peekStack(), thread);
            while (!block?.[thread.id]?.['switchId']) {
                if (!block) return;
                block = this.getBlock(block.parent, thread);
            }
            if (block) block = this.getBlock(block[thread.id].switchId, thread);
            return block;
        }

        /* Utilities     ^^^^ */
        /* Actual blocks vvvv */

        /* Built in to JS */
        switch0({ value }, util) {
            const thread = util.thread, myId = thread.peekStack();
            if (this.inFlyout(thread)) return;
            thread.id = 'e';this.stirSoup(20);
            if (!toClean?.[thread.id]) toClean[thread.id] = [];
            toClean[thread.id].push(myId);
            const block = this.getBlock(myId, thread), self = {
                value,
                broke: false,
                skippingCase: {
                    bool: false,
                    value: null
                },
                doNext: false,
                falling: false,
                switchId: myId
            }
            this.updateBlockData(block, thread, self);
            this.shareSwitch(thread, myId);
            util.startBranch(1, false);
        }
        case0({ value }, util) {
            const thread = util.thread, self = this.getDataViaId(thread.peekStack(), thread);
            if (this.inFlyout(thread)) return;
            const switchBlock = this.getBlock(self.switchId, thread);
            if (!switchBlock) return;
            this.shareSwitch(thread, self.switchId);
            const switchData = this.getBlockData(switchBlock, thread);
            const switchValue = switchData?.value; if (!switchValue) return;
            if (switchData.broke) return;
            let didSpecialMove = false;
            if (switchData.skippingCase.bool) {
                didSpecialMove = true;
                if (value === switchData.skippingCase.value) switchData.skippingCase.bool = false;
                else return;
            }
            if (switchData.doNext) {
                didSpecialMove = true;
                switchData.doNext = false;
            }
            if (!didSpecialMove && switchValue !== value && !switchData.falling) return;
            util.startBranch(1, false);
            switchData.falling = true;
            return;
        }
        default0(_, util) {
            const thread = util.thread, self = this.getDataViaId(thread.peekStack(), thread);
            if (this.inFlyout(thread)) return;
            const switchBlock = this.getBlock(self.switchId, thread); if (!switchBlock) return;
            this.shareSwitch(thread, self.switchId);
            const switchBroke = this.getBlockData(switchBlock, thread)?.broke; if (switchBroke) return;
            util.startBranch(1, false);
        }
        break0(_, util) {
            const thread = util.thread, self = this.getDataViaId(thread.peekStack(), thread);
            if (this.inFlyout(thread)) return;
            const switchBlock = this.getBlock(self.switchId, thread); if (!switchBlock) return;
            this.updateBlockData(switchBlock, thread, { broke: true, falling: false });
        }

        /* Not in JS */
        switchValue(_, util) {
            const thread = util.thread;;
            if (this.inFlyout(thread)) return '';
            const switchBlock = this.ascendUntilSwitch(thread); if (!switchBlock) return '';
            const switchValue = this.getBlockData(switchBlock, thread)?.value; if (!switchValue) return '';
            return switchValue;
        }
        skip2case({ value }, util) {
            const thread = util.thread;;
            if (this.inFlyout(thread)) return;
            const switchBlock = this.ascendUntilSwitch(thread);
            if (!switchBlock) return;
            this.updateBlockData(switchBlock, thread, { skippingCase: {
                bool: true,
                value
            } });
            return;
        }
        skip2default(_, util) {
            const thread = util.thread;;
            if (this.inFlyout(thread)) return;
            const switchBlock = this.ascendUntilSwitch(thread);
            if (!switchBlock) return;
            this.updateBlockData(switchBlock, thread, { skippingCase: {
                bool: true,
                value: new ImpossibleUsageSkip
            } });
            return;
        }
        runNextCase(_, util) {
            const thread = util.thread;;
            if (this.inFlyout(thread)) return;
            const switchBlock = this.ascendUntilSwitch(thread);
            if (!switchBlock) return;
            this.updateBlockData(switchBlock, thread, { doNext: true });
            return;
        }
    }
    // @ts-expect-error Not typed yet & custom event
    runtime.addListener('THREAD_RETIRED', function(thread) {
        if (!thread?.id) return;
        if (!Array.isArray(toClean[thread.id])) return;
        for (const blockId of toClean[thread.id]) {
            delete thread.blockContainer.getNlock(blockId)[thread.id];
        }
    });
    Scratch.extensions.register(new SwitchCaseV2);
})(Scratch);