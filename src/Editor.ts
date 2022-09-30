import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
class Editor {
  private editor: EditorView = new EditorView({
    parent: document.body.querySelector("#app")!,
    doc: "code here",
    extensions: [basicSetup, javascript()],
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
