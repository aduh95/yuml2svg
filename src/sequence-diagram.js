const {
  extractBgAndNote,
  formatLabel,
  recordName,
  splitYumlExpr,
} = require("./yuml2dot-utils.js");
const Renderer = require("./sequence-renderer.js");

/*
Unofficial syntax, based on a proposal specified in the Scruffy project, plus local additions

Object     [Patron]
Message    [Patron]order food>[Waiter]
Response   [Waiter]serve wine.>[Patron]
Note       [Actor]-[note: a note message]
Comment    // Comments

Asynchronous message            [Patron]order food>>[Waiter]
Open activation box at source   [Source](message>[Dest]
Open activation box at dest     [Source]message>([Dest]
Close activation at dest        [Source]message>)[Dest]
Close activation at source      [Source])message>[Dest]
Cancel activation box           [Source])X
*/

function parseYumlExpr(specLine) {
  const exprs = [];
  const parts = splitYumlExpr(specLine, "[");

  for (let i = 0; i < parts.length; i++) {
    let part = parts[i].trim();
    if (part.length === 0) continue;

    if (part.match(/^\[.*\]$/)) {
      // object
      part = part.substr(1, part.length - 2);
      const ret = extractBgAndNote(part, true);
      exprs.push([
        ret.isNote ? "note" : "object",
        ret.part,
        ret.bg,
        ret.fontcolor,
      ]);
    } else if (part.indexOf(">") >= 0) {
      // message
      let style = part.indexOf(".>") >= 0 ? "dashed" : "solid";
      style = part.indexOf(">>") >= 0 ? "async" : style;

      let prefix = "";
      if (part.startsWith("(") || part.startsWith(")")) {
        prefix = part.substr(0, 1);
        part = part.substr(1);
      }

      let message = "";
      const pos = part.match(/[\.|>]{0,1}>[\(|\)]{0,1}$/);
      if (pos === null) {
        throw new Error("Invalid expression");
      } else if (pos.index > 0) {
        message = part.substr(0, pos.index);
        part = part.substr(pos.index);
      }

      let suffix = "";
      if (part.endsWith("(") || part.endsWith(")")) {
        suffix = part.charAt(part.length - 1);
        part = part.substr(0, part.length - 1);
      }

      exprs.push(["signal", prefix, message, style, suffix]);
    } else throw new Error("Invalid expression");
  }

  return exprs;
}

function composeSVG(specLines, options) {
  const actors = [];
  const signals = [];

  const uids = {};
  for (let i = 0; i < specLines.length; i++) {
    const elem = parseYumlExpr(specLines[i]);

    for (let k = 0; k < elem.length; k++) {
      const type = elem[k][0];

      if (type === "object") {
        let label = elem[k][1];
        const name = recordName(label);
        if (name in uids) continue;

        label = formatLabel(label, 20, true);
        const actor = {
          type: elem[k][0],
          name,
          label,
          index: actors.length,
        };
        uids[name] = actor;

        actors.push(actor);
      }
    }

    const isValidElem =
      elem.length === 3 && elem[0][0] === "object" && elem[1][0] === "signal";

    if (isValidElem && elem[2][0] === "object") {
      const [_, __, message, style] = elem[1];
      const actorA = uids[recordName(elem[0][1])];
      const actorB = uids[recordName(elem[2][1])];

      switch (style) {
        case "dashed":
          signals.push({
            type: "signal",
            actorA,
            actorB,
            linetype: "dashed",
            arrowtype: "arrow-filled",
            message,
          });
          break;
        case "solid":
          signals.push({
            type: "signal",
            actorA,
            actorB,
            linetype: "solid",
            arrowtype: "arrow-filled",
            message,
          });
          break;
        case "async":
          signals.push({
            type: "signal",
            actorA,
            actorB,
            linetype: "solid",
            arrowtype: "arrow-open",
            message,
          });
          break;

        default:
      }
    } else if (isValidElem && elem[2][0] === "note") {
      const actor = uids[recordName(elem[0][1])];
      const message = formatLabel(elem[2][1], 20, true);
      const note = { type: "note", message, actor };

      if (elem[2][2])
        // background color
        note.bgcolor = elem[2][2];
      if (elem[2][3])
        // font color
        note.fontcolor = elem[2][3];

      signals.push(note);
    }
  }

  const renderer = new Renderer(actors, signals, uids, options.isDark);
  return renderer.svg_.serialize();
}

module.exports = composeSVG;