(function (Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
      throw new Error(`"LocalStorage Unlocked" extension must be ran unsandboxed.`);
    }

    window.addEventListener('storage', (event) => {
      if (event.storageArea === localStorage) {
        Scratch.vm.runtime.startHats('0znzwlocalstorageunlocked_whenChanged');
      }
    });
    class LocalStorageUnlocked {
      getInfo() {
        return {
          id: '0znzwlocalstorageunlocked',
          name: 'Local Storage | Unlocked',
          docsURI: "https://extensions.turbowarp.org/local-storage.html",
          blocks: [
          {
            opcode: 'getLSitem',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get [name] from localstorage',
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello'
              }
            }
          }, {
            opcode: 'setLSitem',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set [name] in localstorage to [value]',
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello'
              },
              value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'world'
              }
            }
          }, {
            opcode: 'removeLSitem',
            blockType: Scratch.BlockType.COMMAND,
            text: 'remove [name] from localstorage',
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello'
              }
            }
          }, {
              hideFromPalette: true,
              opcode: 'whenChanged',
              blockType: Scratch.BlockType.HAT,
              text: 'when another window changes storage',
              isEdgeActivated: false
            }
          ],
        };
      }
      setLSitem(args) {
        localStorage.setItem(args.name, args.value);
      }
      getLSitem(args) {
        return localStorage.getItem(args.name);
      }
      removeLSitem(args) {
        localStorage.removeItem(args.name);
      }
    }
    Scratch.extensions.register(new LocalStorageUnlocked());
  })(Scratch);
