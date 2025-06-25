// === CHOIX DE LA CONNAISSANCE ===
const knowledgeType = "books"; 

// Fonction qui redirige vers l'API adaptée selon knowledgeType
async function getRecommendation(query) {
  if (knowledgeType === "books") {
    return await getBooks(query);
  } else if (knowledgeType === "movies") {
    return await getMovies(query);
  } else if (knowledgeType === "music") {
    return await getMusic(query);
  } else {
    return "Unknown knowledge type selected.";
  }
}

// API OpenLibrary pour livres
async function getBooks(query) {
  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch books");
    const data = await response.json();
    if (!data.docs || data.docs.length === 0) return "No books found for your query.";

    let recommendations = "Your recommended reads:<br><br>";
    data.docs.slice(0, 5).forEach((book) => {
      const title = book.title || "Unknown Title";
      const author = book.author_name ? book.author_name.join(", ") : "Unknown Author";
      const year = book.first_publish_year || "Unknown Year";
      const bookUrl = book.key ? `https://openlibrary.org${book.key}` : "#";
      recommendations += `<strong>${title}</strong> by ${author} (${year}) - <a href="${bookUrl}" target="_blank" rel="noopener noreferrer">More info</a><br>`;
    });
    return recommendations;
  } catch (err) {
    console.error(err);
    return "Sorry, something went wrong with book recommendations.";
  }
}

// API TVMaze pour films/séries
async function getMovies(query) {
  try {
    const url = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch shows");
    const data = await response.json();
    if (!data || data.length === 0) return `No TV shows found for "${query}". Try: Friends, Breaking Bad, Game, Office!`;

    let message = "TV shows I found:<br><br>";
    data.slice(0, 3).forEach(({show}) => {
      const title = show.name || "Unknown Title";
      const year = show.premiered ? show.premiered.substring(0, 4) : "Unknown Year";
      const rating = show.rating?.average || "No rating";
      const genres = show.genres?.join(", ") || "Unknown genres";
      const summary = show.summary ? show.summary.replace(/<[^>]*>/g, "").substring(0, 150) + "..." : "No description available";
      const network = show.network?.name || show.webChannel?.name || "Unknown network";

      message += `📺 <strong>${title}</strong> (${year})<br>`;
      message += `Network: ${network}<br>`;
      message += `Rating: ${rating}/10<br>`;
      message += `Genres: ${genres}<br>`;
      message += `${summary}<br><br>`;
    });
    return message;
  } catch (err) {
    console.error(err);
    return "Sorry, I couldn't search for TV shows right now.";
  }
}

// API iTunes pour musique
async function getMusic(query) {
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=5`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch music");
    const data = await response.json();
    if (!data.results || data.results.length === 0) return "No music found for that topic.";

    let message = "Music from iTunes:<br><br>";
    data.results.slice(0, 5).forEach((song) => {
      const title = song.trackName || "Unknown Song";
      const artist = song.artistName || "Unknown Artist";
      const album = song.collectionName || "Unknown Album";
      const price = song.trackPrice ? `$${song.trackPrice}` : "Price not available";
      const preview = song.previewUrl || "#";
      const artwork = song.artworkUrl100 || "";

      message += `${artwork ? `<img src="${artwork}" style="width:60px;height:auto;float:left;margin-right:10px;">` : ""}`;
      message += `<strong>${title}</strong><br>`;
      message += `by ${artist}<br>`;
      message += `Album: ${album}<br>`;
      message += `${price}<br>`;
      if (preview !== "#") {
        message += `<a href="${preview}" target="_blank" rel="noopener noreferrer">Preview</a><br>`;
      }
      message += `<div style="clear:both;"></div><br>`;
    });
    return message;
  } catch (err) {
    console.error(err);
    return "Sorry, I couldn't search for music right now.";
  }
}

// --- Gestion affichage des messages ---
function addMessage(messageText, senderType) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", senderType);
  messageDiv.innerHTML = messageText.replace(/\n/g, "<br>");
  messageDiv.style.animation = "fadeIn 0.5s ease-in";
  const messagesContainer = document.getElementById("messages");
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  return messageDiv;
}

// --- Initialisation et événements ---
document.addEventListener("DOMContentLoaded", () => {
  let welcomeMessage = "";
  if (knowledgeType === "books") {
    welcomeMessage = 'Hello, I am your book recommendation chatbot!\nGive me a topic!\n\nExample: Adventure';
  } else if (knowledgeType === "movies") {
    welcomeMessage = 'Hello, I am your TV show recommendation chatbot!\nGive me a show name!\n\nExample: Friends';
  } else if (knowledgeType === "music") {
    welcomeMessage = 'Hello, I am your music recommendation chatbot!\nGive me an artist or genre!\n\nExample: Beyonce';
  } else {
    welcomeMessage = 'Hello, I am your recommendation chatbot!\nGive me a keyword!';
  }
  addMessage(welcomeMessage, "bot");
});

const sendButton = document.getElementById("send-button");
const userInput = document.getElementById("user-input");

sendButton.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});

async function sendMessage() {
  const input = userInput.value.trim();
  if (!input) return;

  addMessage(input, "user");
  userInput.value = "";

  // Désactiver input et bouton
  userInput.disabled = true;
  sendButton.disabled = true;

  // Afficher message "Bot is typing..."
  const typingMessage = addMessage("<em>Bot is typing...</em>", "bot");

  try {
    const response = await getRecommendation(input);

    // Delay artificiel pour effet naturel
    await new Promise(resolve => setTimeout(resolve, 500));

    // Supprimer message "Bot is typing..."
    typingMessage.remove();

    addMessage(response, "bot");
  } catch (err) {
    typingMessage.remove();
    addMessage("Oops, something went wrong. Please try again.", "bot");
    console.error(err);
  } finally {
    // Réactiver input et bouton
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus();
  }
}
