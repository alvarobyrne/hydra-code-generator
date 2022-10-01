type CodeGeneratorProps = {
  min?: number;
  max?: number;
  arrowFunctionProb?: number;
  mouseFunctionProb?: number;
  modulateItselfProb?: number;
  ignoredList: string[];
  exclusiveSourceList: string[];
  exclusiveFunctionList: string[];
};
class CodeGenerator {
  public info = `// Random Hydra code generated by HCG: https://github.com/alecominotti/hydracodegenerator/\n// @alecominotti\n\n`;
  public minValue = 0; // lower bound value to set as function argument,
  public maxValue = 5; // upper bound value to set as function argument,
  public arrowFunctionProb = 10; // Probabilities of generating an arrow function that changes value over time (ex.: () => Math.sin(time * 0.3)),
  public mouseFunctionProb = 0; // Probabilities of generating an arrow function that uses mouse position (ex.: () => mouse.x),
  public modulateItselfProb = 20; // Probabilities of generating a modulation function with "o0" as argument (ex.: modulate(o0,1)),
  static mathFunctions = ["sin", "cos", "tan"];
  static mouseList = ["mouse.x", "mouse.y"];
  static sourcesList = [
    "gradient",
    "noise",
    "osc",
    "shape",
    "solid",
    "voronoi",
  ];
  static colorList = [
    "brightness",
    "contrast",
    "color",
    "colorama",
    "invert",
    "luma",
    "posterize",
    "saturate",
    "thresh",
  ];
  static geometryList = [
    "kaleid",
    "pixelate",
    "repeat",
    "repeatX",
    "repeatY",
    "rotate",
    "scale",
    "scrollX",
    "scrollY",
  ];
  static modulatorsList = [
    "modulate",
    "modulateHue",
    "modulateKaleid",
    "modulatePixelate",
    "modulateRepeat",
    "modulateRepeatX",
    "modulateRepeatY",
    "modulateRotate",
    "modulateScale",
    "modulateScrollX",
    "modulateScrollY",
  ];
  static operatorsList = ["add", "blend", "diff", "layer", "mask", "mult"];
  static functionsList = [
    "genColor",
    "genGeometry",
    "genModulator",
    "genOperator",
  ];
  public ignoredList = [
    "solid",
    "brightness",
    "luma",
    "invert",
    "posterize",
    "thresh",
    "layer",
    "modulateScrollX",
    "modulateScrollY",
  ];
  static allFunctions = [
    ...CodeGenerator.colorList,
    ...CodeGenerator.geometryList,
    ...CodeGenerator.modulatorsList,
    ...CodeGenerator.operatorsList,
  ];
  public exclusiveSourceList: string[] = [];
  public exclusiveFunctionList: string[] = [];
  constructor({
    min,
    max,
    arrowFunctionProb,
    mouseFunctionProb,
    modulateItselfProb,
    ignoredList,
    exclusiveSourceList,
    exclusiveFunctionList,
  }: CodeGeneratorProps) {
    if (min) this.minValue = min;
    if (max) this.maxValue = max;
    if (min && max && min > max) {
      this.printError("Argument max value must be bigger than min value.");
      return;
    }
    if (ignoredList && ignoredList.length) this.ignoredList = ignoredList;
    if (arrowFunctionProb)
      if (0 <= arrowFunctionProb && arrowFunctionProb <= 100)
        this.arrowFunctionProb = arrowFunctionProb;
      else {
        this.printError(
          "Arrow function probability must be a number between 0 and 100."
        );
        return;
      }
    if (mouseFunctionProb)
      if (0 <= mouseFunctionProb && mouseFunctionProb <= 100)
        this.mouseFunctionProb = mouseFunctionProb;
      else {
        this.printError(
          "Mouse arrow function probability must be a number between 0 and 100."
        );
        return;
      }
    if (modulateItselfProb)
      if (0 <= modulateItselfProb && modulateItselfProb <= 100)
        this.modulateItselfProb = modulateItselfProb;
      else {
        this.printError(
          "Modulate itself probability must be a number between 0 and 100."
        );
        return;
      }
    if (exclusiveSourceList && exclusiveSourceList.length > 0)
      if (this.checkSources(exclusiveSourceList))
        this.exclusiveSourceList = exclusiveSourceList;
      else if (!exclusiveSourceList.length) {
        this.printError(
          "One or more of the specified exclusive sources doesn't exist"
        );
        return;
      }
    if (exclusiveFunctionList && exclusiveFunctionList.length > 0)
      if (this.checkFunctions(exclusiveFunctionList))
        this.exclusiveFunctionList = exclusiveFunctionList;
      else if (!exclusiveFunctionList.length) {
        this.printError(
          "One or more of the specified exclusive functions doesn't exist"
        );
        return;
      }
    if (
      ignoredList.length > 0 &&
      (exclusiveSourceList.length > 0 || exclusiveFunctionList.length > 0)
    ) {
      const exclusiveSourceAndFunction = [
        ...this.exclusiveSourceList,
        ...this.exclusiveFunctionList,
      ];
      const isExclusiveIgnored = exclusiveSourceAndFunction.some(
        (functionName) => this.ignoredList.includes(functionName)
      );
      // if( len([i for i in exclusiveSourceAndFunction if i in this.ignoredList]) > 0)
      if (isExclusiveIgnored)
        this.printError(
          "You can't ignore sources or functions specified as exclusive"
        );
      return;
    }
  }
  printError(msg: string) {
    console.log(msg);
  }
  checkSources(sources: string[]) {
    console.log("sources: ", sources);
    return isSubset(sources, CodeGenerator.sourcesList);
  }
  checkFunctions(functions: string[]) {
    console.log("functions: ", functions);
    return isSubset(functions, CodeGenerator.allFunctions);
  }
  truncate(number: number, digits: number): number {
    const stepper = 10.0 ** digits;
    return Math.trunc(stepper * number) / stepper;
  }

  isIgnored(chosen: string) {
    return this.ignoredList.includes(chosen);
  }
  isExclusiveSource(chosen: string) {
    if (this.exclusiveSourceList.length === 0) {
      return true;
    } else {
      return this.exclusiveSourceList.includes(chosen);
    }
  }

  isExclusiveFunction(chosen: string) {
    if (this.exclusiveFunctionList.length == 0) {
      return true;
    } else {
      return this.exclusiveFunctionList.includes(chosen);
      // return(chosen.lower() in [x.lower() for x in this.exclusiveFunctionList])
    }
  }
  genNormalValue() {
    const randomTruncate = random.randint(0, 3);
    const val = this.truncate(
      random.uniform(this.minValue, this.maxValue),
      randomTruncate
    );
    return val.toString();
  }
  genArrowFunctionValue() {
    const randomTimeMultiplier = this.truncate(
      random.uniform(0.1, 1),
      random.randint(1, 2)
    );
    //probabilities of generating an arrow function
    if (random.randint(1, 100) <= this.arrowFunctionProb) {
      const arrowFunctionName =
        CodeGenerator.mathFunctions[
          random.randint(0, CodeGenerator.mathFunctions.length - 1)
        ];
      return `() => Math.${arrowFunctionName}(time * ${randomTimeMultiplier})`;
    }
    //probabilities of generating a mouse function
    if (random.randint(1, 100) <= this.mouseFunctionProb) {
      return `() =>  ${
        CodeGenerator.mouseList[
          random.randint(0, CodeGenerator.mouseList.length - 1)
        ]
      }  * ${randomTimeMultiplier}`;
    }
    return "";
  }
  //generates a number, mouse, or math functions
  genValue() {
    const arrow = this.genArrowFunctionValue();
    if (arrow !== "") return arrow;
    else return this.genNormalValue();
  }
  // generates a normal number with 1/5 posibilities of being negative
  genPosOrNegValue() {
    const arrow = this.genArrowFunctionValue();
    if (arrow != "") return arrow;
    else if (random.randint(1, 5) == 5) return "-" + this.genNormalValue();
    else return this.genNormalValue();
  }
  //generates a number between 0 and 1
  genCeroOneValue() {
    const arrow = this.genArrowFunctionValue();
    if (arrow !== "") return arrow;
    else return this.truncate(random.uniform(0, 1), 1).toString();
  }
  // generates a number between 0 and 0.5
  genCeroPointFiveValue() {
    const arrow = this.genArrowFunctionValue();
    if (arrow != "") return arrow;
    else return this.truncate(random.uniform(0, 0.5), 2).toString();
  }
  //generates a number between 0.1 and maxValue
  genCeroPointOneToMax() {
    const arrow = this.genArrowFunctionValue();
    if (arrow !== "") return arrow;
    else return this.truncate(random.uniform(0.1, this.maxValue), 2).toString();
  }
  //generates a number between 0.1 and maxValue
  genCeroPointOneToOne() {
    const arrow = this.genArrowFunctionValue();
    if (arrow != "") return arrow;
    else return this.truncate(random.uniform(0.1, 1), 2).toString();
  }
  // END VALUE GENERATION METHODS ---

  // MAIN METHODS ---

  generateCode(minFunctions: number, maxFunctions: number) {
    // return;
    const functionsAmount = random.randint(minFunctions, maxFunctions);
    let code = "";
    code += this.info;
    code += this.genSource() + "\n";
    Array(functionsAmount)
      .fill("")
      .forEach((_) => {
        code += "  " + this.genFunction() + "\n";
      });
    code += ".out(o0)";
    return code;
  }

  exclusiveIgnoredInteresection() {
    return intersection(this.exclusiveSourceList, this.ignoredList);
  }
  /**
   * returns a source calling one of them randomly
   */

  genSource() {
    let listToChooseFrom: string[];
    if (this.exclusiveSourceList.length > 0)
      listToChooseFrom = this.exclusiveSourceList;
    else listToChooseFrom = CodeGenerator.sourcesList;
    const igonredAndExclusive = this.exclusiveIgnoredInteresection();
    if (igonredAndExclusive.length) {
      throw new Error(
        `the function(s) ${igonredAndExclusive.toString()} are marked as ignored and exclusive`
      );
    }
    const rc = random.choice(listToChooseFrom);
    // console.log("rc: ", rc);
    //@ts-ignore
    const method = this[rc]();
    // console.log("method: ", method);
    return method;
  }
  genFunction() {
    let listToChooseFrom: string[];
    if (this.exclusiveFunctionList.length > 0)
      listToChooseFrom = this.exclusiveFunctionList;
    else listToChooseFrom = CodeGenerator.functionsList;
    const igonredAndExclusive = intersection(
      this.exclusiveFunctionList,
      this.ignoredList
    );

    if (igonredAndExclusive.length) {
      throw new Error(
        `the function(s) ${igonredAndExclusive.toString()} are marked as ignored and exclusive`
      );
    }
    const rc = random.choice(listToChooseFrom);
    //@ts-ignore
    const method = this[rc]();
    // console.log("method: ", method);
    return method;
  }
  setExclusiveSource(name: string, isExclusive: boolean) {
    if (isExclusive) {
      this.exclusiveSourceList.push(name);
    } else {
      const i = this.exclusiveSourceList.indexOf(name);
      this.exclusiveSourceList.splice(i, 1);
    }
  }
  // exclusiveFunctionList
  setExclusiveFunction(name: string, isExclusive: boolean) {
    if (isExclusive) {
      this.exclusiveFunctionList.push(name);
    } else {
      const i = this.exclusiveFunctionList.indexOf(name);
      this.exclusiveFunctionList.splice(i, 1);
    }
  }
  setIgnoredElement(name: string, isIgnored: boolean) {
    if (isIgnored) {
      this.ignoredList.push(name);
    } else {
      const i = this.ignoredList.indexOf(name);
      this.ignoredList.splice(i, 1);
    }
  }
  // SOURCES ---

  gradient() {
    return "gradient(" + this.genValue() + ")";
  }

  noise() {
    return "noise(" + this.genValue() + ", " + this.genValue() + ")";
  }

  osc() {
    return (
      "osc(" +
      this.genValue() +
      ", " +
      this.genValue() +
      ", " +
      this.genValue() +
      ")"
    );
  }

  shape() {
    return (
      "shape(" +
      this.genValue() +
      ", " +
      this.genCeroPointFiveValue() +
      ", " +
      this.genCeroPointOneToOne() +
      ")"
    );
  }

  solid() {
    return (
      "solid(" +
      this.genCeroOneValue() +
      ", " +
      this.genCeroOneValue() +
      ", " +
      this.genCeroOneValue() +
      ", " +
      this.genCeroPointOneToMax() +
      ")"
    );
  }

  voronoi() {
    return (
      "voronoi(" +
      this.genValue() +
      ", " +
      this.genValue() +
      ", " +
      this.genCeroOneValue() +
      ")"
    );
  }

  // END SOURCES ---}
  // FUNCTION METHODS ---

  // returns a color function calling one of them randomly
  genColor() {
    const chosen = random.choice(CodeGenerator.colorList);
    //@ts-ignore
    return this[chosen]();
  }

  // returns a geometry function calling one of them randomly
  genGeometry() {
    const chosen = random.choice(CodeGenerator.geometryList);
    //@ts-ignore
    return this[chosen]();
  }

  // returns a geometry function calling one of them randomly
  genModulator() {
    const chosen = random.choice(CodeGenerator.modulatorsList);
    //@ts-ignore
    return this[chosen]();
  }

  // returns an operator function calling one of them randomly
  genOperator() {
    const chosen = random.choice(CodeGenerator.operatorsList);
    //@ts-ignore
    return this[chosen]();
  }

  // END FUNCTION METHODS ---

  // COLOR ---

  brightness() {
    return ".brightness(" + this.genCeroOneValue() + ")";
  }

  contrast() {
    return ".contrast(" + this.genCeroPointOneToMax() + ")";
  }

  color() {
    return (
      ".color(" +
      this.genCeroOneValue() +
      ", " +
      this.genCeroOneValue() +
      ", " +
      this.genCeroOneValue() +
      ")"
    );
  }

  colorama() {
    return ".colorama(" + this.genValue() + ")";
  }

  invert() {
    return ".invert(" + this.genCeroOneValue() + ")";
  }

  luma() {
    return ".luma(" + this.genCeroOneValue() + ")";
  }

  posterize() {
    return (
      ".posterize(" +
      this.genCeroOneValue() +
      ", " +
      this.genCeroOneValue() +
      ")"
    );
  }

  saturate() {
    return ".saturate(" + this.genValue() + ")";
  }

  thresh() {
    return (
      ".thresh(" + this.genCeroOneValue() + ", " + this.genCeroOneValue() + ")"
    );
  }

  // ENDCOLOR ---

  // GEOMETRY ---

  kaleid() {
    return ".kaleid(" + this.genValue() + ")";
  }

  pixelate() {
    return (
      ".pixelate(" +
      this.genCeroPointOneToMax() +
      ", " +
      this.genCeroPointOneToMax() +
      ")"
    );
  }

  repeat() {
    return (
      ".repeat(" +
      this.genValue() +
      ", " +
      this.genValue() +
      ", " +
      this.genValue() +
      ", " +
      this.genValue() +
      ")"
    );
  }

  repeatX() {
    return ".repeatX(" + this.genValue() + ", " + this.genValue() + ")";
  }

  repeatY() {
    return ".repeatY(" + this.genValue() + ", " + this.genValue() + ")";
  }

  rotate() {
    return ".rotate(" + this.genValue() + ", " + this.genValue() + ")";
  }

  scale() {
    return (
      ".scale(" +
      this.genPosOrNegValue() +
      ", " +
      this.genCeroPointOneToOne() +
      ", " +
      this.genCeroPointOneToOne() +
      ")"
    );
  }

  scrollX() {
    return ".scrollX(" + this.genValue() + ", " + this.genValue() + ")";
  }

  scrollY() {
    return ".scrollY(" + this.genValue() + ", " + this.genValue() + ")";
  }

  // ENDGEOMETRY ---

  // OPERATORS ---

  add() {
    return ".add(" + this.genSource() + ", " + this.genCeroOneValue() + ")";
  }

  blend() {
    return ".blend(" + this.genSource() + ", " + this.genCeroOneValue() + ")";
  }

  diff() {
    return ".diff(" + this.genSource() + ")";
  }

  layer() {
    return ".layer(" + this.genSource() + ")";
  }

  mask() {
    return (
      ".mask(" +
      this.genSource() +
      ", " +
      this.genValue() +
      ", " +
      this.genCeroOneValue() +
      ")"
    );
  }

  mult() {
    return ".mult(" + this.genSource() + ", " + this.genCeroOneValue() + ")";
  }

  // END OPERATORS ---
  // MODULATORS ---

  modulate() {
    if (random.randint(1, 100) <= this.modulateItselfProb)
      return ".modulate(o0, " + this.genValue() + ")";
    else return ".modulate(" + this.genSource() + ", " + this.genValue() + ")";
  }

  modulateHue() {
    if (random.randint(1, 100) <= this.modulateItselfProb)
      return ".modulateHue(o0, " + this.genValue() + ")";
    else
      return ".modulateHue(" + this.genSource() + ", " + this.genValue() + ")";
  }

  modulateKaleid() {
    if (random.randint(1, 100) <= this.modulateItselfProb)
      return ".modulateKaleid(o0, " + this.genValue() + ")";
    else
      return (
        ".modulateKaleid(" + this.genSource() + ", " + this.genValue() + ")"
      );
  }

  modulatePixelate() {
    if (random.randint(1, 100) <= this.modulateItselfProb)
      return ".modulatePixelate(o0, " + this.genValue() + ")";
    else
      return (
        ".modulatePixelate(" + this.genSource() + ", " + this.genValue() + ")"
      );
  }

  modulateRepeat() {
    if (random.randint(1, 100) <= this.modulateItselfProb)
      return (
        ".modulateRepeat(o0, " +
        this.genValue() +
        ", " +
        this.genValue() +
        ", " +
        this.genCeroOneValue() +
        ", " +
        this.genCeroOneValue() +
        ")"
      );
    else
      return (
        ".modulateRepeat(" +
        this.genSource() +
        ", " +
        this.genValue() +
        ", " +
        this.genValue() +
        ", " +
        this.genCeroOneValue() +
        ", " +
        this.genCeroOneValue() +
        ")"
      );
  }

  modulateRepeatX() {
    if (random.randint(1, 100) <= this.modulateItselfProb)
      return (
        ".modulateRepeatX(o0, " +
        this.genValue() +
        ", " +
        this.genCeroOneValue() +
        ")"
      );
    else
      return (
        ".modulateRepeatX(" +
        this.genSource() +
        ", " +
        this.genValue() +
        ", " +
        this.genCeroOneValue() +
        ")"
      );
  }

  modulateRepeatY() {
    if (random.randint(1, 100) <= this.modulateItselfProb)
      return (
        ".modulateRepeatY(o0, " +
        this.genValue() +
        ", " +
        this.genCeroOneValue() +
        ")"
      );
    else
      return (
        ".modulateRepeatY(" +
        this.genSource() +
        ", " +
        this.genValue() +
        ", " +
        this.genCeroOneValue() +
        ")"
      );
  }

  modulateRotate() {
    if (random.randint(1, 100) <= this.modulateItselfProb)
      return ".modulateRotate(o0, " + this.genValue() + ")";
    else
      return (
        ".modulateRotate(" + this.genSource() + ", " + this.genValue() + ")"
      );
  }

  modulateScale() {
    if (random.randint(1, 100) <= this.modulateItselfProb)
      return ".modulateScale(o0, " + this.genValue() + ")";
    else
      return (
        ".modulateScale(" + this.genSource() + ", " + this.genValue() + ")"
      );
  }

  modulateScrollX() {
    if (random.randint(1, 100) <= this.modulateItselfProb)
      return (
        ".modulateScrollX(o0, " +
        this.genCeroOneValue() +
        ", " +
        this.genCeroOneValue() +
        ")"
      );
    else
      return (
        ".modulateScrollX(" +
        this.genSource() +
        ", " +
        this.genCeroOneValue() +
        ", " +
        this.genCeroOneValue() +
        ")"
      );
  }

  modulateScrollY() {
    if (random.randint(1, 100) <= this.modulateItselfProb)
      return (
        ".modulateScrollY(o0, " +
        this.genCeroOneValue() +
        ", " +
        this.genCeroOneValue() +
        ")"
      );
    else
      return (
        ".modulateScrollY(" +
        this.genSource() +
        ", " +
        this.genCeroOneValue() +
        ", " +
        this.genCeroOneValue() +
        ")"
      );
  }

  // END MODULATORS ---
}
/*javascript function that checks if a given set is a subset of another given one*/
function isSubset(set: string[], superSet: string[]) {
  for (var i = 0; i < set.length; i++) {
    if (superSet.indexOf(set[i]) === -1) {
      return false;
    }
  }
  return true;
}
class random {
  static randint(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  static uniform(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
  static choice(list: any[]) {
    var index = Math.floor(Math.random() * list.length);
    return list[index];
  }
}
/* javascript function that returns the intersection of two given arrays*/
function intersection(arr1: any[], arr2: any[]) {
  var result = [];
  for (var i = 0; i < arr1.length; i++) {
    for (var j = 0; j < arr2.length; j++) {
      if (arr1[i] == arr2[j]) {
        result.push(arr1[i]);
        break;
      }
    }
  }
  return result;
}
export default CodeGenerator;