const socket = io();
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fedX = canvas.offsetLeft;
const fedY = canvas.offsetTop;
const width = 1900;
const height = 1200;

var clicking = null;
var pastX = 0;
var pastY = 0;
var lineColor = 'black';
var lineWidth = 4;

const drawPoint = (startX, startY, finishX, finishY, color) => {
    ctx.beginPath();
    ctx.lineCap = "round";

    if (color === 'white') {
        ctx.lineWidth = 18;
    } else {
        ctx.lineWidth = 5;
    }
    
    ctx.strokeStyle = color;
    ctx.moveTo(startX, startY);
    ctx.lineTo(finishX, finishY);
    ctx.stroke();
}

const changeColor = (color) => {
    if (color === 'white') {
        lineColor = color;
    }else if (color === 'clear'){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        socket.emit('clear', true);
    }else {
        lineWidth = 4;
        lineColor = color;
    }
};


canvas.addEventListener('mousedown', (event) => {
    pastX = event.clientX - fedX;
    pastY = event.clientY - fedY;
    clicking = true;
});

canvas.addEventListener('mouseup', () => {
    clicking = false;
});

canvas.addEventListener('mouseleave', () => {
    clicking = false;
});

canvas.addEventListener('mousemove', (event) => {
    if (clicking === true) {
        const x = event.clientX - fedX;
        const y = event.clientY - fedY;
        
        const data = {x, y, pastX, pastY, lineColor, lineWidth};
        drawPoint(pastX, pastY, x, y, lineColor);
        
        pastX = x;
        pastY = y;

        socket.emit('data', data);
    }
});

//sunucudan mesaji dinliyor
socket.on('data', (data) => {
    drawPoint(data.pastX, data.pastY, data.x, data.y, data.lineColor);
});

socket.on('clear', (data) => {
    if (data === true) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});