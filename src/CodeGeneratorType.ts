type CodeGeneratorProps = {
  min?: number;
  max?: number;
  arrowFunctionProb?: number;
  mouseFunctionProb?: number;
  modulateItselfProb?: number;
  ignoredList?: string[];
  exclusiveSourceList?: string[];
  exclusiveFunctionList?: string[];
};

export default CodeGeneratorProps;
