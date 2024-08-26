import QRcodeHelper from './QRcode.helper.js';

// Library
import FS from 'fs-extra';
import { fileTypeFromBuffer } from 'file-type';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

class FileSystemHelper {
  /**
   * Helper class for interacting with the file system.
   * @class
   * @param {Object} server - The server object.
   */
  constructor(server) {
    this.server = server;
  }
  
  /**
   * 
   * @param { string } fileBase64 - Base64 String
   * @param { Array } allowedExtension  - Allowed Extension
   * @param { Number } maximumSize - Maximum Size in Megabyte
   * @param { boolean } getFile - True for return the buffer file
   * @param { boolean } getType - True for return type of file
   * @returns [{ boolean }, { object }]
   */
  async fileValidationBase64(fileBase64, allowedExtension, maximumSize, getFile, getType) {
    if(!fileBase64) return -1;

    const file = Buffer.from(fileBase64, 'base64');
    const fileSize = Buffer.byteLength(file) / 1048576;

    if(fileSize > maximumSize) return -2;

    const fileType = await fileTypeFromBuffer(file);

    if(!fileType) return -3;
    if(allowedExtension.includes(fileType.ext) === false) return -3;
    
    if(getFile === false && getType === false) return true;

    return {
      ...( getFile === true ? { file } : {}),
      ...( getType === true ? { type: fileType.ext } : {})
    }
  }

  /**
   * Reads a file from the given path and returns its content and MIME type.
   * @async
   * @param {string} path - The path of the file to read.
   * @returns {Promise<{file: Buffer, mime: string}>} - A promise that resolves to an object containing the file content and MIME type.
   */
  async readFile(path) {
    const file = FS.readFileSync(process.cwd() + path);
    const { mime } = await fileTypeFromBuffer(file);

    return {
      file, mime
    };
  }

  /**
   * Embeds a QR code image into a PDF document and returns the modified PDF buffer.
   * @param {Buffer} fileBuffer - The buffer of the PDF file to modify.
   * @param {string} serial_number - The serial number to embed in the QR code.
   * @param {Object} [properties=null] - Optional properties to set in the PDF document.
   * @param {string} [properties.title] - The title of the PDF document.
   * @param {string} [properties.author] - The author of the PDF document.
   * @returns {Promise<Buffer>} - The modified PDF buffer.
   */
  async embedQrToPdf(fileBuffer, serial_number, properties = null) {
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const pages = pdfDoc.getPages();
    
    const qrBuffer = await (new QRcodeHelper().generateBuffer(this.server.env.WEB_HOST + '/verify/' + serial_number));
    const image = await pdfDoc.embedJpg(qrBuffer);
    const qrDims = image.scale(0.5);
    
    for(let i in pages) {
      const page = pages[i];

      page.drawImage(image, {
        x: page.getSize().width - qrDims.width - 40, // Adjust the position as needed
        y: 40,
        width: qrDims.width,
        height: qrDims.height,
      });
    }

    pdfDoc.setProducer(this.server.env.APP_NAME);
    pdfDoc.setSubject('Digital Signature');

    if(properties !== null) {
      pdfDoc.setTitle(properties.title);
      pdfDoc.setAuthor(properties.author);
    }

    return (await pdfDoc.save());
  }

  async customizeEmbedQrToPdf(fileBuffer, serial_number, properties = null, qrSizeData) {
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const pages = pdfDoc.getPages();
    
    const qrBuffer = await (new QRcodeHelper().generateBuffer(this.server.env.WEB_HOST + '/verify/' + serial_number));
    const image = await pdfDoc.embedJpg(qrBuffer);
    
    for(let i in qrSizeData) {
      if(qrSizeData[i] === null) continue;
      const page = pages[i];

      page.drawImage(image, {
        x: qrSizeData[i].x, // Adjust the position as needed
        y: qrSizeData[i].y,
        width: qrSizeData[i].width,
        height: qrSizeData[i].width,
      });

      if(properties.sign_name !== null) {
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontSize = properties.signNameSize ? properties.signNameSize : 12;

        // const textWidth = font.widthOfTextAtSize(properties.sign_name, fontSize);
        // const textHeight = font.heightAtSize(fontSize);

        // Draw Sign Name Text under QR Code, color black
        page.drawText(properties.sign_name, {
          x: qrSizeData[i].x,
          y: qrSizeData[i].y - 15,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0)
        });
      }
    }

    pdfDoc.setProducer(this.server.env.APP_NAME);
    pdfDoc.setSubject('Digital Signature');

    if(properties !== null) {
      pdfDoc.setTitle(properties.title);
      pdfDoc.setAuthor(properties.author);
    }

    return (await pdfDoc.save());
  }
}

export default FileSystemHelper;