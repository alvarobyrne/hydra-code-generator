import "./style.css";
import CodeGeneratorClient, { CODE_GENERATED } from "./CodeGeneratorClient";
import Editor, {
  EDITOR_EVAL_BLOCK_EVENT,
  EDITOR_EVAL_LINE_EVENT,
} from "./editor/Editor";
import HydraClient from "./HydraClient";
const codeGenerator = new CodeGeneratorClient();
codeGenerator.on(CODE_GENERATED, (code) => {
  try {
    editor.setValue(code);
    simplestRepl(code);
    navigator.clipboard.writeText(code);
  } catch (e) {
    console.log("e: ", e);
  }
});
const editor = new Editor();
const hydraClient = new HydraClient();
function simplestRepl(code: string) {
  try {
    hydraClient.eval(code);
  } catch (error) {
    console.log("error: ", error);
  }
}
editor.on(EDITOR_EVAL_LINE_EVENT, simplestRepl);
editor.on(EDITOR_EVAL_BLOCK_EVENT, simplestRepl);
