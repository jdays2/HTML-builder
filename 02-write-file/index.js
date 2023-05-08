const fs = require('fs');
const readline = require('readline');
const path = require('path');

const filename = 'party.txt';
const filePath = path.join(__dirname, filename);

const welcomeMessage =
  '"Оставь одежду всяк сюда входящий..."\nГласила табличка на двери в которую вы вошли. Ваши действия?\n\n';
const exitMessage = '\nВас выгнали...';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const exit = () => {
  process.stdout.write(exitMessage);
  process.exit();
};

fs.writeFile(filePath, '', () => {});

process.stdout.write(welcomeMessage);

rl.on('line', (input) => {
  if (input === 'exit') exit();

  fs.appendFile(filePath, `${input}\n`, (err) => {
    if (err) console.error(err);
    return;
  });
});

rl.on('SIGINT', exit);
