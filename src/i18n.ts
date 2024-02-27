import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import detector from "i18next-browser-languagedetector";

i18n
  .use(Backend)
  .use(detector)
  .use(initReactI18next)
  .init({
    supportedLngs: ["en", "es", "pt"],
    backend: {
      loadPath: "./locales/{{lng}}/{{ns}}.json" 
    },
    ns: ["common"],
    defaultNS: "common",
    fallbackLng: "en"
  });

i18n.changeLanguage("pt"); 

i18n.on("languageChanged", (lng) => {
  console.log("Idioma alterado para", lng);  
});

i18n.on("loaded", (loaded) => {
  console.log("Arquivos carregados", loaded);
});

i18n.on("failedLoading", (lng, ns, msg) => {
  console.log("Falha ao carregar", lng, ns, msg);
});

export const TRANSLATIONS = {
  salesPipeline: { 
    title: 'Pipeline de vendas'
  },
  companies: {
    title: 'Empresas'
  },
  contacts: {
    title: 'Contatos'
  },
  administration: {
    title: 'Administração'  
  },
  settings: {
    title: 'Configurações'
  },
  auditLog: {
    title: 'Log de auditoria'
  }
}

export default i18n;
