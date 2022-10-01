//@ts-nocheck
import REGL from "regl";
import { Hydra, generators } from "hydra-ts";
import ArrayUtils from "hydra-ts/src/lib/array-utils";

class HydraClient {
  private hydra;
  private time = 0;

  constructor() {
    const WIDTH = 1080;
    const HEIGHT = 1080;
    const DENSITY = 2;

    const canvas = document.createElement("canvas");
    canvas.style.backgroundColor = "#000000";
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    document.body.appendChild(canvas);

    ArrayUtils.init();

    const regl = REGL(canvas) as any;

    this.hydra = new Hydra({
      width: WIDTH * DENSITY,
      height: HEIGHT * DENSITY,
      precision: "mediump",
      regl,
    });

    this.hydra.loop.start();

    const { outputs, render } = this.hydra;
    const [o0] = outputs;

    render(o0);
    setInterval(() => (this.time += 0.016), 16);
  }
  eval(code: string) {
    const { sources, outputs, render } = this.hydra;
    const [s0, s1, s2, s3] = sources;
    const [o0, o1, o2, o3] = outputs;
    const time = this.time;
    //@ts-ignore
    const { src, osc, gradient, shape, voronoi, noise, solid } = generators;
    try {
      eval(code);
    } catch (error) {
      console.log("error: ", error);
    }
  }
}

export default HydraClient;
