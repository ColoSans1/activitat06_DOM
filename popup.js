document.getElementById('setBgRed').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: setBackgroundRed
    });
  });
});

document.getElementById('setLinkColor').addEventListener('click', () => {
  const color = prompt("Introduce el Color que quieras (Ejemplo Azul):");
  if (color) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: setLinkColor,
        args: [color]
      });
    });
  }
});

document.getElementById('deleteImages').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: deleteImages
    });
  });
});

document.getElementById('togglePasswords').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: togglePasswords
    });
  });
});

document.getElementById('stickyMenu').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: createStickyMenu
    });
  });
});

function setBackgroundRed() {
  document.body.style.backgroundColor = 'red';
}

function setLinkColor(color) {
  const links = document.querySelectorAll('a');
  links.forEach(link => link.style.color = color);
}

function deleteImages() {
  const images = document.querySelectorAll('img');
  images.forEach(img => img.remove());
}

function togglePasswords() {
  const passwordInputs = document.querySelectorAll('input[type="password"], input[is_pass="true"]');
  passwordInputs.forEach(input => {
    if (input.type === 'password') {
      input.type = 'text';
      input.setAttribute('is_pass', 'true');
    } else {
      input.type = 'password';
      input.setAttribute('is_pass', 'false');
    }
  });
}

function createStickyMenu() {
  const menu = document.createElement('div');
  menu.style.position = 'fixed';
  menu.style.top = '50%';
  menu.style.right = '10px';
  menu.style.transform = 'translateY(-50%)';
  menu.style.backgroundColor = 'white';
  menu.style.border = '1px solid black';
  menu.style.padding = '10px';
  menu.style.zIndex = '1000';

  const infoButton = document.createElement('button');
  infoButton.textContent = 'INFORMACIO IMATGES';
  infoButton.addEventListener('click', () => {
    addImageInfoEvents();
  });

  const priceButton = document.createElement('button');
  priceButton.textContent = 'PREU MÉS PETIT';
  priceButton.addEventListener('click', () => {
    highlightLowestPrice();
  });

  menu.appendChild(infoButton);
  menu.appendChild(priceButton);
  document.body.appendChild(menu);
}

function addImageInfoEvents() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    const altText = img.alt || 'No alt text';
    const textElement = document.createElement('div');
    textElement.textContent = altText;
    textElement.style.position = 'absolute';
    textElement.style.backgroundColor = 'white';
    textElement.style.border = '1px solid black';
    textElement.style.padding = '5px';
    textElement.style.zIndex = '1001';

    img.addEventListener('mouseover', () => {
      const rect = img.getBoundingClientRect();
      textElement.style.top = `${rect.top}px`;
      textElement.style.left = `${rect.left}px`;
      document.body.appendChild(textElement);
    });

    img.addEventListener('mouseout', () => {
      document.body.removeChild(textElement);
    });
  });
}

function highlightLowestPrice() {
  const priceElements = document.querySelectorAll('span.a-price span.a-offscreen');
  let lowestPrice = Infinity;
  let lowestPriceElement = null;

  priceElements.forEach(element => {
    const priceText = element.textContent.replace(/[^0-9,\.]/g, '').replace(',', '.');
    const price = parseFloat(priceText);
    if (!isNaN(price) && price < lowestPrice) {
      lowestPrice = price;
      lowestPriceElement = element.closest('.s-result-item');
    }
  });

  if (lowestPriceElement) {
    lowestPriceElement.style.backgroundColor = 'yellow';
    lowestPriceElement.scrollIntoView({ behavior: 'smooth' });
  }
}
