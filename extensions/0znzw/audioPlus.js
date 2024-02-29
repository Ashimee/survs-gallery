/**!
 * Audio+
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.5
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function (Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error(`"Audio+" extension must be ran unsandboxed.`);
    }

    const vm = Scratch.vm;
    const Cast = Scratch.Cast;

    const _clamp = function(min,max,num){
        if (num <= min) return min;
        if (num >= max) return max;
        return num;
    };

    //.@ts-expect-error
    var audios = Object.create(null);

    function pauseAll(alsoStop) {
        const vals = Object.values(audios);
        var song;
        for (song in vals) {
            song = vals[song];
            song.pause();
            if (alsoStop) song.currentTime = 0;
        }
    }

    document.querySelector('img[class=stop-all_stop-all_1Y8P9]').addEventListener('click', function(){
        audios = Object.create(null);
    });

    class AudioPlus {
        getInfo() {
            return {
                id: '0znzwAudioPlus',
                color1: "#156f25",
                name: "Audio+",
                blocks: [{
                    opcode: 'createNewSound',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'create new sound [NAME] [URL]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Sound1'
                        },
                        URL: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'https://extensions.turbowarp.org/meow.mp3'
                        }
                    }
                }, {
                    opcode: 'playSound',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'play [NAME]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Sound1'
                        }
                    }
                }, {
                    opcode: 'deleteSound',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'delete sound [NAME]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Sound1'
                        }
                    }
                }, '---', {
                    opcode: 'setSoundTime',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set current second of [NAME] to [SECOND]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Sound1'
                        },
                        SECOND: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                }, '---', {
                    opcode: 'setSoundVolume',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set volume of [NAME] to [VLM]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Sound1'
                        },
                        VLM: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                }, {
                    opcode: 'changeSoundVolume',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'change volume of [NAME] by [VLM]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Sound1'
                        },
                        VLM: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                }, '---', {
                    opcode: 'stopSound',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'stop sound [NAME]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Sound1'
                        }
                    }
                }, {
                    opcode: 'stopAllSounds',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'stop all sounds'
                }, '---', {
                    opcode: 'audioExists',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'audio [NAME] exists?',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Sound1'
                        }
                    }
                }, {
                    disableMonitor: true,
                    opcode: 'getAllSounds',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'get all sounds'
                }, {
                    opcode: 'isAudio',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'is [NAME] [OPTION]?',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Sound1'
                        },
                        OPTION: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'sound_states'
                        }
                    }
                }, {
                    opcode: 'getAudio',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'get [NAME]\'s [OPTION]?',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Sound1'
                        },
                        OPTION: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'sound_attrs'
                        }
                    }
                }, '---', {
                    opcode: 'pauseSound',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'pause [NAME]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Sound1'
                        }
                    }
                }, {
                    opcode: 'pauseAllSounds',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'pause all sounds'
                }, {
                    opcode: 'unpauseSound',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'unpause [NAME]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Sound1'
                        }
                    }
                }, '---', {
                    opcode: 'loopSound',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'loop [NAME]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Sound1'
                        }
                    }
                }, {
                    opcode: 'unloopSound',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'unloop [NAME]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Sound1'
                        }
                    }
                }],
                menus: {
                    sound_states: {
                        acceptReporters: true,
                        items: ['looped', 'playing', 'paused', 'over']
                    },
                    sound_attrs: {
                        acceptReporters: true,
                        items: ['volume', 'current time', 'length']
                    }
                }
            };
        }

        audioExists({NAME}) {
            NAME = Cast.toString(NAME);
            return Object.keys(audios).includes(NAME);
        }

        createNewSound({NAME, URL}) {
            NAME = Cast.toString(NAME);
            URL = Cast.toString(URL);
            if (this.audioExists(NAME)) return;
            //eslint-disable-next-line
            audios[NAME] = new Audio(URL);
            const audio = audios[NAME];
            audio.name = NAME;
            audio.addEventListener("ended", function(){
                this.currentTime = 0;
            });
            audio.addEventListener('loadedmetadata', function(){
                audio.dur = audio.duration;
            },false);
        }

        deleteSound({NAME}) {
            try {
            NAME = Cast.toString(NAME);
            this.stopSound(NAME);
            delete audios[NAME];
            } catch (e) {
                console.log(e);
            }
        }

        isAudio({NAME, OPTION}) {
            try {
            NAME = Cast.toString(NAME);
            const audio = audios[NAME];
            switch (OPTION) {
                case 'looped':
                    return audio.loop;
                case 'playing':
                    return !audio.paused;
                case 'paused':
                    return audio.paused;
                case 'over':
                    return audio.currentTime;
            }
            } catch (e) {
                console.log(e);
            }
        }

        getAudio({NAME, OPTION}) {
            try {
            NAME = Cast.toString(NAME);
            const audio = audios[NAME];
            switch (OPTION) {
                case 'volume':
                    return audio.volume * 100;
                case 'second':
                    return audio.currentTime;
                case 'length':
                    return audio.dur;
            }
            } catch (e) {
                console.log(e);
            }
        }

        playSound({NAME}) {
            try {
            NAME = Cast.toString(NAME);
            const audio = audios[NAME];
            audio.play();
            } catch (e) {
                console.log(e);
            }
        }

        pauseAllSounds() {
            pauseAll(false);
        }

        stopAllSounds() {
            pauseAll(true);
        }

        stopSound({NAME}) {
            try {
            NAME = Cast.toString(NAME);
            const audio = audios[NAME];
            audio.pause();
            audio.currentTime = 0;
            } catch (e) {
                console.log(e);
            }
        }

        setSoundTime({NAME, SECOND}) {
            try {
            NAME = Cast.toString(NAME);
            SECOND = Cast.toNumber(SECOND);
            const audio = audios[NAME];
            audio.currentTime = SECOND;
            } catch (e) {
                console.log(e);
            }
        }

        getAllSounds() {
            return JSON.stringify(Object.keys(audios));
        }

        setSoundVolume({NAME, VLM}) {
            try {
            NAME = Cast.toString(NAME);
            VLM = Cast.toNumber(VLM);
            const audio = audios[NAME];
            audio.volume = _clamp(0,100,VLM) / 100;
            } catch (e) {
                console.log(e);
            }
        }

        changeSoundVolume({NAME, VLM}) {
            try {
                NAME = Cast.toString(NAME);
                VLM = Cast.toNumber(VLM);
                const audio = audios[NAME];
                audio.volume = _clamp(0,100,((audio.volume * 100) + VLM) / 100);
            } catch (e) {
                console.log(e);
            }
        }

        pauseSound({NAME}) {
            try {
            NAME = Cast.toString(NAME);
            const audio = audios[NAME];
            if (!audio.paused) {
                audio.pause();
            }
            } catch (e) {
                console.log(e);
            }
        }

        unpauseSound({NAME}) {
            try {
            NAME = Cast.toString(NAME);
            const audio = audios[NAME];
            if (audio.paused) {
                audio.play();
            }
            } catch (e) {
                console.log(e);
            }
        }

        loopSound({NAME}) {
            try {
            NAME = Cast.toString(NAME);
            const audio = audios[NAME];
            audio.loop = true;
            } catch (e) {
                console.log(e);
            }
        }

        unloopSound({NAME}) {
            try {
            NAME = Cast.toString(NAME);
            const audio = audios[NAME];
            audio.loop = false;
            } catch (e) {
                console.log(e);
            }
        }
    }

    //@ts-expect-error
    Scratch.extensions.register(new AudioPlus());
})(Scratch);
