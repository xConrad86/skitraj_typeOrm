const nodemailer = require("nodemailer");

export async function sendEmail(user, token) {
    const clientURL = "http://localhost:3000";
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "skitrajTest@gmail.com",
        pass: "axs7777KBS#",
      },
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "skitrajTest@gmail.com", // sender address
      to: user, // list of receivers
      subject: "Reset hasła SKITRAJ", // Subject line
      text: "Utraciłeś hasło? kliknij w link poniżej:", // plain text body
      html: `
      <a href="${clientURL}/NewPass/${token}">${token}</a>
    `,
    });
    console.log("Message sent: %s", info.messageId);
  }
  