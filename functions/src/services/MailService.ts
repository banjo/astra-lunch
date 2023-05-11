import sgMail from "@sendgrid/mail";

const KEY = process.env.SENDGRID_API_KEY;

const send = async (subject: string, text: string) => {
    if (!KEY) {
        throw new Error("No sendgrid key");
    }
    sgMail.setApiKey(KEY);

    const msg = {
        to: "anton.odman@gmail.com",
        from: "anton.odman+dev@gmail.com",
        subject,
        text,
    };

    await sgMail.send(msg).catch(console.log);
};

export const MailService = {
    send,
};
