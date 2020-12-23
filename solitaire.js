const cards = new Image();
cards.src = 'cards.png';


const init = _ => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 91;
    canvas.height = 136;
    let card = '';
    let arr = [];
    for (let i = 0; i < 13; i++) {
        ctx.drawImage(cards, 9 + (98 * i) + -0.2 * i, 8, 89, 134, 1, 0, 89, 134);
        card = `<div class='card' data-dragable='true' data-number='${(i+1)}' data-color='red' data-shape='heart' data-front='false'>
        <img class='front' src='${canvas.toDataURL()}'>
        <img class='back' src='back.jpg'>
        </div>`;
        arr.push(card);
    }
    for (let i = 0; i < 13; i++) {
        ctx.drawImage(cards, 9 + (98 * i) + -0.2 * i, 152, 89, 134, 1, 0, 89, 134);
        card = `<div class='card' data-dragable='true' data-number='${(i+1)}' data-color='red' data-shape='diamond' data-front='false'>        
        <img class='front' src='${canvas.toDataURL()}'>
        <img class='back' src='back.jpg'>
        </div>`;
        arr.push(card);
    }
    for (let i = 0; i < 13; i++) {
        ctx.drawImage(cards, 9 + (98 * i) + -0.2 * i, 295, 89, 134, 1, 0, 89, 134);
        card = `<div class='card' data-dragable='true' data-number='${(i+1)}' data-color='black' data-shape='club' data-front='false'>        
        <img class='front' src='${canvas.toDataURL()}'>
        <img class='back' src='back.jpg'>
        </div>`;
        arr.push(card);
    }
    for (let i = 0; i < 13; i++) {
        ctx.drawImage(cards, 9 + (98 * i) + -0.2 * i, 438, 89, 134, 1, 0, 89, 134);
        card = `<div class='card' data-dragable='true' data-number='${(i+1)}' data-color='black' data-shape='spade' data-front='false'>        
        <img class='front' src='${canvas.toDataURL()}'>
        <img class='back' src='back.jpg'>
        </div>`;
        arr.push(card);
    }
    arr.sort(_ => {
        return Math.random() - Math.random()
    });
    for (let i = 28; i < arr.length; i++) {
        document.querySelector('.empty.queueBack').innerHTML += arr[i];
    }

    document.querySelector('#solitaire #table').children[0].innerHTML += arr[0];
    document.querySelector('#solitaire #table').children[1].innerHTML += arr[1];
    document.querySelector('#solitaire #table').children[1].innerHTML += arr[2];
    document.querySelector('#solitaire #table').children[2].innerHTML += arr[3];
    document.querySelector('#solitaire #table').children[2].innerHTML += arr[4];
    document.querySelector('#solitaire #table').children[2].innerHTML += arr[5];
    for (let i = 6; i < 10; i++) {
        document.querySelector('#solitaire #table').children[3].innerHTML += arr[i];
    }
    for (let i = 10; i < 15; i++) {
        document.querySelector('#solitaire #table').children[4].innerHTML += arr[i];
    }
    for (let i = 15; i < 21; i++) {
        document.querySelector('#solitaire #table').children[5].innerHTML += arr[i];
    }
    for (let i = 21; i < 28; i++) {
        document.querySelector('#solitaire #table').children[6].innerHTML += arr[i];
    }
    for (let i = 0; i < 7; i++) {
        organize(i);
    }
}

const flip = (target, front) => {
    target.dataset['front'] = front ? 'true' : 'false';
    target.children[1].style.zIndex = front ? 1 : 2;
    target.children[0].style.zIndex = front ? 2 : 1;
}

const organize = a => {
    if (document.querySelectorAll('#solitaire #table .empty')[a] == undefined) return;
    a = document.querySelectorAll('#solitaire #table .empty')[a].children;
    for (let i = 0; i < a.length; i++) {
        if (a[i].dataset['front'] !== 'true') {
            flip(a[i], false);
        }
        a[i].style.top = -2 + (20 * i) + 'px';
        a[i].dataset['top'] = 'false';
        a[i].dataset['location'] = i;
        if (i === a.length - 1) {
            a[i].dataset['top'] = 'true';
            flip(a[i], true)
        }
    }
}

let clickedCard;
let mouseDown = false;
let startX, startY;
let sX, sY;
let tempEvent;
let moves = 0;
const addMove = _ => {
    moves++;
    document.querySelector('#move').innerHTML = 'Moves : ' + moves;
    let sorted = 0;
    for (let i = 0; i < 4; i++) {
        sorted += document.querySelector('#sort').children[i].childElementCount;
    }
    if (sorted == 52) {
        alert("끝!!!!!!");
        return;
    }
}
document.body.addEventListener('mousedown', e => {
    if (e.target.parentNode.className != 'empty col') {
        if (e.target != e.target.parentNode.lastChild && e.target.parentNode.className == 'solitaire') {
            return;
        }
    }
    mouseDown = true;

    if (e.target.className === 'card' && e.target.dataset['front'] == 'true') {
        tempEvent = e;
        startX = e.clientX;
        startY = e.clientY;
        clickedCard = e.target;
        sX = clickedCard.offsetLeft;
        sY = clickedCard.offsetTop;
    } else {
        clickedCard = null;
    }
})

document.body.addEventListener('mouseup', e => {
    mouseDown = false;
    tempEvent = null;
    if (clickedCard !== null) {
        const sorts = document.querySelectorAll('.empty.sort');
        if (e.clientX >= sorts[0].getBoundingClientRect().x && e.clientX <= sorts[3].getBoundingClientRect().x + 91 &&
            e.clientY >= sorts[0].getBoundingClientRect().y && e.clientY <= sorts[0].getBoundingClientRect().y + 134) {

            const tempParent = clickedCard.parentNode;
            for (let i = 0; i < 4; i++) {
                let rect = sorts[i].getBoundingClientRect();
                if (e.clientX >= rect.x && e.clientX <= rect.x + 91 && e.clientY >= rect.y && e.clientY <= rect.y + 134) {
                    const number = Number(clickedCard.dataset['number']);
                    const shape = clickedCard.dataset['shape'];
                    if (number - 1 == sorts[i].childElementCount && sorts[i].dataset['space'] == shape) {
                        sorts[i].appendChild(clickedCard);
                        clickedCard.style.left = '-3px'
                        clickedCard.style.top = '-3px'
                        organize(tempParent.dataset['index']);
                        addMove();
                        return;
                    }
                }
            }

        }
        const table = document.querySelector('#table');
        for (let i = 0; i < 7; i++) {
            let rect = table.children[i].childElementCount != 0 ? table.children[i].lastChild.getClientRects()[0] : table.children[i].getClientRects()[0];
            if (e.clientX >= rect.x && e.clientX <= rect.x + 90 && e.clientY >= rect.y && e.clientY <= rect.y + 130) {
                let index = Number(e.target.parentNode.dataset['index']);
                if (i == index) {
                    continue;
                }
                if (table.children[i].childElementCount != 0) {
                    if ((Number(table.children[i].lastChild.dataset['number']) - 1) != e.target.dataset['number']) {
                        break;
                    }
                    if (table.children[i].lastChild.dataset['color'] == e.target.dataset['color']) {
                        break;
                    }
                }

                if (clickedCard != clickedCard.parentNode.lastChild) {
                    let arr = [];
                    for (let k = Number(clickedCard.dataset['location']); k <= Number(clickedCard.parentNode.lastChild.dataset['location']); k++) {
                        arr.push(clickedCard.parentNode.children[k]);
                    }
                    for (let k = 0; k < arr.length; k++) {
                        arr[k].style.left = '-2.5px';
                        arr[k].style.top = sY + (k * 20) + 'px';
                        table.children[i].appendChild(arr[k]);
                    }
                } else {
                    table.children[i].appendChild(e.target);
                }
                organize(index);
                organize(i);
                addMove();
                return;
            }
        }
        clickedCard.style.left = '-2.5px';
        clickedCard.style.top = sY + 'px';

        if (clickedCard != clickedCard.parentNode.lastChild) {
            for (let i = Number(clickedCard.dataset['location']); i < clickedCard.parentNode.children.length; i++) {
                clickedCard.parentNode.children[i].style.left = '-2.5px';
            }
            organize(Number(clickedCard.parentNode.dataset['index']));

        }
    }

})

document.body.addEventListener('mousemove', e => {
    if (mouseDown && clickedCard != null) {
        clickedCard.style.left = (e.clientX - startX + 'px');
        clickedCard.style.top = (e.clientY - startY + sY + 'px');
        for (let i = 0; i < clickedCard.parentNode.children.length; i++) {
            if (clickedCard == clickedCard.parentNode.children[i]) {
                let temp = 0;
                for (let k = i + 1; k < clickedCard.parentNode.children.length; k++) {
                    temp++;
                    clickedCard.parentNode.children[k].style.left = (e.clientX - startX + 'px');
                    clickedCard.parentNode.children[k].style.top = (e.clientY - startY + sY + (20 * temp) + 'px');
                }
                break;
            }
        }
    }
})

document.body.addEventListener('mouseleave', e => {
    if (clickedCard !== null && mouseDown === true) {
        clickedCard.style.left = sX + 'px';
        clickedCard.style.top = sY + 'px';
        mouseDown = false;
    }
})

document.querySelector('.queueBack').addEventListener('mouseup', e => {
    const target = e.target;
    if (document.querySelector('.queueBack').children.length == 0) {
        if (document.querySelector('.queueFront').children.length == 0) {
            return;
        }
        const queueFront = document.querySelectorAll('.queueFront .card');
        for (let i = queueFront.length - 1; i >= 0; i--) {
            document.querySelector('.queueBack').appendChild(queueFront[i]);
            flip(queueFront[i], false);
        }
        return;
    }
    addMove();
    document.querySelector('.queueFront').appendChild(target);
    flip(target, true);
})

window.onload = _ => {
    init();
}