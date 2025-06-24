import { Listes } from './Liste.js';

const input = document.getElementById("user-input");
const button = document.getElementById("send-button");
const messagesDiv = document.getElementById("messages");

// Fonction pour ajouter un message dans le chat
function addMessage(text, sender) {
    const message = document.createElement("div");
    message.classList.add("message", sender);
    message.textContent = text;
    messagesDiv.appendChild(message);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // scroll auto vers le bas
}

// Événement bouton
button.addEventListener("click", sendMessage);

// Touche Entrée = envoi aussi
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    const mot = input.value.trim().toLowerCase();
    if (!mot) return;

    addMessage("👤 " + input.value, "user");

    const reponse = Listes[mot] || "Je suis désolé, j'ai pas compris ce que tu voulais dire, peut tu le dire d'une autre manière ?";
    addMessage(reponse, "bot");

    input.value = "";
}
