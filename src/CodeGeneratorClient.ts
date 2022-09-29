import CodeGenerator from "./CodeGenerator";
import dat from "dat.gui";
class CodeGeneratorClient {
  constructor() {
    const hydra = new CodeGenerator({
      ignoredList: [],
      exclusiveFunctionList: [],
      exclusiveSourceList: [],
    });
    console.log("hydra: ", hydra);
    const allSources = hydra.sourcesList;
    console.log("allSources: ", allSources);

    const gui = new dat.GUI();
    gui.width = 500;
    gui.add(hydra, "minValue", 0, 5).name("min value for function arguments");
    gui.add(hydra, "maxValue", 5, 10).name("max value for function arguments");

    hydra.arrowFunctionProb;
    hydra.mouseFunctionProb;
    const model = { minAmountFunctions: 3, maxAmountFunctions: 10 };
    gui
      .add(model, "minAmountFunctions", 0, 10)
      .name("minimum amount of functions");
    gui
      .add(model, "maxAmountFunctions", 0, 10)
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
    gui
      .add(
        {
          f() {
            doGenerateCode();
          },
        },
        "f"
      )
      .name("Generate code");

    function doGenerateCode() {
      const code = hydra.generateCode(
        model.minAmountFunctions,
        model.maxAmountFunctions
      );
      console.log("code: ", code);
    }
    const exclusiveSourcesFolder = gui.addFolder("Exclusive sources");
    hydra.sourcesList.map((name) => {
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
    hydra.allFunctions.forEach((name) => {
      const isExclusive = hydra.exclusiveFunctionList.includes(name);
      const controller = exclusiveFunctionsFolder
        .add({ f: isExclusive }, "f")
        .name(name);
      controller.onChange((value) => {
        hydra.setExclusiveFunction(name, value);
        const ef = hydra.exclusiveFunctionList;
        console.log("ef: ", ef);
      });
    });

    const sourcesAndFunctions = [...hydra.sourcesList, ...hydra.allFunctions];
    const ignoredElemenntsFolder = gui.addFolder("Ignored elements");
    sourcesAndFunctions.forEach((name) => {
      const isIgnored = hydra.ignoredList.includes(name);
      const controller = ignoredElemenntsFolder
        .add({ f: isIgnored }, "f")
        .name(name);
      controller.onChange((value) => {
        hydra.setIgnoredElement(name, value);
        const ef = hydra.ignoredList;
        console.log("ef: ", ef);
      });
    });
  }
}
export default CodeGeneratorClient;
