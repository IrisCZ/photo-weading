import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import i18next from "i18next";

i18next.use(LanguageDetector).init({detection: {order: ['navigator']}});
console.log(LanguageDetector);
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      es: {
        translation: {
          hi: "¡Hola! Somos ",
          saraandceles: "Sara y Celes",
          welcome: "¡Bienvenidos a nuestra boda!",
          tellUsYourName: "Dinos tu nombre para que sepamos de quién son las fotos.",
          send: 'Enviar',
          theWeddingOrganizer: "el organizador de la boda",
          errorSendingVideo: "No se ha podido enviar el video",
          errorSendingPhoto: "No se ha podido enviar la foto",
          uploading: 'Enviando foto.....',
          info1: "Nos gustaría que nos mandarais un video con vuestros mejores deseos para recordar este momento tan especial para nosotros.",
          info2: "Si ya lo habeis hecho... ¡Haz fotos para que podamos verlas en la pantalla!",
          thanksForComing: "¡Muchas gracias a todos por venir!"
        }
      },
      pt: {
        translation: {
          hi: "Olá, somos ",
          saraandceles: "Sara e Celes",
          welcome: "Bem-vindo ao nosso casamento!",
          tellUsYourName: "Diga-nos o seu nome para sabermos de quem são as fotos.",
          send: 'Mandar',
          theWeddingOrganizer: "o planejador de casamento",
          errorSendingVideo: "O vídeo não pôde ser enviado",
          errorSendingPhoto: "A foto não pôde ser enviada",
          uploading: 'Enviando foto.....',
          info1: "Gostava que nos enviasse um vídeo com os seus melhores votos para recordar este momento especial para nós.",
          info2: "Se tu já fez isso... Tire fotos para que possamos vê-las na tela!",
          thanksForComing: "Muito obrigado a todos por terem vindo!"
        }
      }
    },
    fallbackLng: "es",
    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
  });


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
