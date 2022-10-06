import "./style.css";
import CodeGeneratorClient, { CODE_GENERATED } from "./CodeGeneratorClient";
import Editor from "./Editor";
import HydraClient from "./HydraClient";
const codeGenerator = new CodeGeneratorClient();
codeGenerator.on(CODE_GENERATED, (code) => {
  try {
    editor.setValue(code);
    hydraClient.eval(code);
    navigator.clipboard.writeText(code);
  } catch (e) {
    console.log("e: ", e);
  }
});
const editor = new Editor();
const hydraClient = new HydraClient();
