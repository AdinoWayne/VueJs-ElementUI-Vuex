const CryptoJS = require('crypto-js');

const encryptWithAES = (text) => {
  const passphrase = 'HUMAX-123';
  return CryptoJS.AES.encrypt(text, passphrase).toString();
};

const decryptWithAES = (cipherText) => {
  const passphrase = 'HUMAX-123';
  const bytes = CryptoJS.AES.decrypt(cipherText, passphrase);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

export const setLocalStorage = (name, value) => {
    const strValue = JSON.stringify(value);
    localStorage.setItem(name, encryptWithAES(strValue));
}

export const getLocalStorage = (name) => {
    const cipherText = localStorage.getItem(name);
    if (!cipherText) {
        return null;
    }
    const strText = decryptWithAES(cipherText);
    return JSON.parse(strText);
}