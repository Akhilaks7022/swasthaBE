
export class EmailTemplateService {
  static Email_Subject = "Email Verification Code";

  static Email_Content(otp: number): string {
    return `<html><body>Dear Customer,<br><br>Thank you for choosing atmaparikshan+<br><br> To complete the verification process for your email address, please use the following secure password: <b>${otp}</b>.<br><br>If you encounter any issues or have any questions, please don't hesitate to visit us at <a href="https://atmaparikshan.com/">https://atmaparikshan.com/</a>.<br><br>Sincerely,<br>Swastha Technovations Pvt Ltd</body></html>`;
  }

  static Another_Email_Subject = "Document Access Request";
  
  static Another_Email_Content(): string {
    return `<html><body>
      <p>Dear Team,</p>
      <p>I hope this email finds you well.</p>
      <p>I am reaching out to request access to confidential documents for the purpose of review and decision-making.</p>
      <p>Thank you</p>
    </body></html>`;
  }
}
