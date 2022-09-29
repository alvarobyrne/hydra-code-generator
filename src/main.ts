import "./style.css";
import CodeGeneratorClient, { CODE_GENERATED } from "./CodeGeneratorClient";
const codeGenerator = new CodeGeneratorClient();
codeGenerator.on(CODE_GENERATED, (code) => {
  console.log("code: ", code);
});
