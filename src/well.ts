import {SCREEN_WIDTH} from "./config.js";
import {next_tetraminos, tetraminos} from "./tetraminos.js";

let DEBUG_COLOR = "lime";
let STARTX = 95;
let STARTY = 47;
let DRAW_STARTX = STARTX + 0.5;
let DRAW_STARTY = STARTY + 0.5;
let WELL_HEIGHT = 20;
let WELL_WIDTH = 10;
let CELL_SIZE = 8;
let WELL_OFFSET = SCREEN_WIDTH * STARTY + STARTX;

let NEXT_STARTX = 195;
let NEXT_STARTY = 119;
let DRAW_NEXT_STARTX = NEXT_STARTX + 0.5;
let DRAW_NEXT_START_Y = NEXT_STARTY + 0.5;
let NEXT_WIDTH = 3;
let NEXT_HEIGHT = 3;
let NEXT_OFFSET = SCREEN_WIDTH * NEXT_STARTY + NEXT_STARTX;

export function draw_debug(ctx: CanvasRenderingContext2D) {
    draw_grid(ctx, DRAW_STARTX, DRAW_STARTY, WELL_WIDTH, WELL_HEIGHT);
    draw_grid(ctx, DRAW_NEXT_STARTX, DRAW_NEXT_START_Y, NEXT_WIDTH, NEXT_HEIGHT);
}

function draw_grid(
    ctx: CanvasRenderingContext2D,
    startx: number,
    starty: number,
    width: number,
    height: number
) {
    ctx.strokeStyle = DEBUG_COLOR;
    ctx.beginPath();
    ctx.moveTo(startx, starty);
    ctx.lineTo(startx, starty + height * CELL_SIZE);
    ctx.lineTo(startx + width * CELL_SIZE, starty + height * CELL_SIZE);
    ctx.lineTo(startx + width * CELL_SIZE, starty);
    ctx.lineTo(startx, starty);
    ctx.stroke();

    for (let i = 0; i < width; i++) {
        ctx.beginPath();
        ctx.moveTo(startx + CELL_SIZE * i, starty);
        ctx.lineTo(startx + CELL_SIZE * i, starty + height * CELL_SIZE);
        ctx.stroke();
    }

    for (let i = 0; i < height; i++) {
        ctx.beginPath();
        ctx.moveTo(startx, starty + CELL_SIZE * i);
        ctx.lineTo(startx + width * CELL_SIZE, starty + CELL_SIZE * i);
        ctx.stroke();
    }
}
export function is_cell_empty(
    buffer: ArrayLike<number>,
    offset: number,
    cell_x: number,
    cell_y: number,
    local_offset: number
) {
    let central_pixel =
        (offset +
            cell_x * CELL_SIZE +
            local_offset +
            SCREEN_WIDTH * cell_y * CELL_SIZE +
            SCREEN_WIDTH * local_offset) *
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
            well[y][x] = is_cell_empty(buffer, WELL_OFFSET, x, y, CELL_SIZE / 2) ? 0 : 1;
        }
    }

    return well;
}

export function get_next(buffer: ArrayLike<number>) {
    let next: Array<number> = [];
    for (let y = 0; y < NEXT_HEIGHT; y++) {
        for (let x = 0; x < NEXT_WIDTH; x++) {
            next.push(is_cell_empty(buffer, NEXT_OFFSET, x, y, 2) ? 0 : 1);
        }
    }

    return next;
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
    }
}

export function identify_next_tetramino(buffer: ArrayLike<number>) {
    let next_grid = get_next(buffer);

    let tetra_identifier = next_grid.join("");
    // console.log(tetra_identifier);
    if (next_tetraminos[tetra_identifier]) {
        return next_tetraminos[tetra_identifier].name;
    } else {
        console.log("next not found:", tetra_identifier);
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
// @ts-ignore
window.get_next = get_next;
// @ts-ignore
window.identify_next_tetramino = identify_next_tetramino;
