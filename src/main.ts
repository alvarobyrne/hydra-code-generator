import CodeGenerator from "./CodeGenerator";
import "./style.css";
const hydra = new CodeGenerator({});
console.log("hydra: ", hydra);
const allSources = hydra.sourcesList;
console.log("allSources: ", allSources);
// const allFunctions = hydra.allFunctions
// console.log("allFunctions: ", allFunctions);

const defaultIgnoredList = hydra.ignoredList;
console.log("defaultIgnoredList: ", defaultIgnoredList);

const defaultExclusiveSources = hydra.exclusiveSourceList;
console.log("defaultExclusiveSources: ", defaultExclusiveSources);

const defaultExclusiveFunctions = hydra.exclusiveFunctionList;
console.log("defaultExclusiveFunctions: ", defaultExclusiveFunctions);
