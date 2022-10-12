import CodeGenerator from "./CodeGenerator";
import dat from "dat.gui";
import { EventEmitter } from "eventemitter3";
import { setExternalLinks } from "./miscellanea/externalLinks";
export const CODE_GENERATED = "code:generated";
import Toastify from "toastify-js";
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
    gui
      .add(hydra, "minValue", 0, 5, 1)
      .name("min value for function arguments");
    gui
      .add(hydra, "maxValue", 5, 10, 1)
      .name("max value for function arguments");

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
      const isExclusiveSource = hydra.exclusiveSourceList.includes(name);
      const model = {
        isExclusiveSource,
      };
      const controller = exclusiveSourcesFolder
        .add(model, "isExclusiveSource")
        .name(name);
      controller.onChange((q: boolean) => {
        try {
          hydra.setExclusiveSource(name, q);
        } catch (error) {
          model.isExclusiveSource = false;
          controller.updateDisplay();
          this.toastError(error as Error);
        }
      });
    });

    const exclusiveFunctionsFolder = gui.addFolder("Exclusive functions");
    CodeGenerator.allFunctions.forEach((name) => {
      const isExclusiveFunction = hydra.exclusiveFunctionList.includes(name);
      const model = { isExclusiveFunction };
      const controller = exclusiveFunctionsFolder
        .add(model, "isExclusiveFunction")
        .name(name);
      controller.onChange((value) => {
        try {
          hydra.setExclusiveFunction(name, value);
        } catch (e) {
          model.isExclusiveFunction = false;
          controller.updateDisplay();
          this.toastError(e as Error);
        }
      });
    });

    const sourcesAndFunctions = [
      ...CodeGenerator.sourcesList,
      ...CodeGenerator.allFunctions,
    ];
    const ignoredElementsFolder = gui.addFolder("Ignored elements");
    sourcesAndFunctions.forEach((name) => {
      const isIgnored = hydra.ignoredList.includes(name);
      const model = { isIgnored };
      const controller = ignoredElementsFolder
        .add(model, "isIgnored")
        .name(name);
      controller.onChange((value) => {
        try {
          hydra.setIgnoredElement(name, value);
        } catch (e) {
          model.isIgnored = false;
          controller.updateDisplay();
          this.toastError(e as Error);
        }
      });
    });
    setExternalLinks(gui);
    setTimeout(doGenerateCode, 1000);
  }
  toastError(e: Error) {
    Toastify({
      text: e.message,
      duration: 5000,
      // newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "left", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "red",
      },
      // onClick: function () {}, // Callback after click
    }).showToast();
  }
}
export default CodeGeneratorClient;
