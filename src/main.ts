import "./style.css";
import CodeGeneratorClient, { CODE_GENERATED } from "./CodeGeneratorClient";
import Editor from "./Editor";
const codeGenerator = new CodeGeneratorClient();
codeGenerator.on(CODE_GENERATED, (code) => {
  editor.setValue(code);
});
const editor = new Editor();
