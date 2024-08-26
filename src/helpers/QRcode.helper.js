// Library
import QRcode from 'qrcode';
import Jimp from 'jimp';

class QRcodeHelper {
  async generateBuffer(text) {
    const options = {
      errorCorrectionLevel: 'L',
      type: 'image/jpeg',
      quality: 1,
      margin: 0,
      width: 1080,
      height: 1080,
    };

    const qrBuffer = await QRcode.toBuffer(text, options);
    const image = await Jimp.read(qrBuffer);
    const logoImage = await Jimp.read(process.cwd() + '/server_data/resources/logo.png');
    logoImage.resize(200, 200)
  
    const x = (image.bitmap.width - logoImage.bitmap.width) / 2;
    const y = (image.bitmap.height - logoImage.bitmap.height) / 2;
    
    image.composite(logoImage, x, y, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacityDest: 1,
      opacitySource: 1,
    });

    return await image.getBufferAsync(Jimp.MIME_JPEG)
  }
}

export default QRcodeHelper;