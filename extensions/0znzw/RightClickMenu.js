/**!
 * Right Click Menu
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"RightClick-Menu" extension must be ran unsandboxed.`);
  }
  const disable = function(e){e.preventDefault(); return false}, enable = function(e){return true};
  const fakeEvent = {preventDefault: function(){}};
  document.oncontextmenu = enable;
  let isDisabled = false;
  class extension {
    getInfo() { return({
      id: '0znzwRightClick',
      name: 'Right Click menu',
      blocks: [{
        blockType: Scratch.BlockType.COMMAND,
        opcode: 'enable',
        text: 'enable right click menu'
      }, {
        blockType: Scratch.BlockType.COMMAND,
        opcode: 'disable',
        text: 'disable right click menu'
      }, {
        blockType: Scratch.BlockType.BOOLEAN,
        opcode: 'isDisabled',
        text: 'is right click menu disabled?'
      }]
    })}
    isDisabled() { return(!document.oncontextmenu(fakeEvent)) }
    enable() { document.oncontextmenu = enable; }
    disable() { document.oncontextmenu = disable; }
  }
  Scratch.extensions.register(new extension());
})(Scratch);
