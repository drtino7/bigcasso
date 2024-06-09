let canvas = document.getElementById('work');
let context = canvas.getContext('2d');
let drawing = false;
let startX, startY, endX, endY;
let currentFigure = 'square';
let textMode = false;
let shapes = []; // Array to store drawn shapes

function setFigure(figure) {
    currentFigure = figure;
    textMode = false;
    document.getElementById('textInput').style.display = 'none';
}

function setTextMode() {
    textMode = true;
    document.getElementById('textInput').style.display = 'block';
}

function drawShape(shape) {
    if (shape.type === 'text') {
        context.font = '20px Arial';
        context.fillStyle = 'black';
        context.fillText(shape.text, shape.x, shape.y);
    } else {
        context.fillStyle = shape.color;
        context.strokeStyle = shape.color;
        context.lineWidth = shape.lineWidth;

        if (shape.type === 'square') {
            context.fillRect(shape.x, shape.y, shape.width, shape.width);
        } else if (shape.type === 'circle') {
            context.beginPath();
            const radius = Math.sqrt(Math.pow(shape.width, 2) + Math.pow(shape.height, 2)) / 2;
            context.arc(shape.x + shape.width / 2, shape.y + shape.height / 2, radius, 0, 2 * Math.PI);
            context.fill();
        } else if (shape.type === 'triangle') {
            context.beginPath();
            context.moveTo(shape.x, shape.y);
            context.lineTo(shape.x + shape.width, shape.y + shape.height);
            context.lineTo(shape.x - shape.width, shape.y + shape.height);
            context.closePath();
            context.fill();
        } else if (shape.type === 'rectangle') {
            context.fillRect(shape.x, shape.y, shape.width, shape.height);
        }  else if (shape.type === 'arrow') {

                    const angle = Math.atan2(shape.endY - shape.startY, shape.endX - shape.startX);
                    const headLength = 10; // Length of the arrow head
                    const arrowWidth = 10; // Width of the arrow line
                    context.beginPath();
                    context.moveTo(shape.startX, shape.startY);
                    context.lineTo(shape.endX, shape.endY);
                    context.stroke();

                    // Draw the arrow head
                    context.beginPath();
                    context.moveTo(shape.endX, shape.endY);
                    context.lineTo(shape.endX - headLength * Math.cos(angle - Math.PI / 6), shape.endY - headLength * Math.sin(angle - Math.PI / 6));
                    context.moveTo(shape.endX, shape.endY);
                    context.lineTo(shape.endX - headLength * Math.cos(angle + Math.PI / 6), shape.endY - headLength * Math.sin(angle + Math.PI / 6));
                    context.stroke();

                    // Draw a thicker line for the arrow body
                    const dx = arrowWidth / 2 * Math.sin(angle);
                    const dy = arrowWidth / 2 * Math.cos(angle);
                    context.beginPath();
                    context.moveTo(shape.startX - dx, shape.startY + dy);
                    context.lineTo(shape.endX - dx, shape.endY + dy);
                    context.lineTo(shape.endX + dx, shape.endY - dy);
                    context.lineTo(shape.startX + dx, shape.startY - dy);
                    context.closePath();
                    context.fill();          

        }
    }
}


function removeLastElement() {
    shapes.pop(); // Remove the last drawn shape
    redrawCanvas(); // Redraw the canvas after removing the shape
}

function redrawCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw all shapes stored in the array
    shapes.forEach(shape => {
        drawShape(shape);
    });
}

canvas.addEventListener('mousedown', (e) => {
    if (textMode) {
        let text = document.getElementById('textInput').value;
        shapes.push({ type: 'text', text: text, x: e.offsetX, y: e.offsetY });
        redrawCanvas();
        textMode = false;
        document.getElementById('textInput').style.display = 'none';
        return;
    }
    drawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
});

// canvas.addEventListener('mouseup', (e) => {
//     if (!drawing) return;
//     drawing = false;
//     endX = e.offsetX;
//     endY = e.offsetY;

//     const width = Math.abs(endX - startX);
//     const height = Math.abs(endY - startY);
//     const minX = Math.min(startX, endX);
//     const minY = Math.min(startY, endY);

//     shapes.push({ type: currentFigure, x: minX, y: minY, width: width, height: height, color: getRandomColor(), lineWidth: 1 });
//     redrawCanvas();


// });

// canvas.addEventListener('mouseup', (e) => {
//             if (!drawing) return;
//             drawing = false;

//             // Calculate end coordinates
//             endX = e.offsetX;
//             endY = e.offsetY;

//             // Push the arrow to the shapes array
//             shapes.push({
//                 type: 'arrow',
//                 startX: startX,
//                 startY: startY,
//                 endX: endX,
//                 endY: endY,
//                 color: getRandomColor(),
//                 lineWidth: 5 // You can adjust the thickness here
//             });

//             // Redraw canvas with the new arrow
//             redrawCanvas();
//         });


        canvas.addEventListener('mouseup', (e) => {
            if (!drawing) return;
            drawing = false;

            // Calculate end coordinates
            endX = e.offsetX;
            endY = e.offsetY;

            // Push the new shape to the shapes array
            shapes.push({
                type: currentFigure,
                startX: startX,
                startY: startY,
                endX: endX,
                endY: endY,
                x: Math.min(startX, endX),
                y: Math.min(startY, endY),
                width: Math.abs(endX - startX),
                height: Math.abs(endY - startY),
                color: getRandomColor()
            });

            // Redraw canvas with the new shape
            redrawCanvas();
        });



canvas.addEventListener('mouseout', () => {
    drawing = false;
});

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    shapes = [];
    redrawCanvas();
}
