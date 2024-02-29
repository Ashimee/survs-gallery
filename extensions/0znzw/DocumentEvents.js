/**!
 * Document Events
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function(Scratch) {
    'use strict';
    const canvas = Scratch.vm.renderer.canvas;
    const runtime = Scratch.vm.runtime;
    if (!Scratch.extensions.unsandboxed) {
      throw new Error(`"DocumentEvents" extension must be ran unsandboxed.`);
    }
    class extension {
      getInfo() {
        return {
          id: 'DocumentEvents0znzw',
          name: 'Tab Events',
          blocks: [
            {
              opcode: 'isFocused',
              blockType: Scratch.BlockType.BOOLEAN,
              text: 'is tab focused?'
            },
            { blockType: Scratch.BlockType.LABEL, text: 'Broken Blocks:' },
            {
              opcode: 'onVisibilityChange',
              blockType: Scratch.BlockType.EVENT,
              text: 'when tab visibility is changed',
              isEdgeActivated: false
            },
            {
              opcode: 'onCanvasEnter',
              blockType: Scratch.BlockType.EVENT,
              text: 'when mouse enters canvas',
              isEdgeActivated: false
            },
            {
              opcode: 'onCanvasLeave',
              blockType: Scratch.BlockType.EVENT,
              text: 'when mouse leaves canvas',
              isEdgeActivated: false
            },
            {
              opcode: 'onMouseMove',
              blockType: Scratch.BlockType.EVENT,
              text: 'when mouse moves on canvas',
              isEdgeActivated: false
            },
            {
              opcode: 'whenOffline',
              blockType: Scratch.BlockType.EVENT,
              text: 'when device becomes offline',
              isEdgeActivated: false
            },
            {
              opcode: 'whenOnline',
              blockType: Scratch.BlockType.EVENT,
              text: 'when device becomes online',
              isEdgeActivated: false
            },
          ]
        };
      }
      //0
      isFocused() {
        return document.hasFocus();
      }
      isTouchingCanvas() {
        return !0;
      }
      onVisibilityChange(){}
      onCanvasEnter(){}
      onCanvasLeave(){}
      onMouseMove(){}
      whenOnline(){}
      whenOffline(){}
      //1
    }
    document.addEventListener('visibilitychange', (event) => {
      runtime.startHats('DocumentEvents0znzw_onVisibilityChange');
    });
    canvas.addEventListener('mouseenter', (event) => {
      runtime.startHats('DocumentEvents0znzw_onCanvasEnter');
    });
    canvas.addEventListener('mouseout', (event) => {
       runtime.startHats('DocumentEvents0znzw_onCanvasLeave');
    });
    canvas.addEventListener('mousemove', (event) => {
      runtime.startHats('DocumentEvents0znzw_onMouseMove');
    });
    document.addEventListener('online', (event) => {
      runtime.startHats('DocumentEvents0znzw_whenOnline');
    });
    document.addEventListener('offline', (event) => {
      runtime.startHats('DocumentEvents0znzw_whenOffline');
    });
    Scratch.extensions.register(new extension());
  })(Scratch);
