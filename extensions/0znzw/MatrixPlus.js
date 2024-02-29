/**!
 * MicroBit-Matrix+
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function(Scratch) {
    'use strict';


    if (!Scratch.extensions.unsandboxed) {
      throw new Error(`"MicroBit_Matrix+" extension must be ran unsandboxed.`);
    }

    class Extension {
      getInfo() {
        return {
          id: 'MatrixPlus0znzw',
          name: 'Microbit Matrix+',
          blocks: [
            {
              blockType: Scratch.BlockType.BOOLEAN,
              opcode: 'matrixValidator',
              text: 'is binary [MATRIX] a valid matrix?',
              arguments: {
                MATRIX: {defaultValue: '0101010101100010101000100', type: Scratch.ArgumentType.MATRIX},
              }
            },
            {
              blockType: Scratch.BlockType.REPORTER,
              opcode: 'matrixCoupler',
              text: '[A]',
              arguments: {
                A: {defaultValue: '0101010101100010101000100', type: Scratch.ArgumentType.MATRIX},
              }
            },
            {
              blockType: Scratch.BlockType.REPORTER,
              opcode: 'quadMatrixCoupler',
              text: ['[A] [B]', '[C] [D]'],
              arguments: {
                A: {defaultValue: '0101010101100010101000100', type: Scratch.ArgumentType.MATRIX},
                B: {defaultValue: '0101010101100010101000100', type: Scratch.ArgumentType.MATRIX},
                C: {defaultValue: '0101010101100010101000100', type: Scratch.ArgumentType.MATRIX},
                D: {defaultValue: '0101010101100010101000100', type: Scratch.ArgumentType.MATRIX}
              }
            },
            {
              blockType: Scratch.BlockType.REPORTER,
              opcode: 'getMicrobitMatrix',
              text: 'get matrix number [NUMBER] out of binary [MATRIX]',
              arguments: {
                NUMBER: {defaultValue: 1, type: Scratch.ArgumentType.NUMBER},
                MATRIX: {defaultValue: '0101010101100010101000100', type: Scratch.ArgumentType.STRING}
              }
            },
            {
              blockType: Scratch.BlockType.REPORTER,
              opcode: 'getDigitAt',
              text: 'get pixel at row [ROW] and collum [COLLUM] of matrix [MATRIX]',
              arguments: {
                ROW: {defaultValue: 3, type: Scratch.ArgumentType.NUMBER},
                COLLUM: {defaultValue: 5, type: Scratch.ArgumentType.NUMBER},
                MATRIX: {defaultValue: '0101010101100010101000100', type: Scratch.ArgumentType.MATRIX}
              }
            }
          ]
        };
      }
      //Matrix testing
      matrixValidator({ MATRIX }, util) {
        MATRIX = Scratch.Cast.toString(MATRIX);

        //Making sure the length is correct
        if (MATRIX.length < 25 || (MATRIX.length % 25) != 0) return false;

        //Making sure its binary
        if ((MATRIX.replace(/[01]/g, '') !== '')) return false;

        //All checks to invalidate the matrix failed which means its a matrix.
        return true;
      }
      //Couplers
      matrixCoupler({ A }, util) {
        return Scratch.Cast.toString(A);
      }
      quadMatrixCoupler({ A, B, C, D }, util) {
        return (`${Scratch.Cast.toString(A)}${Scratch.Cast.toString(B)}${Scratch.Cast.toString(C)}${Scratch.Cast.toString(D)}`);
      }
      //Matrix handling
      getMicrobitMatrix({ NUMBER, MATRIX }, util) {
        NUMBER = Math.round(Scratch.Cast.toNumber(NUMBER));
        MATRIX = Scratch.Cast.toString(MATRIX);
        return (MATRIX.slice((NUMBER-1)*25, ((NUMBER-1)*25)+25));
      }
      getDigitAt({ ROW, COLLUM, MATRIX }, util) {
        ROW = Math.round(Scratch.Cast.toNumber(ROW));
        COLLUM = Math.round(Scratch.Cast.toNumber(COLLUM));
        MATRIX = Scratch.Cast.toString(MATRIX);

        //Clamping
        ROW = (ROW < 1 ? 1 : (ROW > 5 ? 5 : ROW));
        COLLUM = (COLLUM < 1 ? 1 : (COLLUM > 5 ? 5 : COLLUM));

        //Math!
        return MATRIX.charAt(((ROW-1)*5)+(COLLUM-1));
      }
    }
    Scratch.extensions.register(new Extension());
  })(Scratch);
