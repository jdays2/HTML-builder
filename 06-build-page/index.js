const fs = require('fs');
const path = require('path');

const TEMPLATE_PATH = path.join(__dirname, 'template.html');
const COMPONENTS_DIR = path.join(__dirname, 'components');
const STYLES_DIR = path.join(__dirname, 'styles');
const ASSETS_DIR = path.join(__dirname, 'assets');
const DIST_DIR = path.join(__dirname, 'project-dist');

async function createDirectory(path) {
  try {
    await fs.promises.access(path);
  } catch {
    await fs.promises.mkdir(path);
  }
}

async function readDirectory(path) {
  try {
    const files = await fs.promises.readdir(path);
    return files.filter(file => file.includes('.html'));
  } catch {
    return [];
  }
}

async function readCssDirectory(path) {
  try {
    const files = await fs.promises.readdir(path);
    return files.filter(file => file.includes('.css'));
  } catch {
    return [];
  }
}

async function readFile(path) {
  return await fs.promises.readFile(path, 'utf-8');
}

async function writeFile(path, content) {
  return await fs.promises.writeFile(path, content);
}

async function copyDirectory(src, dest) {
  await createDirectory(dest);

  const files = await fs.promises.readdir(src);

  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    const stat = await fs.promises.stat(srcPath);

    if (stat.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      const content = await fs.promises.readFile(srcPath);
      await fs.promises.writeFile(destPath, content);
    }
  }
}
async function build() {
  await createDirectory(DIST_DIR);
  console.log('The folder seems to have been created.......');

  await copyDirectory(ASSETS_DIR, path.join(DIST_DIR, 'assets'));
  console.log('The assets seem to be installed...?');

  let template = await readFile(TEMPLATE_PATH);

  const componentFiles = await readDirectory(COMPONENTS_DIR);
  for (const componentFile of componentFiles) {
    const componentName = path.basename(componentFile, '.html');
    const componentContent = await readFile(path.join(COMPONENTS_DIR, componentFile));
    const componentPattern = new RegExp(`{{${componentName}}}`, 'g');
    template = template.replace(componentPattern, componentContent);
  }

  const styleFiles = await readCssDirectory(STYLES_DIR);
  let cssContent = '';
  for (const styleFile of styleFiles) {
    if (path.extname(styleFile) !== '.css') {
      throw new Error(`Invalid file type ${path.extname(styleFile)} in ${STYLES_DIR}`);
    }
    const styleContent = await readFile(path.join(STYLES_DIR, styleFile));
    cssContent += styleContent;
  }

  await writeFile(path.join(DIST_DIR, 'index.html'), template);
  console.log('markup is loaded in html ;| ');

  await writeFile(path.join(DIST_DIR, 'style.css'), cssContent);
  console.log('styles is loaded in css\n');
  console.log('Если я с чем-то не разобрался, напишите мне, я поправлю! Не оценивайте анонимно, пожалуйста!');
}
build();

