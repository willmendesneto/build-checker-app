# Build Checker App



## Run application
### With file watch and livereload

```bash
gulp serve
```

### Pre-packaging app

```bash
gulp build;electron dist
```

## Package application

```bash
gulp package
```

## Directory structure

```
+ .serve/              Compiled files
+ dist/                Application for distribution
- release/             Packaged applications for platforms
 |+ darwin/
 |+ linux/
 |+ win32/
- src/                 Source directory
 |- assets/
  |+ images/
 |- browser/           For browser process scripts
  |+ menu/
 |- renderer/          For renderer process scripts and resources
  |+ components/       React components
  |  bootstrap.js      Entry point for render process
  |  index.html
 |- styles/            SCSS directory
 |  app.js             Entry point for browser process
  bower.json           Bower package (optional)
  gulpfile.js          Gulp tasks
  package.json
```
