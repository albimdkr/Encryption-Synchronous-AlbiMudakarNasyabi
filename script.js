// function generateSecretKey() {
//     return CryptoJS.lib.WordArray.random(32);
// };


// function encryptMessage(){
//     const message = document.getElementById("enter-message").value;
//     const secretKey = generateSecretKey();
//     const encryptedMessage = CryptoJS.AES.encrypt(message, secretKey);
//     const encodedKey = CryptoJS.enc.Base64.stringify(secretKey);
//     alert("Encrypted message: " + encryptedMessage + "Key: " + encodedKey);
// };

// function decryptMessage(){
//     const encryptedMessage = prompt("Enter encrypted message:");
//     const encodedKey = prompt("Enter key:");
//     // const encryptedMessage = document.getElementById("encrypted-message").value;
//     // const encodedKey = document.getElementById("value-key").value;
//     const secretKey = CryptoJS.enc.Base64.parse(encodedKey);
//     const decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
//     const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
//     alert("Decrypted message: " + decryptedMessage);
// }


// function stringToUint8Array(str) {
//     return new TextEncoder().encode(str);
//   }
  
//   // Convert Uint8Array to string
//   function uint8ArrayToString(uint8Array) {
//     return new TextDecoder().decode(uint8Array);
//   }
  
//   // Generate a random 256-bit key
//   async function generateKey() {
//     return await window.crypto.subtle.generateKey(
//       { name: "AES-GCM", length: 256 },
//       true,
//       ["encrypt", "decrypt"]
//     );
//   }
  
//   // Encrypt the message with the key
//   async function encrypt() {
//     const message = document.getElementById("enter-message").value;
//     const key = await generateKey();
//     const encodedMessage = stringToUint8Array(message);
//     const encryptedMessage = await window.crypto.subtle.encrypt(
//       { name: "AES-GCM", iv: window.crypto.getRandomValues(new Uint8Array(12)) },
//       key,
//       encodedMessage
//     );
//     document.getElementById("result-encrypt").value = uint8ArrayToString(new Uint8Array(encryptedMessage));
//     document.getElementById("enter-key").value = uint8ArrayToString(new Uint8Array(await window.crypto.subtle.exportKey("raw", key)));
//   }
  
//   // Decrypt the message with the key
//   async function decrypt() {
//     const encryptedMessage = document.getElementById("encrypted-message").value;
//     var key = await window.crypto.subtle.importKey(
//       "raw",
//       stringToUint8Array(document.getElementById("value-key").value),
//       { name: "AES-GCM", length: 256 },
//       true,
//       ["encrypt", "decrypt"]
//     );
//     const decryptedMessage = await window.crypto.subtle.decrypt(
//       { name: "AES-GCM", iv: window.crypto.getRandomValues(new Uint8Array(12)) },
//       key,
//       new Uint8Array(stringToUint8Array(encryptedMessage))
//     );
//     document.getElementById("result-decrypt").value = uint8ArrayToString(new Uint8Array(decryptedMessage));
//   }

(() => {

    /*
    Store the calculated ciphertext and IV here, so we can decrypt the message later.
    */
    let ciphertext;
    let iv;
  
    /*
    Fetch the contents of the "message" textbox, and encode it
    in a form we can use for the encrypt operation.
    */
    function getMessageEncoding() {
      const messageBox = document.getElementById("enter-message");
      let message = messageBox.value;
      let enc = new TextEncoder();
      return enc.encode(message);
    }
  
    /*
    Get the encoded message, encrypt it and display a representation
    of the ciphertext in the "Ciphertext" element.
    */
    async function encryptMessage(key) {
      let encoded = getMessageEncoding();
      // The iv must never be reused with a given key.
      iv = window.crypto.getRandomValues(new Uint8Array(12));
      ciphertext = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv
        },
        key,
        encoded
      );
  
      let buffer = new Uint8Array(ciphertext, 0, 5);
      const ciphertextValue = document.getElementById("result-encrypt");
      ciphertextValue.classList.add('fade-in');
      ciphertextValue.addEventListener('animationend', () => {
        ciphertextValue.classList.remove('fade-in');
      });
      ciphertextValue.textContent = `${buffer}...[${ciphertext.byteLength} bytes total]`;
    }
  
    /*
    Fetch the ciphertext and decrypt it.
    Write the decrypted message into the "Decrypted" box.
    */
    async function decryptMessage(key) {
      let decrypted = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv
        },
        key,
        ciphertext
      );
  
      let dec = new TextDecoder();
      const decryptedValue = document.getElementById("encrypted-message");
      decryptedValue.classList.add('fade-in');
      decryptedValue.addEventListener('animationend', () => {
        decryptedValue.classList.remove('fade-in');
      });
      decryptedValue.textContent = dec.decode(decrypted);
    }
  
    /*
    Generate an encryption key, then set up event listeners
    on the "Encrypt" and "Decrypt" buttons.
    */
    window.crypto.subtle.generateKey(
      {
          name: "AES-GCM",
          length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    ).then((key) => {
      const encryptButton = document.getElementById("enter-key btn-encrypt");
      encryptButton.addEventListener("click", () => {
        encryptMessage(key);
      });
  
      const decryptButton = document.getElementById("value-key btn-decrypt");
      decryptButton.addEventListener("click", () => {
        decryptMessage(key);
      });
    });
  
  })();
  