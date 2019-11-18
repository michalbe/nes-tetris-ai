export const tetraminos: {
    [key: string]: any;
} = {
    // J
    "0100010011000000": {
        name: "J",
        rotation: 0,
        add_step: 0,
    },
    "0111000100000000": {
        name: "J",
        rotation: 1, //90
        add_step: 0,
    },
    "0110010001000000": {
        name: "J",
        rotation: 2, //180
        add_step: -1,
    },
    "1000111000000000": {
        name: "J",
        rotation: 3, //270
        add_step: 0,
    },

    // T
    "0100111000000000": {
        name: "T",
        rotation: 0,
        add_step: 0,
    },
    "0100110001000000": {
        name: "T",
        rotation: 1, //90
        add_step: 0,
    },
    "0111001000000000": {
        name: "T",
        rotation: 2, //180
        add_step: 0,
    },
    "0100011001000000": {
        name: "T",
        rotation: 3, //270
        add_step: 0,
    },

    // I
    "0100010001000100": {
        name: "I",
        rotation: 0,
        add_step: 0,
    },
    "1111000000000000": {
        name: "I",
        rotation: 1, //90
        add_step: 0,
    },

    // L
    "0100010001100000": {
        name: "L",
        rotation: 0,
        add_step: 0,
    },
    "0010111000000000": {
        name: "L",
        rotation: 1, //90
        add_step: 0,
    },
    "1100010001000000": {
        name: "L",
        rotation: 2, //180
        add_step: 0,
    },
    "0111010000000000": {
        name: "L",
        rotation: 3, //270
        add_step: 0,
    },

    // S
    "0011011000000000": {
        name: "S",
        rotation: 0,
        add_step: 0,
    },

    "1000110001000000": {
        name: "S",
        rotation: 1, //90
        add_step: 0,
    },

    // Z
    "0110001100000000": {
        name: "Z",
        rotation: 0,
        add_step: 0,
    },
    "0100110010000000": {
        name: "Z",
        rotation: 1, //90
        add_step: 0,
    },

    // O
    "0110011000000000": {
        name: "O",
        rotation: 0,
        add_step: 0,
    },
};

// @ts-ignore
window.tetraminos = tetraminos;
