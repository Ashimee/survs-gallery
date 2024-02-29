/**!
 * Dynamic Join
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(async function(Scratch) {
    'use strict';
    if (!Scratch.extensions.unsandboxed) {
        throw new Error(`"Dynamic-Join" extension must be ran unsandboxed.`);
    }

    const vm = Scratch.vm;

    // @ts-expect-error
    try { if (!ReduxStore.getState().scratchGui.mode.isPlayerOnly) alert('Hey, sorry for this but if you have loaded a project you saved or are just doing this then read below:\nDont delete the project-store sprite, but if you load up your project again there will be a duplicate that you can delete, but be warned if you delete the wrong one it will break.'); } catch { console.log('Project is most likely packaged.') };
    let dynamicStorage, joins, joinsMax, hasJoin, joinBlocks;
    class extension {
        getInfo() {
            return {
                id: '0znzwDynamicJoin',
                name: 'Dynamic Join',
                blocks: joinBlocks
            };
        }
        constructor() {
            let self = this;

            function tryFix() {
                self._fixUpJoins();
            }
            tryFix();
            vm.runtime.on('PROJECT_LOADED', tryFix.bind(this));
        }
        _dym_function(...argu) {
            return Object.values(argu[0]).join('');
        }
        _AddArgumentObj(char) {
            return {
                type: Scratch.ArgumentType.STRING,
                defaultValue: char.toString()
            }
        }
        _GenerateInputsOfLength(count) {
            let args = [];
            let argums = {};
            for (let i = 0; i < count; i++) {
                let str = `_${i.toString()}`;
                args.push(str);
            }
            for (let i = 0; i < count; i++) argums[args[i]] = this._AddArgumentObj(args[i]);
            return {
                args,
                argums
            };
        }
        _createJoinOfLength(len) {
            let generatedArgs = this._GenerateInputsOfLength(len);
            let args = generatedArgs.args;
            for (let i = 0; i < args.length; i++) args[i] = `[${args[i]}]`;

            let text = `join (${len}) ` + args.join(' ');
            let opcode = `join${len}`;

            let argums = generatedArgs.argums;

            let block = {
                hideFromPalette: true,
                blockType: Scratch.BlockType.REPORTER,
                opcode,
                text,
                arguments: argums,
                _dym_function: this._dym_function,
                joinCount: len,
            }
            return block;
        }
        async _fixUpJoins() {
            await initValues();
            for (let i = 0; i < joinsMax; i++) {
                let block = this._createJoinOfLength(i + 1);
                console.log(block, joins);
                this[block.opcode] = block._dym_function;
                joinBlocks.push(block);
            }
        }
        _UpdateJoin() {
            for (let i = 0; i < joinBlocks.length; i++) {
                let block = joinBlocks[i];
                if (block.blockType == Scratch.BlockType.BUTTON) continue;
                block.hideFromPalette = true;
            }
            if (hasJoin.includes(joins)) {
                for (let i = 0; i < joinBlocks.length; i++) {
                    let block = joinBlocks[i];
                    if (parseInt(block.opcode) == joins) {
                        block.hideFromPalette = false;
                        return;
                    }
                }
                return;
            }

            let block = this._createJoinOfLength(joins);
            console.log(block, joins);
            this[block.opcode] = block._dym_function;
            joinBlocks.push(block);
            // @ts-expect-error
            vm.extensionManager.refreshBlocks();
            dynamicStorage.set('blocks', joinBlocks);
            dynamicStorage.set('joinCount', joinsMax);
        }
        addJoin() {
            joins += 1;
            if (joins > joinsMax) joinsMax = joins;
        }
        removeJoin() {
            joins -= 1;
            if (joins < 1) joins = 1;
        }
    }
    let inited_extension = new extension();
    Scratch.extensions.register(inited_extension);

    const ProjectStore = class {
        /*
         * @0znzw || DO NOT REMOVE THIS COMMENT || v1.4
         * LICENSED UNDER MIT LICENSE
         * OLD LICENSE UNDER Creative Commons Attribution 4.0 International.
         * https://creativecommons.org/licenses/by/4.0/deed.en
         * https://creativecommons.org/licenses/by/4.0/legalcode.en
         */
        #namespace;
        #target;
        #data;
        constructor(_namespace) {
            this.#namespace = _namespace;
        }
        #isJSON(obj) {
            try {
                JSON.parse(obj);
                return true
            } catch {
                return false
            };
        }
        #getJSON() {
            return JSON.parse(this.#data.value);
        }
        #updateData(obj) {
            this.#data.value = JSON.stringify(obj);
        }
        #hasNamespace() {
            return this.#getJSON().hasOwnProperty(this.#namespace);
        }
        #initNamespace() {
            let json = this.#getJSON();
            json[this.#namespace] = {};
            this.#updateData(json);
        }
        isHooked = false;
        async #initSprite() {
            if (this.#getSprite() == undefined) await vm.addSprite({
                "isStage": false,
                "name": "\u0000\u0000\u0000\u0000project data\u0000\u0000\u0000\u0000",
                "variables": {},
                "lists": {},
                "broadcasts": {},
                "blocks": {
                    "uCn[~uv]RWN_/xQ6xNjw_projectStore": {
                        "opcode": "procedures_definition",
                        "next": null,
                        "parent": null,
                        "inputs": {
                            "custom_block": [1, "xlC:?,3e8,er1Vhv9Hht_projectStore"]
                        },
                        "fields": {},
                        "shadow": false,
                        "topLevel": true,
                        "x": 44,
                        "y": 44
                    },
                    "xlC:?,3e8,er1Vhv9Hht_projectStore": {
                        "opcode": "procedures_prototype_projectStore",
                        "next": null,
                        "parent": "uCn[~uv]RWN_/xQ6xNjw_projectStore",
                        "inputs": {
                            "(t!0s{$)gN}I)5GTA)B4_projectStore": [1, "w)+5@NCxcn@3xC;HA9|(_projectStore"]
                        },
                        "fields": {},
                        "shadow": true,
                        "topLevel": false,
                        "mutation": {
                            "tagName": "mutation",
                            "children": [],
                            "proccode": "%s",
                            "argumentids": "[\"(t!0s{$)gN}I)5GTA)B4_projectStore\"]",
                            "argumentnames": "[\"\"]",
                            "argumentdefaults": "[\"\"]",
                            "warp": "true"
                        }
                    },
                    "w)+5@NCxcn@3xC;HA9|(_projectStore": {
                        "opcode": "argument_reporter_string_number",
                        "next": null,
                        "parent": "xlC:?,3e8,er1Vhv9Hht_projectStore",
                        "inputs": {},
                        "fields": {
                            "VALUE": ["", null]
                        },
                        "shadow": true,
                        "topLevel": false
                    },
                    "L}eN`m|v;fQu(k?lRf1S_projectStore": {
                        "opcode": "procedures_call",
                        "next": null,
                        "parent": null,
                        "inputs": {
                            "(t!0s{$)gN}I)5GTA)B4_projectStore": [1, [10, "project data"]]
                        },
                        "fields": {},
                        "shadow": false,
                        "topLevel": true,
                        "x": 323,
                        "y": 455,
                        "mutation": {
                            "tagName": "mutation",
                            "children": [],
                            "proccode": "%s",
                            "argumentids": "[\"(t!0s{$)gN}I)5GTA)B4_projectStore\"]",
                            "warp": "true"
                        }
                    }
                },
                "comments": {},
                "currentCostume": 0,
                "costumes": [{
                    "name": "costume1",
                    "bitmapResolution": 1,
                    "dataFormat": "svg",
                    "assetId": "592bae6f8bb9c8d88401b54ac431f7b6",
                    "md5ext": "592bae6f8bb9c8d88401b54ac431f7b6.svg",
                    "rotationCenterX": 44,
                    "rotationCenterY": 44
                }],
                "sounds": [],
                "volume": 100,
                "visible": true,
                "x": 0,
                "y": 0,
                "size": 100,
                "direction": 90,
                "draggable": false,
                "rotationStyle": "all around"
            });
            return true;
        }
        #getSprite() {
            return vm.runtime.getSpriteTargetByName('\u0000\u0000\u0000\u0000project data\u0000\u0000\u0000\u0000');
        }
        async hook() {
            if (!this.isHooked) {
                await this.#initSprite();
                this.#target = this.#getSprite();
                this.#data = this.#getBlocksByOpcode('text')[0].fields.TEXT;
                if (!this.#isJSON(this.#data.value)) this.#data.value = '{}';
                if (!this.#hasNamespace()) this.#initNamespace();
                this.isHooked = true;
                return Promise.resolve();
            }
            return Promise.reject();
        }
        get(prop) {
            return this.#getJSON()[this.#namespace][prop];
        }
        set(prop, value) {
            let json = this.#getJSON();
            json[this.#namespace][prop] = value;
            this.#updateData(json);
        }
        remove(prop) {
            let json = this.#getJSON();
            delete json[this.#namespace][prop];
            this.#updateData(json);
        }
        unhook() {
            let json = this.#getJSON();
            delete json[this.#namespace];
            this.#updateData(json);
        }
        #getBlocksByOpcode(opcode) {
            let blocks = Object.values(this.#target.blocks._blocks);
            let myBlocks = [];
            for (let i = 0; i < blocks.length; i++) {
                let block = blocks[i];
                if (block.opcode == opcode) myBlocks.push(block);
            }
            return myBlocks;
        }
    }
    async function initValues() {
        dynamicStorage = new ProjectStore('0znzwDynamicJoin');
        await dynamicStorage.hook();
        joins = 1, joinsMax = 1;
        hasJoin = [1];
        joinBlocks = dynamicStorage.get('blocks');
        joinsMax = dynamicStorage.get('joinCount');
        if (joinBlocks == [] || joinBlocks == {} || joinBlocks == undefined) joinBlocks = [{
                blockType: Scratch.BlockType.BUTTON,
                text: '+1',
                func: 'addJoin'
            },
            {
                blockType: Scratch.BlockType.BUTTON,
                text: '-1',
                func: 'removeJoin'
            },
            {
                blockType: Scratch.BlockType.BUTTON,
                text: 'Refresh JOIN block',
                func: '_UpdateJoin'
            },
        ], joinsMax = 1;
        return Promise.resolve();
    }
    await initValues();
    inited_extension._fixUpJoins();

    vm.extensionManager.refreshBlocks();
})(Scratch);