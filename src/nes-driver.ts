import {CANVAS_ID, FRAMEBUFFER_SIZE, SCREEN_HEIGHT, SCREEN_WIDTH} from "./config.js";

declare var jsnes: any;
interface JsNes {
    frame: () => void;
    loadROM: (rom_data: string) => void;
    buttonDown: (player: number, button: string) => void;
    buttonUp: (player: number, button: string) => void;
}

export class NES {
    nes: JsNes;
    canvas_ctx: CanvasRenderingContext2D;
    image: ImageData;
    framebuffer_u8: Uint8ClampedArray;
    framebuffer_u32: Uint32Array;

    running: boolean = true;

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

    frame() {
        this.image.data.set(this.framebuffer_u8);
        this.canvas_ctx.putImageData(this.image, 0, 0);
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
            case 81: // 'q' - azerty
                callback(player, jsnes.Controller.BUTTON_A);
                break;
            case 83: // 's' - qwerty, azerty
            case 79: // 'o' - dvorak
                callback(player, jsnes.Controller.BUTTON_B);
                break;
            case 9: // Tab
                callback(player, jsnes.Controller.BUTTON_SELECT);
                break;
            case 13: // Return
                callback(player, jsnes.Controller.BUTTON_START);
                break;
            default:
                break;
        }
    }
}