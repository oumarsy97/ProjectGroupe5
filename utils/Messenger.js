import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import http from 'follow-redirects';

export default class Messenger {
// Configuration du transporteur (transporter) pour Gmail
static transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true pour les ports 465, false pour les autres ports
    auth: {
        user: 'syoumar505@gmail.com', // Votre adresse email Gmail
        pass: 'bngc rasj ytwc xmmd', // Votre mot de passe Gmail (ou mot de passe d'application)
    },
});

// Fonction pour envoyer un email
static sendMail = async (destination, name, message) => {
    
// Configuration du transporteur (transporter) pour Gmail
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true pour les ports 465, false pour les autres ports
    auth: {
        user: 'syoumar505@gmail.com', // Votre adresse email Gmail
        pass: 'bngc rasj ytwc xmmd', // Votre mot de passe Gmail (ou mot de passe d'application)
    },
});

// Fonction pour envoyer un email
    try { 
        const info = await transporter.sendMail({
            from: '"Cargo Express" <syoumar505@gmail.com>', // Adresse de l'expéditeur et nom
            to: destination, // Adresse du destinataire
            subject: 'Mail de Recu', // Sujet de l'email
            text: message, // Corps du message en texte brut
            // html: message, // Si vous avez besoin d'envoyer le message en HTML
            // attachments: [
            //     { filename: 'recu.pdf', path: './path-to-recu.pdf' }
            // ]
        });

        // console.log('Message sent: %s', info.messageId);
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        return { message: 'E-mail envoyé avec succès !', status: 200 };
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
        return { message: `Erreur lors de l'envoi de l'e-mail: ${error.message}`, status: 500 };
    }


}

static sendSms = async (destination, name, message) => {
   
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "App 6d70d8cdb5f5dcd80ad1fe005f6e6384-848c34c8-3c94-4f8c-adbf-b4fc929f2dfa");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    
    const raw = JSON.stringify({
        "messages": [
            {
                "destinations": [{"to":destination}],
                "from": "Tailor Digital",
                "text": message
            }
        ]
    });
    
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };
    
    fetch("https://w1qlj8.api.infobip.com/sms/2/text/advanced", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

static sendWhatsapp = async (destination, name, message) => {
    const myHeaders = new Headers();
myHeaders.append("Authorization", "App 6d70d8cdb5f5dcd80ad1fe005f6e6384-848c34c8-3c94-4f8c-adbf-b4fc929f2dfa");
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Accept", "application/json");

const raw = JSON.stringify({
    "messages": [
        {
            "from": "447860099299",
            "to": "221781807229",
            "messageId": "907a6087-9a98-4f41-a1a8-6e8bd6560910",
            "content": {
                "templateName": "message_test",
                "templateData": {
                    "body": {
                        "placeholders": ["Oumar"]
                       
                    }
                },
                "language": "fr"
            }
        }
    ]
});

const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
};

fetch("https://w1qlj8.api.infobip.com/whatsapp/1/message/template", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

}

