import bwipjs from 'bwip-js';

export async function generatePdf417DataUrl(text: string) {
  const buffer = await new Promise<Buffer>((resolve, reject) => {
    bwipjs.toBuffer(
      {
        bcid: 'pdf417',
        text,
        scale: 10,
        height: 12,
        width: 30,
        includetext: false,
        // paddingwidth: 20,
        // paddingheight: 20,
        columns: 1,
        // ratio: 3,
      },
      (err: Error | null, png?: Buffer) => {
        if (err) {
          reject(err);
          return;
        }
        if (!png) {
          reject(new Error('bwip-js did not return image data'));
          return;
        }
        resolve(png);
      },
    );
  });

  return `data:image/png;base64,${buffer.toString('base64')}`;
}
