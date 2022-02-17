const nodemailer = require("nodemailer");

const clientURL = "http://localhost:3000";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "skitrajTest@gmail.com",
    pass: "axs7777KBS#",
  },
});

const mailFrom = "skitrajTest@gmail.com"


export async function sendEmail(user: string, token: string) {
    
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: mailFrom, // sender address
    to: user, // list of receivers
    subject: "Reset hasła SKITRAJ", // Subject line
    text: "Utraciłeś hasło? kliknij w link poniżej:", // plain text body
    html: `
      <a href="${clientURL}/reset-password/${token}">${token}</a>
    `,
  });
  console.log("Message sent: %s", info.messageId);
}

export async function sendEmailTest(user: string, payload: string) {  
  
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: mailFrom, // sender address
    to: user, // list of receivers
    subject: "Formularz Skitraj", // Subject line
    text: "Witam to twój payload \n" + payload, // plain text body  
  });
  console.log("Message sent: %s", info.messageId);
}

export function showError(text: string, msg: string) {
  return text + (msg ? " Error message: " + msg : "");
}
