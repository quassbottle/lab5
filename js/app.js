class Collider {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
    }

    intersectsWith(collider) {
        if (this.x >= collider.x + collider.size || collider.x >= this.x + this.size) return false;
        if (this.y >= collider.y + collider.size || collider.y >= this.y + this.size) return false;
        return true;
    }
}

$(() => {
   const container = $("#main");
   const amount = $("#amount");

   let counter = 0;
   let figuresUpdate;
   let figures = [];

   $(document).on("click", "#start", () => {
       figuresUpdate = setInterval(instantiateFigureUpdate, 250);
       counter = Math.min(100, Math.max(1, amount.val()));
       amount.val(counter);
       container.empty();
       figures = [];
   });

   function instantiateFigureUpdate() {
       if (counter <= 0) {
           clearInterval(figuresUpdate);
           return false;
       }

       const figure = $(`<div class="figure ${next(10) % 2 === 0 ? "circle" : ""}"></div>`);
       const size = next(75, 25);
       figure.width(size);
       figure.height(size);

       let start = getRandomPoint(container, size);
       let dest = getRandomPoint(container, size);

       if (start.x === dest.x || start.y === dest.y) return false;

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
           }).some((f) => {
               let col2 = getCollider(f);
               if (col2.intersectsWith(col1)) {
                   clearInterval(update);

                   createParticles(figure);
                   createParticles(f);

                   destroyFigure(f);
                   destroyFigure(figure);

                   return true;
               }
           })
       }, 1);

       counter--;
       console.log(counter);
       return true;
   }

   function destroyFigure(figure) {
       figures = figures.filter((f) => {
           return f !== figure;
       })
       figure.remove();
   }

   function createParticles(figure) {
       for (let i = 0; i < 3; i++) {
           const particle = $(`<div class="figure"></div>`);
           const size = 25;
           particle.width(size);
           particle.height(size);

           let dest = getRandomPoint(container, size);

           particle.css({
              "left": figure.css("left"),
              "top": figure.css("top"),
              "background": "red"
           });

           particle.animate({
               "left": dest.x + "px",
               "top": dest.y + "px",
               "opacity": 0
           }, 2500, "linear");

           container.append(particle);
       }
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
