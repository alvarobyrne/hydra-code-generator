import { EditorView, basicSetup } from "codemirror";
import { keymap } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark, oneDarkHighlightStyle } from "@codemirror/theme-one-dark";
import { syntaxHighlighting } from "@codemirror/language";
import { EventEmitter } from "eventemitter3";
import { getLine, getBlock } from "./evalKeymaps";

export const EDITOR_EVAL_LINE_EVENT = "editor:evalLine";
export const EDITOR_EVAL_BLOCK_EVENT = "editor:evalBlock";
class Editor extends EventEmitter {
  private editor: EditorView;
  constructor() {
    super();
    //Keyboard-combination:event-name, valeu pairs
    const hydraKeysEvents = {
      "Ctrl-Enter": EDITOR_EVAL_LINE_EVENT,
      "Alt-Enter": EDITOR_EVAL_BLOCK_EVENT,
    };
    const self = this;
    const hydraKeymaps = Object.entries(hydraKeysEvents).map(([key, val]) => ({
      key: key,
      run: (opts) => {
        console.log("called", val, opts);
        let text = "";
        if (val === "editor:evalLine") {
          text = getLine(opts);
        } else if (val === "editor:evalBlock") {
          text = getBlock(opts);
        }
        console.log("text", text);
        self.emit(val, text);
      },
    }));
    this.editor = new EditorView({
      parent: document.body.querySelector("#app")!,
      doc: "code here",
      extensions: [
        basicSetup,
        syntaxHighlighting(oneDarkHighlightStyle, { fallback: true }),
        keymap.of([...hydraKeymaps]),
        EditorView.theme({
          "&": {
            fontSize: "16px",
            backgroundColor: "transparent",
          },
          "& .cm-line": {
            maxWidth: "fit-content",
            // background: "hsla(50,23%,5%,0.6)",
            background: "rgba(0, 0, 0, 0.7)",
          },
        }),
        javascript(),
        oneDark,
      ],
    });
  }
  setValue(code: string) {
    console.log("code: ", code);
    // this.editor.set;
    // const transaction = this.editor.state.update({   });
    this.editor.dispatch({
      changes: { from: 0, to: this.editor.state.doc.length, insert: code },
    });
  }
}
export default Editor;
