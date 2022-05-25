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
    try {
        const cipherText = localStorage.getItem(name);
        if (!cipherText) {
            return null;
        }
        const strText = decryptWithAES(cipherText);
        return JSON.parse(strText);
    } catch (error) {
        localStorage.removeItem('user');
        window.location.href = '/login';
    }

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

export const compareObjects = (o1, o2) => {
    return equals(o1, o2);
}

const isArray = arr => {
    return Array.isArray(arr) || arr instanceof Array;
};
  
const isDefined = value => {
    return typeof value !== "undefined";
};
  

const equals = (o1, o2) => {
    if (o1 === o2) return true;
    if (o1 === null || o2 === null) return false;
    if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
    let t1 = typeof o1,
      t2 = typeof o2,
      length = 0,
      key = null,
      keySet = null;
    if (t1 === t2 && t1 === "object") {
      if (isArray(o1)) {
        if (!isArray(o2)) return false;
        if ((length = o1.length) === o2.length) {
          for (key = 0; key < length; key++) {
            if (!equals(o1[key], o2[key])) return false;
          }
          return true;
        }
      } else {
        if (isArray(o2)) return false;
        keySet = Object.create(null);
        for (key in o1) {
          if (!equals(o1[key], o2[key])) return false;
          keySet[key] = true;
        }
        for (key in o2) {
          if (!(key in keySet) && isDefined(o2[key])) return false;
        }
        return true;
      }
    }
    return false;
};