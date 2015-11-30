import pdf from 'phantom-html2pdf';

import Stream from 'stream';

function generatePDF(file, cb) {
  let options = {
    html: file.contents
  };
  pdf.convert(options, function (result) {
    file.contents = result.toStream();
    cb(null, file);
  });
}

export function toPDF() {
  let stream = new Stream.Transform({objectMode: true});

  stream._transform = function (file, enc, cb) {
    generatePDF(file, cb);
  };

  return stream;
}