/**!
 * File Manager
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
      throw new Error(`"File Manager" extension must be ran unsandboxed.`);
    }

    let fs;
    try {
      fs = window.fileSystemPromiseAPI;
      fileSystemAPI = window.fileSystemAPI
    } catch(err) {
      console.error('failed to load fs')
    }

    class fileReaderExt {
      getInfo() {
        return {
          id: '0znzwFileManager',
          name: 'File Manager',
          blocks: [
            {
              blockType: Scratch.BlockType.BOOLEAN,
              opcode: 'can_use_api',
              text: 'packaged-file api available?'
            },
            {
              blockType: Scratch.BlockType.LABEL,
              text: 'Directory\'s'
            },
            {
              blockType: Scratch.BlockType.REPORTER,
              opcode: 'getCwd',
              text: 'current directory'
            },
            {
              blockType: Scratch.BlockType.BOOLEAN,
              opcode: 'isDirectory',
              text: 'is [PATH] a directory?',
              arguments: {
                PATH: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'C:\\Hello'
                }
              }
            },
            {
              blockType: Scratch.BlockType.COMMAND,
              opcode: 'mkDir',
              text: 'create directory [PATH]',
              arguments: {
                PATH: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'C:\\Hello'
                }
              }
            },
            {
              blockType: Scratch.BlockType.COMMAND,
              opcode: 'rmDir',
              text: 'remove directory [PATH] recursively: [RECURSIVE]',
              arguments: {
                PATH: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'C:\\Hello'
                },
                RECURSIVE: {
                  type: Scratch.ArgumentType.BOOLEAN
                }
              }
            },
            {
              blockType: Scratch.BlockType.REPORTER,
              opcode: 'listDir',
              text: 'list files in directory [PATH]',
              arguments: {
                PATH: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'C:\\Hello'
                }
              }
            },
            {
              blockType: Scratch.BlockType.LABEL,
              text: 'File Handling'
            },
            {
              blockType: Scratch.BlockType.BOOLEAN,
              opcode: 'isFile',
              text: 'is [PATH] a file?',
              arguments: {
                PATH: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'C:\\Hello\\world.txt'
                }
              }
            },
            {
              blockType: Scratch.BlockType.COMMAND,
              opcode: 'createFile',
              text: 'create file [PATH]',
              arguments: {
                PATH: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'C:\\Hello\\world.txt'
                }
              }
            },
            {
              blockType: Scratch.BlockType.COMMAND,
              opcode: 'writeFile',
              text: 'write [DATA] to file [PATH] as type [MODE]',
              arguments: {
                DATA: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'Hello, World!'
                },
                PATH: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'C:\\Hello\\world.txt'
                },
                MODE: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'text',
                  menu: 'modes'
                }
              }
            },
            {
              blockType: Scratch.BlockType.REPORTER,
              opcode: 'readFile',
              text: 'read file [PATH] as type [MODE]',
              arguments: {
                PATH: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'C:\\Hello\\world.txt'
                },
                MODE: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'text',
                  menu: 'modes'
                }
              }
            },
            {
              blockType: Scratch.BlockType.COMMAND,
              opcode: 'removeFile',
              text: 'delete file [PATH]',
              arguments: {
                PATH: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'C:\\Hello\\world.txt'
                }
              }
            },
            {
              blockType: Scratch.BlockType.REPORTER,
              opcode: 'getAttribute',
              text: 'get attribute [NAME] from file [PATH]',
              arguments: {
                PATH: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'C:\\Hello\\world.txt'
                },
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'file size',
                  menu: 'file_attributes'
                }
              }
            },
            {
              blockType: Scratch.BlockType.LABEL,
              text: 'Path Utils'
            },
            {
              blockType: Scratch.BlockType.BOOLEAN,
              opcode: 'pathExists',
              text: 'file / folder [PATH] exists?',
              arguments: {
                PATH: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'C:\\Hello\\world.txt'
                }
              }
            },
            {
              blockType: Scratch.BlockType.COMMAND,
              opcode: 'setDelim',
              text: 'set delimiter to [DELIM]',
              arguments: {
                DELIM: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: ';'
                }
              }
            },
            {
              blockType: Scratch.BlockType.COMMAND,
              opcode: 'setSeparator',
              text: 'set separator to [SEP]',
              arguments: {
                SEP: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: '\\'
                }
              }
            },
            {
              blockType: Scratch.BlockType.REPORTER,
              opcode: 'joinPath',
              text: 'join paths [PATH] [PATH2]',
              arguments: {
                PATH: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'C:\\Hello'
                },
                PATH2: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'world.txt'
                }
              }
            },
            {
              blockType: Scratch.BlockType.REPORTER,
              opcode: 'makeLong',
              text: 'convert path [PATH] to long/namespaced',
              arguments: {
                PATH: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'C:\\Hello\\world.txt'
                }
              }
            },
            {
              blockType: Scratch.BlockType.REPORTER,
              opcode: 'normalize',
              text: 'normalize path [PATH]',
              arguments: {
                PATH: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'C:\\Hello\\world.txt'
                }
              }
            },
            {
              blockType: Scratch.BlockType.REPORTER,
              opcode: 'relative',
              text: 'relative path from [PATH] to [PATH2]',
              arguments: {
                PATH: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'Hello'
                },
                PATH2: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'world.txt'
                }
              }
            },
            {
              blockType: Scratch.BlockType.REPORTER,
              opcode: 'getFilename',
              text: 'get filename from path [PATH]',
              arguments: {
                PATH: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'C:\\Hello\\world.txt'
                }
              }
            },
            {
              blockType: Scratch.BlockType.REPORTER,
              opcode: 'getExtName',
              text: 'get file extension from path [PATH]',
              arguments: {
                PATH: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'world.txt'
                }
              }
            },
            {
              blockType: Scratch.BlockType.REPORTER,
              opcode: 'getDirName',
              text: 'get directory name from path [PATH]',
              arguments: {
                PATH: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'C:\\Hello\\world.txt'
                }
              }
            },
            {
              blockType: Scratch.BlockType.BOOLEAN,
              opcode: 'isAbsolute',
              text: 'is path [PATH] absolute?',
              arguments: {
                PATH: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'C:\\Hello\\world.txt'
                }
              }
            },
          ], menus: {
            encodings: {acceptReporters: true, items: '_getEncodings'},
            modes: {acceptReporters: true, items: ['text', 'base64', 'dataURL']},
            file_attributes: {acceptReporters: true, items: [
              'file size', 'last access time', 'last access time (MS)',
              'creation time', 'creation time (MS)', 'inode change time',
              'inode change time (MS)'
            ]}
          }
        };
      }
      /* utility functions */
      _getEncodings(...args) {
        let json = ['utf8'];
        let argValues = Object.values(...args);
        if (argValues.length == 6) {
          return json.includes(argValues[5]);
        }
        return json;
      }
      _isFile(pathItem) {
        return !!pathAPI.extname(pathItem);
      }
      /* end utility's */
      can_use_api() {
        try { fs && 1 } catch { return false };
        try { fileSystemAPI && 1 } catch { return false };
        try { fileSystemPromiseAPI && 1 } catch { return false };
        try { pathAPI && 1 } catch { return false };
        try { shellAPI && 1 } catch { return false };
        try { CD && 1 } catch { return false };
        try { Buffer && 1 } catch { return false };
        return true;
      }
      /* path utils */
      setDelim({ DELIM }) {
        pathAPI.delimiter = Scratch.Cast.toString(DELIM);
      }
      setSeparator({ SEP }) {
        pathAPI.sep = Scratch.Cast.toString(SEP);
      }
      makeLong({ PATH }) {
        PATH = Scratch.Cast.toString(PATH);
        return pathAPI._makeLong(PATH);
      }
      normalize({ PATH }) {
        PATH = Scratch.Cast.toString(PATH);
        return pathAPI.normalize(PATH);
      }
      relative({ PATH, PATH2 }) {
        PATH = Scratch.Cast.toString(PATH);
        PATH2 = Scratch.Cast.toString(PATH2);
        return pathAPI.relative(PATH, PATH2);
      }
      getFilename({ PATH }) {
        PATH = Scratch.Cast.toString(PATH);
        return pathAPI.basename(PATH);
      }
      getDirName({ PATH }) {
        PATH = Scratch.Cast.toString(PATH);
        return pathAPI.dirname(PATH);
      }
      getExtName({ PATH }) {
        PATH = Scratch.Cast.toString(PATH);
        return pathAPI.extname(PATH);
      }
      isAbsolute({ PATH }) {
        PATH = Scratch.Cast.toString(PATH);
        return pathAPI.isAbsolute(PATH);
      }
      joinPath({ PATH, PATH2 }) {
        PATH = Scratch.Cast.toString(PATH);
        PATH2 = Scratch.Cast.toString(PATH2);
        return pathAPI.join(PATH, PATH2);
      }
      parsePath({ PATH }) {
        PATH = Scratch.Cast.toString(PATH);
        return JSON.stringify(pathAPI.parse(PATH));
      }
      pathExists({ PATH }) {
        PATH = Scratch.Cast.toString(PATH);
        if (fileSystemAPI.existsSync(PATH)) {
          return true;
        }
        return false;
      }
      /* end path utils */
      /* reading files */
      async readFile({ PATH, MODE }) {
        PATH = Scratch.Cast.toString(PATH);
        MODE = Scratch.Cast.toString(MODE);
        function ab2str(buf) {
          return String.fromCharCode.apply(null, new Uint16Array(buf));
        }
        
        function str2ab(str) {
          var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
          var bufView = new Uint16Array(buf);
          for (var i=0, strLen=str.length; i<strLen; i++) {
            bufView[i] = str.charCodeAt(i);
          }
          return buf;
        }
        function bytesArrToBase64(arr) {
          const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"; // base64 alphabet
          const bin = n => n.toString(2).padStart(8,0); // convert num to 8-bit binary string
          const l = arr.length
          let result = '';
        
          for(let i=0; i<=(l-1)/3; i++) {
            let c1 = i*3+1>=l; // case when "=" is on end
            let c2 = i*3+2>=l; // case when "=" is on end
            let chunk = bin(arr[3*i]) + bin(c1? 0:arr[3*i+1]) + bin(c2? 0:arr[3*i+2]);
            let r = chunk.match(/.{1,6}/g).map((x,j)=> j==3&&c2 ? '=' :(j==2&&c1 ? '=':abc[+('0b'+x)]));  
            result += r.join('');
          }
        
          return result;
        }
        let DATA = '';
        try {
          DATA = await fs.readFile(PATH);
        } catch(e) {
          console.error(e);
          return '';
        }
        const base64 = bytesArrToBase64(DATA);
        switch(MODE) {
          case 'base64':
            return base64;
          case 'dataURL':
            return `data:application/octet-stream;base64,${base64}`;
          default:
            DATA = Base64.decode(base64);
            return DATA;
        }
      }
      /* end reading files */
      /* writing files */
      isFile({ PATH }) {
        PATH = Scratch.Cast.toString(PATH);
        if (!fileSystemAPI.existsSync(PATH)) return false;
        return this._isFile(PATH);
      }
      createFile({ PATH }) {
        PATH = Scratch.Cast.toString(PATH);
        fileSystemAPI.appendFile(PATH, '', function (err) {
          if (err) console.error(err);
        }); 
      }
      removeFile({ PATH }) {
        PATH = Scratch.Cast.toString(PATH);
        fileSystemAPI.unlink(PATH, err => {
          if (err) console.error(err);
        });
      }
      async writeFile({ DATA, PATH, MODE }) {
        DATA = Scratch.Cast.toString(DATA);
        PATH = Scratch.Cast.toString(PATH);
        MODE = Scratch.Cast.toString(MODE);
        let isBuffer = false;
        switch(MODE) {
          case 'dataURL':
            DATA = DATA.substr(DATA.indexOf(','), Infinity);
          case 'base64':
            isBuffer = true;
            DATA = await Buffer(String(DATA), 'base64');
            break;
          default:
            break;
        }
        const writeArgs = [PATH, DATA, function(err) {
          if (err) console.error(err);
        }]
        if (isBuffer) writeArgs.splice(2, 0, 'binary');
        fs.writeFile(...writeArgs);
        if (isBuffer) {
          DATA.fill(0);
          DATA = undefined;
        }
      }
      /* end writing files */
      /* directory's */
      getCwd() {
        return CD();
      }
      isDirectory({ PATH }) {
        PATH = Scratch.Cast.toString(PATH);
        if (!fileSystemAPI.existsSync(PATH)) return false;
        return !this._isFile(PATH);
      }
      mkDir({ PATH }) {
        PATH = Scratch.Cast.toString(PATH);
        fs.access(PATH, (error) => {
          if (error) {
            fs.mkdir(PATH, { recursive: true }, (error) => {
              if (error) {
                console.log(error);
              }
            });
          }
        });
      }
      rmDir({ PATH, RECURSIVE }) {
        PATH = Scratch.Cast.toString(PATH);
        RECURSIVE = Scratch.Cast.toBoolean(RECURSIVE);
        fileSystemAPI.rmdir(PATH, { recursive: RECURSIVE }, err => {
          if (err) console.error(err);
        });
      }
      async listDir({ PATH }) {
        PATH = Scratch.Cast.toString(PATH);
        let files = await fileSystemAPI.readdirSync(PATH);
        return JSON.stringify(files);
      }
      /* end directory's */
      /* file attributes */
      getAttribute({ PATH, NAME }) {
        PATH = Scratch.Cast.toString(PATH);
        NAME = Scratch.Cast.toString(NAME);
        try {
          var stats = fileSystemAPI.statSync(PATH);
        } catch (err) {
          console.error(err);
        }
        switch(NAME) {
          case 'file size':
            return stats.size;
          case 'last access time':
            return stats.atime.toString();
          case 'last access time (MS)':
            return stats.atimeMs;
          case 'creation time':
            return stats.birthtime.toString();
          case 'creation time (MS)':
            return stats.birthtimeMs;
          case 'inode change time':
            return stats.ctime.toString();
          case 'inode change time (MS)':
            return stats.ctimeMs;
          default:
            return stats.size;
        }
      }
      /* end attributes section */
      /* misc */
      beep() {
        shellAPI.beep();
      }
      /* end misc section */
    }
    Scratch.extensions.register(new fileReaderExt());
  })(Scratch);