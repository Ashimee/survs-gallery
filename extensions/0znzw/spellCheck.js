/**!
 * Spellcheck
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function(Scratch) {
    'use strict';

    // @ts-expect-error
    let spell = /*https://www.npmjs.com/package/spell*/(function(){var e={},r=e.spell,o=function(e){var r=e&&"function"==typeof e.get?e.get():{},o=function(){},t="abcdefghijklmnopqrstuvwxyz".split("");function n(o){e&&"function"==typeof e.store&&e.store(r,o)}function s(e,r){var o,n,s=[],f=r||t;for(o=0;o<e.length;o++)s.push(e.slice(0,o)+e.slice(o+1));for(o=0;o<e.length-1;o++)s.push(e.slice(0,o)+e.slice(o+1,o+2)+e.slice(o,o+1)+e.slice(o+2));for(o=0;o<e.length;o++)for(n in f)s.push(e.slice(0,o)+f[n]+e.slice(o+1));for(o=0;o<=e.length;o++)for(n in f)s.push(e.slice(0,o)+f[n]+e.slice(o));return s}function f(e){for(var r in e)if(e.hasOwnProperty(r))return!1;return!0}function c(e,r,o){var t,n,s,f=[];for(n=o;n>=r;n--)if(e.hasOwnProperty(n))for(s in t=e[n])t.hasOwnProperty(s)&&f.push({word:s,score:n});return f}function i(e,t){if("object"==typeof e&&(t=e),"string"==typeof e&&("object"==typeof t?t.corpus=e:t={corpus:e}),"string"==typeof t&&(t={corpus:t}),(t="object"==typeof t?t:{}).reset=!1!==t.reset,t.store=!1!==t.store,t.after_store=t.after_store||o,t.corpus=t.corpus||"",t.reset&&(r={}),"object"==typeof t.corpus)for(var s in t.corpus)p(s,{score:t.corpus[s]});else!function(e,r){var o;for(r=r||/[a-z]+/g,e=e.toLowerCase();o=r.exec(e);)p(o[0],1)}(t.corpus);t.store&&n(t.after_store)}function p(e,t){"string"!=typeof t&&"number"!=typeof t||(t={score:parseInt(t,10)}),(t="object"==typeof t?t:{}).score=t.score||1,t.store=t.store||!0,t.done=t.done||o,e=e.toLowerCase(),r[e]=r.hasOwnProperty(e)?r[e]+t.score:t.score,t.store&&n(t.done)}function u(e,t){(t="object"==typeof t?t:{}).store=!1!==t.store,t.done=t.done||o,r.hasOwnProperty(e)&&delete r[e],t.store&&n(t.done)}function a(e,o){if(r.hasOwnProperty(e))return[{word:e,score:r[e]}];var t,n,i,p=s(e,o),u={};function a(e){r.hasOwnProperty(e)&&(i=r[e],u.hasOwnProperty(i)||(u[i]={}),u[i][e]=!0,n=n?n<i?i:n:i,t=t?t>i?i:t:i)}return p.forEach(a),f(u)?(p.forEach((function(e){s(e,o).forEach(a)})),f(u)?[]:c(u,t,n)):c(u,t,n)}function l(e){return{corpus:r}}return{reset:function(){return i({reset:!0})},load:i,export:l,save:l,add_word:p,addWord:p,remove_word:u,removeWord:u,suggest:a,lucky:function(e,r){var o=a(e,r)[0];if(o&&o.hasOwnProperty("word"))return o.word}}};if(o._previous=r,"undefined"!=typeof exports)o.platform={name:"node.js",version:process.version},o.version=JSON.parse(require("fs").readFileSync(__dirname+"/package.json")).version,o.path=__dirname,"undefined"!=typeof module&&module.exports&&(exports=module.exports=o),exports.spell=o;else{if(o.platform={name:"browser"},o.version="0.0.3","function"!=typeof define||!define.amd)return e.spell=o,e;define("spell",(function(){return o}))}})().spell();

    class spellcheck {
      getInfo() {
        return {
          id: '0znzwSpellcheck',
          name: 'Spellcheck',
          blocks: [
            {
                opcode: 'reset',
                blockType: Scratch.BlockType.COMMAND,
                text: 'reset dictionary'
            },
            {
                opcode: 'export',
                blockType: Scratch.BlockType.REPORTER,
                text: 'export dictionary',
            },
            {
              opcode: 'load',
              blockType: Scratch.BlockType.COMMAND,
              text: 'load text/dictionary [text] reset: [reset]',
              arguments: {
                text: { type: Scratch.ArgumentType.STRING, defaultValue: 'foo bar' },
                reset: { type: Scratch.ArgumentType.BOOLEAN },
              }
            },
            {
                opcode: 'add',
                blockType: Scratch.BlockType.COMMAND,
                text: 'add word [text] score: [score]',
                arguments: {
                  text: { type: Scratch.ArgumentType.STRING, defaultValue: 'foo' },
                  score: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
                }
            },
            {
                opcode: 'remove',
                blockType: Scratch.BlockType.COMMAND,
                text: 'remove word [text]',
                arguments: {
                  text: { type: Scratch.ArgumentType.STRING, defaultValue: 'foo' },
                }
            },
            {
                opcode: 'suggest',
                blockType: Scratch.BlockType.REPORTER,
                text: 'suggestions for [text] with alphabet [alph]',
                arguments: {
                  text: { type: Scratch.ArgumentType.STRING, defaultValue: 'bam' },
                  alph: { type: Scratch.ArgumentType.STRING, defaultValue: 'abcdefghijklmnopqrstuvwxyz' },
                }
            },
            {
                opcode: 'lucky',
                blockType: Scratch.BlockType.REPORTER,
                text: 'lucky [text]',
                arguments: {
                  text: { type: Scratch.ArgumentType.STRING, defaultValue: 'bam' },
                }
            },
          ]
        };
      }
      reset() { spell.reset() }
      export() { return JSON.stringify(spell.export()) }
      load({ text, reset }) { try { spell.load(JSON.parse(text), {reset}) } catch { spell.load(text, {reset}) } }
      remove({ text }) { spell.remove_word(text) }
      add({ text, score }) { spell.add_word(text, {score}) }
      lucky({ text }) { return spell.lucky(text) }
      suggest({ text, alph }) { return JSON.stringify(spell.suggest(text, alph.split(''))) }
    }
    Scratch.extensions.register(new spellcheck());
  })(Scratch);
