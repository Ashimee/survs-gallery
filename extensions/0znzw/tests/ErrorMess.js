/**!
 * Error Mess
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function(Scratch){
    if (!Scratch.extensions.unsandboxed) {
        throw new Error(`"Error Mess" extension must be ran unsandboxed.`);
    }
async function crashPage(error) {try{
    if (vm.runtime.targets.length < 2) await vm.addSprite(`{"isStage":false,"name":"ZnVuY3Rpb24gYnkgaHR0cHM6Ly9zY3JhdGNoLm1pdC5lZHUvdXNlcnMvMHpuencv","variables":{},"lists":{},"broadcasts":{},"blocks":{},"comments":{},"currentCostume":0,"costumes":[{"name":"","bitmapResolution":1,"dataFormat":"svg","assetId":"14e46ec3e2ba471c2adfe8f119052307","md5ext":"14e46ec3e2ba471c2adfe8f119052307.svg","rotationCenterX":0,"rotationCenterY":0}],"sounds":[],"volume":0,"visible":false,"x":0,"y":0,"size":0,"direction":0,"draggable":false,"rotationStyle":"","extensionURLs":{},"extensionEnvs":{}}`);
    vm.extensionManager.securityManager.getSandboxMode = function() {return 'unsandboxed'};
    Object.prototype.toString = function(){return JSON.stringify(this)};
    Array.prototype.toString = function(){return JSON.stringify(this)};
    document.querySelector('div[class^="sprite-selector_sprite-wrapper"]').click();
    setTimeout(function(){
        vm.extensionManager.loadExtensionURL('https://surv.is-a.dev/survs-gallery/Placeholder.js');
        setTimeout(function(){
            document.querySelector('div[class^=stage-selector_stage-selector]').click();
            setTimeout(function(){
                const err = document.querySelector('p[class^=crash-message_error-message]');
                err.textContent = error;
            }, 100);
        }, 250);
    }, 250);
    return Promise.resolve(error);
}catch{return Promise.resolve(undefined)}}
    class extension {
        getInfo() {
            return {
                id: '0znzwErrors',
                name: 'Error Mess',
                blocks: [{
                    opcode: 'consoleLog',
                    blockType: 'command',
                    text: 'console log | error: [ERROR]',
                }, {
                    blockType: 'label',
                    text: 'EDITOR ONLY'
                }, {
                    opcode: 'compilerError',
                    blockType: 'command',
                    text: 'throw new compiler error | sprite: [SPRITE_NAME] error: [ERROR]',
                }, {
                    opcode: 'crashEditor',
                    blockType: 'command',
                    text: 'crash editor | error: [ERROR]',
                }, {
                    opcode: 'visualReport',
                    blockType: 'command',
                    text: 'visual report error: [ERROR]',
                }]
            }
        }
        compilerError({ ERROR, SPRITE_NAME }) {
            ERROR = Scratch.Cast.toString(ERROR);
            SPRITE_NAME = Scratch.Cast.toString(SPRITE_NAME);
            vm.runtime.emitCompileError({getName: ()=>SPRITE_NAME}, ERROR);
        }
        crashEditor({ ERROR }) {
            ERROR = Scratch.Cast.toString(ERROR);
            await crashPage(ERROR);
        }
        consoleLog({ ERROR }) {
            ERROR = Scratch.Cast.toString(ERROR);
            console.error(ERROR);
        }
        visualReport({ ERROR }, util) {
            ERROR = Scratch.Cast.toString(ERROR);
            vm.runtime.visualReport(util.thread.peekStack(), ERROR);
        }
    }
    // @ts-ignore This happens sometimes
    Scratch.extensions.register(new extension());
})(Scratch);