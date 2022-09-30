import CodeGenerator from "./CodeGenerator";
import dat from "dat.gui";
import { EventEmitter } from "eventemitter3";
import clickable from "./utils/dat.gui.clickable";
export const CODE_GENERATED = "code:generated";
class CodeGeneratorClient extends EventEmitter {
  constructor() {
    super();
    const hydra = new CodeGenerator({
      ignoredList: [],
      exclusiveFunctionList: [],
      exclusiveSourceList: [],
    });

    const gui = new dat.GUI();
    gui.width = 500;
    gui.add(hydra, "minValue", 0, 5).name("min value for function arguments");
    gui.add(hydra, "maxValue", 5, 10).name("max value for function arguments");

    hydra.arrowFunctionProb;
    hydra.mouseFunctionProb;
    const model = { minAmountFunctions: 3, maxAmountFunctions: 10 };
    gui
      .add(model, "minAmountFunctions", 0, 10, 1)
      .name("minimum amount of functions");
    gui
      .add(model, "maxAmountFunctions", 0, 10, 1)
      .name("maximum amount of functions");
    gui
      .add(hydra, "arrowFunctionProb", 0, 100)
      .name("arrow function probability");
    gui
      .add(hydra, "mouseFunctionProb", 0, 100)
      .name("mouse function probability");
    hydra.modulateItselfProb;
    gui
      .add(hydra, "modulateItselfProb", 0, 100)
      .name("source self modulation probability");
    const generateCodeButton = gui
      .add(
        {
          f() {
            doGenerateCode();
            buttonElement?.removeAttribute("style");
          },
        },
        "f"
      )
      .name("Generate code");
    const buttonElement: HTMLLIElement = generateCodeButton.domElement
      .parentNode!.parentNode as HTMLLIElement;
    buttonElement.style.backgroundColor = "red";
    buttonElement.style.textShadow = "none";
    buttonElement.style.color = "black";

    const doGenerateCode = () => {
      const code = hydra.generateCode(
        model.minAmountFunctions,
        model.maxAmountFunctions
      );
      this.emit(CODE_GENERATED, code);
    };
    const exclusiveSourcesFolder = gui.addFolder("Exclusive sources");
    CodeGenerator.sourcesList.map((name) => {
      const isExclusive = hydra.exclusiveSourceList.includes(name);
      const model = {
        f: (q: boolean) => {
          hydra.setExclusiveSource(name, q);
        },
      };
      const controller = exclusiveSourcesFolder
        .add({ f: isExclusive }, "f")
        .name(name);
      controller.onChange(model.f);
    });

    const exclusiveFunctionsFolder = gui.addFolder("Exclusive functions");
    CodeGenerator.allFunctions.forEach((name) => {
      const isExclusive = hydra.exclusiveFunctionList.includes(name);
      const controller = exclusiveFunctionsFolder
        .add({ f: isExclusive }, "f")
        .name(name);
      controller.onChange((value) => {
        hydra.setExclusiveFunction(name, value);
      });
    });

    const sourcesAndFunctions = [
      ...CodeGenerator.sourcesList,
      ...CodeGenerator.allFunctions,
    ];
    const ignoredElemenntsFolder = gui.addFolder("Ignored elements");
    sourcesAndFunctions.forEach((name) => {
      const isIgnored = hydra.ignoredList.includes(name);
      const controller = ignoredElemenntsFolder
        .add({ f: isIgnored }, "f")
        .name(name);
      controller.onChange((value) => {
        hydra.setIgnoredElement(name, value);
      });
    });

    const externalLinksFolder = gui.addFolder("Links");
    clickable(
      "https://github.com/alvarobyrne/hydra-code-generator",
      "this repo's code",
      externalLinksFolder
    );
    clickable(
      "https://hydracg.herokuapp.com/",
      "original app",
      externalLinksFolder
    );
    clickable(
      "https://github.com/alecominotti/hydracodegenerator",
      "original python repo",
      externalLinksFolder
    );

    setTimeout(doGenerateCode, 1000);
  }
}
export default CodeGeneratorClient;
