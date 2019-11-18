import {SCREEN_WIDTH} from "./config.js";
import {tetraminos} from "./tetraminos.js";

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
    let offset = SCREEN_WIDTH * STARTY + STARTX;
    let central_pixel =
        (offset +
            cell_x * CELL_SIZE +
            CELL_SIZE / 2 +
            SCREEN_WIDTH * cell_y * CELL_SIZE +
            (SCREEN_WIDTH * CELL_SIZE) / 2) *
        4;

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

export function identify_tetramino(buffer: ArrayLike<number>) {
    let well = get_well(buffer);
    let result: number[] = [];
    let size = 4;

    for (let y = 0; y < size; y++) {
        for (let x = 3; x < 3 + size; x++) {
            result.push(well[y][x]);
        }
    }

    let tetra_identifier = result.join("");
    if (tetraminos[tetra_identifier]) {
        return tetraminos[tetra_identifier].name;
    } else {
        if ((tetra_identifier.match(/1/g) || []).length === 4) {
            console.log("not found:", tetra_identifier);
        }
        return false;
    }
}

// @ts-ignore
window.is_cell_empty = is_cell_empty;
// @ts-ignore
window.draw_debug = draw_debug;
// @ts-ignore
window.get_well = get_well;
// @ts-ignore
window.identify_tetramino = identify_tetramino;
