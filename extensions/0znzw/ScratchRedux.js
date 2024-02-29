/**!
 * Scratch Redux
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(function (Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error(`"Scratch Redux" extension must be ran unsandboxed.`);
    }

    function redux() {
        return ReduxStore.getState();
    }

    /* these are cause I am lazy, and are for less advanced blocks */
    function label(text) {
        return {
            blockType: Scratch.BlockType.LABEL,
            text
        }
    }

    function boolean(opcode, text) {
        return {
            opcode,
            blockType: Scratch.BlockType.BOOLEAN,
            text
        }
    }

    function reporter(opcode, text) {
        return {
            opcode,
            blockType: Scratch.BlockType.REPORTER,
            text
        }
    }

    class ScratchRedux {
        getInfo() {
            return {
                name: 'Scratch Redux',
                id: '0znzwScratchRedux',
                blocks: [
                    label('Stage'),
                    reporter('stageSize', 'stage size'),
                    reporter('stageWidth', 'stage width'),
                    reporter('stageHeight', 'stage height'),
                    label('Project'),
                    boolean('projectFullScreened', 'is project fullscreened?'),
                    boolean('projectEmbedded', 'is project embedded?'),
                    boolean('projectChanged', 'project changed?'),
                    reporter('projectData', 'project-state data'),
                    reporter('projectTitle', 'project title'),
                    reporter('projectInstructions', 'project instructions'),
                    reporter('projectCredits', 'project credits'),
                    reporter('projectAuthor', 'project author'),
                    reporter('projectThumbnail', 'project thumbnail'),
                    reporter('projectID', 'project id'),
                    label('Page (Inaccurate)'),
                    reporter('windowWidth', 'window width'),
                    reporter('windowHeight', 'window height'),
                    boolean('windowFullScreened', 'is window fullscreened?'),
                    label('Editor'),
                    boolean('editingProject', 'is user editing the project?'),
                    boolean('openedEditor', 'has user opened the editor before?'),
                    reporter('currentEditorTab', 'current editor tab'),
                    label('Virtual-Machine (VM)'),
                    boolean('isVMrunning', 'is vm running?'),
                    boolean('startedVM', 'has vm started?'),
                    boolean('isTurbo', 'turbo?'),
                    label('Other'),
                    boolean('alertsVisible', 'are alerts visible?'),
                    boolean('fontsLoaded', 'are fonts loaded?'),
                    reporter('toolboxXML', 'toolbox XML'),
                    label('Locales'),
                    boolean('isRTL', 'is RTL?'),
                    reporter('currentLocale', 'current locale')
                ]
            }
        }
        /* Stage */
        stageSize() { return redux().scratchGui.stageSize.stageSize }
        stageWidth() { return redux().scratchGui.customStageSize.width }
        stageHeight() { return redux().scratchGui.customStageSize.height }
        /* Project */
        projectFullScreened() { return redux().scratchGui.mode.isFullScreen }
        projectEmbedded() { return redux().scratchGui.mode.isEmbedded }
        projectChanged() { return redux().scratchGui.projectChanged }
        projectData() { return redux().scratchGui.projectState.projectData }
        projectTitle() { return redux().scratchGui.projectTitle }
        projectInstructions() { return redux().scratchGui.tw.description.instructions }
        projectCredits() { return redux().scratchGui.tw.description.credits }
        projectAuthor() { return redux().scratchGui.tw.author.username }
        projectThumbnail() { return redux().scratchGui.tw.author.thumbnail }
        projectID() { return redux().scratchGui.projectState.projectId }
        /* Page */
        windowWidth() { return redux().scratchGui.tw.dimensions[0] }
        windowHeight() { return redux().scratchGui.tw.dimensions[1] }
        windowFullScreened() { return redux().scratchGui.tw.isWindowFullScreened }
        /* Editor */
        editingProject() { return redux().scratchGui.mode.isPlayerOnly }
        openedEditor() { return redux().scratchGui.mode.hasEverEnteredEditor }
        currentEditorTab() { return redux().scratchGui.editorTab.activeTabIndex }
        /* VM */
        isVMrunning() { return redux().scratchGui.vmStatus.running }
        startedVM() { return redux().scratchGui.vmStatus.started }
        isTurbo() { return redux().scratchGui.vmStatus.turbo }
        /* Other */
        alertsVisible() { return redux().scratchGui.alerts.visible }
        fontsLoaded() { return redux().scratchGui.fontsLoaded }
        toolboxXML() { return redux().scratchGui.toolbox.toolboxXML }
        /* Locales */
        isRTL() { return redux().locales.isRtl }
        currentLocale() { return redux().locales.locale }
    }

    Scratch.extensions.register(new ScratchRedux());
})(Scratch);
