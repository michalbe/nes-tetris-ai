export const SCREEN_WIDTH = 256;
export const SCREEN_HEIGHT = 240;
export const FRAMEBUFFER_SIZE = SCREEN_WIDTH * SCREEN_HEIGHT;
export const CANVAS_ID = "nes-canvas";
export const ROM_URL = "roms/tetris.nes";
export const DEBUG = true;
export const STARTING_X = 3;

export const weights = {
    heights: -0.10066,
    lines: 0.360666,
    holes: -0.995663,
    bumpiness: -0.184483,
};
