/**!
 * Performance
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function(Scratch) {

    if (!Scratch.extensions.unsandboxed) {
        throw new Error(`"Performance" extension must be ran unsandboxed.`);
    }

    // todo:
    //   add: PerformanceMark / performance.measure
    //   add: performance.timing

    class extension {
        getInfo() {
            return {
                id: '0znzwPerformance',
                name: 'Performance',
                blocks: [{
                    opcode: 'toJSON',
                    text: 'performance json',
                    blockType: 'reporter'
                },
                {
                    opcode: 'TIMINGtoJSON',
                    text: 'timing json',
                    blockType: 'reporter'
                },
                '---',
                {
                    opcode: 'baselineTimestamp',
                    text: 'baseline monotonic clock',
                    blockType: 'reporter'
                },
                {
                    opcode: 'timeSinceBaseline',
                    text: 'timestamp since baseline',
                    blockType: 'reporter'
                },
                '---',
                {
                    opcode: 'markInTimeline',
                    text: 'mark performance in timeline, name: [MARK_NAME]',
                    blockType: 'command',
                    arguments: {
                        MARK_NAME: {
                            type: 'string',
                            defaultValue: 'MARK'
                        }
                    }
                },
                '---',
                {
                    opcode: 'getCores',
                    text: 'get number of cores',
                    blockType: 'reporter'
                },
                '---',
                {
                    opcode: 'setResourceTimingBufferSize',
                    text: 'set resource timing buffer size to: [SIZE]',
                    blockType: 'command',
                    arguments: {
                        SIZE: {
                            type: 'number',
                            defaultValue: '255'
                        }
                    }
                },
                {
                    blockType: 'label',
                    text: 'Navigation'
                },
                {
                    opcode: 'navType_NAVIGATE',
                    text: 'NAVIGATE TYPE CODE',
                    blockType: 'reporter'
                },
                {
                    opcode: 'navType_RESERVED',
                    text: 'RESERVED TYPE CODE',
                    blockType: 'reporter'
                },
                {
                    opcode: 'navType_RELOAD',
                    text: 'RELOAD TYPE CODE',
                    blockType: 'reporter'
                },
                {
                    opcode: 'navType_BNEXT',
                    text: 'BACK-NEXT TYPE CODE',
                    blockType: 'reporter'
                },
                '---',
                {
                    opcode: 'navType',
                    text: 'navigation type',
                    blockType: 'reporter'
                },
                {
                    opcode: 'redirectCount',
                    text: 'redirection count',
                    blockType: 'reporter'
                },
                {
                    blockType: 'label',
                    text: 'Timing',
                    hideFromPalette: true
                },
                {
                    blockType: 'label',
                    text: '/!\\ EXPERIMENTAL /!\\'
                },
                {
                    opcode: 'measureUsage',
                    text: 'measure web app usage',
                    blockType: 'reporter'
                },
                '---',
                {
                    opcode: 'heapLimit',
                    text: 'JS heap limit',
                    blockType: 'reporter'
                },
                {
                    opcode: 'usedHeap',
                    text: 'used JS heap',
                    blockType: 'reporter'
                },
                {
                    opcode: 'totalHeap',
                    text: 'total JS heap',
                    blockType: 'reporter'
                }]
            }
        }
        toJSON() {
            return JSON.stringify(performance.toJSON());
        }
        baselineTimestamp() {
            // https://w3c.github.io/hr-time/#dfn-monotonic-clock
            return performance.timeOrigin;
        }
        timeSinceBaseline() {
            return performance.now();
        }
        markInTimeline({ MARK_NAME }) {
            MARK_NAME = Scratch.Cast.toString(MARK_NAME);
            performance.mark(MARK_NAME);
        }
        async measureUsage() {
            // https://developer.mozilla.org/en-US/docs/Web/API/Performance/measureUserAgentSpecificMemory#browser_compatibility
            // @ts-expect-error its experimental, ignore this error
            const sample = await performance.measureUserAgentSpecificMemory();
            return sample;
        }
        heapLimit() {
            // @ts-expect-error its experimental, ignore this error (deprecated also)
            return performance.memory.jsHeapSizeLimit;
        }
        usedHeap() {
            // @ts-expect-error its experimental, ignore this error (deprecated also)
            return performance.memory.usedJSHeapSize;
        }
        totalHeap() {
            // @ts-expect-error its experimental, ignore this error (deprecated also)
            return performance.memory.totalJSHeapSize;
        }
        getCores() {
            return navigator.hardwareConcurrency;
        }
        setResourceTimingBufferSize({ SIZE }) {
            SIZE = Scratch.Cast.toNumber(SIZE);
            performance.setResourceTimingBufferSize(SIZE);
        }
        navType() {
            // deprecated
            return performance.navigation.type;
        }
        redirectCount() {
            // deprecated
            return performance.navigation.redirectCount;
        }
        navType_RELOAD() {
            // deprecated
            return performance.navigation.TYPE_RELOAD;
        }
        navType_RESERVED() {
            // deprecated
            return performance.navigation.TYPE_RESERVED;
        }
        navType_BNEXT() {
            // deprecated
            return performance.navigation.TYPE_BACK_FORWARD;
        }
        navType_NAVIGATE() {
            // deprecated
            return performance.navigation.TYPE_NAVIGATE;
        }
        TIMINGtoJSON() {
            // deprecated
            return JSON.stringify(performance.timing);
        }
    }

    // @ts-ignore This happens sometimes
    Scratch.extensions.register(new extension());
})(Scratch);