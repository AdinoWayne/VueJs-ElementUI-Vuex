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

function isPositiveInteger(x) {
  // http://stackoverflow.com/a/1019526/11236
  return /^\d+$/.test(x);
}

export const compareVersionNumbers = (v1, v2) => {
  var v1parts = v1.split('.');
  var v2parts = v2.split('.');

  // First, validate both numbers are true version numbers
  function validateParts(parts) {
      for (var i = 0; i < parts.length; ++i) {
          if (!isPositiveInteger(parts[i])) {
              return false;
          }
      }
      return true;
  }
  if (!validateParts(v1parts) || !validateParts(v2parts)) {
      return NaN;
  }

  for (var i = 0; i < v1parts.length; ++i) {
      if (v2parts.length === i) {
          return 1;
      }

      if (v1parts[i] === v2parts[i]) {
          continue;
      }
      if (v1parts[i] > v2parts[i]) {
          return 1;
      }
      return -1;
  }

  if (v1parts.length != v2parts.length) {
      return -1;
  }

  return 0;
}