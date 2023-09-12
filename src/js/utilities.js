export function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "-header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

 function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

export function handleError(message) {
  const toast = document.getElementById("toast")
  toast.textContent = message
  toast.classList.toggle("show")
  setTimeout(function() {
      toast.classList.toggle("show")
  }, 3000)
}

export function handleInputError() {
  const themePicker = document.getElementById("themePicker")
  themePicker.placeholder = "Please enter a theme."
  themePicker.classList.toggle("outline")
  setTimeout(function() {
    themePicker.classList.toggle("outline")
    themePicker.placeholder = ""
  }, 3000)
}

export async function fetchAPI(name, url) {
  try {
      const res = await fetch(url)
      if (!res.ok) {
          throw Error (`Could not fetch data from ${name}`)
      }
      const data = await res.json()
      return data
  }
  
  catch (error) {
      console.error(error)
      handleError()
  }
}

export function getSelectedInput(name) {
  const selectedInputs = document.querySelectorAll(`input[name=${name}]:checked`)
  return Array.from(selectedInputs).map(input => input.value)
}


export function hexToRgbA(hex, alpha){
  var c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
      c= hex.substring(1).split('');
      if(c.length== 3){
          c= [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c= '0x'+c.join('');
      return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+`,${alpha})`;
  }
  throw new Error('Bad Hex');
}



// Changes the color of CSS variable: takes 2 arguments: variable, color as string
export function changeInputColor(variable, color) {
  document.documentElement.style
    .setProperty(variable, color);
}