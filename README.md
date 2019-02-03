cmsis-viewer
====================

> What the heck is goin on in that little thing!

# Prerequisites

 * [node](https://nodejs.org) - latest version
 * [npm](https://nodejs.org) - latest version
 * [gnu-rm](https://developer.arm.com/open-source/gnu-toolchain/gnu-rm/downloads) - gnu embedded toolchain for arm
 * [python](https://www.python.org/) - required by `gdb-js`

# Installation

```
# clone repo including submodules
git clone --recursive <this-repo>

# install dependencies
npm install
```

# Usage 

Using gdb functionality requires a gdb server to be up and running. For example, to debug stm32 mcu's you need to launch `st-util` before running debugger. If you can launch debugger in your terminal, you can launch debugger in this tool.

Also make sure your executable has proper debug flags. You won't be able to read CMSIS variables without `-g3` flag.

Once gdb server is up and running, simply start the electron app.

```
npm start
```

# Todo

 * test/fix functionality on windows
 * test/fix functionality on osx
 * ui needs work, it's confusing to anyone who didn't make the tool
 * allow commands to be executed in terminal emulator
 * consider launching gdb server for user when launching debugger
 * add build config for production
 * add launch script that does not host remote content in electron
 * publish to npm
 * package electron for window, osx, and linux
 * improve gdb toolbar button state, user is required to refresh the page (ctrl+r) because the toolbar get's in a bad state.

# Contributing

If you have something you want to contribute, please create an issue and/or submit a pull request.
