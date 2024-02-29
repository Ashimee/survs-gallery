/**!
 * Niche Toolbox
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 2.3
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
/**
 * Many thanks to:
 *   SharkPool for helping with bug test+fixing, and for color creating the icon.
 *   ObviousAlexC for the Scratch To Canvas Cords function.
 *   IonSlayer for the print block idea.
 *   DragoCuven for the export sprite as dataURL idea.
 *   Dominic for the run in project idea.
 *
 * Profiles:
 *   SharkPool:    https://www.youtube.com/@SharkPool_SP/
 *   ObviousAlexC: https://scratch.mit.edu/users/pinksheep2917/
 *   IonSlayer:    https://scratch.mit.edu/users/ionslayer/
 *   DragoCuven:   https://scratch.mit.edu/users/MARTINELPLAYZ/
 *   Dominic:      https://scratch.mit.edu/users/GamingWithDominic/
 */
(function (Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Niche-Toolbox" extension must be ran unsandboxed.`);
  }
  /* TYPES + CASTING */
  const BlockType = Scratch.BlockType;
  const ArgumentType = Scratch.ArgumentType;
  const Cast = Scratch.Cast;
  /* VM */
  const vm = Scratch.vm;
  const renderer = vm.renderer;
  const runtime = vm.runtime;
  /* Classes */
  const Runtime = runtime.constructor;
  /* Errors */
  function throwwww(err) {
    throw new Error(err);
  }
  // const canvas = (document.querySelector("canvas").getBoundingClientRect());
  const menuIconURI =
    'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyNjciIGhlaWdodD0iMjY3IiB2aWV3Qm94PSIwLDAsMjY3LDI2NyI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEwNi41LC00Ni41KSI+PGcgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aXNQYWludGluZ0xheWVyJnF1b3Q7OnRydWV9IiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0xMDYuNSwxODBjMCwtNzMuNzMwMDEgNTkuNzY5OTksLTEzMy41IDEzMy41LC0xMzMuNWM3My43MzAwMSwwIDEzMy41LDU5Ljc2OTk5IDEzMy41LDEzMy41YzAsNzMuNzMwMDEgLTU5Ljc2OTk5LDEzMy41IC0xMzMuNSwxMzMuNWMtNzMuNzMwMDEsMCAtMTMzLjUsLTU5Ljc2OTk5IC0xMzMuNSwtMTMzLjV6IiBmaWxsPSIjZWQ2MzAwIiBzdHJva2Utd2lkdGg9IjAiLz48cGF0aCBkPSJNMjUzLjk3MTczLDEwMS4yMTI4NWMwLjQ5OTE0LDAuMDY1MTggMS4zMDU0NiwwLjE5NTUyIDEuNzkxODEsMC4yNzM3M2M3LjEyODgzLDEuMTA3OTYgMTMuNDEyOTUsMy45NDk1NyAxOS4wNDQzNSw4LjY0MjEyYzEuODU1OCwxLjUyNTA4IDMuMzUzMjQsMy4wNjMyIDE2LjgwNDU5LDE3LjA4ODczYzYuNjgwODcsNi45NzM2NiA3LjgxOTk2LDguMjkwMTggOS44OTMzMywxMS40MDU1MmMxLjQzMzQ1LDIuMTUwNzYgMi4wNDc3OCwzLjMxMDg2IDMuNDU1NjMsNi41MDQ0MWMwLjY3ODMzLDEuNTUxMTUgMS41NDg2NCwzLjM0OTk2IDEuOTE5OCwzLjk4ODY3YzAuNzAzOTMsMS4xODYxOCAyLjQwNjE0LDMuNTU4NTIgMy4zMDIwNSw0LjYxNDM1bDAuNDk5MTQsMC41NzM1M2wwLjY5MTEzLC0wLjM2NDk4YzEuMDExMDksLTAuNTIxMzkgMS44MzAyLC0wLjcxNjkzIDMuMDg0NDYsLTAuNzE2OTNjMS45OTY1OCwwIDMuNjk4OCwwLjc4MjEgNS4yMjE4NCwyLjQxMTQ2YzEuMzgyMjUsMS40ODU5NyAyLjAzNDk4LDIuOTE5ODEgMi4xNTAxNyw0Ljc1NzczYzAuMDg5NTksMS4zNDI1OSAtMC4wODk1OSwyLjMwNzE3IC0wLjYyNzEzLDMuNDE1MTRjLTAuMzQ1NTcsMC43MTY5MiAtMS4xNjQ2NywxLjYwMzMgLTYuNDI0OSw2Ljk4NjY5Yy0zLjMxNDg0LDMuMzg5MDYgLTYuMjk2OTMsNi4zNzQwNSAtNi42Mjk2OSw2LjYyMTcxYy0xLjg2ODU5LDEuNDA3NzYgLTQuNDUzOTIsMS42MDMyOSAtNi43MzIwNywwLjUwODM2Yy0yLjcwMDUxLC0xLjMwMzQ4IC00LjM4OTkzLC0zLjc0MTAxIC00LjU5NDcsLTYuNjQ3NzljLTAuMTQwNzgsLTIuMDU5NTEgMC40NzM1NSwtMy41NDU0OSAyLjIxNDE3LC01LjM5NjQ0bDEuMTc3NDcsLTEuMjI1MjhsLTEuODE3NCwtMi4yOTQxNGMtNC4xMjExNSwtNS4yNDAwMiAtNi4yNDU3MywtNi44NDMzMSAtOS4yOTE4LC03LjAxMjc3Yy0wLjc0MjMyLC0wLjA1MjE0IC0xLjM5NTA0LDAgLTIuMDQ3NzgsMC4xNDMzOWMtMy41MzI0MiwwLjc5NTEyIC01LjkwMDE2LDAuNTczNTMgLTguMTc4MzIsLTAuNzE2OTNjLTAuODA2MzEsLTAuNDY5MjYgLTEuODQzLC0xLjE4NjE3IC0yLjMxNjU1LC0xLjYyOTM2bC0wLjMzMjc3LC0wLjI5OThsLTEzLjQxMjk1LDEzLjY2MDU1Yy03LjkwOTU1LDguMDU1NTUgLTEzLjM4NzM2LDEzLjcyNTcyIC0xMy4zMzYxNywxMy44MTY5N2MwLjA1MTE5LDAuMDc4MjEgMS4zOTUwNSwxLjM4MTcgMi45OTQ4OCwyLjkwNjc3YzEuNTk5ODMsMS41MjUwOCAzLjE2MTI2LDMuMDM3MTMgMy40ODEyMywzLjM2M2MwLjMxOTk3LDAuMzI1ODcgMi4wOTg5NywyLjA1OTUxIDMuOTY3NTcsMy44NDUyOWMxLjg2ODU5LDEuNzk4ODEgMy45OTMxNywzLjg0NTI5IDQuNzM1NDksNC41NjIyMWMwLjc0MjMyLDAuNzE2OTIgMi44NDEyOSwyLjczNzMzIDQuNjcxNSw0LjQ5NzA0YzEuODMwMiwxLjc1OTcxIDMuOTI5MTcsMy43ODAxMSA0LjY3MTQ5LDQuNDk3MDNjMC43NDIzMiwwLjcxNjkyIDIuODQxMjksMi43MzczMyA0LjY3MTUsNC40OTcwNGMxLjgzMDIsMS43NTk3MSAzLjkyOTE4LDMuNzgwMTEgNC42NzE1LDQuNDk3MDNjMC43NDIzMiwwLjcxNjkyIDIuODY2ODksMi43NzY0NCA0LjczNTQ5LDQuNTYyMjFjMS44Njg1OSwxLjc4NTc4IDMuOTY3NTcsMy44MDYxOCA0LjY3MTUsNC40OTcwM2MwLjcwMzkzLDAuNjkwODUgMS44MDQ2MSwxLjc0NjY3IDIuNDMxNzQsMi4zNDYyOGM3LjMyMDgxLDcuMDI1OCAxMi43MjE4MiwxMi4yNzg4NSAxMy40NTEzNCwxMy4wODcwMWMyLjQ1NzMzLDIuNjk4MjEgMy41NDUyMiw2LjQxMzE2IDIuOTQzNjksOS45MzI1N2MtMC44NzAzLDUuMDMxNDYgLTQuNDc5NTIsOS4zODUxMSAtOS4wOTk4MiwxMC45NzUzN2MtMS41NDg2NCwwLjUyMTM5IC0yLjA0Nzc4LDAuNjEyNjMgLTMuNzc1NTksMC42MTI2M2MtMi4wMDkzOCwwIC0yLjkwNTI4LC0wLjE2OTQ1IC00LjU4MTksLTAuODYwM2MtMS44NDMsLTAuNzU2MDIgLTMuMjM4MDUsLTEuNzMzNjQgLTUuMDA0MjYsLTMuNDgwMzFjLTAuNTYzMTQsLTAuNTQ3NDcgLTQuMTQ2NzUsLTQuNDA1NzggLTcuOTczNTQsLTguNTYzOTFjLTMuODEzOTgsLTQuMTU4MTMgLTcuODcxMTUsLTguNTUwODggLTguOTk3NDMsLTkuNzc2MTVjLTMuMzc4ODMsLTMuNjQ5NzcgLTE3LjU3MjUsLTE5LjA0Mzk1IC0yMC45ODk3MywtMjIuNzQ1ODZjLTEuNzUzNDEsLTEuOTAzMDkgLTQuMDQ0MzYsLTQuMzkyNzUgLTUuMTA2NjUsLTUuNTM5ODJjLTEuMDYyMjksLTEuMTQ3MDcgLTMuMTg2ODUsLTMuNDU0MjUgLTQuNzIyNjksLTUuMTIyNzFjLTEuNTM1ODQsLTEuNjU1NDMgLTIuODQxMjksLTMuMDI0MSAtMi45MDUyOCwtMy4wMjQxYy0wLjA1MTE5LDAgLTAuMzQ1NTcsMC4yNzM3NCAtMC42NTI3MywwLjYxMjY0Yy0wLjUzNzU1LDAuNjEyNjQgLTMuMTk5NjYsMy40NjcyOCAtMTAuOTk0MDEsMTEuODM1NjdjLTIuMDczMzcsMi4yMjg5NiAtNS4yNzMwMyw1LjY1NzE0IC03LjExNjAzLDcuNjI1NGMtMjYuNzQ5MTEsMjguNzE1ODMgLTMyLjEzNzMzLDM0LjQ3NzI1IC0zMi42NDkyNywzNC45NDY1Yy0xLjI2NzA3LDEuMTYwMSAtMi42NjIxMiwxLjcwNzU3IC00LjM4OTkzLDEuNzA3NTdjLTEuMzY5NDUsMC4wMTMwNCAtMi4wMjIxOCwtMC4xMTczMSAtMy40ODEyMiwtMC42OTA4NWMtMi4wNjA1OCwtMC44MDgxNyAtMi43MjYxMSwtMS4zOTQ3MyAtOS40NTgxOCwtOC4yOTAxOGMtNi44MzQ0NywtNi45ODY2OSAtNy4yNDQwMiwtNy40ODIwMiAtNy45MDk1NSwtOS41NDE1M2MtMC41ODg3NCwtMS44MjQ4OCAtMC4yMDQ3OCwtMy43MTQ5NCAxLjEyNjI4LC01LjUxMzc1YzAuMjU1OTcsLTAuMzUxOTQgMi45NDM2OSwtMy4wNjMyMSA1Ljk2NDE2LC02LjAwOTA4YzMuMDMzMjcsLTIuOTU4OTIgNi4zMzUzMiwtNi4xOTE1NyA3LjM1OTIxLC03LjE5NTI1YzEuOTcwOTksLTEuOTQyMiA1LjMxMTQzLC01LjIwMDkxIDEyLjY3MDYzLC0xMi4zODMxM2MyLjQ5NTczLC0yLjQzNzUyIDUuMzQ5ODMsLTUuMjI2OTggNi4zMzUzMiwtNi4xOTE1N2MwLjk4NTQ5LC0wLjk2NDU4IDMuODEzOTksLTMuNzI3OTcgNi4yNzEzMiwtNi4xMjY0YzIuNDcwMTMsLTIuMzk4NDIgNS4yODU4MywtNS4xNjE4MiA2LjI3MTMyLC02LjEyNjM5YzAuOTg1NDksLTAuOTc3NjIgMy43NjI3OSwtMy42ODg4NyA2LjE4MTczLC02LjA0ODE4YzIuNDA2MTQsLTIuMzU5MzEgNC4zNzcxMywtNC4zMjc1OCA0LjM3NzEzLC00LjM5Mjc1YzAsLTAuMTE3MzIgLTEuMTc3NDgsLTEuNDA3NzYgLTguOTU5MDMsLTkuODI4MjljLTEuNTIzMDQsLTEuNjU1NDMgLTMuNTA2ODIsLTMuODA2MTggLTQuNDE1NTMsLTQuNzk2ODRjLTAuODk1OTEsLTAuOTc3NjIgLTEuNjYzODIsLTEuNzg1NzggLTEuNjg5NDIsLTEuNzg1NzhjLTAuMDI1NiwwIC0wLjQ2MDc0LDAuMDkxMjQgLTAuOTcyNjksMC4xODI0OWMtMC41MTE5NCwwLjEwNDI4IC0xLjg2ODYxLDAuMzc4MDIgLTMuMDMzMjgsMC41OTk2MWMtMS4xNjQ2OCwwLjIyMTU5IC0yLjM2Nzc0LDAuNDU2MjIgLTIuNjg3NzEsMC41MjEzOWMtMC4zMTk5NywwLjA2NTE4IC0xLjUyMzA0LDAuMjk5OCAtMi42ODc3MSwwLjUyMTM5Yy0xLjE2NDY4LDAuMjIxNTkgLTIuMzY3NzQsMC40NTYyMiAtMi42ODc3MSwwLjUyMTRjLTAuMzE5OTcsMC4wNjUxOCAtMS41MjMwNCwwLjI5OTggLTIuNjg3NzEsMC41MjEzOWMtMS4xNjQ2OCwwLjIyMTU5IC0yLjUwODUzLDAuNDgyMjkgLTMuMDA3NjcsMC41ODY1N2MtNC4zMTMxNCwwLjg2MDMgLTYuNjI5NjksMS4yNTEzNSAtNi43MDY0OCwxLjE2MDFjLTAuMDUxMTksLTAuMDY1MTggLTIuMTM3MzYsLTMuMTE1MzQgLTQuNjIwMywtNi43NjUxYy0yLjQ5NTczLC0zLjY2MjggLTYuMTY4OTMsLTguOTk0MDYgLTguMTY1NTEsLTExLjg2MTczYy0yLjAwOTM4LC0yLjg2NzY3IC00LjYwNzUsLTYuNTgyNjIgLTUuNzcyMTgsLTguMjY0MTFjLTEuMTY0NjgsLTEuNjY4NDYgLTIuMTExNzgsLTMuMTQxNDEgLTIuMDg2MTcsLTMuMjU4NzFjMC4wMjU2LC0wLjExNzMyIDEuODY4NiwtMi4wNzI1NSA0LjA5NTU2LC00LjM1MzY1bDQuMDU3MTYsLTQuMTMyMDZsOS4wMjMwMiw5LjE4OTU5bDkuMDIzMDMsOS4xODk1OWw2LjA5MjE0LC0xLjc3Mjc0bDYuMTA0OTQsLTEuNzcyNzRsMS4xMTM0OCwtNC4wMDE3MWMwLjYyNzEzLC0yLjE4OTg2IDEuMTc3NDgsLTQuMTg0MiAxLjI0MTQ3LC00LjQxODgzYzAuMTAyMzksLTAuNDA0MDkgMC4yMzAzOCwtMC44ODYzNyAwLjQ3MzU1LC0xLjc1OTcxYzAuMTc5MTgsLTAuNTg2NTcgMC4zOTY3NiwtMS4zODE3IDAuNTExOTQsLTEuODUwOTVjMC4xMDIzOSwtMC4zNzgwMSAtMC4xMDIzOSwtMC42MTI2MyAtOC44OTUwNCwtOS41ODA2M2wtOS4wMTAyMywtOS4xODk1OWw0LjQ1MzkyLC00LjUzNjE0bDQuNDQxMTIsLTQuNTIzMWwxLjIxNTg3LDAuODIxMmMxLjU2MTQzLDEuMDY4ODYgMTguNTgzNiwxMi4zNTcwNiAyNC43NjUzMywxNi40MjM5NGMyLjYxMDkyLDEuNzA3NTcgNC43MjI2OSwzLjE4MDUxIDQuNzIyNjksMy4yNTg3MmMtMC4wMTI4LDAuMDkxMjUgLTAuMjA0NzgsMC45NTE1NCAtMC40MjIzNSwxLjkxNjEyYy0wLjY3ODMzLDMuMDM3MTMgLTEuNDQ2MjUsNi40MzkyMyAtMS41NDg2NCw2LjkwODQ5Yy0wLjA1MTE5LDAuMjQ3NjYgLTAuMzk2NzUsMS43OTg4MSAtMC43Njc5MSwzLjQ1NDI0Yy0wLjcyOTUyLDMuMjMyNjUgLTAuODA2MzEsMy42MTA2NiAtMC45OTgzLDQuNDk3MDNjLTAuMDYzOTksMC4zMjU4NyAtMC40MjIzNSwxLjkyOTE2IC0wLjc5MzUyLDMuNTg0NTljLTAuOTM0Myw0LjE5NzIzIC0wLjkyMTUsNC4xNDUwOSAtMC45NDcxLDQuNDMxODZjLTAuMDEyOCwwLjI3MzczIDAuNDQ3OTUsMC43NDI5OCA2LjI1ODUyLDYuMzIxOTFjMS44MzAyLDEuNzU5NzEgMy45MjkxOCwzLjc4MDExIDQuNjcxNSw0LjQ5NzAzYzEuMjAzMDcsMS4xNzMxMyA2Ljk2MjQ1LDYuNzEyOTYgOC44Njk0NCw4LjUyNDgxbDAuNzQyMzIsMC43MTY5MmwxMy41NzkzNCwtMTMuODMwMDFsMTMuNTc5MzQsLTEzLjgzbC0wLjI4MTU3LC0wLjQwNDA5Yy0wLjcwMzkzLC0xLjAwMzY5IC0xLjEyNjI4LC0yLjQzNzUyIC0xLjI0MTQ3LC00LjE4NDJjLTAuMTAyMzksLTEuNTY0MTggMC4wNjM5OSwtMi40NjM1OSAwLjcxNjczLC0zLjkxMDQ2YzAuOTg1NDksLTIuMTYzNzkgMS4yNTQyNywtMy43Mjc5OCAxLjAyMzg5LC01Ljg1MjY2Yy0wLjU3NTk0LC01LjA5NjYzIC00LjEwODM2LC0xMC4xMTUwNiAtMTAuMzkyNDgsLTE0LjcyOTQxYy0zLjM3ODgzLC0yLjQ3NjYzIC04LjEyNzEyLC00LjgzNTk0IC0xMi4xOTcwOCwtNi4wNjEyMmMtMy44OTQxMywtMS4xNjAyIC0wLjcwMzkzLC0zLjg3MTM2IDMuNzc1NTksLTQuMTcxMTZjMS4zNDM4NSwtMC4wOTEyNSA3Ljg3MTE1LDAuMDM5MSA4Ljc2NzA2LDAuMTgyNDl6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjoxMzMuNToxMzMuNS0tPg==';
  let CustomLayers = [];

  //@ts-expect-error
  /* eslint-disable */ (function () {
    var _0x319f41 = _0x39b7;
    function _0x39b7(t, r) {
      var a = _0x1014();
      return (_0x39b7 = function (t, r) {
        return a[(t -= 295)];
      })(t, r);
    }
    function _0x1014() {
      var _0x1a7a35 = [
        '5111996tLmxub',
        '1249FFuKyO',
        '1978IqbbSd',
        '6399coVOVY',
        'runtime',
        '36513147tcIYMv',
        '2770QcbBHr',
        '4226184ZCmoYg',
        '56AWrHSS',
        'getPrimitives',
        'ext_scratch3_motion',
        '1735195CoynVD',
        '12TuUzZH',
        'J05pY2hlLVRvb2xib3ggbXVzdCBiZSBydW4gdW5zYW5kYm94ZWRcbkFsc28gaWYgeW91IGFyZSBvbiBQTSBwbGVhc2UgdXNlIFRXLiBodHRwczovL3R1cmJvd2FycC5vcmcvZWRpdG9yJw==',
        '649306AxaDMi',
        eval(atob('J21vdGlvbl9tb3ZlYmFja3N0ZXBzJw==')),
      ];
      return (
        (_0x1014 = function () {
          return _0x1a7a35;
        }),
        _0x1014()
      );
    }
    !(function (t, r) {
      for (var a = _0x39b7, n = _0x1014(); ; )
        try {
          if (
            721474 ===
            (parseInt(a(300)) / 1) * (parseInt(a(301)) / 2) +
              -parseInt(a(306)) / 3 +
              -parseInt(a(299)) / 4 +
              (parseInt(a(310)) / 5) * (-parseInt(a(295)) / 6) +
              (parseInt(a(297)) / 7) * (-parseInt(a(307)) / 8) +
              (-parseInt(a(302)) / 9) * (-parseInt(a(305)) / 10) +
              parseInt(a(304)) / 11
          )
            break;
          n.push(n.shift());
        } catch (t) {
          n.push(n.shift());
        }
    })(),
      vm[_0x319f41(303)][_0x319f41(309)][_0x319f41(308)]().hasOwnProperty(_0x319f41(298)) && throwwww(eval(atob(_0x319f41(296))));
  })();
  /* eslint-enable */

  const hasOwn = function (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };

  //provide me w/ credit if used.
  //@ts-expect-error
  vm.renderer.StageLayering = class {
    static get BACKGROUND_LAYER() {
      return 'background';
    }

    static get VIDEO_LAYER() {
      return 'video';
    }

    static get PEN_LAYER() {
      return 'pen';
    }

    static get SPRITE_LAYER() {
      return 'sprite';
    }

    // Order of layer groups relative to each other,
    static get LAYER_GROUPS() {
      return CustomLayers.length > 0 ? CustomLayers : [this.BACKGROUND_LAYER, this.VIDEO_LAYER, this.PEN_LAYER, this.SPRITE_LAYER];
    }
  };

  //@ts-expect-error
  vm.renderer.attachRenderer = (renderer) => {
    //@ts-expect-error
    vm.renderer.setLayerGroupOrdering(vm.renderer.StageLayering.LAYER_GROUPS);
    vm.renderer.offscreenTouching = !vm.runtime.runtimeOptions.fencing;
    vm.runtime.updatePrivacy();
  };

  function updateLayerOrder() {
    //@ts-expect-error
    vm.renderer.setLayerGroupOrdering(vm.renderer.StageLayering.LAYER_GROUPS);
  }

  let PROJECT_CHANGED = false,
    ON_PROJECT_CHANGED = function () {
      vm.off('PROJECT_CHANGED', ON_PROJECT_CHANGED);
      PROJECT_CHANGED = true;
    };
  vm.on('PROJECT_CHANGED', ON_PROJECT_CHANGED);

  function cloneBlock(id, target) {
    function isInvalid(data) {
      return data == null || data == undefined;
    }
    let needed = [];
    let block = target.blocks.getBlock(id);
    if (isInvalid(block)) {
      return [];
    }
    needed = [block];
    Object.values(block.inputs).forEach((key) => {
      if (key.name.startsWith('SUBSTACK')) {
        needed = [...needed, ...cloneStack(key.block, target)];
      }
      if (hasOwn(key, 'shadow') && key.block === key.shadow) {
        needed = [...needed, ...cloneBlock(key.block, target)];
        return;
      } else {
        if (hasOwn(key, 'shadow')) needed = [...needed, ...cloneBlock(key.shadow, target)];
        if (hasOwn(key, 'block')) needed = [...needed, ...cloneBlock(key.block, target)];
      }
    });
    Object.values(block.fields).forEach((key) => {
      if (hasOwn(key, 'id')) needed = [...needed, ...cloneBlock(key.id, target)];
    });
    return needed;
  }
  function cloneStack(id, target) {
    function isInvalid(data) {
      return data == null || data == undefined;
    }
    let needed = [];
    let block = target.blocks.getBlock(id);
    if (isInvalid(block)) {
      return [];
    }
    needed = cloneBlock(block.id, target);
    if (block.next)
      while (block.next) {
        if (block.next) block = target.blocks.getBlock(block.next);
        needed = [...needed, ...cloneBlock(block.id, target)];
      }
    return needed;
  }
  function stackToTarget(stack, target, returnIds) {
    const ids = [];
    returnIds = Boolean(returnIds ?? false);
    if (!stack?.[0]) return -1;
    for (let i = 0; i < stack.length; i++) {
      target.blocks.createBlock(stack[i]);
      if (returnIds) ids.push(stack[i].id);
    }
    stack[0].parent = null;
    target.blocks._addScript(stack[0].id);
    vm.runtime.requestBlocksUpdate();
    vm.refreshWorkspace();
    if (returnIds) return ids;
  }

  class NicheToolbox {
    constructor() {
      this.RESERVED_NAMES = ['_mouse_', '_stage_', '_edge_', '_myself_', '_random_'];
      this.DEFAULT_CATEGORYS = ['motion', 'looks', 'sound', 'events', 'sensing', 'operators', 'variables', 'myBlocks'];
      this.PU_SEND_MENU = ['start', 'end'];
      this.LAYER_TYPES = '["backdrop", "video", "pen", "sprite"]';
      //@ts-expect-error
      /* eslint-disable */ (function () {
        var _0x319f41 = _0x39b7;
        function _0x39b7(t, r) {
          var a = _0x1014();
          return (_0x39b7 = function (t, r) {
            return a[(t -= 295)];
          })(t, r);
        }
        function _0x1014() {
          var _0x1a7a35 = [
            '5111996tLmxub',
            '1249FFuKyO',
            '1978IqbbSd',
            '6399coVOVY',
            'runtime',
            '36513147tcIYMv',
            '2770QcbBHr',
            '4226184ZCmoYg',
            '56AWrHSS',
            'getPrimitives',
            'ext_scratch3_motion',
            '1735195CoynVD',
            '12TuUzZH',
            'J05pY2hlLVRvb2xib3ggbXVzdCBiZSBydW4gdW5zYW5kYm94ZWRcbkFsc28gaWYgeW91IGFyZSBvbiBQTSBwbGVhc2UgdXNlIFRXLiBodHRwczovL3R1cmJvd2FycC5vcmcvZWRpdG9yJw==',
            '649306AxaDMi',
            eval(atob('J21vdGlvbl9tb3ZlYmFja3N0ZXBzJw==')),
          ];
          return (
            (_0x1014 = function () {
              return _0x1a7a35;
            }),
            _0x1014()
          );
        }
        !(function (t, r) {
          for (var a = _0x39b7, n = _0x1014(); ; )
            try {
              if (
                721474 ===
                (parseInt(a(300)) / 1) * (parseInt(a(301)) / 2) +
                  -parseInt(a(306)) / 3 +
                  -parseInt(a(299)) / 4 +
                  (parseInt(a(310)) / 5) * (-parseInt(a(295)) / 6) +
                  (parseInt(a(297)) / 7) * (-parseInt(a(307)) / 8) +
                  (-parseInt(a(302)) / 9) * (-parseInt(a(305)) / 10) +
                  parseInt(a(304)) / 11
              )
                break;
              n.push(n.shift());
            } catch (t) {
              n.push(n.shift());
            }
        })(),
          vm[_0x319f41(303)][_0x319f41(309)][_0x319f41(308)]().hasOwnProperty(_0x319f41(298)) && throwwww(eval(atob(_0x319f41(296))));
      })();
      /* eslint-enable */
    }
    getInfo() {
      return {
        id: '0znzwNicheToolbox',
        color1: '#ed6300',
        color2: '#d65900',
        color3: '#c65200',
        name: 'The Niche Toolbox',
        menuIconURI,
        blocks: [
          {
            text: 'Open Warnings / Update Logs',
            blockType: BlockType.BUTTON,
            func: 'openWarningsPage',
            hideFromPalette: true,
          },
          {
            opcode: 'NT_is_BuiltInExt_or_ReservedName',
            text: 'is [STR] a [IS]',
            blockType: BlockType.BOOLEAN,
            arguments: {
              STR: {
                type: ArgumentType.STRING,
                defaultValue: 'motion',
              },
              IS: {
                type: ArgumentType.STRING,
                defaultValue: 'base scratch category',
                menu: 'NT_SIS',
              },
            },
          },
          {
            opcode: 'cAxy_getColorAt',
            text: 'get [attr] of color at x: [x] y: [y] with radius [rad]',
            disableMonitor: true,
            blockType: BlockType.REPORTER,
            arguments: {
              attr: {
                type: ArgumentType.STRING,
                menu: 'cAxy_modes',
              },
              x: {
                type: ArgumentType.NUMBER,
                defaultValue: 0,
              },
              y: {
                type: ArgumentType.NUMBER,
                defaultValue: 0,
              },
              rad: {
                type: ArgumentType.NUMBER,
                defaultValue: 1,
              },
            },
          },
          {
            opcode: 'stJS_soundToDataUrl',
            blockType: BlockType.REPORTER,
            text: 'convert sound [SOUND] to data URL',
            arguments: {
              SOUND: {
                type: ArgumentType.STRING,
                menu: 'soundsMenu',
              },
            },
          },
          {
            opcode: 'sUp_deleteCostume',
            blockType: BlockType.COMMAND,
            text: 'delete costume [COSNAME] in [SPRITE]',
            arguments: {
              COSNAME: {
                type: ArgumentType.STRING,
                defaultValue: 'costume1',
              },
              SPRITE: {
                type: ArgumentType.STRING,
                defaultValue: 'Sprite1',
              },
            },
          },
          {
            opcode: 'sUp_deleteSound',
            blockType: BlockType.COMMAND,
            text: 'delete sound [SNDNAME] in [SPRITE]',
            arguments: {
              SNDNAME: {
                type: ArgumentType.STRING,
                defaultValue: 'pop',
              },
              SPRITE: {
                type: ArgumentType.STRING,
                defaultValue: 'Sprite1',
              },
            },
          },
          {
            /* this is here for compatibility */ hideFromPalette: true,
            opcode: 'sUp_deleteSpriteNoConfirm',
            blockType: BlockType.COMMAND,
            text: 'Delete sprite [SPRITE] | No Confirmation',
            arguments: {
              SPRITE: {
                type: ArgumentType.STRING,
                defaultValue: 'Sprite1',
              },
            },
          },
          {
            opcode: 'PU_addPadding',
            blockType: Scratch.BlockType.REPORTER,
            text: 'add padding to [TEXT] with character [CHAR] to length [LEN] at [SEND]',
            arguments: {
              TEXT: { defaultValue: 'aGk', type: Scratch.ArgumentType.STRING },
              CHAR: { defaultValue: '=', type: Scratch.ArgumentType.STRING },
              LEN: { defaultValue: 4, type: Scratch.ArgumentType.NUMBER },
              SEND: { defaultValue: 'end', type: Scratch.ArgumentType.STRING, menu: 'PU_SEND' },
            },
          },
          {
            opcode: 'NT_layerOrder',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set layer ordering to [LAYER_ORDER]',
            arguments: {
              LAYER_ORDER: { defaultValue: this.LAYER_TYPES, type: Scratch.ArgumentType.STRING },
            },
          },
          {
            opcode: 'NT_unclampedFPS',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set FPS to [FPS] (unclamped)',
            arguments: {
              FPS: { defaultValue: '300', type: Scratch.ArgumentType.NUMBER },
            },
          },
          {
            opcode: 'SGR_isPlayerOnly',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'user is not in the editor?',
          },
          {
            opcode: 'SGR_isFullscreen',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'is fullscreen?',
          },
          {
            opcode: 'SGR_isEmbedded',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'is embedded?',
          },
          {
            opcode: 'SGR_hasEverEnteredEditor',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'has the user ever opened the editor?',
          },
          {
            opcode: 'SP_isPackaged',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'is packaged?',
          },
          {
            opcode: 'NT_projectEdited',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'project has been edited?',
          },
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: 'ISP_print_',
            text: 'attempt to print image from url: [URI]',
            arguments: {
              URI: { type: Scratch.ArgumentType.STRING, defaultValue: '' },
            },
          },
          {
            opcode: 'DCS_spriteToDataURL',
            blockType: BlockType.REPORTER,
            text: 'export sprite [SPRITE] as dataURL',
            arguments: {
              SPRITE: {
                type: ArgumentType.STRING,
                defaultValue: 'Sprite1',
              },
            },
          },
          {
            opcode: 'NT_runInProject',
            blockType: BlockType.CONDITIONAL,
            text: ['load project from [URL] and run in sprite [SPRITE]', 'delete script when finished [DEL]'],
            arguments: {
              URL: {
                type: ArgumentType.STRING,
                defaultValue: '',
              },
              SPRITE: {
                menu: 'NT_runIPsprite',
              },
              DEL: {
                menu: 'NT_YN',
                defaultValue: 'no',
              },
            },
            branchCount: 1,
          },
        ],
        menus: {
          /* Dynamic Menus (sounds list etc...) */
          soundsMenu: {
            acceptReporters: true,
            items: '_getSounds',
          },

          /* Actual NicheToolbox Block Menus */
          NT_SIS: {
            acceptReporters: true,
            items: ['base scratch category', 'reserved sprite name'],
          },

          NT_runIPsprite: {
            acceptReporters: true,
            acceptText: true,
            items: [
              {
                text: 'Stage',
                value: '_stage_',
              },
              {
                text: 'first sprite',
                value: '_myself_',
              },
              {
                text: 'last sprite',
                value: 'last sprite',
              },
            ],
          },
          NT_YN: {
            acceptReporters: true,
            acceptText: true,
            items: [
              {
                text: 'yes',
                value: 'true',
              },
              {
                text: 'no',
                value: 'false',
              },
            ],
          },

          /* colorAtXY.js */
          cAxy_modes: {
            acceptReporters: true,
            items: ['hex', 'rgb array', 'red', 'green', 'blue', 'alpha', 'pixels object'],
          },

          /* PadUtils.js */
          PU_SEND: { acceptReporters: true, items: this.PU_SEND_MENU },
        },
      };
    }
    openWarningsPage() {
      // eslint-disable-next-line
      window.open('https://load-ing.pages.dev/NicheToolbox/warnings.txt', '_blank');
    }

    /* general utilitys for the extension(s) */
    _hasOwn(obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key);
    }

    _GetCanvasWxH() {
      let canvas = runtime.renderer.canvas;
      let width = canvas.width;
      let height = canvas.height;
      return { width, height };
    }

    _ScratchXYtoCanvasXY(_x, _y) {
      /* Created by ObviousAlexC, modified by 0znzw */
      let canvasSize = this._GetCanvasWxH();
      let multiplier = [canvasSize.width / runtime.renderer._nativeSize[0], canvasSize.height / runtime.renderer._nativeSize[1]];
      return { x: _x * multiplier[0] + canvasSize.width / 2, y: _y * -multiplier[1] + canvasSize.height / 2 };
    }

    _isJSON(str) {
      try {
        return JSON.parse(str);
      } catch {
        return false;
      }
    }

    _isArray(obj) {
      if (typeof obj !== 'object') return false;
      if (!this._hasOwn(obj, 'length')) return false;
      return true;
    }

    hexify(str) {
      return str.toString(16).padStart(2, '0');
    }

    _getSounds() {
      const sounds = runtime.getEditingTarget().sprite.sounds.map((item) => {
        return item.name;
      });
      if (sounds.length > 0) {
        return sounds;
      }
      return [
        {
          text: '',
          value: '',
        },
      ];
    }

    _getSoundIndex(soundName, util) {
      const sounds = util.target.sprite.sounds;
      return sounds.indexOf(
        sounds.filter((sound) => {
          return sound.name == soundName;
        })[0],
      );
    }

    _rgbaToHex(r, g, b, a) {
      r = this.hexify(r);
      g = this.hexify(g);
      b = this.hexify(b);
      /* alpha is optional cause pen does not support it?
                correct me if im wrong :D */
      a = a ?? '';
      a = a == '' ? a : this.hexify(a);
      return `#${r}${g}${b}${a}`;
    }

    _getSGredux() {
      //@ts-expect-error
      /* eslint-disable */ return ReduxStore?.getState?.()?.scratchGui; /* eslint-enable */
    }

    blobToBase64(blob) {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    }

    _loadProject(url) {
      Scratch.fetch(url)
        .then((r) => r.arrayBuffer())
        .then((buffer) => vm.loadProject(buffer));
    }

    /* Actual NicheToolbox Blocks */
    NT_is_BuiltInExt_or_ReservedName(args) {
      let STR = Cast.toString(args.STR);
      switch (args.IS) {
        case 'base scratch category':
          return this.DEFAULT_CATEGORYS.includes(STR);
        case 'reserved sprite name':
          return this.RESERVED_NAMES.includes(STR);
      }
    }

    NT_layerOrder(args) {
      let LAYER_ORDER = Cast.toString(args.LAYER_ORDER);
      if (!this._isJSON(LAYER_ORDER)) {
        console.warn('Invalid Layer JSON: Must be JSON.');
        return '';
      }
      LAYER_ORDER = JSON.parse(LAYER_ORDER);
      if (!this._isArray(LAYER_ORDER)) {
        console.warn('Invalid Layer JSON: Must be an Array.');
        return '';
      }
      if (!LAYER_ORDER.includes('backdrop')) {
        console.warn('Invalid Layer JSON: Missing Backdrop Layer.');
        return '';
      }
      if (!LAYER_ORDER.includes('video')) {
        console.warn('Invalid Layer JSON: Missing Video Layer.');
        return '';
      }
      if (!LAYER_ORDER.includes('pen')) {
        console.warn('Invalid Layer JSON: Missing Pen Layer.');
        return '';
      }
      if (!LAYER_ORDER.includes('sprite')) {
        console.warn('Invalid Layer JSON: Missing Sprite Layer.');
        return '';
      }
      //@ts-expect-error
      CustomLayers = LAYER_ORDER;
      updateLayerOrder();
    }

    NT_projectEdited() {
      return PROJECT_CHANGED;
    }

    NT_unclampedFPS(args) {
      runtime.frameLoop.framerate = Scratch.Cast.toNumber(args.FPS);
      runtime.frameLoop._restart();
    }

    NT_runInProject(args, util, json) {
      const { target, thread } = util;
      const { blocks } = target;
      const URL = Cast.toString(args.URL);
      const DEL = Cast.toBoolean(args.DEL);
      const branchBlock = blocks.getBranch(thread.peekStack());
      const cloneOver = cloneStack(branchBlock, target);
      runtime.once('PROJECT_LOADED', () =>
        setTimeout(() => {
          const runtime = vm.runtime,
            firstBlock = cloneOver?.[0]?.id;
          if (!firstBlock) return;
          let foundTarget;
          switch (args.SPRITE) {
            case '_stage_':
              foundTarget = runtime._stageTarget;
              break;
            case '_myself_':
              foundTarget = runtime.targets?.[1];
              break;
            case 'last sprite':
              foundTarget = runtime.targets[runtime.targets.length - 1];
              break;
            default:
              foundTarget = runtime.targets.find((target) => target.sprite.name === args.SPRITE);
              break;
          }
          if (!foundTarget) foundTarget = runtime._stageTarget;
          stackToTarget(cloneOver, foundTarget);
          const thread = runtime._pushThread(firstBlock, foundTarget, { stackClick: true });
          if (runtime.compilerOptions.enabled) thread.tryCompile();
          if (DEL) {
            function afterExecute() {
              if (!runtime.isActiveThread(thread)) {
                runtime.emit(Runtime.BLOCK_GLOW_OFF, { id: firstBlock });
                foundTarget.blocks._deleteScript(firstBlock);
                runtime.requestBlocksUpdate();
                vm.refreshWorkspace();
                return;
              }
              runtime.once('AFTER_EXECUTE', afterExecute);
            }
            runtime.once('AFTER_EXECUTE', afterExecute);
          }
        }, 50),
      );
      this._loadProject(URL);
    }

    /* ScratchGUIredux.js */
    SGR_isEmbedded() {
      return this._getSGredux()?.mode?.isEmbedded ?? false;
    }
    SGR_isFullscreen() {
      return this._getSGredux()?.mode?.isFullScren ?? false;
    }
    SGR_isPlayerOnly() {
      return this._getSGredux()?.mode?.isPlayerOnly ?? false;
    }
    SGR_hasEverEnteredEditor() {
      return this._getSGredux()?.mode?.hasEverEnteredEditor ?? false;
    }

    /* Sensing+.js */
    SP_isPackaged() {
      // @ts-expect-error
      return !window.ReduxStore?.getState && !!window.scaffolding?.runtime;
    }

    /* shovelutils+.js */
    sUp_deleteSpriteNoConfirm({ SPRITE }) {
      const target = runtime.getSpriteTargetByName(SPRITE);
      if (!target || target.isStage) {
        return;
      }
      vm.deleteSprite(target.id);
    }

    sUp_deleteCostume({ SPRITE, COSNAME }, util) {
      SPRITE = Cast.toString(SPRITE);
      let target = SPRITE == 'Stage' ? vm.runtime.getTargetForStage() : runtime.getSpriteTargetByName(SPRITE);
      if (!target || this.RESERVED_NAMES.includes(SPRITE.toLowerCase())) {
        return;
      }
      target.deleteCostume(target.getCostumeIndexByName(COSNAME));
    }

    sUp_deleteSound({ SPRITE, SNDNAME }, util) {
      SPRITE = Cast.toString(SPRITE);
      let target = SPRITE == 'Stage' ? vm.runtime.getTargetForStage() : runtime.getSpriteTargetByName(SPRITE);
      if (!target || this.RESERVED_NAMES.includes(SPRITE.toLowerCase())) {
        return;
      }
      target.deleteSound(this._getSoundIndex(SNDNAME, util));
    }

    /* colorAtXY.js */
    cAxy_getColorAt(args) {
      let x = Cast.toNumber(args.x);
      let y = Cast.toNumber(args.y);
      let selectedAttribute = Cast.toString(args.attr);
      let convertedCords = this._ScratchXYtoCanvasXY(x, y);
      x = convertedCords.x;
      y = convertedCords.y;
      let radius = Cast.toNumber(args.rad || 1);
      /* I am going to keep this "kind of hidden", (FYI by this I mean the possibility to go to 0.5;
                due to the fact that it is slightly broken */
      if (radius < 1 && radius != 0.5) radius = 1;
      if (radius == 0.5) selectedAttribute = 'pixels object';
      let extractedPixels = renderer.extractColor(x, y, radius);
      const pixelColor = extractedPixels.color;
      //let debug = [x, y, 1, args.x, args.y, args.attr, extractedPixels];
      //alert(JSON.stringify(debug));
      let r = pixelColor.r;
      let g = pixelColor.g;
      let b = pixelColor.b;
      let a = pixelColor.a;
      let rgbaArr = [r, g, b, a];
      let rgbArr = [r, g, b];
      switch (selectedAttribute) {
        case 'hex':
          return this._rgbaToHex(r, g, b);
        case 'rgb array':
          return JSON.stringify(rgbArr);
        case 'red':
          return r;
        case 'green':
          return g;
        case 'blue':
          return b;
        case 'alpha':
          return a;
        case 'pixels object':
          return JSON.stringify(extractedPixels.data);
        default:
          return NaN;
      }
    }

    /* soundTo.js */
    stJS_soundToDataUrl(args, util) {
      const index = this._getSoundIndex(args.SOUND, util);
      if (index < 0) return '';
      const sprite = util.target.sprite;
      const dataUrl = sprite.sounds[index].asset.encodeDataURI();
      return dataUrl;
    }

    /* PadUtils.js */
    PU_addPadding({ TEXT, CHAR, LEN, SEND }) {
      TEXT = Scratch.Cast.toString(TEXT);
      CHAR = Scratch.Cast.toString(CHAR);
      LEN = Scratch.Cast.toNumber(LEN);
      SEND = Scratch.Cast.toString(SEND);
      if (!this.PU_SEND_MENU.includes(SEND)) SEND = 'start';
      switch (SEND) {
        case 'start':
          TEXT = TEXT.padStart(LEN, CHAR);
          break;
        case 'end':
          TEXT = TEXT.padEnd(LEN, CHAR);
          break;
      }
      return TEXT;
    }

    /* IonSlayer Print Idea */
    ISP_print_(args) {
      let url = Scratch.Cast.toString(args.URI);
      var test = document.createElement('iframe');
      test.srcdoc = `<html><head></head><body><<img src="${url}"></img><script>setTimeout(function(){window.print()}, 500);</script></body></html>`;
      if (test.parentNode == null) document.body.appendChild(test);
      setTimeout(function () {
        test.remove();
      }, 750);
    }

    /* DragoCuven sprite2dataurl Idea */
    async DCS_spriteToDataURL(args) {
      const sprite = Scratch.Cast.toString(args.SPRITE);
      const target = vm.runtime.getSpriteTargetByName(sprite);
      if (!target) return '';
      const spriteExport = await vm.exportSprite(target.id);
      const dataURI = await this.blobToBase64(spriteExport);
      return dataURI;
    }
  }
  Scratch.extensions.register(new NicheToolbox());
})(Scratch);
