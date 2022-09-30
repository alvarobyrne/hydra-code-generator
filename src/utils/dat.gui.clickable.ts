import { type GUI } from "dat.gui";

const clickableAnchor = (href: string) => {
  const clickable: HTMLAnchorElement = document.createElement("a");
  clickable.target = "_blank";
  clickable.href = href;
  clickable.click();
};
const clickable = (url: string, name: string, gui: GUI) => {
  gui
    .add(
      {
        f: () => clickableAnchor(url),
      },
      "f"
    )
    .name(name);
};
export default clickable;
