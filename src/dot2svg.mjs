import Viz from "viz.js";
let viz, oldVizOptions;

const createVizInstanceWithDefaultOptions = () =>
  import("viz.js/full.render.js")
    .then(module => module.default)
    .then(({ Module, render }) => new Viz({ Module, render }));

/**
 *
 * @param {string} dot The graph to render, as DOT
 * @param {object} [vizOptions] @see https://github.com/mdaines/viz.js/wiki/API#new-vizoptions
 * @param {object} [renderOptions] @see https://github.com/mdaines/viz.js/wiki/API#render-options
 */
export default async (dot, vizOptions, renderOptions) => {
  if (vizOptions && vizOptions !== oldVizOptions) {
    viz = new Viz((oldVizOptions = vizOptions));
  } else if (viz === undefined) {
    viz = createVizInstanceWithDefaultOptions();
  }
  const renderer = await viz;
  return renderer.renderString(dot, renderOptions).catch(err => {
    /** @see https://github.com/mdaines/viz.js/wiki/Caveats */
    viz = undefined;
    oldVizOptions = undefined;

    throw err;
  });
};
