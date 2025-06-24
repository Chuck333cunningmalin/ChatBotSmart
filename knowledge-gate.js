  const container = document.querySelector('.falling-books-container');

  for (let i = 0; i < 20; i++) {
    const book = document.createElement('div');
    book.classList.add('book');
    book.textContent = '📚';
    book.style.left = Math.random() * 100 + 'vw';
    book.style.animationDelay = Math.random() * 5 + 's';
    book.style.animationDuration = 3 + Math.random() * 5 + 's';
    book.style.fontSize = 16 + Math.random() * 24 + 'px';
    container.appendChild(book);
  }

