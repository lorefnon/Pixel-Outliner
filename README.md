<table>
  <tr>
    <td rowspan='2'>
      <img src="https://raw.githubusercontent.com/lorefnon/pixel-outliner/master/assets/icons/pxo_app_icon.png">
    </td>
    <td>
      <strong> Pixel Outliner </strong>
    </td>
  </tr>
  <tr>
    <td>
      Lightweight cross-platform minimal outliner for everyday note-taking, brainstorming and ideation.
    </td>  
  </tr>
</table>

## Current Status:

Beta. Most features are functional, though the user interface needs polishing. File format may undergo backward incompatible changes
before we reach 1.0. Not recommended for serious use.

## Screenshots:

<img src="https://raw.githubusercontent.com/lorefnon/pixel-outliner/master/assets/screenshots/screenshot.png">

## Goals

- To provide a cross-platform & intuitive bloat-free interface for outling and note-taking.
- To provide a vendor neutral solution that does not lock the user in any proprietary service.

## Running the app:

### Pre-packaged apps:

Pre-packaged app for OS X (64 bit) is available [here]().
Installers will be available for other major platforms soon.

### Installation from source:

- Install nwjs (previously node-webkit): This provides the foundational framework for building desktop applications in javascript
- Install node.js (nvm is recommended approach, although official installers should work fine as well): This is required for our javascript based toolchain
- `cd pixel-outliner`
- Install gulp - our build tool: `npm install -g gulp`
- Install project dependencies: `npm install`
- Build the source: `gulp`
- Run the app: `nwjs .`

### Building the Mac App:

- `gulp bundle`

## License:

[![GPL V3.0](http://www.gnu.org/graphics/gplv3-127x51.png)](http://www.gnu.org/licenses/gpl-3.0.en.html)

Pixel Outliner is built upon open source technologies, and is available under [GPL v3.0 license](https://www.gnu.org/copyleft/gpl.html). Community contributions are more than welcome, as long as they are aligned with the project goals.
