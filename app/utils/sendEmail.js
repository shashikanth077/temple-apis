const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const {getCurrentDate} = require('../utils');

module.exports = class Email {
  constructor(user, url, title,type='login') {
    this.to = user?.email;
    this.url = url;
    this.subject = user?.subject;
    this.customerName = user?.name;
    this.customerEmail = user?.email;
    this.currentdate = getCurrentDate;
    this.message = user?.message;
    this.bodyData = user?.bodyData;
    this.title = title;
    this.from = `TempleOrg <${process.env.EMAIL_FROM}>`;
    this.name = user?.name;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // Sendgrid
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, //dev purpose
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  registerPartials() {
    const absoluteHeaderPath = path.resolve(
      __dirname,
      "../views/email/maillayout/header.handlebars"
    );
    handlebars.registerPartial(
      "header",
      fs.readFileSync(absoluteHeaderPath, "utf8")
    );

    const absoluteFooterPath = path.resolve(
      __dirname,
      "../views/email/maillayout/footer.handlebars"
    );
    handlebars.registerPartial(
      "footer",
      fs.readFileSync(absoluteFooterPath, "utf8")
    );
  }

  // Send the actual email
  async send(template, subject) {
    this.registerPartials();

    const headerTemplateSource = handlebars.partials["header"];
    const footerTemplateSource = handlebars.partials["footer"];

    const MainContentSource = fs.readFileSync(
      `${__dirname}/../views/email/${template}.handlebars`,
      "utf8"
    );

    const mainContentTemplate = handlebars.compile(MainContentSource, {
      partials: {
        header: headerTemplateSource,
        footer: footerTemplateSource,
      },
    });

    const emailHtml = mainContentTemplate(this);

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: emailHtml,
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendEnquiry() {
    await this.send("sendEnquiry", "Enquiry notification");
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the Sai Sathya Narayana Temple!");
  }

  async sendPasswordReset() {
    await this.send("requestResetPassword", "Reset password link");
  }

  async verifyEmailAddress() {
    await this.send(
      "verifyEmail",
      "Verify your email address to activate your account"
    );
  }

  async donationConfirmation() {
    await this.send(
      "donationSuccess",
      "Donation confirmation email"
    );
  }

  async ShopConfirmation() {
    await this.send(
      "shopSuccess",
      "Purchasing confirmation email"
    );
  }

  async serviceConfirmation() {
    await this.send(
      "serviceSuccess",
      "Service confirmation email"
    );
  }

  async resetPassword() {
    await this.send("resetPassword", "password has been reset succesfully");
  }

  async volunteerApprove() {
    await this.send("volunteerapprove", "Your volunteer request submission status");
  }
};
