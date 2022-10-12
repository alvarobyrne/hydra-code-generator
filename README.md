# Hydra code generator in typescript

A port from the @alecominotti python version

# Original project
- https://hydracg.herokuapp.com/
- https://github.com/alecominotti/hydracodegenerator

**Not ported**: In the original port one may run a local server and control hydra from there

# View on line

<a href="https://alvarobyrne.github.io/hydra-code-generator/" target="_blank">view on line</a>

# TODO:

- currently, upon building using vite's defualt `tsconfig.json` file, there are many `ts` errors in the `hydra-ts`  library, so one has to add the `//@ts-nocheck` at the top of the files that throw such errors.
- The mouse function probability has not been ported (and might not be)
- Remove many `//@ts-ignore` comments
### Other functions 

That I would like to add:
- https://github.com/samarthgulati/hydra-blockly/blob/master/image-editing-glsl-functions.js

# References:

- @ojack's https://github.com/ojack/hydra-editor-cm6 @ojack

## using 

https://github.com/folz/hydra-ts

### Code is copied to clipbaord

Upon random generation code is also copied to clipboard so that it is easy to paste (for example at https://hydra.ojack.xyz)