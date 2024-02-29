/**!
 * Switch-Case
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.4.3b
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 * IF YOU USE THE SWITCH CASE CODE PLEASE PROVIDE CREDIT!!
 */
(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Switch Case" extension must be ran unsandboxed.`);
  }

  function getBlockByID(target, id) {
    return(target.blocks._blocks[id]);
  }

  function setBlockByID(target, id, JSON) {
    target.blocks._blocks[id] = JSON;
  }

  function getOuterBlockID(target, startBlockID) {
    let block = getBlockByID(target, startBlockID);

    while(block.parent != null && getBlockByID(target, block.parent).next) {
      block = getBlockByID(target, block.parent);
    }

    if (block.parent) block = getBlockByID(target, block.parent);
    return block;
  }

  function isInPalette(thread) {
    return !(Object.keys(thread.target.blocks._blocks).includes(thread.peekStack()));
  }

  let call = 'Dont run me in the palette :(';
  function PaletteCheck(thread) {
    if (isInPalette(thread)) { Scratch.vm.runtime.visualReport(thread.peekStack(), call); return call };
    return false;
  }

  function getOuterCblock(target, startId) {
    let block = getBlockByID(target, startId);
    let isC = false;
    while (!isC && block.hasOwnProperty('parent') && block.parent !== null) {
      block = getBlockByID(target, block.parent);
      isC = (block.hasOwnProperty('inputs') && block.inputs.hasOwnProperty('SUBSTACK'));
    }
    return (isC ? block : null);
  }

  function getOuterCtillOpcode(target, startId, opcode) {
    let currentC = getOuterCblock(target, startId);
    while (currentC != null && currentC.opcode !== opcode) {
      currentC = getOuterCblock(target, currentC.id);
    }
    return currentC;
  }

  function genLabelXML(text) {
    text = text.replaceAll('\\', '\\\\');
    text = text.replaceAll('"', '&quot;');
    text = text.split('\n');

    let gap = 5;//minimum gap is not 0?
    for (let i = 0; i < text.length; i++) {
      let str = text[i];
      str = `<label text="${str}"/><sep gap="${gap}"/>`;
      text[i] = str;
    }

    text = text.join('');
    return text;
  }

  const vm = Scratch.vm;
  let showBroken = true;
  let brokenText = 'Show Broken';
  let extensionID = '0znzwSwitchCase';

  /* eslint-disable */
  let Colours;
  try {
    // @ts-ignore
    Colours = ScratchBlocks.Colours;
  } catch {
    let ScratchBlocks = {Colours: {control:{
      primary: '#FFAB19', secondary: '#EC9C13', tertiary: '#CF8B17'
    }}};
    Colours = ScratchBlocks.Colours;
  }

  let color1 = Colours.control.primary;
  let color2 = Colours.control.secondary;
  let color3 = Colours.control.tertiary;

  /* eslint-enable */

  class SwitchCaseExt {
    getInfo() {
      return {
        id: extensionID,
        name: 'Switch Case',
        color1, color2, color3,
        blocks: [
          {
            opcode: 'switch_',
            blockType: Scratch.BlockType.CONDITIONAL,
            text: 'switch [DATA] | be strict: [STRICT]',
            arguments: {
              DATA: {
                type: Scratch.ArgumentType.STRING,
              },
              STRICT: {
                type: Scratch.ArgumentType.BOOLEAN,
              }
            }
          },
          {
            opcode: 'case_',
            blockType: Scratch.BlockType.CONDITIONAL,
            text: 'case [DATA]',
            arguments: {
              DATA: {
                type: Scratch.ArgumentType.STRING,
              }
            }
          },
          {
            opcode: 'default_',
            blockType: Scratch.BlockType.CONDITIONAL,
            text: 'default'
          },
          '---',
          {
            //hideFromPalette: showBroken,
            disableMonitor: true,
            opcode: 'lcv_case_',
            blockType: Scratch.BlockType.REPORTER,
            text: 'switch value',//'[DATA]',
            arguments: {
              DATA: {
                type: Scratch.ArgumentType.STRING,
                menu: 'lcv'
              }
            }
          },
          '---',
          /* :sob: why does it matter if I call it break or continue :( */
          {
            opcode: 'break_',
            blockType: Scratch.BlockType.COMMAND,
            text: 'exit switch',
            isTerminal: true
          },
          {
            opcode: 'continue_',
            blockType: Scratch.BlockType.COMMAND,
            text: 'exit case',
            isTerminal: true
          },
          '---',
          {
            opcode: 'next_',
            blockType: Scratch.BlockType.COMMAND,
            text: 'run next case',
            arguments: {
              DATA: {
                type: Scratch.ArgumentType.BOOLEAN,
              },
            }
          },
          {
            opcode: 'exec_case_',
            blockType: Scratch.BlockType.COMMAND,
            text: 'run case [DATA]',
            arguments: {
              DATA: {
                type: Scratch.ArgumentType.STRING,
              },
              DATA1: {
                type: Scratch.ArgumentType.BOOLEAN,
              },
            }
          },
          /*{
            blockType: Scratch.BlockType.BUTTON,
            text: brokenText,
            func: 'brokenUpdate'
          },
          {
            hideFromPalette: showBroken,
            //@ts-expect-error
            blockType: Scratch.BlockType.XML,
            xml: genLabelXML('THESE BLOCKS CAN CORRUPT YOUR\nPROJECT, USE THEM AT YOUR OWN\nRISK.'),
          },
          */
        ], menus: {
          lcv: {
            acceptReporters: false,
            items: [{text: 'last case', value: 0},
                    /*'current case',*/
                    {text: 'switch value', value: 1}]
          }
        }
      };
    }

    brokenUpdate() {  showBroken = !showBroken;
                      brokenText = (!showBroken ? 'Hide Broken' : 'Show Broken');
                      //@ts-expect-error
                      vm.extensionManager.refreshBlocks();
                    }

    switch_({ DATA, STRICT }, util) {
      const thread = util.thread;
      const target = util.target;
      const blockID = thread.peekStack();

      if (PaletteCheck(thread)) return call;

      let self = getBlockByID(target, blockID);
      self.switchData = DATA;
      self.ranCase = false;
      self.switchSkipAll = false;
      self.runNext = false;
      self.runIfCase = `_${DATA}`;
      self.planOnRunning = 0;
      self.beStrict = STRICT;
      setBlockByID(target, blockID, self);

      return 1;
    }

    case_({ DATA }, util) {
      const thread = util.thread;
      const target = util.target;
      const blockID = thread.peekStack();

      if (PaletteCheck(thread)) return call;

      let outer = getOuterCtillOpcode(target, blockID, `${extensionID}_switch_`);
      if (outer == null || outer.switchSkipAll) return 0;
      
      let matchesData = ((outer.beStrict && DATA === outer.switchData) || (!outer.beStrict && DATA == outer.switchData));

      if (matchesData || outer.runNext || DATA == outer.runIfCase) {
        if (outer.runNext) { outer.runNext = false } else outer.ranCase = true;
        setBlockByID(target, outer.id, outer);
        return 1;
      }

      return 0;
    }

    default_(args, util) {
      const thread = util.thread;
      const target = util.target;
      const blockID = thread.peekStack();

      let self = getBlockByID(target, blockID);

      if (PaletteCheck(thread)) return call;
      let outer = getOuterCtillOpcode(target, blockID, `${extensionID}_switch_`);
      if (outer == null || self.next || (outer.ranCase || outer.switchSkipAll)) return 0;

      return 1;
    }

    lcv_case_(args, util) {
      const thread = util.thread;
      const target = util.target;
      const blockID = thread.peekStack();

      if (PaletteCheck(thread)) return call;

      let outer = getOuterCtillOpcode(target, blockID, `${extensionID}_switch_`);
      if (outer == null) return 0;

      return outer.switchData;

      switch(args.DATA) {
        case 0: return 0;
        case 1: return outer.switchData;
      }
    }

    next_(args, util) {
      const thread = util.thread;
      const target = util.target;
      const blockID = thread.peekStack();

      let self = getBlockByID(target, blockID);

      if (PaletteCheck(thread)) return call;
      let outer = getOuterBlockID(target, blockID);

      if (outer.opcode != `${extensionID}_switch_`) return 0;

      outer.runNext = true;
      setBlockByID(target, outer.id, outer);
      vm.runtime._pushThread(self.next, target, {stackClick:false})
    }

    exec_case_(args, util) {
      const thread = util.thread;
      const target = util.target;
      const blockID = thread.peekStack();

      if (PaletteCheck(thread)) return call;

      let outer = getOuterCtillOpcode(target, blockID, `${extensionID}_switch_`);
      if (outer == null) return 0;

      outer.runIfCase = args.DATA;
      setBlockByID(target, outer.id, outer);
    }

    break_(args, util) {
      const thread = util.thread;
      const target = util.target;
      const blockID = thread.peekStack();

      if (PaletteCheck(thread)) return call;

      let outer = getOuterCtillOpcode(target, blockID, `${extensionID}_switch_`);
      if (outer == null) return 0;

      outer.switchSkipAll = true;
      setBlockByID(target, outer.id, outer);
    }

    continue_(args, util) {
      const thread = util.thread;
      const target = util.target;
      const blockID = thread.peekStack();

      let self = getBlockByID(target, blockID);

      if (PaletteCheck(thread)) return call;

      let outer = getOuterCtillOpcode(target, blockID, `${extensionID}_switch_`);
      if (outer == null) return 0;

      let block = self;
      while (block.parent != null && block.opcode != `${extensionID}_case_`) {
        block = getBlockByID(target, block.parent);
      }
      if (block.opcode != `${extensionID}_case_`) return 0;

      vm.runtime._stopThread(thread);
      let nextThread = vm.runtime._pushThread(block.next, target, {stackClick: true});

      outer.planOnRunning += 1;
      setBlockByID(target, outer.id, outer);
      if (vm.runtime.isActiveThread(nextThread)) util.yield();

      if (outer.next && outer.planOnRunning == 1) vm.runtime._pushThread(outer.next, target, {stackClick: true});
    }

  }

  //@ts-expect-error
  Scratch.extensions.register(new SwitchCaseExt());
})(Scratch);
