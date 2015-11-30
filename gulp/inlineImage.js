import cheerio from 'cheerio';
import url     from 'url';
import path    from 'path';
import {readFileSync} from 'fs';
import Stream from 'stream';

let contentTypes = {
  ".png": "image/png",
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".bmp": "image/bmp",
  ".webp": "image/webp"
};

function isLocalHref(href) {
  return href && !url.parse(href).hostname;
}

function inline(reportPath, html) {
  let dom = cheerio.load(html);
  dom('a[href^="screenshots"] > img').each(function (idx, el) {
    el = dom(el);
    // Load screenshot
    let src = el.attr('src');
    if (src && isLocalHref(src)) {
      let file = path.join(reportPath, src);
      let img = readFileSync(file);
      let contentType = contentTypes[path.extname(file)] || 'image/png';
      let dataUri = `data:${contentType};base64,${img.toString("base64")}`;
      // Now replace the relative URI with the data URI.
      el.attr('src', dataUri);
    }
  });
  return new Buffer(dom.html({decodeEntities: false}));
}

export function inlineImage() {
  let stream = new Stream.Transform({objectMode: true});

  stream._transform = function (file, enc, cb) {
    if (file.isBuffer()) {
      let dir = file.path.replace(path.basename(file.path), '');
      file.contents = inline(dir, file.contents);
      this.push(file);
      return cb();
    }
    cb(null, file);
  };

  return stream;
}