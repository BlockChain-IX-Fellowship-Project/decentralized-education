import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Generate a personalized certificate PDF using the template image and dynamic data.
 * @param {Object} params
 * @param {string} params.learnerName - Name of the learner
 * @param {string} params.courseName - Name of the course
 * @param {string} params.walletAddress - Wallet address of the learner
 * @param {string} params.issueDate - Date of issue (e.g., '2025-08-02')
 * @param {string} [params.outputPath] - Output PDF path (default: 'certificate.pdf')
 */
export function generateCertificate({
  learnerName,
  courseName,
  walletAddress,
  issueDate,
  outputPath = 'certificate.pdf'
}) {
  const doc = new PDFDocument({
    size: 'A4',
    layout: 'landscape'
  });

  const templatePath = path.join(__dirname, '../assets/certificate_template.png');
  doc.image(templatePath, 0, 0, { width: doc.page.width, height: doc.page.height });

  const pageWidth = doc.page.width;

  // CERTIFICATE title
  doc.font(path.join(__dirname, '../assets/libre-baskerville.regular.ttf'));
  doc.fontSize(50.3).fillColor('#16223A');
  const certText = 'CERTIFICATE';
  const certWidth = doc.widthOfString(certText);
  const certX = (pageWidth / 2) - (certWidth / 2);
  const certY = 90;
  doc.text(certText, certX, certY);

  // OF COMPLETION subtitle
  doc.fontSize(27.3).fillColor('#BFA640');
  const completionText = 'OF COMPLETION';
  const completionWidth = doc.widthOfString(completionText);
  const completionX = (pageWidth / 2) - (completionWidth / 2);
  const completionY = certY + 55;
  doc.text(completionText, completionX, completionY);

  // PRESENTED TO
  doc.font('Times-Roman');
  doc.fontSize(16.8).fillColor('#16223A');
  const presentedText = 'THIS CERTIFICATE IS PROUDLY PRESENTED TO:';
  const presentedWidth = doc.widthOfString(presentedText);
  const presentedX = (pageWidth / 2) - (presentedWidth / 2);
  const presentedY = completionY + 50;
  doc.text(presentedText, presentedX, presentedY);

  // Learner Name (dynamic)
  doc.font(path.join(__dirname, '../assets/EDLavonia-Regular.ttf'));
  doc.fontSize(62.9).fillColor('#222');
  const nameWidth = doc.widthOfString(learnerName);
  const nameX = (pageWidth / 2) - (nameWidth / 2);
  const nameY = presentedY + 40;
  doc.text(learnerName, nameX, nameY);

  // Main sentence (dynamic)
  doc.font('Times-Roman');
  doc.fontSize(15.7).fillColor('#16223A');
  const mainSentence = `This certificate is awarded to "${learnerName}" for successfully completing the course "${courseName}" on DELEARN. The achievement is recorded on the blockchain and is verifiable using the wallet address "${walletAddress}".\nIssued on ${issueDate}.`;
  const mainWidth = doc.widthOfString(mainSentence, {width: pageWidth - 120});
  const mainX = 60;
  const mainY = nameY + 120;
  doc.text(mainSentence, mainX, mainY, {align: 'center', width: pageWidth - 120});

  // DeLearn Team
  doc.font(path.join(__dirname, '../assets/libre-baskerville.regular.ttf'));
  doc.fontSize(18).fillColor('#BFA640');
  const teamText = 'DeLearn Team';
  const teamWidth = doc.widthOfString(teamText);
  const teamX = (pageWidth / 2) - (teamWidth / 2);
  const teamY = mainY + 141;
  doc.text(teamText, teamX, teamY);

  doc.pipe(fs.createWriteStream(outputPath));
  doc.end();
  return doc;
}

export default {
  generateCertificate
};
