class Collider {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
    }

    intersectsWith(collider) {
        let x = collider.x >= this.x && collider.x <= this.x + this.size;
        let y = collider.y >= this.y && collider.y <= this.y + this.size;
        return x && y;
    }
}


$(() => {
   const container = $("#main");
   let figures = [];

   setInterval(instantiateFigureUpdate, 250);

   function instantiateFigureUpdate() {

       const figure = $(`<div class="figure ${next(10) % 2 === 0 ? "circle" : ""}"></div>`);
       const size = next(75, 25);
       figure.width(size);
       figure.height(size);
       //const x = next(container.width() - size) + "px";
       //const y = next(container.height() - size) + "px";

       let start = getRandomPoint(container, size);
       let dest = getRandomPoint(container, size);

       if (start.x === dest.x || start.y === dest.y) return;

       figure.css({
           "left": start.x + "px",
           "top": start.y + "px",
           "background": `rgb(${next(256)}, ${next(256)}, ${next(256)})`
       });

       figures.push(figure);
       container.append(figure);

       figure.animate({
           "left": dest.x + "px",
           "top": dest.y + "px"
       }, 2000, "linear", () => {
           destroyFigure(figure);
       });

       const getCollider = (figure) => {
           let x = figure.css("left").replace("px", "") - 0;
           let y = figure.css("top").replace("px", "") - 0;
           let size = figure.css("width").replace("px", "") - 0;
           return new Collider(x, y, size);
       }

       let update = setInterval(() => {
           let col1 = getCollider(figure);

           if ((col1.x <= 0 || col1.x >= container.width()) ||
               (col1.y <= 0 || col1.y >= container.height())) return;

           figures.filter((f) => {
               return f !== figure;
           }).forEach((f) => {
               let col2 = getCollider(f);
               if (col1.intersectsWith(col2)) {
                   console.log(col1, col2);
                   destroyFigure(f);
                   destroyFigure(figure);
                   clearInterval(update);
               }
           })
       }, 1);

   }

   function destroyFigure(figure) {
       figures = figures.filter((f) => {
           return f !== figure;
       })
       figure.remove();
   }



   function getRandomPoint(container, size) {
       let x = next(10) % 2 === 0 ? -size : container.width();
       let y = next(10) % 2 === 0 ? -size : container.height();

       let dX, dY;

       if (x === -size) {
           dX = container.width();
           dY = next(container.height());
       } else {
           dX = -size;
           dY = next(container.height());
       }
       if (y === -size) {
           dX = next(container.width());
           dY = container.height();
       } else {
           dX = next(container.width());
           dY = -size;
       }

       return {
           x: dX,
           y: dY
       };
   }

   function next(max, min = 0) {
       return Math.floor(Math.random() * (max - min) + min);
   }
});


// // setup
// let initialSpeed = 10;
//
// // dynamic
// let x = 0;
// let y = 0;
//
// let velocity = {
//     x: initialSpeed,
//     y: initialSpeed
// };
//
// window.setInterval(() => {
//     tick();
//
// }, 50)
//
// window.setInterval(() => {
//     fixedUpdate();
// }, 1);
//
// function tick() {
//     move(figure, velocity)
// }
//
// function fixedUpdate() {
//     x = figure.css("left").replace("px", "") - 0;
//     y = figure.css("top").replace("px", "") - 0;
//
//     $("#debug").text(`X: ${x} Y: ${y}`);
// }
//
// function move(figure, velocity) {
//     x = figure.css("left").replace("px", "") - 0;
//     y = figure.css("top").replace("px", "") - 0;
//
//     let newX = x + velocity.x;
//     let newY = y + velocity.y;
//
//     figure.animate({
//         left: `=${clamp(0, container.width() - figure.width(),  newX)}`,
//         top: `=${clamp(0, container.height() - figure.height(), newY)}`}, 50, "linear");
// }
//
// function clamp(min, max, val) {
//     return Math.max(min, Math.min(max, val))
// }