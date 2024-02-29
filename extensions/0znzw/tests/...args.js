/**!
 * ...args
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function(Scratch) {
    'use strict';
    class site_placeholder {
      getInfo() {
        return {
          id: 'thrdTest',
          name: '...args',
          blocks: [
            {
              blockType: Scratch.BlockType.COMMAND,
              opcode: 'thrdJS',
              text: 'run js (w/util) [js]',
              arguments: {js:{type:Scratch.ArgumentType.STRING,defaultValue:'console.log(util)'}}
            },
            {
              blockType: Scratch.BlockType.REPORTER,
              opcode: 'thrdJS2',
              text: 'run js (w/util) [js]',
              arguments: {js:{type:Scratch.ArgumentType.STRING,defaultValue:'console.log(util)'}}
            },
          ]
        };
      }
      thrdJS(args, util) {
        eval(args.js);
      }
      thrdJS2(args, util) {
        return eval(args.js);
      }
    }
    Scratch.extensions.register(new site_placeholder());
  })(Scratch);