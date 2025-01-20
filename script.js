const canvas = document.getElementById('canvas');
const vectorizeBtn = document.getElementById('vectorizeBtn');
const textInput = document.getElementById('textInput');
const fontSelect = document.getElementById('fontSelect');
const fontSize = document.getElementById('fontSize');
const gridToggle = document.getElementById('gridToggle');

// Function to create grid
function toggleGrid(show) {
  const gridSize = 20;
  canvas.innerHTML = show ? '' : canvas.innerHTML;

  if (show) {
    for (let x = 0; x <= canvas.clientWidth; x += gridSize) {
      canvas.innerHTML += `<line x1="${x}" y1="0" x2="${x}" y2="${canvas.clientHeight}" class="grid"></line>`;
    }
    for (let y = 0; y <= canvas.clientHeight; y += gridSize) {
      canvas.innerHTML += `<line x1="0" y1="${y}" x2="${canvas.clientWidth}" y2="${y}" class="grid"></line>`;
    }
  }
}

// Function to add vectorized text
function addVectorizedText() {
  const text = textInput.value;
  const font = fontSelect.value;
  const size = fontSize.value;

  const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  textElement.textContent = text;
  textElement.setAttribute('x', 50);
  textElement.setAttribute('y', 50);
  textElement.setAttribute('font-family', font);
  textElement.setAttribute('font-size', `${size}px`);
  textElement.setAttribute('fill', 'black');
  textElement.setAttribute('draggable', 'true');

  // Drag functionality
  textElement.addEventListener('mousedown', (event) => {
    const offsetX = event.offsetX - parseFloat(textElement.getAttribute('x'));
    const offsetY = event.offsetY - parseFloat(textElement.getAttribute('y'));

    function onMouseMove(e) {
      const x = e.offsetX - offsetX;
      const y = e.offsetY - offsetY;

      // Snap to grid
      if (gridToggle.checked) {
        textElement.setAttribute('x', Math.round(x / 20) * 20);
        textElement.setAttribute('y', Math.round(y / 20) * 20);
      } else {
        textElement.setAttribute('x', x);
        textElement.setAttribute('y', y);
      }
    }

    function onMouseUp() {
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
    }

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
  });

  canvas.appendChild(textElement);
}

// Event Listeners
vectorizeBtn.addEventListener('click', addVectorizedText);
gridToggle.addEventListener('change', (e) => toggleGrid(e.target.checked));
