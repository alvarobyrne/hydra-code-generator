# Hydra code generator in typescript

A port from the @alecominotti python version

# Original project
- https://hydracg.herokuapp.com/
- https://github.com/alecominotti/hydracodegenerator

**Not ported**: In the original port one may run a local server and control hydra from there

# View on line

<a href="https://alvarobyrne.github.io/hydra-code-generator/" target="_blank">view on line</a>

# TODO:

- One shouldn't be able to mark the same function as _exclusive_ and _ignored_ at the same time, currently there is no error capturing for this
- Remove many @ts-ignore comments
- Add keymaps for evaluation
### Other functions 

That I would like to add:
- https://github.com/samarthgulati/hydra-blockly/blob/master/image-editing-glsl-functions.js

# References:

- @ojack's https://github.com/ojack/hydra-editor-cm6 @ojack

### Code is copied to clipbaord

Upon random generation code is also copied to clipboard so that it is easy to paste (for example at https://hydra.ojack.xyz)