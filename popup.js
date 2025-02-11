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
  document.querySelectorAll('a').forEach(link => link.style.color = color);
}

function deleteImages() {
  document.querySelectorAll('img').forEach(img => img.remove());
}

function togglePasswords() {
  document.querySelectorAll('input[type="password"], input[is_pass="true"]').forEach(input => {
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
  infoButton.style.display = 'block';
  infoButton.style.marginBottom = '10px';
  infoButton.addEventListener('click', () => {
    addImageInfoEvents();
  });

  const priceButton = document.createElement('button');
  priceButton.textContent = 'PREU MÉS PETIT';
  priceButton.style.display = 'block';
  priceButton.addEventListener('click', () => {
    highlightLowestPrice();
  });

  menu.appendChild(infoButton);
  menu.appendChild(priceButton);
  document.body.appendChild(menu);

  function addImageInfoEvents() {
    document.querySelectorAll("img").forEach(img => {
      const tooltip = document.createElement("div");
      tooltip.innerText = img.alt || "Sin descripción";
      tooltip.style.position = "absolute";
      tooltip.style.background = "rgba(0, 0, 0, 0.75)";
      tooltip.style.color = "white";
      tooltip.style.padding = "5px";
      tooltip.style.borderRadius = "5px";
      tooltip.style.fontSize = "12px";
      tooltip.style.visibility = "hidden";
      tooltip.style.pointerEvents = "none";
      tooltip.style.zIndex = "10000";
      document.body.appendChild(tooltip);
      
      img.addEventListener("mouseenter", (event) => {
        tooltip.style.left = `${event.pageX + 10}px`;
        tooltip.style.top = `${event.pageY + 10}px`;
        tooltip.style.visibility = "visible";
      });
      
      img.addEventListener("mouseleave", () => {
        tooltip.style.visibility = "hidden";
      });
    });
  }
}


function highlightLowestPrice() {
  const priceElements = document.querySelectorAll('span.a-price span.a-offscreen, ._cDEzb_p13n-sc-css-line-clamp-3_g3dy1');
  let lowestPrice = Infinity;
  let lowestPriceElement = null;

  priceElements.forEach(element => {
    const priceText = element.textContent.replace(/[^0-9,\.]/g, '').replace(',', '.');
    const price = parseFloat(priceText);

    if (!isNaN(price) && price < lowestPrice) {
      lowestPrice = price;
      lowestPriceElement = element.closest('.s-result-item') || element;
    }
  });

  if (lowestPriceElement) {
    lowestPriceElement.style.backgroundColor = 'yellow';
    lowestPriceElement.style.border = '5px solid red';
    lowestPriceElement.style.padding = '10px';
    lowestPriceElement.style.transition = 'background-color 0.5s ease';

    lowestPriceElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

    let toggle = true;
    const blinkEffect = setInterval(() => {
      lowestPriceElement.style.backgroundColor = toggle ? 'yellow' : 'white';
      toggle = !toggle;
    }, 500);

    setTimeout(() => clearInterval(blinkEffect), 3000);
  } else {
    alert("No s'ha trobat cap preu vàlid.");
  }
}
