import {SCREEN_WIDTH} from "./config.js";

let STARTX = 95;
let STARTY = 47;
let DRAW_STARTX = STARTX + 0.5;
let DRAW_STARTY = STARTY + 0.5;
let DEBUG_COLOR = "lime";
let WELL_HEIGHT = 20;
let WELL_WIDTH = 10;
let CELL_SIZE = 8;

export function draw_debug(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = DEBUG_COLOR;
    ctx.beginPath();
    ctx.moveTo(DRAW_STARTX, DRAW_STARTY);
    ctx.lineTo(DRAW_STARTX, DRAW_STARTY + WELL_HEIGHT * CELL_SIZE);
    ctx.lineTo(DRAW_STARTX + WELL_WIDTH * CELL_SIZE, DRAW_STARTY + WELL_HEIGHT * CELL_SIZE);
    ctx.lineTo(DRAW_STARTX + WELL_WIDTH * CELL_SIZE, DRAW_STARTY);
    ctx.lineTo(DRAW_STARTX, DRAW_STARTY);
    ctx.stroke();

    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo(DRAW_STARTX + CELL_SIZE * i, DRAW_STARTY);
        ctx.lineTo(DRAW_STARTX + CELL_SIZE * i, DRAW_STARTY + WELL_HEIGHT * CELL_SIZE);
        ctx.stroke();
    }

    for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(DRAW_STARTX, DRAW_STARTY + CELL_SIZE * i);
        ctx.lineTo(DRAW_STARTX + WELL_WIDTH * CELL_SIZE, DRAW_STARTY + CELL_SIZE * i);
        ctx.stroke();
    }
}

export function is_cell_empty(buffer: ArrayLike<number>, cell_x: number, cell_y: number) {
    // let central_pixel =
    //     STARTX + cell_x * CELL_SIZE * 4 + CELL_SIZE / 2 + SCREEN_WIDTH * (STARTY - 1) * 4;

    let offset = SCREEN_WIDTH * STARTY + STARTX;
    let central_pixel =
        (offset +
            cell_x * CELL_SIZE +
            CELL_SIZE / 2 +
            SCREEN_WIDTH * cell_y * CELL_SIZE +
            (SCREEN_WIDTH * CELL_SIZE) / 2) *
        4;
    // console.log("index:", central_pixel);
    if (
        buffer[central_pixel] === 0 &&
        buffer[central_pixel + 1] === 0 &&
        buffer[central_pixel + 2] === 0
    ) {
        return true;
    }

    return false;
}

export function get_well(buffer: ArrayLike<number>) {
    let well: Array<Array<number>> = [];
    for (let y = 0; y < WELL_HEIGHT; y++) {
        well[y] = [];
        for (let x = 0; x < WELL_WIDTH; x++) {
            well[y][x] = is_cell_empty(buffer, x, y) ? 0 : 1;
        }
    }

    return well;
}

// @ts-ignore
window.is_cell_empty = is_cell_empty;
// @ts-ignore
window.draw_debug = draw_debug;
// @ts-ignore
window.get_well = get_well;
