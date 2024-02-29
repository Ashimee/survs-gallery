/**!
 * AddonBlock Creator
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function(Scratch) {
    'use strict';
    if (!Scratch.extensions.unsandboxed) {
        throw new Error(`"AddonBlock Creator" extension must be ran unsandboxed.`);
    }
    const vm = Scratch.vm;
    const runtime = vm.runtime;
    class AddonBlockCreator {
        getInfo() {
            return {
                id: '0znzwAddonBlockCreator',
                name: 'Addon block creator',
                color1: "#b4b4b4",
                color2: "#9c9c9c",
                color3: "#646464",
                blocks: [{
                    blockType: Scratch.BlockType.BUTTON,
                    text: 'READ ME',
                    func: 'readMe'
                }, {
                    opcode: 'registerBlock',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'create new block with text of: [TEXT] and callback js of: [JAVASCRIPT]',// with argument mappings of [ARG_MAPPING]',
                    arguments: {
                        TEXT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'eval [js]'
                        },
                        ARG_MAPPING: {
                            //removed
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '["js"]'
                        },
                        JAVASCRIPT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'eval(args.js);'
                        }
                    }
                }],
                menus: {}
            }
        }
        //extension stuff
        readMe() {
            alert('The blocks generated will work if you register the block, and they will even save.\nSadly they wont work on scratch as they will be converted to a custom block.\n\n\nArguments:\nThe block is called with the arguments "args".\nSo to use arguments type " args.[argname here] "');
        }
        registerBlock(args) {
            function extractArgsFrom(text, replace) {
                var nextStartIdx = 0;
                var args = [];
                for (let i = 0; i<text.length-text.replaceAll('[','').length; i++) {
                    var string = text.substring((text.indexOf('[', nextStartIdx)) + 1, text.indexOf("]", nextStartIdx));
                    if (text[text.indexOf('[', nextStartIdx) - 1] == '\\') {
                        nextStartIdx = text.indexOf(']', nextStartIdx) + 1;
                        continue;
                    }
                    args.push(string);
                    if (replace.bool) {
                        text = text.replace(`[${string}]`, replace.str);
                    }
                    nextStartIdx = text.indexOf(']', nextStartIdx) + 1;
                }
                return [args, text.replaceAll('\\[', '[')];
            }; 
            const generateFunctionFromJS = function(JS){var genJS=(function(js){return `(function(args){\n${js}\n})`});return eval(`${genJS(JS)}`)};
            const parsedArgs = extractArgsFrom(args.TEXT, {str:'%s',bool:true});
            const callback = generateFunctionFromJS(args.JAVASCRIPT);
            const arguments_ = parsedArgs[0];
            const procedureCode = parsedArgs[1];
            vm.addAddonBlock({
                    arguments: arguments_, // argument names
                    procedureCode, // %s stands for an argument and will be mapped to the n'th corresponding item in arguments array
                    callback,
                    hidden: false // make sure the block is visible
            });
        }
    }

    Scratch.extensions.register(new AddonBlockCreator());
})(Scratch);