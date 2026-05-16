const translations = {
  es: {
    welcome: "Bienvenido, {name}"
  },
  en: {
    welcome: "Welcome, {name}"
  }
};

function t(key, options, language) {
  let value = translations[language][key];
  if (typeof value === 'string' && options) {
    Object.keys(options).forEach(optKey => {
      value = value.replace(new RegExp(`{${optKey}}`, 'g'), options[optKey]);
    });
  }
  return value;
}

console.log("ES:", t('welcome', { name: "Richard" }, 'es'));
console.log("EN:", t('welcome', { name: "Richard" }, 'en'));
