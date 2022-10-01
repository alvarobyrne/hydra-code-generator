import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark, oneDarkHighlightStyle } from "@codemirror/theme-one-dark";
import { syntaxHighlighting } from "@codemirror/language";
class Editor {
  private editor: EditorView = new EditorView({
    parent: document.body.querySelector("#app")!,
    doc: "code here",
    extensions: [
      basicSetup,
      syntaxHighlighting(oneDarkHighlightStyle, { fallback: true }),

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
  constructor() {}
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
