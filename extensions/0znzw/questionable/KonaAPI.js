/**!
 * KonaChan API
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function(Scratch) {
    'use strict';
    if (!Scratch.extensions.unsandboxed) {
        throw new Error(`"Konachan API" extension must be ran unsandboxed.`);
    }
    function constructPostUrl(args) {
        let url = 'https://konachan.net/post.json?limit=100&page=1&tags= -rating:s';
        if (args.page != undefined) {
            url = url.replace('page=1', `page=${args.page}`)
        }
        if (args.tags != undefined) {
            url = url.replace('tags=', `tags=${encodeURIComponent(args.tags)}`)
        }
        return 'https://corsproxy.io/?'+encodeURIComponent(url);
    }
    let clamp = (n,c,r)=>{return r>c?c:r<n?n:r};
    class konachan {
        constructor() {
            this.tags = [];
            this.tagPrefixes = ['character', 'copyright', 'artist', {
                text: 'none',
                value: ''
            }]
        }
        getInfo() {
            return {
                id: '0znzwKonaapi',
                name: 'Konachan API',
                blocks: [
                    {
                        opcode: 'getPostOfPage',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get post [POST] on page [PAGE]',
                        arguments: {
                            POST: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            PAGE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'getAttrOfPost',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get [ATTRIBUTE] from post [POST]',
                        arguments: {
                            POST: {
                                type: 'null',
                            },
                            ATTRIBUTE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'id',
                                menu: 'postAttributes'
                            }
                        }
                    },
                    { blockType: Scratch.BlockType.LABEL, text: 'Tags' },
                    {
                        opcode: 'addTag',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'add tag [TAG_DATA] of type [TAG_TYPE]',
                        arguments: {
                            TAG_TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'none',
                                menu: 'prefixes'
                            },
                            TAG_DATA: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'yuri'
                            }
                        }
                    },
                    {
                        opcode: 'removeTag',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'remove tag [TAG_DATA] of type [TAG_TYPE]',
                        arguments: {
                            TAG_TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'none',
                                menu: 'prefixes'
                            },
                            TAG_DATA: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'yuri'
                            }
                        }
                    },
                ], menus: {
                    postAttributes: {
                        acceptReporters: true,
                        items: '_validPostAttrs'
                    },
                    prefixes: {
                        acceptReporters: true,
                        items: this.tagPrefixes
                    },
                }
            };
        }

        //helper functions
        _isValidJSON(data) {
            try {let tmp = JSON.parse(data)} catch {return false};
            return true;
        }
        _refixMenu(...args) {
            let json = args[0];
            if (Object.keys(args).length < 5) return json;
            for (let tag in json) {
                let idx = tag;
                tag = json[idx];
                if (typeof tag === 'object') {
                    //@ts-ignore
                    json[idx] = tag.value;
                }
            }
            return json;
        }
        _validPostAttrs(...args) { 
            let json = ['id', 'tags', {
                text: 'download url',
                value: 'file_url'
            }, {
                text: 'post time',
                value: 'created_at'
            }, {
                text: 'poster id',
                value: 'creator_id'
            }, 'rating', 'width', 'height',
            'source', 'md5', 'score'];
            return this._refixMenu(json, ...args);
        }
        _getTags() {
            return this.tags.join(' ');
        }

        //actual functions
        async getPostOfPage({ POST, PAGE }) {
            PAGE = Scratch.Cast.toNumber(PAGE) || undefined;
            POST = clamp(1,100,Scratch.Cast.toNumber(POST)) || undefined;
            let url = constructPostUrl({page: PAGE, tags: this._getTags()});
            if (!Scratch.canFetch(url)) return;
            let response = await ((await Scratch.fetch(url)).json());
            console.log(response);
            return JSON.stringify(response[POST]);
        }
        getAttrOfPost({ ATTRIBUTE, POST }) {
            ATTRIBUTE = Scratch.Cast.toString(ATTRIBUTE);

            if (!this._validPostAttrs(0,0,0,0,0).includes(ATTRIBUTE)) return '';
            if (!this._isValidJSON(POST)) return '';

            let ATTR = JSON.parse(POST)[ATTRIBUTE];
            if (ATTRIBUTE === 'tags') ATTR = ATTR.split(' ');

            if (typeof ATTR === 'object') ATTR = JSON.stringify(ATTR);
            return ATTR;
        }

        //tags
        addTag({ TAG_TYPE, TAG_DATA }) {
            let TAG = TAG_DATA;

            TAG = Scratch.Cast.toString(TAG);
            TAG_TYPE = Scratch.Cast.toString(TAG_TYPE);

            let tagPrefix = (this._refixMenu(this.tagPrefixes).includes(TAG_TYPE) ? TAG_TYPE+':' : '');
            TAG = tagPrefix+TAG;

            if (this.tags.includes(TAG)) return;
            this.tags.push(TAG);
        }

        removeTag({ TAG_TYPE, TAG_DATA }) {
            let TAG = TAG_DATA;

            TAG = Scratch.Cast.toString(TAG);
            TAG_TYPE = Scratch.Cast.toString(TAG_TYPE);

            let tagPrefix = (this._refixMenu(this.tagPrefixes).includes(TAG_TYPE) ? TAG_TYPE+':' : '');
            TAG = tagPrefix+TAG;

            if (!this.tags.includes(TAG)) return;
            //@ts-expect-error
            this.tags.pop(this.tags.indexOf(TAG, 0));
        }
    }

    //@ts-ignore
    Scratch.extensions.register(new konachan());
})(Scratch);