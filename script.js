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

  addDragAndDrop(textElement);
  canvas.appendChild(textElement);
}

// Function to add drag-and-drop functionality (Mouse and Touch)
function addDragAndDrop(element) {
  let offsetX, offsetY;

  // Drag Start
  function dragStart(event) {
    event.preventDefault();
    const isTouch = event.type === 'touchstart';
    const point = isTouch ? event.touches[0] : event;

    offsetX = point.clientX - element.getBoundingClientRect().x;
    offsetY = point.clientY - element.getBoundingClientRect().y;

    document.addEventListener(isTouch ? 'touchmove' : 'mousemove', dragMove);
    document.addEventListener(isTouch ? 'touchend' : 'mouseup', dragEnd);
  }

  // Drag Move
  function dragMove(event) {
    event.preventDefault();
    const isTouch = event.type === 'touchmove';
    const point = isTouch ? event.touches[0] : event;

    let x = point.clientX - canvas.getBoundingClientRect().x - offsetX;
    let y = point.clientY - canvas.getBoundingClientRect().y - offsetY;

    // Snap to grid if enabled
    if (gridToggle.checked) {
      x = Math.round(x / 20) * 20;
      y = Math.round(y / 20) * 20;
    }

    element.setAttribute('x', x);
    element.setAttribute('y', y);
  }

  // Drag End
  function dragEnd(event) {
    event.preventDefault();
    document.removeEventListener(event.type === 'touchend' ? 'touchmove' : 'mousemove', dragMove);
    document.removeEventListener(event.type === 'touchend' ? 'touchend' : 'mouseup', dragEnd);
  }

  // Add event listeners for both mouse and touch
  element.addEventListener('mousedown', dragStart);
  element.addEventListener('touchstart', dragStart, { passive: false });
}

// Event Listeners
vectorizeBtn.addEventListener('click', addVectorizedText);
gridToggle.addEventListener('change', (e) => toggleGrid(e.target.checked));
