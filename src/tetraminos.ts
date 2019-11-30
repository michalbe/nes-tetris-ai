export const tetraminos: {
    [key: string]: any;
} = {
    // J
    "0111000100000000": {
        name: "J",
    },

    // T
    "0111001000000000": {
        name: "T",
    },

    // I
    "1111000000000000": {
        name: "I",
    },

    // L
    "0111010000000000": {
        name: "L",
    },

    // S
    "0011011000000000": {
        name: "S",
    },

    // Z
    "0110001100000000": {
        name: "Z",
    },

    // O
    "0110011000000000": {
        name: "O",
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

const all_possible_rotations: {
    [key: string]: Array<string>;
} = {
    L: ["0111010000000000", "0110001000100000", "0001011100000000", "0010001000110000"],
    S: ["0011011000000000", "0010001100010000"],
    O: ["0110011000000000"],
    I: ["1111000000000000", "0010001000100010"],
    Z: ["0110001100000000", "0001001100100000"],
    J: ["0111000100000000", "0010001001100000", "0100011100000000", "0011001000100000"],
};

export const get_all_rotations = (() => {
    let rotations: {[key: string]: Array<Array<Array<number>>>} = {};
    return (name: string) => {
        if (rotations[name]) {
            return rotations[name];
        }

        let rotations_map = all_possible_rotations[name];
        rotations[name] = rotations_map.map(schema =>
            schema.match(/.{1,4}/g)!.map(row => row.split("").map(element => parseInt(element, 10)))
        );

        return rotations[name];
    };
})();

// @ts-ignore
window.tetraminos = tetraminos;
