/**!
 * My Blocks Plus V2
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error(`"My Blocks+" extension must be ran unsandboxed.`);
    }

    // for now
    window.Scratch = Scratch;

    /**
     * Checks if the {key} is in the {object}'s prototype
     * @param {Object} object Object to check
     * @param {String|Number} key Key to check for
     * @returns {Boolean} Weather or not it was found in the prototype
     */
    const hasOwn = function (object, key) {
        return Object.prototype.hasOwnProperty.call(object, key);
    };

    const { Cast, BlockType, ArgumentType, vm } = Scratch;
    const { runtime } = vm;


    /** @type {Object} Extension storage object */
    // @ts-expect-error Not typed yet
    const extensionStorage = runtime.extensionStorage;
    if (!extensionStorage) throw new Error('VM is to outdated.');


    const extensionId = '0znzwMyBlocksPlusA3', getInfo = {
        id: extensionId,
        name: 'My Blocks+ VA3-2',
        blocks: [{
            // hideFromPalette: true,
            opcode: 'arg',
            blockType: BlockType.REPORTER,
            allowDropAnywhere: true,
            func: 'argument',
            text: '',
            arguments: {}
        }, {
            // hideFromPalette: true,
            opcode: 'def',
            blockType: BlockType.HAT,
            func: 'definition',
            text: 'definition',
            arguments: {}
        }, {
            // hideFromPalette: true,
            opcode: 'call',
            func: 'call',
            text: 'call',
            arguments: {}
        }]
    };

    extensionStorage[extensionId] = {};
    /** @type {Object} Where we store out extension data */
    const RuntimeStorage = extensionStorage[extensionId];

    /** Utilities */
    var Tools = {
        /**
         * Escape a string to be safe to use in XML content.
         * CC-BY-SA: hgoebl
         * https://stackoverflow.com/questions/7918868/
         * how-to-escape-xml-entities-in-javascript
         * @param {!string | !Array.<string>} unsafe Unsafe string.
         * @return {string} XML-escaped string, for use within an XML tag.
         * https://github.com/TurboWarp/scratch-vm/blob/develop/src/util/xml-escape.js
         */
        xmlEscape(unsafe) {
            if (typeof unsafe !== 'string') {
                if (Array.isArray(unsafe)) {
                    // This happens when we have hacked blocks from 2.0
                    // See #1030
                    unsafe = String(unsafe);
                } else {
                    return unsafe;
                }
            }
            return unsafe.replace(/[<>&'"]/g, (c) => {
                switch (c) {
                    case '<':
                        return '&lt;';
                    case '>':
                        return '&gt;';
                    case '&':
                        return '&amp;';
                    case "'":
                        return '&apos;';
                    case '"':
                        return '&quot;';
                }
            });
        },
        /**
         * UID Generator
         * @param {Number} idLength
         * @returns {String} random UID
         */
        stirSoup(idLength) {
            // https://github.com/TurboWarp/scratch-vm/blob/develop/src/util/uid.js
            const soup = '!#%()*+,-./:;=?@[]^_`{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const id = [];
            for (let i = 0; i < idLength; i++) {
                id[i] = soup.charAt(Math.random() * soup.length);
            }
            return id.join('');
        },
        mutationXML(blockInfo) {
            return `<mutation blockInfo="${Tools.xmlEscape(blockInfo)}"/>`;
        }
    };

    getInfo.blocks.push({
        // @ts-ignore
        blockType: 'xml',
        xml: (function(){
            const blockInfo = getInfo.blocks.find(block => block.func === 'call');
            blockInfo.arguments['ARG0'] = {
                type: ArgumentType.STRING
            };
            return `<block type="${extensionId}_call">${Tools.mutationXML(blockInfo)}<field name="ARG0"><shadow type="text"><field name="TEXT">50</field></shadow></field></block>`;
        })()
    });

    class MBP {
        getInfo() {
            return getInfo;
        }
        argument() {}
        definition() {}
        call() {}
    }

    // @ts-ignore
    Scratch.extensions.register(new MBP());
})(Scratch);