/**!
 * Pen 2 Vector
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function (Scratch) {
    window.strokes = [];
    const pen = vm.runtime.ext_pen;
    pen.colorUtil = class {
      /**
       * @typedef {object} RGBObject - An object representing a color in RGB format.
       * @property {number} r - the red component, in the range [0, 255].
       * @property {number} g - the green component, in the range [0, 255].
       * @property {number} b - the blue component, in the range [0, 255].
       */
  
      /**
       * @typedef {object} HSVObject - An object representing a color in HSV format.
       * @property {number} h - hue, in the range [0-359).
       * @property {number} s - saturation, in the range [0,1].
       * @property {number} v - value, in the range [0,1].
       */
  
      /** @type {RGBObject} */
      static get RGB_BLACK() {
        return { r: 0, g: 0, b: 0 };
      }
  
      /** @type {RGBObject} */
      static get RGB_WHITE() {
        return { r: 255, g: 255, b: 255 };
      }
  
      /**
       * Convert a Scratch decimal color to a hex string, #RRGGBB.
       * @param {number} decimal RGB color as a decimal.
       * @return {string} RGB color as #RRGGBB hex string.
       */
      static decimalToHex(decimal) {
        if (decimal < 0) {
          decimal += 0xffffff + 1;
        }
        let hex = Number(decimal).toString(16);
        hex = `#${'000000'.substr(0, 6 - hex.length)}${hex}`;
        return hex;
      }
  
      /**
       * Convert a Scratch decimal color to an RGB color object.
       * @param {number} decimal RGB color as decimal.
       * @return {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
       */
      static decimalToRgb(decimal) {
        const a = (decimal >> 24) & 0xff;
        const r = (decimal >> 16) & 0xff;
        const g = (decimal >> 8) & 0xff;
        const b = decimal & 0xff;
        return { r: r, g: g, b: b, a: a > 0 ? a : 255 };
      }
  
      /**
       * Convert a hex color (e.g., F00, #03F, #0033FF) to an RGB color object.
       * @param {!string} hex Hex representation of the color.
       * @return {RGBObject} null on failure, or rgb: {r: red [0,255], g: green [0,255], b: blue [0,255]}.
       */
      static hexToRgb(hex) {
        if (hex.startsWith('#')) {
          hex = hex.substring(1);
        }
        const parsed = parseInt(hex, 16);
        if (isNaN(parsed)) {
          return null;
        }
        if (hex.length === 6) {
          return {
            r: (parsed >> 16) & 0xff,
            g: (parsed >> 8) & 0xff,
            b: parsed & 0xff,
          };
        } else if (hex.length === 3) {
          const r = (parsed >> 8) & 0xf;
          const g = (parsed >> 4) & 0xf;
          const b = parsed & 0xf;
          return {
            r: (r << 4) | r,
            g: (g << 4) | g,
            b: (b << 4) | b,
          };
        }
        return null;
      }
  
      /**
       * Convert an RGB color object to a hex color.
       * @param {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
       * @return {!string} Hex representation of the color.
       */
      static rgbToHex(rgb) {
        return Color.decimalToHex(Color.rgbToDecimal(rgb));
      }
  
      /**
       * Convert an RGB color object to a Scratch decimal color.
       * @param {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
       * @return {!number} Number representing the color.
       */
      static rgbToDecimal(rgb) {
        return (rgb.r << 16) + (rgb.g << 8) + rgb.b;
      }
  
      /**
       * Convert a hex color (e.g., F00, #03F, #0033FF) to a decimal color number.
       * @param {!string} hex Hex representation of the color.
       * @return {!number} Number representing the color.
       */
      static hexToDecimal(hex) {
        return Color.rgbToDecimal(Color.hexToRgb(hex));
      }
  
      /**
       * Convert an HSV color to RGB format.
       * @param {HSVObject} hsv - {h: hue [0,360), s: saturation [0,1], v: value [0,1]}
       * @return {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
       */
      static hsvToRgb(hsv) {
        let h = hsv.h % 360;
        if (h < 0) h += 360;
        const s = Math.max(0, Math.min(hsv.s, 1));
        const v = Math.max(0, Math.min(hsv.v, 1));
  
        const i = Math.floor(h / 60);
        const f = h / 60 - i;
        const p = v * (1 - s);
        const q = v * (1 - s * f);
        const t = v * (1 - s * (1 - f));
  
        let r;
        let g;
        let b;
  
        switch (i) {
          default:
          case 0:
            r = v;
            g = t;
            b = p;
            break;
          case 1:
            r = q;
            g = v;
            b = p;
            break;
          case 2:
            r = p;
            g = v;
            b = t;
            break;
          case 3:
            r = p;
            g = q;
            b = v;
            break;
          case 4:
            r = t;
            g = p;
            b = v;
            break;
          case 5:
            r = v;
            g = p;
            b = q;
            break;
        }
  
        return {
          r: Math.floor(r * 255),
          g: Math.floor(g * 255),
          b: Math.floor(b * 255),
        };
      }
  
      /**
       * Convert an RGB color to HSV format.
       * @param {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
       * @return {HSVObject} hsv - {h: hue [0,360), s: saturation [0,1], v: value [0,1]}
       */
      static rgbToHsv(rgb) {
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;
        const x = Math.min(Math.min(r, g), b);
        const v = Math.max(Math.max(r, g), b);
  
        // For grays, hue will be arbitrarily reported as zero. Otherwise, calculate
        let h = 0;
        let s = 0;
        if (x !== v) {
          const f = r === x ? g - b : g === x ? b - r : r - g;
          const i = r === x ? 3 : g === x ? 5 : 1;
          h = ((i - f / (v - x)) * 60) % 360;
          s = (v - x) / v;
        }
  
        return { h: h, s: s, v: v };
      }
  
      /**
       * Linear interpolation between rgb0 and rgb1.
       * @param {RGBObject} rgb0 - the color corresponding to fraction1 <= 0.
       * @param {RGBObject} rgb1 - the color corresponding to fraction1 >= 1.
       * @param {number} fraction1 - the interpolation parameter. If this is 0.5, for example, mix the two colors equally.
       * @return {RGBObject} the interpolated color.
       */
      static mixRgb(rgb0, rgb1, fraction1) {
        if (fraction1 <= 0) return rgb0;
        if (fraction1 >= 1) return rgb1;
        const fraction0 = 1 - fraction1;
        return {
          r: fraction0 * rgb0.r + fraction1 * rgb1.r,
          g: fraction0 * rgb0.g + fraction1 * rgb1.g,
          b: fraction0 * rgb0.b + fraction1 * rgb1.b,
        };
      }
    };
    pen.colorUtil = new pen.colorUtil().__proto__.constructor;
    pen.target = vm.runtime.targets[1];
    pen.state = function () {
      if (Object.hasOwn(pen.target._customState, 'Scratch.pen'))
        return pen.target._customState['Scratch.pen'];
      return undefined;
    };
    pen._state = pen.state;
    pen.setupState = function (target) {
      pen.target = target;
      pen.state = function () {
        const _state_ = pen._state();
        if (!_state_) return undefined;
        _state_.toHex = function () {
          const Color = pen.colorUtil;
          const _state = pen.state();
          if (!_state) return '#000000';
          const HSV = {
            h: _state.color * 3.6,
            s: _state.saturation,
            v: _state.brightness,
          };
          const RGB = Color.hsvToRgb(HSV);
          return Color.decimalToHex(Color.rgbToDecimal(RGB));
        };
        return _state_;
      };
    };
    const _otm = pen._onTargetMoved;
    const pd = pen._penDown.bind(pen);
    const c = pen.clear.bind(pen);
    pen._onTargetMoved = function (target, oldX, oldY, isForced) {
      if (!isForced) {
        const _state = pen.state();
        window.strokes.push(
          `<line x1="${oldX + vm.runtime.stageWidth/2}" y1="${oldY + vm.runtime.stageHeight/2}" x2="${target.x + vm.runtime.stageWidth/2}" y2="${
            target.y + vm.runtime.stageHeight/2
          }" stroke="${_state.toHex()}" stroke-width="${
            _state.penAttributes.diameter
          }" stroke-linecap="round" />`,
        );
      }
      return _otm(target, oldX, oldY, isForced);
    };
    pen._penDown = function (target) {
      const down = pd(target);
      const _state = pen.state();
      window.strokes.push(
        `<circle cx="${target.x + vm.runtime.stageWidth/2}" cy="${target.y + vm.runtime.stageHeight/2}" r="${
          _state.penAttributes.diameter
        }" stroke="${_state.toHex()}" />`,
      );
      return down;
    };
    pen.getVector = function () {
      return `<svg width="480" height="360" xmlns="http://www.w3.org/2000/svg" version="1.1">
    ${window.strokes.join('')}
  </svg>`;
    };
    pen.clear = function () {
      c();
      const vector = pen.getVector();
      console.log(vector);
      window.strokes = [];
    };
    pen.setupState();
    class extension {
      getInfo() {
        return {
          id: '0znzwPen2Vector',
          name: 'Pen 2 Vector',
          blocks: [
            {
              opcode: 'init',
              text: 'setup pen state here',
            },
            { opcode: 'vector', blockType: 'reporter', text: 'pen SVG' },
          ],
        };
      }
      init() {
        pen.setupState(vm.runtime.getEditingTarget());
      }
      vector() {
        return pen.getVector();
      }
    }
    Scratch.extensions.register(new extension());
  })(Scratch);
  