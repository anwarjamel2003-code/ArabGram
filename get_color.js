const { Jimp } = require('jimp');

async function extractColors() {
  try {
    const image = await Jimp.read('public/arabgram-logo.png');
    const colorCounts = {};

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      const a = this.bitmap.data[idx + 3];

      if (a > 50) { 
        // ignore pure white and black and grays
        if (!(Math.abs(r-g)<10 && Math.abs(g-b)<10)) {
          // round colors to nearest 10 to group them
          const rr = Math.round(r/10)*10;
          const gg = Math.round(g/10)*10;
          const bb = Math.round(b/10)*10;
          const color = `${rr},${gg},${bb}`;
          colorCounts[color] = (colorCounts[color] || 0) + 1;
        }
      }
    });

    const sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
    console.log('Top 20 non-gray dominant colors (R,G,B):');
    sortedColors.slice(0, 20).forEach(([color, count]) => {
      console.log(`- rgb(${color}) : ${count} pixels`);
    });
  } catch (err) {
    console.error('Error reading image:', err);
  }
}

extractColors();
