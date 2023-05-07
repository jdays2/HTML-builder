const fs = require('fs');
const path = require('path');

const existMessage = 'The folder already exists and has been updated!.\n'
const createMessage = '\nFolder created!\n'

const srcFolderName = 'files';
const resFolderName = 'files-copy';

const srcPath = path.join(__dirname, srcFolderName);
const resPath = path.join(__dirname, resFolderName);

const copyDir = (src, res) => {
  fs.access(res, (err)=>{
    if(!err){
      process.stdout.write(existMessage);
      fs.rm(res, { recursive: true }, (err) => {
        if (err) throw err;
        createDir(src, res);
      });
    } else {
      process.stdout.write(createMessage);
      createDir(src, res);
    }
  });
}

const createDir = (src, res) => {
  fs.mkdir(res, (err)=>{
    if(err) throw err;
    fs.readdir(src, {withFileTypes: true}, (err,files)=>{
      if(err) throw err;
      files.forEach((file)=>{
        const fileSrcPath = path.join(src, file.name);
        const fileResPath = path.join(res, file.name);
        if(file.isDirectory()){
          copyDir(fileSrcPath, fileResPath);
        } else {
          fs.copyFile(fileSrcPath, fileResPath, (err)=>{
            if(err) throw err;
          })
        }
      })
    })
  })
}

copyDir(srcPath, resPath)