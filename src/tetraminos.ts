export const tetraminos: {
    [key: string]: any;
} = {
    // J
    "0111000100000000": {
        name: "J",
        rotation: 1, //90
        add_step: 0,
    },

    // T
    "0111001000000000": {
        name: "T",
        rotation: 2, //180
        add_step: 0,
    },

    // I
    "1111000000000000": {
        name: "I",
        rotation: 1, //90
        add_step: 0,
    },

    // L
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

    // Z
    "0110001100000000": {
        name: "Z",
        rotation: 0,
        add_step: 0,
    },

    // O
    "0110011000000000": {
        name: "O",
        rotation: 0,
        add_step: 0,
    },
};

export const next_tetraminos: {
    [key: string]: any;
} = {
    "011110000": {
        name: "S",
    },
    "111100000": {
        name: "L",
    },
    "111010000": {
        name: "T",
    },
    "111001000": {
        name: "J",
    },
    "011011000": {
        name: "O",
    },
    "000111000": {
        name: "I",
    },
    "110011000": {
        name: "Z",
    },
};

// @ts-ignore
window.tetraminos = tetraminos;
