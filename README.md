# Build Checker App

A simple app for check status CI status using Electron JS. For now BuildCheckerApp works with all CI/CD servers that response a CCTray XML file.

[Electron](http://electron.atom.io/) app based on [React](https://facebook.github.io/react/), [Redux](https://github.com/reactjs/redux), [React Router](https://github.com/reactjs/react-router), [Webpack](http://webpack.github.io/docs/), [React Transform HMR](https://github.com/gaearon/react-transform-hmr) for rapid application development

## CCTray format examples:

### Travis-CI:

- Public repositories: `https://api.travis-ci.org/repos/<owner>/<repository>/cc.xml`
- Private repositories: `https://api.travis-ci.com/repositories/<owner>/<repository>.xml?token=<token>`

### Snap-CI:

- Public/private repositories: `https://snap-ci.com/<owner>/<repository>/branch/<branchname>/cctray.xml`

### Circle CI:

- Public/private repositories: `https://circleci.com/gh/<owner>/<repository>.cc.xml?circle-token=<token>`

### Wercker CI:

The Wercker CI use HTTP basic auth in your cctray url. For solve this, please use a trick using the URL itself, as specified in [RFC 1738](http://www.ietf.org/rfc/rfc1738.txt). Simply pass the user/pass before the host with an `@` sign.

- Public/private repositories: `https://<your-wercker-username>:<your-wercker-password>@app.wercker.com/api/v2/applications/<your-wercker-project-id>/cc/build`

> For know more about the `<your-wercker-project-id>`, please access the post on Wercker Blog ["Build and deploy status notification with the cctray feed"](http://blog.wercker.com/2013/07/12/Build-and-deploy-status-notifications-with-cctray-feed.html)

## Screenshot

![Build Checker App](http://i.imgur.com/Yene0cP.gif?1)

## Install

First, clone the repo via git:

```bash
git clone https://github.com/willmendesneto/build-checker-app.git <your-project-name>
```

And then install dependencies.

```bash
$ cd <your-project-name> && npm install
```

> Please check `.nvmrc` file. Please run the specific node and npm versions for use this repository

## Run

Run this two commands __simultaneously__ in different console tabs.

```bash
$ npm run build-css
$ npm run hot-server
$ npm run start-hot
```

or run two servers with one command

```bash
$ npm run dev
```

*Note: requires a node version >= 4 and an npm version >= 2.*


## Common issues

If you are running the app in a unix environment, there's an issue about some specific operational system versions (until right now only happens in Ubuntu 0.14) that is about the integration between ElectronJS Tray component and OS. To solve this you need to install `libappindicator1` package using this command.

```bash
sudo apt-get update
sudo apt-get install libappindicator1
``

If you find issues, please feel free to create a new issue in the repository :)

## Externals

If you use any 3rd party libraries which can't be built with webpack, you must list them in your `webpack.config.base.js`：

```javascript
externals: [
  // put your node 3rd party libraries which can't be built with webpack here (mysql, mongodb, and so on..)
]
```

You can find those lines in the file.


## CSS Modules

This boilerplate out of the box is configured to use [css-modules](https://github.com/css-modules/css-modules).

All `.css` file extensions will use css-modules unless it has `.global.css`.

If you need global styles, stylesheets with `.global.css` will not go through the
css-modules loader. e.g. `app.global.css`


## Package

```bash
$ npm run package
```

To package apps for all platforms:

```bash
$ npm run package-all
```

## Options

- --name, -n: Application name (default: ElectronReact)
- --version, -v: Electron version (default: latest version)
- --asar, -a: [asar](https://github.com/atom/asar) support (default: false)
- --icon, -i: Application icon
- --all: pack for all platforms

Use `electron-packager` to pack your app with `--all` options for darwin (osx), linux and win32 (windows) platform. After build, you will find them in `release` folder. Otherwise, you will only find one for your os.

`test`, `tools`, `release` folder and devDependencies in `package.json` will be ignored by default.

## Default Ignore modules

We add some module's `peerDependencies` to ignore option as default for application size reduction.

- `babel-core` is required by `babel-loader` and its size is ~19 MB
- `node-libs-browser` is required by `webpack` and its size is ~3MB.

> **Note:** If you want to use any above modules in runtime, for example: `require('babel/register')`, you should move them from `devDependencies` to `dependencies`.

## Building windows apps from non-windows platforms

Please checkout [Building windows apps from non-windows platforms](https://github.com/maxogden/electron-packager#building-windows-apps-from-non-windows-platforms).
