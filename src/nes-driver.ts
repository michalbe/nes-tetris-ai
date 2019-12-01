import {calculate_best_position} from "./calculations.js";
import {
    CANVAS_ID,
    DEBUG,
    FRAMEBUFFER_SIZE,
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
    STARTING_X,
} from "./config.js";
import {get_all_rotations} from "./tetraminos.js";
import {get_tetra_code, get_well, identify_next_tetramino, identify_tetramino} from "./well.js";

declare var jsnes: any;
interface JsNes {
    frame: () => void;
    loadROM: (rom_data: string) => void;
    buttonDown: (player: number, button: string) => void;
    buttonUp: (player: number, button: string) => void;
    toJSON: () => any;
    fromJSON: (data: any) => void;
}

export const enum State {
    Identifying,
    Rotating,
    Moving,
    PushingDown,
}

export class NES {
    nes: JsNes;
    canvas_ctx: CanvasRenderingContext2D;
    image: ImageData;
    framebuffer_u8: Uint8ClampedArray;
    framebuffer_u32: Uint32Array;

    running: boolean = true;

    tetramino: string | null = null;
    next: string | null = null;
    well: Array<Array<number>> = [];

    state: State = State.Identifying;

    movement: number = 0;
    direction: string = "";

    rotation: number = 0;

    constructor(rom_data: string) {
        this.nes = new jsnes.NES({
            onFrame: (framebuffer_24: Array<number>) => {
                for (let i = 0; i < FRAMEBUFFER_SIZE; i++) {
                    this.framebuffer_u32[i] = 0xff000000 | framebuffer_24[i];
                }
            },
        });

        let canvas = document.getElementById(CANVAS_ID);
        this.canvas_ctx = (canvas as HTMLCanvasElement).getContext("2d")!;
        this.image = this.canvas_ctx.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        console.log(SCREEN_WIDTH, SCREEN_HEIGHT);
        this.canvas_ctx.fillStyle = "black";
        this.canvas_ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        let buffer = new ArrayBuffer(this.image.data.length);
        this.framebuffer_u8 = new Uint8ClampedArray(buffer);
        this.framebuffer_u32 = new Uint32Array(buffer);

        document.addEventListener("keydown", event => {
            this.keyboard(this.nes.buttonDown, event);
        });
        document.addEventListener("keyup", event => {
            this.keyboard(this.nes.buttonUp, event);
        });

        this.nes.loadROM(rom_data);
    }

    save(slot: number = 0) {
        let data = JSON.stringify(this.nes.toJSON());
        localStorage.setItem(`slot_${slot}`, data);
    }

    load(slot: number = 0) {
        let text = localStorage.getItem(`slot_${slot}`);
        if (text) {
            let data = JSON.parse(text);
            this.nes.fromJSON(data);
        } else {
            console.error("no save on slot", slot);
        }
    }

    frame() {
        let msg = "";
        this.image.data.set(this.framebuffer_u8);
        this.canvas_ctx.putImageData(this.image, 0, 0);

        if (DEBUG) {
            // draw_debug(this.canvas_ctx);
        }

        switch (this.state) {
            case State.Identifying:
                let tetramino = identify_tetramino(this.framebuffer_u8);

                let next = identify_next_tetramino(this.framebuffer_u8);

                if (tetramino && next && (tetramino !== this.tetramino || next !== this.next)) {
                    this.tetramino = tetramino;
                    this.next = next;
                    this.well = get_well(this.framebuffer_u8);

                    let rotations = get_all_rotations(this.tetramino!);

                    let calculated_position = calculate_best_position(this.well, rotations);

                    this.movement = Math.abs(calculated_position.x - STARTING_X);
                    this.direction =
                        calculated_position.x - STARTING_X > 0
                            ? jsnes.Controller.BUTTON_RIGHT
                            : jsnes.Controller.BUTTON_LEFT;
                    this.rotation = calculated_position.rotation;

                    console.log(`Current: ${this.tetramino}, Next: ${this.next}`);

                    this.state = State.Rotating;
                }
                break;
            case State.Rotating:
                if (this.rotation) {
                    this.nes.buttonDown(1, jsnes.Controller.BUTTON_A);
                    this.nes.frame();
                    this.nes.buttonUp(1, jsnes.Controller.BUTTON_A);
                    this.rotation--;
                } else {
                    this.state = State.Moving;
                }
                break;

            case State.Moving:
                if (this.movement) {
                    this.nes.buttonDown(1, this.direction);
                    this.nes.frame();
                    this.nes.buttonUp(1, this.direction);
                    this.movement--;
                } else {
                    this.state = State.PushingDown;
                }
                break;
        }

        this.nes.frame();

        if (this.running) {
            window.requestAnimationFrame(() => {
                this.frame();
            });
        }
    }

    stop() {
        this.running = false;
    }

    start() {
        this.running = true;
        this.frame();
    }

    keyboard(callback: (player: number, button: string) => void, event: KeyboardEvent) {
        let player = 1;
        // console.log(event.keyCode);
        switch (event.keyCode) {
            case 38: // UP
                callback(player, jsnes.Controller.BUTTON_UP);
                break;
            case 40: // Down
                callback(player, jsnes.Controller.BUTTON_DOWN);
                break;
            case 37: // Left
                callback(player, jsnes.Controller.BUTTON_LEFT);
                break;
            case 39: // Right
                callback(player, jsnes.Controller.BUTTON_RIGHT);
                break;
            case 65: // 'a' - qwerty, dvorak
                callback(player, jsnes.Controller.BUTTON_A);
                break;
            case 83: // 's' - qwerty, azerty
                callback(player, jsnes.Controller.BUTTON_B);
                break;
            case 9: // Tab
                callback(player, jsnes.Controller.BUTTON_SELECT);
                break;
            case 13: // Return
                callback(player, jsnes.Controller.BUTTON_START);
                break;
            case 81: // PAUSE
                if (event.type === "keyup") {
                    return;
                }
                if (this.running) {
                    this.stop();
                } else {
                    this.start();
                }
                break;
            case 87: // W, get tetra code
                if (event.type === "keyup") {
                    return;
                }
                get_tetra_code(this.framebuffer_u8);
                break;
            case 69: // get rotations
                if (event.type === "keyup") {
                    return;
                }

                console.log("rotations for tetramino: ", this.tetramino);
                if (this.tetramino) {
                    console.log(get_all_rotations(this.tetramino));
                }

                break;
            default:
                break;
        }
    }
}
