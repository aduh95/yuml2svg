const fs = require("fs");

const classDiagram = require("./class-diagram.js");
const usecaseDiagram = require("./usecase-diagram.js");
const activityDiagram = require("./activity-diagram.js");
const stateDiagram = require("./state-diagram.js");
const deploymentDiagram = require("./deployment-diagram.js");
const packageDiagram = require("./package-diagram.js");
const Viz = require("viz.js");
const processEmbeddedImages = require("./svg-utils.js");
const { buildDotHeader } = require("./yuml2dot-utils");

const processYumlDocument = function(text, filename, mayGenerate) {
  const newlines = [];
  const options = { dir: "TB", generate: false };

  const lines = text.split(/\r|\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/^\s+|\s+$/g, ""); // Removes leading and trailing spaces
    if (line.startsWith("//")) processDirectives(line, options);
    else if (line.length > 0) newlines.push(line);
  }

  if (newlines.length === 0) return "";

  if (!options.hasOwnProperty("type")) {
    options.error = "Error: Missing mandatory 'type' directive";
  }

  if (options.hasOwnProperty("error")) {
    return options.error;
  }

  let dot = null;

  try {
    switch (options.type) {
      case "class":
        dot = classDiagram(newlines, options);
        break;
      case "usecase":
        dot = usecaseDiagram(newlines, options);
        break;
      case "activity":
        dot = activityDiagram(newlines, options);
        break;
      case "state":
        dot = stateDiagram(newlines, options);
        break;
      case "deployment":
        dot = deploymentDiagram(newlines, options);
        break;
      case "package":
        dot = packageDiagram(newlines, options);
        break;
    }
  } catch (e) {
    console.error(e);
    return "Error parsing the yUML file";
  }

  if (dot === null) return "Error: unable to parse the yUML file";

  let svgLight, svgDark;
  try {
    svgLight = Viz(buildDotHeader(false) + dot);
    svgLight = processEmbeddedImages(svgLight, false);

    // svgDark = Viz(buildDotHeader(true) + dot);
    // svgDark = processEmbeddedImages(svgDark, true);
  } catch (e) {
    console.error(e);
    return "Error composing the diagram";
  }

  try {
    if (options.generate === true && mayGenerate === true) {
      const imagename = filename.replace(/\.[^.$]+$/, ".svg");
      fs.writeFileSync(imagename, svgLight);
    }
  } catch (e) {
    console.error(e);
  }

  return svgLight;
  // "<div id='light'>\r\n" +
  // svgLight +
  // "\r\n</div><div id='dark'>\r\n" +
  // svgDark +
  // "\r\n</div>"
};

let processDirectives = function(line, options) {
  const directions = {
    leftToRight: "LR",
    rightToLeft: "RL",
    topDown: "TB",
  };

  const keyvalue = /^\/\/\s+\{\s*([\w]+)\s*:\s*([\w]+)\s*\}$/.exec(line); // extracts directives as:  // {key:value}
  if (keyvalue !== null && keyvalue.length === 3) {
    const key = keyvalue[1];
    const value = keyvalue[2];

    switch (key) {
      case "type":
        if (/^(class|usecase|activity|state|deployment|package)$/.test(value))
          options.type = value;
        else {
          options.error =
            "Error: invalid value for 'type'. Allowed values are: class, usecase, activity, state, deployment, package.";
          return;
        }
        break;
      case "direction":
        if (/^(leftToRight|rightToLeft|topDown)$/.test(value))
          options.dir = directions[value];
        else {
          options.error =
            "Error: invalid value for 'direction'. Allowed values are: leftToRight, rightToLeft, topDown <i>(default)</i>.";
          return;
        }
        break;
      case "generate":
        if (/^(true|false)$/.test(value)) options.generate = value === "true";
        else {
          options.error =
            "Error: invalid value for 'generate'. Allowed values are: true, false <i>(default)</i>.";
          return;
        }
    }
  }
};

module.exports = processYumlDocument;
