const colors = require('colorthief');
const { createCanvas, loadImage } = require('canvas');

exports.isSolidColor = (req, res) => {
  colors.getColor(req.body.img_url).then(dominantColor => {
    const isSolidColor = dominantColor.every(v => v < 50);
    res.json({ solid: isSolidColor });
  }).catch(() => res.json({ error: 'Could not process request' }));
}

const mostlyDark = async (url, threshold = 20) => {

  const getIndices = (x, y, width) => {
    var red = y * (width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
  };

  const numSamples = 1000;
  const percentageThreshold = 75;

  const image = await loadImage(url);
  const canvas = createCanvas(image.width, image.width);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);

  let samplesLeft = numSamples;
  let darkCount = 0;
  const data = ctx.getImageData(0, 0, image.width, image.height).data;
  while (samplesLeft--) {
    const x = Math.floor(Math.random() * image.width);
    const y = Math.floor(Math.random() * image.height);
    const [r, g, b] = getIndices(x, y, image.width);
    //console.log({ x, y, r: data[r], g: data[g], b: data[b] })
    const dark = data[r] < threshold && data[g] < threshold && data[b] < threshold;
    if (dark) {
      darkCount++;
    }
  }

  const percentDark = (darkCount / numSamples * 100);
  return percentDark > percentageThreshold;
};
exports.mostlyDark = mostlyDark;

// Expose mostlyDark as a service
exports.mostlyDarkService = (req, res) => {
  mostlyDark(req.body.img_url).then(isDark => {
    res.json({ isDark });
  }).catch(() => res.json({ error: 'Could not process request' }));
};
