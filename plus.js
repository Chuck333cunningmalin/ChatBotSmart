import { Listes } from './Liste.js';

// Cibler les éléments HTML
const input = document.getElementById("user-input");
const button = document.getElementById("send-button");
const messageBox = document.getElementById("reponse");

// Écouter le clic sur le bouton
button.addEventListener("click", () => {
    const mot = input.value.trim().toLowerCase(); // Nettoyage et minuscule

// Vérification dans la liste
if (Listes[mot]) {
    messageBox.textContent = Listes[mot];
} else {
    messageBox.textContent = "Désolé, je ne connais pas ce mot.";
}

input.value = ""; // Effacer le champ après l'envoi
});