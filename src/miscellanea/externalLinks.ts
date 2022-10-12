import type { GUI } from "dat.gui";
import clickable from "../utils/dat.gui.clickable";

const setExternalLinks = (gui: GUI) => {
  const externalLinksFolder = gui.addFolder("Links");
  location;
  console.log("location: ", location);
  if (location.href.indexOf("127.0.0.1") > -1) {
    clickable(
      "https://alvarobyrne.github.io/hydra-code-generator",
      "this page live",
      externalLinksFolder
    );
  }
  clickable(
    "https://github.com/alvarobyrne/hydra-code-generator",
    "this page's code repo",
    externalLinksFolder
  );
  clickable(
    "https://hydracg.herokuapp.com/",
    "original python app at heroku",
    externalLinksFolder
  );
  clickable(
    "https://github.com/alecominotti/hydracodegenerator",
    "original python repo",
    externalLinksFolder
  );
};

export { setExternalLinks };
