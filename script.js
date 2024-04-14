
const catImg = new Image();
const infectedCatImg = new Image();
catImg.src = "cat.png";
infectedCatImg.src = "infected_cat.png";
const ctx = document.getElementById("canvas").getContext("2d");

class Cat {

    constructor(pos, all_infected, none_infected) {

        this.posY = this.determine_y(pos);
        this.posX = 550;
        this.none_infected = none_infected;
        if (all_infected) {this.type = "infected";}
        else {this.type = this.get_type();}
        this.pos = pos;
        this.all_infected = all_infected;

    }

    move(tick_count) {

        let multiplier = tick_count/4000;

        if (this.type == "grandma") {this.posX -= multiplier;}
        else if (this.type == "kid") {this.posX -= 5*multiplier;}
        else if (this.type == "scare") {
            this.posX -= 4*multiplier;
            if (this.pos == "top") {this.posY += 2*multiplier;}
            else if (this.pos == "middle") {this.posY += multiplier;}
            else {this.posY -= 2*multiplier;}
        }
        else if (this.type == "infected") {
            if (this.all_infected) {
                if (this.pos == "bottom") {this.posY -= Math.floor(Math.random() * 8) - 2;}
                else if (this.pos == "top") {this.posY += Math.floor(Math.random() * 8) - 2;}
                else {this.posY = Math.floor(Math.random() * 7) - 3;}
            }
            this.posX -= 2*multiplier;
        }

    }

    check_if_offscreen() {

        if (this.type == "infected") {return false;}
        else if (this.posX < -75) {return true;}
        else if (this.posY < -75) {return true;}
        else if (this.posY > 575) {return true;}
        else {return false;}

    }

    draw_cat() {
        
        if (this.type == "infected") {
            ctx.drawImage(infectedCatImg, this.posX, this.posY);
        }
        else {
            ctx.drawImage(catImg, this.posX, this.posY);
        }
        
    }

    determine_y(placement) {

        if (placement == "top") {return 50;}
        else if (placement == "middle") {return 200;}
        else {return 350;}

    }

    get_type() {

        let rand_num = Math.floor(Math.random() * 4);
        let type;
        switch (rand_num) {
            case 0:
                type = "grandma";
                break;
            case 1:
                type = "kid";
                break;
            case 2:
                type = "scare";
                break;
            case 3:
                if (this.none_infected) {type = "grandma";}
                else {type = "infected";}
                break;
            default:
                if (this.none_infected) {type = "grandma";}
                else {type = "infected";}
                break;
        }
        return type;

    }
    //return 0 if no, 1 if yes, 2 if infected
    check_collision(x, y) {

        if (((x > this.posX) && (x < this.posX + 128))&&((y > this.posY) && (y < this.posY + 128))) {
            if (this.type == "infected") {return 2;}
            return 1;
        }
        return 0;
    }

}

function decide_placement() {

    let rand_num = Math.floor(Math.random() * 3);
    switch (rand_num) {
        case 0:
            return "top";
        case 1:
            return "middle";
        default:
            return "bottom";
    }

}
// pass rgb(r,g,b) string
function set_canvas_background(rgb) {
    ctx.fillStyle = rgb;
    ctx.fillRect(0, 0, 500, 500);
}

let cats = [];
let all_infected = false;
let interval_id;

function play() {

    document.getElementById("play").innerHTML = "Play Again!"
    if (interval_id) {
        clearInterval(interval_id);
    }

    let let_go = false;
    let none_infected = false;
    all_infected = false;
    let tick_count = 3600;
    let running = true;
    cats = [];
    let score;
    let spawn_rate;
    set_canvas_background("rgb(0,0,0)");

    interval_id = setInterval(() => {
        
        ctx.clearRect(0, 0, 500, 500);

        if (!running) {clearInterval(interval_id);}

        if (let_go) {
            score = "You let a cat go :(";
            spawn_rate = 120;
        } else if (all_infected) {
            score = "INFECTED-CAT-O-POCOLIPSE!!";
            spawn_rate = 10;
            set_canvas_background("rgb(0,255,0)");
        } else if (tick_count > 8100) {
            score = "You Win!!! Cats Happy!!!"
            spawn_rate = 10;
            none_infected = true;
            set_canvas_background("rgb(0,0,0)");
        } else if (tick_count < 7500) {
            score = (tick_count - 3600).toString() + " Save the cats!!!";
            spawn_rate = 30;
        } else {
            score = (tick_count - 3600).toString() + " Whoah - almost there ;)";
            spawn_rate = 15;
            set_canvas_background("rgb(255,0,0)");
        }

        for (let i = 0; i < cats.length; i++) {
            cats[i].draw_cat();
            cats[i].move(tick_count);
            if (cats[i].check_if_offscreen() && (!all_infected) && (!none_infected)) {
                let_go = true;
            }
        }

        document.getElementById("score").innerHTML = score;
        tick_count += 1;

        if ((tick_count % spawn_rate) == 0) {
            let placement = decide_placement();
            cats.push(new Cat(placement, all_infected, none_infected));
        }

    }, 16);

}

document.addEventListener('click', (e) => {
    
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    for (let i = 0; i < cats.length; i++) {
        let coll = cats[i].check_collision(x, y);
        if (coll == 2) {all_infected = true;}
        else if (coll == 1) {
            cats.splice(i, 1);
        }
    }
});
