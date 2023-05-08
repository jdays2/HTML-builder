const fs = require('fs');
const path = require('path');

const folderName = 'secret-folder';
const pathFolder = path.join(__dirname, folderName);

const startMessage = '\nHello there! Let\'s see what we have here...\n\n';

fs.readdir(pathFolder, { withFileTypes : true }, (error, result) => {
  if (error) return console.log(error);

  for (let i = 0; i < result.length; i++) {
    const filePath = path.join(pathFolder, result[i].name);
    fs.stat(filePath, (error, stat)=>{
      if (error) {
        console.error('Error!');
        return;
      } 
      if(stat.isFile()){
        const extension = path.extname(filePath);
        const fileName = path.basename(filePath, extension);
        process.stdout.write(`${fileName} - ${extension} - ${Math.floor(stat.size/1024)}kb\n`);
      }
    });
  }
});

process.stdout.write(startMessage);