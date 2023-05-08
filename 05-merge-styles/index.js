const fs = require('fs');
const path = require('path');

const srcName = 'styles';
const folderName = 'project-dist';
const bundleName = 'bundle.css';

const distName = path.join(__dirname, folderName);
const srcPath = path.join(__dirname, srcName);
const filePath = path.join(distName, bundleName);

let result = '';

fs.writeFile(filePath, '', (err) => {
  if (err) throw err;
});

fs.readdir(srcPath, { withFileTypes: true }, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    if (path.extname(file.name) === '.css') {
      const cssPath = path.join(srcPath, file.name);
      const readStream = fs.createReadStream(cssPath);

      readStream.on('data', (chunk) => {
        result += chunk;
      });

      readStream.on('end', () => {
        fs.appendFile(filePath, result, (err) => {
          if (err) throw err;
          
          console.log(`DONE!`);
        });
      });
    }
  });
});