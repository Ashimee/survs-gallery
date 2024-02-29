/**!
 * Button In Block+
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function(Scratch){
    const vm = Scratch.vm;
    const runtime = vm.runtime;
    const bcfi = runtime._buildCustomFieldInfo.bind(runtime);
    const bcftfsb = runtime._buildCustomFieldTypeForScratchBlocks.bind(runtime);
    let fi = null;
    runtime._buildCustomFieldInfo = function(fieldName, fieldInfo, extensionId, categoryInfo) {
      fi = fieldInfo;
      return bcfi(fieldName, fieldInfo, extensionId, categoryInfo);
    }
    runtime._buildCustomFieldTypeForScratchBlocks = function(fieldName, output, outputShape, categoryInfo) {
      let res = bcftfsb(fieldName, output, outputShape, categoryInfo);
      if (fi) {
        if (fi.color1) res.json.colour = fi.color1;
        if (fi.color2) res.json.colourSecondary = fi.color2;
        if (fi.color3) res.json.colourTertiary = fi.color3;
        fi = null;
      }
      return res;
    }
    // https://github.com/LLK/scratch-vm/blob/f405e59d01a8f9c0e3e986fb5276667a8a3c7d40/test/unit/extension_conversion.js#L85-L124
    // https://github.com/LLK/scratch-vm/commit/ceaa3c7857b79459ccd1b14d548528e4511209e7
    vm.addListener('EXTENSION_FIELD_ADDED', fieldInfo => {
       ScratchBlocks.Field.register(fieldInfo.name, fieldInfo.implementation);
    });
    class MyField extends ScratchBlocks.Field {
      constructor(opt_value, argtype) {
        super(opt_value);
        this.addArgType(argtype);
        setTimeout(() => this.setup(), 25);
      }
      amend() {
        if (this.ranSetup) return;
        this.target = vm.editingTarget;
        const source = this.sourceBlock_;
        this.blocks = (source.isInFlyout ? runtime.flyoutBlocks : this.target.blocks);
        const workspaceBlock = source.parentBlock_;
        const fieldBlock = this.blocks.getBlock(source.id);
        const spriteBlock = this.blocks.getBlock(workspaceBlock.id);
        const extensionId = source.type.substr(0, source.type.indexOf('_'));
        const blockOpcode = spriteBlock.opcode.substr(spriteBlock.opcode.indexOf('_') + 1, Infinity);
        const class_ = runtime.getOpcodeFunction(extensionId+'__Int__thisPass')();
        const gotInfo = class_.getInfo();
        const currentBlock = gotInfo.blocks.filter(block => block.opcode === blockOpcode)[0];
        this.extension = {
          class_, id: extensionId, blockOpcode, currentBlock, gotInfo
        }
        this.parent = {
          source, workspaceBlock, spriteBlock, fieldBlock
        }
      }
      getCurrentArgument() {
        const parent = this.parent.spriteBlock, field = this.parent.fieldBlock, currentBlock = this.extension.currentBlock;
        const name = Object.values(parent.inputs).filter(argument => argument.shadow === field.id)[0].name;
        const argument = currentBlock.arguments[name];
        argument.name = name;
        return argument;
      }
      fixColors() {
        const source = this.parent.source;
        const defaultColors = {color1: source.colour_, color2: source.colourSecondary_, color3: source.colourTertiary_};
        const path = source.svgPath_, argumentSvg = path.parentNode, textNode = argumentSvg.querySelector('g.blocklyEditableText text');
        const argument = this.argument;
        const color1 = argument.color1 ?? defaultColors.color1, color2 = argument.color2 ?? defaultColors.color2,
              color3 = argument.color3 ?? defaultColors.color3, textColor = argument.textColor ?? color2;
        source.colour_ = color1;
        source.colourSecondary_ = color2;
        source.colourTertiary_ = color3;
        path.style.fill = color1;
        path.style.stroke = color3;
        textNode.style.fill = textColor;
      }
      setup() {
        this.ranSetup = false;
        this.amend();
        this.argument = this.getCurrentArgument();
        this.fixColors();
        this.ranSetup = true;
      }
    }
    ScratchBlocks.CustomizedField = MyField;
    class FieldButton extends MyField {
      constructor(opt_value) {
        super(opt_value, 'button');
      }
      showEditor_() {
        const fallFn = (()=>{});
        let func = (this.argument.func ?? fallFn);
        if (typeof func === 'string') func = (this.extension.class_[func] ?? fallFn);
        if (typeof func !== 'function') {
          console.warn('Recived invalid function.');
        }
        func(this);
      }
    }
    class ext {
      getInfo() {return{
        id: '0znzwBtnInBlock',
        name: 'Dynamic Join',
        blocks: [
          {
            // required boilerplate
            hideFromPalette: true,
            opcode: '_Int__thisPass',
            blockType: Scratch.BlockType.COMMAND,
            text: '_Int__thisPass',
          },
          {
            opcode: 'block',
            blockType: Scratch.BlockType.REPORTER,
            text: '[B1] [B2] [B3]',
            arguments: {
              B1: {
                type: 'button',
                defaultValue: 'class button',
                color1: '#FF0000',
                textColor: '#FFFFFF',
                func: 'InClass'
              },
              B2: {
                type: 'button',
                defaultValue: 'argument button',
                color1: '#00FF00',
                textColor: '#FFFFFF',
                func: (FieldThis) => {
                  alert('Im in the argument');
                }
              },
              B3: {
                type: 'button',
                defaultValue: 'colorsssss',
                color1: '#41FFA2',
                color2: '#ABF91A',
                color3: '#4412AC',
                textColor: '#FF00FF'
              },
            },
          }
        ],
        customFieldTypes: {
          button: {
            output: 'String',
            outputShape: 3,
            implementation: {
              fromJson: () => new FieldButton()
            }
          }
        }
      }}
      _Int__thisPass() {
        return this;
      }
      InClass(FieldThis) {
        alert('This function is in the class');
      }
      block(args) {
      }
    }
    Scratch.extensions.register(new ext());
  })(Scratch);