import "./style.css";
import CodeGeneratorClient, { CODE_GENERATED } from "./CodeGeneratorClient";
import Editor from "./Editor";
import HydraClient from "./HydraClient";
const codeGenerator = new CodeGeneratorClient();
codeGenerator.on(CODE_GENERATED, (code) => {
  editor.setValue(code);
});
const editor = new Editor();
new HydraClient();
