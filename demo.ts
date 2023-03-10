import express from 'express';
import serve from 'express-static';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import icongen from 'icon-gen';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

const app = express();

app.get('/', (req, res, next) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  fs.promises.readFile(`${__dirname}/public/index.html`).then(html => {
    res.write(html);
    res.end();
  });
});
// @ts-ignore
app.use(serve(`${__dirname}/public`, null));

const iconTimestampFile = "./icon-timestamp.txt";
const iconTimestamp = fs.existsSync(iconTimestampFile) ? fs.readFileSync(iconTimestampFile).toString() : 0;

const {mtime : iconModified} = fs.statSync('./icon.png');
if (`${iconModified.getTime()}` !== iconTimestamp) {
  icongen('icon.png', './public')
  .then((results) => {
    console.log(`${results.length} icons generated.`);
  })
  .catch((err) => {
    console.error(err)
  });
  fs.writeFileSync(iconTimestampFile, `${iconModified.getTime()}`);
}

const server = app.listen(PORT, () => {
  console.log('Demo running at %s', PORT);
});
