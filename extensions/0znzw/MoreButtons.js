/**!
 * More Buttons
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
/**!
 * Many thanks to:
 * CST1229 (https://scratch.mit.edu/users/CST1229/) for creating the "getCurrentBlockArgs" function.
 * Bitter_130 for beta testing in packaged project.
 */
(function (Scratch) {
    'use strict';
    function getCurrentBlockArgs() {
        // this function is by CST1229
        // @ts-ignore Not typed yet.
        const ScratchBlocks = window.ScratchBlocks;
        if (!ScratchBlocks) return {};
        // @ts-ignore Type fuck-up
        const source = ScratchBlocks.selected;
        if (!source) return {};

        const args = {};
        for (const input of source.inputList) {
            for (const field of input.fieldRow) {
                if (field.isCurrentlyEditable()) args[field.name] = field.getValue();
            }
            if (!input.connection) continue;
            const block = input.connection.targetConnection.sourceBlock_;
            if (!block || !block.isShadow()) continue;
            for (const input2 of block.inputList) {
                for (const field2 of input2.fieldRow) {
                    if (field2.isCurrentlyEditable()) args[input.name] = field2.getValue();
                }
            }
        }
        return args;
    }
    const vm = Scratch.vm;
    const runtime = vm.runtime;
    const renderer = runtime.renderer;
    const Cast = Scratch.Cast;
    const BlockType = Scratch.BlockType;
    const ArgType = Scratch.ArgumentType;
    class ext {
        _classWrap(class_) {
            return `[class^="${class_}"]`;
        }
        _getSelectors() {
            const scControlsBar = this._classWrap('sc-controls-bar');
            const selectors = {};
            selectors.greenFlag = (this.isPackaged ? this._classWrap('green-flag-button') : this._classWrap('green-flag_green-flag'));
            selectors.allContainer = (this.isPackaged ? scControlsBar : this._classWrap('stage-header_stage-header-wrapper'));
            selectors.controlContainer = (this.isPackaged ? `${scControlsBar} div:nth-child(1)` : this._classWrap('controls_controls-container'));
            selectors.resizeContainer = (this.isPackaged ? `${scControlsBar} div:nth-child(2)` : this._classWrap('stage-header_stage-size-row'));
            return selectors;
        }
        constructor() {
            // @ts-ignore Not typed yet
            this.isPackaged = !!window?.scaffolding?.vm;
            this.selectors = this._getSelectors();
            this.extensionId = '0znzwMoreButtons';
            this.buttonCount = 0;
            this.lastButton = '';
            /** @type {HTMLElement} */
            this.greenFlag = document.querySelector(this.selectors.greenFlag);
            /** @type {HTMLElement} */
            this.allContainer = document.querySelector(this.selectors.allContainer);
            if (!this.isPackaged) this.allContainer = this.allContainer.parentElement;
            /** @type {HTMLElement} */
            this.controlContainer = document.querySelector(this.selectors.controlContainer);
            /** @type {HTMLElement} */
            this.resizeContainer = document.querySelector(this.selectors.resizeContainer);
            this.controlBar = [];
            this._updateButtons();
            this.buttons = {};
            this.controlBar[0].before(document.createElement('span'));
            this._updateButtons();
        }
        getInfo() {
            return {
                id: this.extensionId,
                name: 'More Buttons',
                color1: '#5caf18',
                color2: '#509815',
                color3: '#509815',
                blocks: [
                    {
                        opcode: 'btnCount',
                        blockType: BlockType.REPORTER,
                        text: 'button count',
                    },
                    {
                        opcode: 'lastBtn',
                        blockType: BlockType.REPORTER,
                        text: 'last button pressed',
                    },
                    {
                        disableMonitor: true,
                        opcode: 'hasBtn',
                        blockType: BlockType.BOOLEAN,
                        text: 'button [NAME] exists?',
                        arguments: {
                            NAME: { type: ArgType.STRING, defaultValue: 'close tab' },
                        },
                    },
                    {
                        opcode: 'newBtnUrl',
                        blockType: BlockType.COMMAND,
                        text: 'add new button named [NAME] with hover text [HOVER] and image-url [URL]',
                        arguments: {
                            NAME: { type: ArgType.STRING, defaultValue: 'close tab' },
                            HOVER: { type: ArgType.STRING, defaultValue: 'closes the tab' },
                            URL: { type: ArgType.STRING, defaultValue: 'https://extensions.turbowarp.org/dango.png' },
                        },
                    },
                    {
                        opcode: 'removeBtn',
                        blockType: BlockType.COMMAND,
                        text: 'remove button named [NAME]',
                        arguments: {
                            NAME: { type: ArgType.STRING, defaultValue: 'close tab' },
                        },
                    },
                    {
                        opcode: 'hideShowBtn',
                        blockType: BlockType.COMMAND,
                        text: '[VISIBILITY] button [NAME]',
                        arguments: {
                            NAME: { type: ArgType.STRING, defaultValue: 'close tab' },
                            VISIBILITY: { type: ArgType.STRING, menu: 'visibility' },
                        },
                    },
                    {
                        opcode: 'hideShowBar',
                        blockType: BlockType.COMMAND,
                        text: '[VISIBILITY] [BAR_NAME] bar(s)',
                        arguments: {
                            BAR_NAME: { type: ArgType.STRING, menu: 'bar' },
                            VISIBILITY: { type: ArgType.STRING, menu: 'visibility' },
                        },
                    },
                    {
                        opcode: 'doAllBtn',
                        blockType: BlockType.COMMAND,
                        text: '[OPT] all buttons',
                        arguments: {
                            NAME: { type: ArgType.STRING, defaultValue: 'close tab' },
                            OPT: { type: ArgType.STRING, menu: 'all' },
                        },
                    },
                    {
                        opcode: 'btnClicked1',
                        blockType: BlockType.HAT,
                        isEdgeActivated: false,
                        shouldRestartExistingThreads: true,
                        text: 'when any button clicked',
                    },
                    {
                        blockType: BlockType.LABEL,
                        text: 'W.I.P',
                    },
                    {
                        opcode: 'moveBtn',
                        blockType: BlockType.COMMAND,
                        text: 'move button [NAME] to position [POS]',
                        arguments: {
                            NAME: { type: ArgType.STRING, defaultValue: 'close tab' },
                            POS: { type: ArgType.NUMBER, defaultValue: 1 },
                        },
                    },
                    {
                        hideFromPalette: true,
                        opcode: 'btnClicked2',
                        blockType: BlockType.HAT,
                        isEdgeActivated: false,
                        shouldRestartExistingThreads: true,
                        text: 'when button [NAME] clicked',
                        arguments: {
                            NAME: { type: ArgType.STRING, defaultValue: 'close tab' },
                        },
                    },
                    {
                        opcode: 'setBtnTo',
                        blockType: BlockType.COMMAND,
                        text: 'set image of button [NAME] to [SPRITE_OR_COSTUME] [ASSET_NAME]',
                        arguments: {
                            NAME: { type: ArgType.STRING, defaultValue: 'close tab' },
                            SPRITE_OR_COSTUME: { type: ArgType.STRING, menu: 'to' },
                            ASSET_NAME: { type: ArgType.STRING, menu: 'sprites_or_costumes' },
                        },
                    }
                ],
                menus: {
                    costumes: {
                        acceptReporters: true,
                        items: '_getCostumes',
                    },
                    sprites_or_costumes: {
                        acceptReporters: true,
                        acceptText: true,
                        items: '_getSpritesOrCostumes',
                    },
                    visibility: {
                        acceptReporters: true,
                        items: ['show', 'hide'],
                    },
                    all: {
                        acceptReporters: true,
                        items: ['remove', 'show', 'hide'],
                    },
                    bar: {
                        acceptReporters: true,
                        items: ['controls', 'resize', 'header', 'all'],
                    },
                    to: {
                        acceptReporters: true,
                        items: ['url', 'costume', 'sprite'],
                    },
                },
            };
        }
        _costumes() {
            return vm.editingTarget.getCostumes();
        }
        _getCostumeURL(name) {
            const costume = this._costumes().filter((costume) => costume.name === name)[0].asset;
            return costume.encodeDataURI();
        }
        _getCostumes(skipPush) {
            const costumes = this._costumes().map((costume) => costume.name);
            if (costumes.length === 0 && !(skipPush ?? false)) costumes.push('');
            return costumes;
        }
        _getSprites() {
            // https://extensions.turbowarp.org/Lily/LooksPlus.js
            const spriteNames = [];
            const targets = runtime.targets;
            const myself = vm.editingTarget.getName();
            if (!vm.editingTarget.isStage) {
                spriteNames.unshift({
                    text: 'Stage',
                    value: '_stage_',
                });
            }
            for (let index = 1; index < targets.length; index++) {
                const target = targets[index];
                if (target.isOriginal) {
                    const targetName = target.getName();
                    if (targetName === myself) {
                        spriteNames.unshift({
                            text: 'this sprite',
                            value: targetName,
                        });
                    } else {
                        spriteNames.push({
                            text: targetName,
                            value: targetName,
                        });
                    }
                }
            }
            if (spriteNames.length > 0) {
                return spriteNames;
            } else {
                return [{ text: '', value: 0 }]; //this should never happen but it's a failsafe
            }
        }
        _getSpritesOrCostumes() {
            const args = getCurrentBlockArgs();
            switch (args.SPRITE_OR_COSTUME) {
                case 'costume':
                    return this._getCostumes();
                case 'sprite':
                    return this._getSprites();
                case 'url':
                    return ['put join block here to type.'];
                default:
                    return [''];
            }
        }
        _clamp(min, max, number) {
            return number <= min ? min : number >= max ? max : number;
        }
        _appendChild(element, position) {
            position = position ?? this.controlBar.length - 1;
            this.controlBar[position].after(element);
            this._updateButtons();
        }
        _updateButtons() {
            this.controlBar = Array.from(this.controlContainer.childNodes).filter(/** @argument {HTMLElement} node */(node) => node.style.display !== 'none');
        }
        _hasCostume(costume) {
            return this._getCostumes(true).includes(costume);
        }
        _doAll(callback) {
            Object.keys(this.buttons).forEach((name) => {
                callback(name, this.buttons[name]);
            });
        }
        _snapshotStage() {
            // https://extensions.turbowarp.org/Lily/LooksPlus.js
            return new Promise((resolve) => {
                Scratch.vm.runtime.renderer.requestSnapshot((uri) => {
                    resolve(uri);
                });
            });
        }
        _getSpriteWithEffects(sprite) {
            // @ts-ignore Not typed yet
            const imageData = vm.runtime.renderer.extractDrawableScreenSpace(sprite.drawableID).imageData;
            var canvas = document.createElement('canvas');
            canvas.width = imageData.width;
            canvas.height = imageData.height;
            canvas.getContext('2d').putImageData(imageData, 0, 0);
            return canvas.toDataURL('image/png');
        }
        _setURL(name, URL) {
            this.buttons[name].src = URL;
        }
        hasBtn({ NAME }) {
            NAME = Cast.toString(NAME);
            return this.buttons[NAME] !== undefined;
        }
        btnCount() {
            return this.buttonCount;
        }
        newBtnUrl(args, util) {
            const NAME = Cast.toString(args.NAME);
            if (this.hasBtn({ NAME })) return '';
            const HOVER = Cast.toString(args.HOVER);
            const URL = Cast.toString(args.URL);
            const button = document.createElement('img');
            button.loading = 'lazy';
            button.title = HOVER;
            button.alt = HOVER;
            button.draggable = false;
            button.classList.add(this.greenFlag.classList[0]);
            button.src = URL;
            button.setAttribute('data-sa-shared-space-order', '0');
            this.buttons[NAME] = button;
            this._appendChild(this.buttons[NAME]);
            button.onclick = () => {
                this.lastButton = NAME;
                runtime.startHats(`${this.extensionId}_btnClicked1`);
            };
            this.buttonCount++;
        }
        removeBtn({ NAME }) {
            NAME = Cast.toString(NAME);
            if (!this.hasBtn({ NAME })) return '';
            this.buttons[NAME].remove();
            this.buttons[NAME] = undefined;
            this.buttonCount--;
        }
        moveBtn({ NAME, POS }) {
            let button;
            NAME = Cast.toString(NAME);
            if (!this.hasBtn({ NAME })) return '';
            POS = Cast.toNumber(POS);
            POS = this._clamp(1, this.controlBar.length, POS) - 1;
            const newButton = this.buttons[NAME].cloneNode(false),
                buttons = [];
            this.buttons[NAME].remove();
            this.buttons[NAME] = newButton;
            for (let i = 0; i < this.controlBar.length; i++) {
                button = this.controlBar[i].cloneNode(false);
                this.controlBar[i].remove();
                if (i === POS) this.controlContainer.appendChild(newButton);
                this.controlContainer.appendChild(button);
            }
            this._updateButtons();
        }
        hideShowBtn({ NAME, VISIBILITY }) {
            NAME = Cast.toString(NAME);
            if (!this.hasBtn({ NAME })) return '';
            const button = this.buttons[NAME];
            VISIBILITY = Cast.toString(VISIBILITY);
            switch (VISIBILITY) {
                case 'show':
                    button.style.display = '';
                    break;
                case 'hide':
                    button.style.display = 'none';
                    break;
                default:
                    break;
            }
            return '';
        }
        btnClicked1() {
            return true;
        }
        btnClicked2({ NAME }) {
            console.log(NAME);
            return false;
        }
        lastBtn() {
            return this.lastButton;
        }
        doAllBtn({ NAME, OPT }) {
            switch (OPT) {
                case 'show':
                    this._doAll((NAME) => {
                        this.hideShowBtn({ NAME, VISIBILITY: 'show' });
                    });
                    break;
                case 'hide':
                    this._doAll((NAME) => {
                        this.hideShowBtn({ NAME, VISIBILITY: 'hide' });
                    });
                    break;
                case 'remove':
                    this._doAll((NAME) => {
                        this.removeBtn({ NAME });
                    });
                    break;
                default:
                    break;
            }
        }
        safeBtnCount() {}
        hideShowBar({ VISIBILITY, BAR_NAME }) {
            BAR_NAME = Cast.toString(BAR_NAME);
            VISIBILITY = Cast.toString(VISIBILITY);
            const display = VISIBILITY.toLowerCase() === 'show' ? '' : 'none';
            switch (BAR_NAME) {
                case 'resize':
                    this.resizeContainer.style.display = display;
                    break;
                case 'controls':
                    this.controlContainer.style.display = display;
                    break;
                case 'header':
                    this.allContainer.style.display = display;
                    break;
                case 'all':
                    // BRO I DONT GIVE A SHIT, JUST SHUT THE FUCK UP 😭
                    // eslint-disable-next-line
                    const containers = [this.resizeContainer, this.controlContainer];
                    containers.forEach(/** @argument {HTMLElement} container */(container) => (container.style.display = display));
                    break;
                default:
                    break;
            }
        }
        async setBtnTo({ NAME, SPRITE_OR_COSTUME, ASSET_NAME }) {
            NAME = Cast.toString(NAME);
            if (!this.hasBtn({ NAME })) return '';
            SPRITE_OR_COSTUME = Cast.toString(SPRITE_OR_COSTUME);
            switch (SPRITE_OR_COSTUME) {
                case 'costume':
                    if (!this._getCostumes(true).includes(ASSET_NAME)) return '';
                    this._setURL(NAME, this._getCostumeURL(ASSET_NAME));
                    break;
                case 'sprite':
                    if (ASSET_NAME === '_stage_') {
                        this._setURL(NAME, await this._snapshotStage());
                    } else if (ASSET_NAME === '_myself_') {
                        this._setURL(NAME, this._getSpriteWithEffects(vm.editingTarget));
                    } else {
                        const target = runtime.getSpriteTargetByName(ASSET_NAME);
                        if (target) this._setURL(NAME, this._getSpriteWithEffects(target));
                    }
                    break;
                case 'url':
                    this._setURL(NAME, ASSET_NAME);
                    break;
                default:
                    break;
            }
            return '';
        }
    }
    Scratch.extensions.register(new ext());
})(Scratch);
