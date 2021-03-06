# Change Log

## 5.0.1

- Fix Node.js compatibility table in `package.json`.

## 5.0.0

- **Breaking** Minimal Node.js version bump to 12
- Upgrade to ECMAScript modules
- First-class browser support (with import-maps)
- Add support for deno (experimental)

## 4.2.2

- Bump version number (npm release on wrong channel)

## 4.2.1

- Fix issue with class and use of angle brackets
- Fix issue with class details not shown properly
- Upgrade dependencies

## 4.2.0

- Fix issue with sequence diagram arrows
- Fix issue with three hex digit colors
- Fix issue with class components color
- Optimize SVG output size
- Upgrade dependencies

## 4.1.0

- Add DOT header overrides to the API to let users customize diagram appearance
- Add TypeScript definitions
- Fix class diagrams
- Bug fixes and performance improvement

## 4.0.1

- Fix some broken features on class and activity diagrams

## 4.0.0

- The API is now promisified due to `Viz.js` v2
  ([huge performance boost](https://github.com/mdaines/viz.js/issues/120#issuecomment-389281407)).
- Added sequence diagrams support.
- Solve issue with record shapes and `Graphviz` 2.39+.
- Add support for `Readable` streams and `Buffer`.
- The API rejects when a error occurs instead of generating a SVG with error
  message.
- Lazy load rendering modules to improve startup time

## 3.1

- Expose `options` object to the API

## 3.0

- Remove global scope uses
- Remove VSCode extension code (this fork aims to be used as a NPM module)

## 2.14

- Added Markdown support
- Improved the generation of SVG artifacts
- Improved rendering for dark and light themes

## 2.13

- Added Sequence diagrams
- Solved issue #31

## 2.12

- Fixed issues related to restrictions for publishing in the Marketplace

## 2.10

- Solved bug #20: Activity Diagram: {bg:xxx} Attribute Overrides Style
- Added feature #15: Allow Escaping "Split" Tokens
- Added testing and continuous integration settings

## 2.9

- Solved bug #17: Use-case inheritance triangle was inverted when comparaed with
  YUML
- Upgraded to viz.js 1.7.1

## 2.8

- Added Package diagrams

## 2.7

- Added Deployment diagrams

## 2.6

- Improvements in the rendering of activity diagrams
- Added a top bar with useful links

## 2.5

- Association classes for the class diagram
- Smart text coloring
- Improved focusing of the editor window
- Solved bug: Class diagram with details not properly rendered with LR direction
- Solved bug: {bg} color names not rendered correctly

## 2.4

- Adjustments for VSCode 1.4

## 2.3

- Better syntax highlight
- Code snippets
- Solved bug: Restored "generate file" functionality

## 2.2

- Added theme-aware coloring

## 2.1

- Solved bug: Long labels are not properly split
- Solved bug: Some special characters in labels crash the diagram generator

## 2.0

- Removed the dependency on http://yuml.me
- Implemented a local svg renderer
- Added support for State diagrams
- Wiki page for the yUML syntax
