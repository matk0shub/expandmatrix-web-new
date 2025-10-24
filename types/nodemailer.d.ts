declare module 'nodemailer' {
  type TransportOptions = Record<string, unknown>;
  type SendMailOptions = Record<string, unknown>;
  type SendMailResponse = unknown;

  interface Transporter {
    sendMail(options: SendMailOptions): Promise<SendMailResponse>;
  }

  interface Nodemailer {
    createTransport(options: TransportOptions): Transporter;
  }

  const nodemailer: Nodemailer;
  export default nodemailer;
}
