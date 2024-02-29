/**!
 * Query Parameters
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 * Made this before the one on turbowarp, just this is V2.
 * Made in an hour.
 */
(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Query Parameters" extension must be ran unsandboxed.`);
}
  var urlParams = new URLSearchParams(window.location.search);
  const vm = Scratch.vm;
  class QueryParams {
  getInfo() {
    return {
      id: '0znzwQueryParams',
      name: 'Query Parameters',
      color1: "#b4b4b4",
      color2: "#9c9c9c",
      color3: "#646464",
      blocks: [{
        func: 'openOriginPullReq',
        blockType: Scratch.BlockType.BUTTON,
        text: 'Original Pull Request'
      }, '---', {
        opcode: 'setParam',
        blockType: Scratch.BlockType.COMMAND,
        text: 'set param [name] to [value]',
        arguments: {
            name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'fps'
            },
            value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '60'
            }
        }
      }, {
        opcode: 'appendParam',
        blockType: Scratch.BlockType.COMMAND,
        text: 'append param [name] with value [value]',
        arguments: {
            name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'fps'
            },
            value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '60'
            }
        }
      }, '---',  {
        opcode: 'deleteParam',
        blockType: Scratch.BlockType.COMMAND,
        text: 'remove param [name]',
        arguments: {
            name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'fps'
            }
        }
      }, '---', {
        opcode: 'hasParam',
        blockType: Scratch.BlockType.BOOLEAN,
        text: 'has param [name]',
        arguments: {
            name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'fps'
            }
        }
      }, {
        disableMonitor: true,
        hideFromPalette: true,
        opcode: 'sortParam',
        blockType: Scratch.BlockType.REPORTER,
        text: 'get sorted parameters'
      }, '---', {
        disableMonitor: true,
        opcode: 'getParam',
        blockType: Scratch.BlockType.REPORTER,
        text: 'get param [name]',
        arguments: {
            name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'fps'
            }
        }
      }, {
        disableMonitor: true,
        opcode: 'getAllParam',
        blockType: Scratch.BlockType.REPORTER,
        text: 'get all values of param named [name]',
        arguments: {
            name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'fps'
            }
        }
      }, {
        disableMonitor: true,
        opcode: 'getValues',
        blockType: Scratch.BlockType.REPORTER,
        text: 'get all values'
      }, {
        disableMonitor: true,
        opcode: 'getKeys',
        blockType: Scratch.BlockType.REPORTER,
        text: 'get all keys'
      }, {
        disableMonitor: true,
        opcode: 'getAllInPairs',
        blockType: Scratch.BlockType.REPORTER,
        text: 'get all in pairs'
      }, '---', {
        opcode: 'refreshURI',
        blockType: Scratch.BlockType.COMMAND,
        text: 'update url'
      }, {
        disableMonitor: true,
        opcode: 'currentURI',
        blockType: Scratch.BlockType.REPORTER,
        text: 'get current url'
      }
    ]};
  }
  hasParam({ name }) {
    return urlParams.has(name);
  }
  getParam({ name }) {
    return decodeURIComponent(urlParams.get(name));
  }
  getAllParam({ name }) {
    return JSON.stringify(urlParams.getAll(name));
  }
  setParam({ name, value }) {
    urlParams.set(name, encodeURIComponent(value));
  }
  deleteParam({ name }) {
    urlParams.delete(name);
  }
  appendParam({ name, value}) {
    urlParams.append(name, encodeURIComponent(value));
  }
  sortParam() {
    return urlParams.sort();
  }
  getValues() {
    const values = [];
    for (const value of urlParams.values()) {
      values.push(value);
    }
    return JSON.stringify(values);
  }
  getKeys() {
    const keys = [];
    for (const key of urlParams.keys()) {
      keys.push(key);
    }
    return JSON.stringify(keys);
  }
  getAllInPairs() {
    const pairs = [];
    for (const [key, value] of urlParams.entries()) {
      pairs.push({key, value});
    }
    return JSON.stringify(pairs);
  }
  refreshURI() {
    history.replaceState(null, "", "?" + urlParams.toString());
  }
  currentURI() {
    return window.location.href;
  }
  //BUTTONS
  openOriginPullReq() {
    const pullRwqUri = 'https://github.com/TurboWarp/extensions/pull/563';
    Scratch.redirect(pullRwqUri);
  }
}
  Scratch.extensions.register(new QueryParams());
})(Scratch);
