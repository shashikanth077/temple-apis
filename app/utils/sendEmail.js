const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const { getCurrentDate } = require("../utils");

//send grid
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = class Email {
  constructor(user, url, title, type = "login") {
    this.to = user?.email;
    this.url = url;
    this.subject = user?.subject;
    this.customerName = user?.name;
    this.customerEmail = user?.email;
    this.currentdate = getCurrentDate;
    this.message = user?.message;
    this.bodyData = user?.bodyData;
    this.title = title;
    this.from = `<${process.env.EMAIL_FROM}>`;
    this.name = user?.name;
  }

  newTransport() {
    return sgMail;
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
  async send(template, subject, role) {
    this.registerPartials();

    const headerTemplateSource = handlebars.partials["header"];
    const footerTemplateSource = handlebars.partials["footer"];

    const MainContentSource = fs.readFileSync(
      `${__dirname}/../views/email/${role}/${template}.handlebars`,
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

    await sgMail.send(mailOptions);
  }

  async sendEnquiry() {
    await this.send("sendEnquiry", "Enquiry notification", "member");
  }

  async sendWelcome() {
    await this.send(
      "welcome",
      "Welcome to the Sai Sathya Narayana Temple!",
      "member"
    );
  }

  async sendPasswordReset() {
    await this.send("requestResetPassword", "Reset password link", "auth");
  }

  async verifyEmailAddress() {
    await this.send(
      "verifyEmail",
      "Verify your email address to activate your account",
      "auth"
    );
  }

  async adminRegistrationConfirm() {
    await this.send(
      "adminRegister",
      "Admin registration confirmation email",
      "auth"
    );
  }

  async donationConfirmation() {
    await this.send("donationSuccess", "Donation confirmation email", "member");
  }

  async ShopConfirmation() {
    await this.send("shopSuccess", "Purchasing confirmation email", "member");
  }

  async serviceConfirmation() {
    await this.send("serviceSuccess", "Service confirmation email", "member");
  }

  async sevaConfirmation() {
    await this.send("sevaSuccess", "Seva confirmation email", "member");
  }

  async eventConfirmation() {
    await this.send(
      "eventSuccess",
      "Event booking confirmation email",
      "member"
    );
  }

  async resetPassword() {
    await this.send(
      "resetPassword",
      "password has been reset succesfully",
      "auth"
    );
  }

  async volunteerApprove() {
    await this.send(
      "volunteerapprove",
      "Your volunteer request submission status",
      "member"
    );
  }
};
