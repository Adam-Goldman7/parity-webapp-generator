
'use strict';

const fs = require('fs-extra');
const unzip = require('unzip');
const Archiver = require('archiver');
const rsGen = require('../util/generator');

module.exports = {
  zip: zip
};

function zip (req, res, next) {
  const staticPath = './tmp/static/';
  const path = req.files['file-input'].file;
  let unzipStream = fs.createReadStream(path);

  unzipStream.pipe(unzip.Extract({ path: staticPath + 'src/web' })).on('close', (err) => {
    console.log('unzipStream closed!');

    if (err) {
      console.log('unzipStream err: ', err);
      return res.send('error!');
    }

    const fromCargo = staticPath + 'src/web/Cargo.toml';
    const toCargo = staticPath + 'Cargo.toml';

    fs.move(fromCargo, toCargo, function (err) {
      if (err) {
        return console.error('Cargo.toml move error: ', err);
      }

      const compiledRs = rsGen(staticPath).join('\n');
      fs.outputFile(staticPath + 'src/lib.rs', compiledRs, (err) => {
        if (err) {
          return console.error('compiled Rs error: ', err);
        }

        console.log('compiled lib.rs');

        res.set('Content-Type', 'application/zip');
        res.set('Content-disposition', 'attachment; filename=myFile.zip');

        let zip = Archiver('zip');
        zip.on('end', err => fs.removeSync('./tmp'));

        zip.pipe(res);
        zip.directory(staticPath, '')
           .finalize();
      });
    });
  });
}


