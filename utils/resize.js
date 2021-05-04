'use strict';
const sharp = require('sharp');

const cropImage = async (file, thumbname) => { // file = full path to image (req.file.path), thumbname = filename (req.file.filename)
  return await sharp(file).resize({
    fit: sharp.fit.contain,
    width: 500
  }).toFile('thumbnails/' + thumbname);
};

module.exports = {
  cropImage,
};