/**!
 * Sprite-Sheets
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error(`"Sprite-Sheets" extension must be ran unsandboxed.`);
    }

    const vm = Scratch.vm;
    const clamp = (a, b, c) => (c >= b ? b : (c <= a ? a : c));


    function cutImageUp(image, numColsToCut, numRowsToCut, widthOfOnePiece, heightOfOnePiece, shiftX, shiftY) {
        let imagePieces = [];
        for (var x = 0; x < numColsToCut; ++x) {
            for (var y = 0; y < numRowsToCut; ++y) {
                var canvas = document.createElement('canvas');
                canvas.width = widthOfOnePiece;
                canvas.height = heightOfOnePiece;
                var context = canvas.getContext('2d');
                context.drawImage(image, x * widthOfOnePiece, y * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, shiftX, shiftY, canvas.width, canvas.height);
                imagePieces.push(canvas.toDataURL());
            }
        }
        return imagePieces;
    }

    let NULL = null;
    class extension {
        constructor() {
            this.spritesheets = {};
            this.unCutERR = 'Please cut the sheet first'
        }
        getInfo() {
            return {
                id: '0znzwSpriteSheets',
                name: 'Sprite-Sheets',
                color1: "#fcb103",
                color2: "#db9a37",
                color3: "#db8937",
                blocks: [{blockType: Scratch.BlockType.LABEL, text: 'WARNING: BITMAP ONLY!!'}, {
                    opcode: 'newSheet',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'create new spritesheet [name] from [img]',
                    arguments: {
                        name: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'sheet1'
                        },
                        img: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: ''
                        },

                    }
                }, {
                    hideFromPalette: true,
                    opcode: 'newClip',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'new Clip: start-x [sx] start-y [sy] end-x [ex] end-y [ey]',
                    arguments: {
                        sx: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        sy: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        ex: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 480
                        },
                        ey: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 360
                        },

                    }
                }, {
                    hideFromPalette: true,
                    opcode: 'clipSheet',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set clip of sheet [name] to [clip]',
                    arguments: {
                        name: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'sheet1'
                        },
                        clip: {
                            type: NULL
                        },

                    }
                }, '---',
                {
                    opcode: 'createSettings',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'create setting with [s1], [s2], [s3]',
                    arguments: {
                        s1: {
                            type: NULL
                        },
                        s2: {
                            type: NULL
                        },
                        s3: {
                            type: NULL
                        },
                    }
                },
                {
                    opcode: 'newShift',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'new Shifter: shift-X [sx] shift-y [sy]',
                    arguments: {
                        sx: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        sy: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },

                    }
                },  {
                    opcode: 'newWxH',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'new WxH: width [w] height [h]',
                    arguments: {
                        w: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 16
                        },
                        h: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 16
                        },

                    }
                }, {
                    opcode: 'newCxR',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'new CxR: columns [c] rows [r]',
                    arguments: {
                        c: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 5
                        },
                        r: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 2
                        },

                    }
                }, '---', {
                    opcode: 'cutSheet',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'cut sheet [name] with settings [set]',
                    arguments: {
                        name: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'sheet1'
                        },
                        set: {
                            type: NULL
                        },

                    }
                }, '---', {
                    opcode: 'getSheetImg',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'image [imgIdx] of sheet [name]',
                    arguments: {
                        imgIdx: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        name: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'sheet1'
                        },

                    }
                }, {
                    opcode: 'getSheetData',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[attrib] of sheet [name]',
                    arguments: {
                        attrib: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'sheetOptions',
                            defaultValue: 'width'
                        },
                        name: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'sheet1'
                        },

                    }
                }],
                menus: {
                    _Images: {
                        acceptReporters: true,
                        items: '_getImages'
                    },
                    sheetOptions: {
                        acceptReporters: true,
                        items: ['width', 'height', 'columns', 'rows', 'shift-x', 'shift-y', 'image count', 'json']
                    }
                }
            };
        }
        _getCostumes() {
            const costumes = vm.runtime.getEditingTarget().sprite.costumes.map(item => {
                return item.name;
            });
            if (costumes.length > 0) {
                return costumes;
            }
            return [{
                text: '',
                value: ''
            }];
        }
        _isJSON(data) {
            try { data = JSON.parse(data) } catch { return false };
            //saves parsing time next time the object is used
            return data;
        }
        _joinObjects(obj1, obj2) {
            let obj3 = {};
            let obj1k = Object.keys(obj1),
                obj2k = Object.keys(obj2);
            for (let i = 0; i < obj1k.length; i++) {
                let key = obj1k[i];
                obj3[key] = obj1[key];
            }
            for (let i = 0; i < obj2k.length; i++) {
                let key = obj2k[i];
                obj3[key] = obj2[key];
            }
            return obj3;
        }
        _createMissingProps(obj, props, defaultValue) {
            for (let i = 0; i < props.length; i++) {
                let prop = props[i];
                if (obj.hasOwnProperty(prop)) continue;
                obj[prop] = defaultValue;
            }
            return obj;
        }
        // Generation of settings for other blocks
        newClip(args, util) {
            let sx = Scratch.Cast.toNumber(args.sx),
                sy = Scratch.Cast.toNumber(args.sy);
            let ex = Scratch.Cast.toNumber(args.ex),
                ey = Scratch.Cast.toNumber(args.ey);
            return JSON.stringify({
                sx,
                sy,
                ex,
                ey
            });
        }
        createSettings(args, util) {
            let s1 = (this._isJSON(Scratch.Cast.toString(args.s1))),
                s2 = (this._isJSON(Scratch.Cast.toString(args.s2))),
                s3 = (this._isJSON(Scratch.Cast.toString(args.s3)))
            if (typeof s1 != 'object') s1 = {};
            if (typeof s2 != 'object') s2 = {};
            if (typeof s3 != 'object') s3 = {};

            let obj = this._joinObjects(s1, s2);
            obj = this._joinObjects(obj, s3);

            obj = this._createMissingProps(obj, ['width', 'height', 'cols', 'rows', 'shiftX', 'shiftY'], 0);

            return JSON.stringify(obj);
        }
        newShift(args, util) {
            let shiftX = Scratch.Cast.toNumber(args.sx),
                shiftY = Scratch.Cast.toNumber(args.sy);
            return JSON.stringify({
                shiftX,
                shiftY
            });
        }
        newWxH(args, util) {
            let width = Scratch.Cast.toNumber(args.w),
                height = Scratch.Cast.toNumber(args.h);
            return JSON.stringify({
                width,
                height
            });
        }
        newCxR(args, util) {
            let cols = Scratch.Cast.toNumber(args.c),
                rows = Scratch.Cast.toNumber(args.r);
            return JSON.stringify({
                cols,
                rows
            });
        }
        //Sheet setup
        newSheet(args, util) {
            let sheetname = Scratch.Cast.toString(args.name);
            this.spritesheets[sheetname] = {
                sheetname,
                imgData: args.img,
                images: []
            };
        }
        clipSheet(args, util) {
            let sheetname = Scratch.Cast.toString(args.name),
                clip = JSON.parse(args.clip);
            this.spritesheets[sheetname].clip = clip;
        }
        //Actually "cutting" the sheet
        cutSheet(args, util) {
            let sheetname = Scratch.Cast.toString(args.name),
                spritesheets = this.spritesheets,
                sheet = spritesheets[sheetname],
                settings = this._isJSON(Scratch.Cast.toString(args.set))
            if (settings==false) { return 'Invalid Settings.' };
            let img = new Image();
            img.onload = function() {
                sheet.images = cutImageUp(img, settings.cols, settings.rows, settings.width, settings.height, settings.shiftX, settings.shiftY);
            };
            img.src = sheet.imgData;

            sheet.width = settings.width;
            sheet.height = settings.height;
            sheet.cols = settings.cols;
            sheet.rows = settings.rows;
            sheet.shiftX = settings.shiftX;
            sheet.shiftY = settings.shiftY;

            spritesheets[sheetname] = sheet;
            this.spritesheets = spritesheets;
        }
        //Sheet properties
        getSheetData(args, util) {
            let sheetname = Scratch.Cast.toString(args.name),
                sheet = this.spritesheets[sheetname],
                attrib = Scratch.Cast.toString(args.attrib);
            switch (attrib) {
                case 'width':
                    return (sheet.width || this.unCutERR);
                case 'height':
                    return (sheet.height || this.unCutERR);
                case 'columns':
                    return (sheet.cols || this.unCutERR);
                case 'rows':
                    return (sheet.rows || this.unCutERR);
                case 'shift-x':
                    return (sheet.shiftX || this.unCutERR);
                case 'shift-y':
                    return (sheet.shiftY || this.unCutERR);
                case 'image count':
                    return sheet.images.length;
                case 'json':
                    return JSON.stringify(sheet);
                default:
                    return '';
            }
        }
        getSheetImg(args, util) {
            let sheetname = Scratch.Cast.toString(args.name),
                imgIdx = Scratch.Cast.toNumber(args.imgidx),
                sheet = this.spritesheets[sheetname];
            imgIdx = clamp(1, sheet.images.length, imgIdx);
            if (sheet.images.length > 0) return sheet.images[imgIdx];
            return this.unCutERR;
        }
    }
    //@ts-expect-error
    Scratch.extensions.register(new extension());
})(Scratch);
