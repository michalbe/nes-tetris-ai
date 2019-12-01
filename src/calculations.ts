import {weights, WELL_HEIGHT_CALCULATION_MARGIN} from "./config.js";
import {WELL_HEIGHT, WELL_WIDTH} from "./well.js";

export function calculate_best_position(
    well: Array<Array<number>>,
    rotation_schemas: Array<Array<Array<number>>>,
    next_rotation_schemas: Array<Array<Array<number>>>
) {
    const positions: {[key: number]: any} = {};

    let height = WELL_HEIGHT;

    for (let column = 0; column < well[0].length; column++) {
        for (let row = 3; row < well.length; row++) {
            if (well[row][column] === 1) {
                height = Math.min(row, height);
                break;
            }
        }
    }

    height -= WELL_HEIGHT_CALCULATION_MARGIN;
    height = Math.max(height, 0);

    console.log("max well height", height);
    for (let schema_index = 0; schema_index < rotation_schemas.length; schema_index++) {
        for (let next_schema = 0; next_schema < next_rotation_schemas.length; next_schema++) {
            for (let row = height; row <= WELL_HEIGHT; row++) {
                for (let cell = -2; cell <= WELL_WIDTH + 2; cell++) {
                    const new_well = calculate_for_position(
                        rotation_schemas[schema_index],
                        well,
                        row,
                        cell
                    );

                    if (new_well) {
                        for (let next_row = height; next_row <= WELL_HEIGHT; next_row++) {
                            for (let next_cell = -2; next_cell <= WELL_WIDTH + 2; next_cell++) {
                                const new_well_with_next = calculate_for_position(
                                    next_rotation_schemas[next_schema],
                                    new_well,
                                    next_row,
                                    next_cell
                                );

                                if (new_well_with_next) {
                                    const points = calculate_points(new_well_with_next);
                                    const {heights, lines, holes, bumpiness, pure_lines} = points;
                                    let height = heights + lines + holes + bumpiness;
                                    positions[height] = positions[height] || {
                                        rotation: schema_index,
                                        x: cell,
                                        new_well,
                                        weights: {heights, lines, holes, bumpiness, pure_lines},
                                    };
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    console.log(positions);

    return positions[
        Math.max.apply(
            null,
            Object.keys(positions).map(e => parseFloat(e))
        )
    ];
}

export function calculate_for_position(
    schema: Array<Array<number>>,
    well: Array<Array<number>>,
    y: number,
    x: number
) {
    const new_well = JSON.parse(JSON.stringify(well));

    try {
        for (let i = y; i < y + schema.length; i++) {
            for (let j = x; j < x + schema[0].length; j++) {
                if (schema[i - y][j - x] === 0) {
                    continue;
                }
                if (
                    schema[i - y][j - x] === 1 &&
                    typeof new_well[i] !== "undefined" &&
                    new_well[i][j] === 1
                ) {
                    return false;
                } else if (i > 0 && well[i - 1][j] === 1 && schema[i - y][j - x] === 1) {
                    // console.log(j, i-1);
                    return false;
                } else if (i > 1 && well[i - 2][j] === 1 && schema[i - y][j - x] === 1) {
                    // console.log(j, i-1);
                    return false;
                } else if (i > 2 && well[i - 3][j] === 1 && schema[i - y][j - x] === 1) {
                    // console.log(j, i-1);
                    return false;
                } else if (i > 3 && well[i - 4][j] === 1 && schema[i - y][j - x] === 1) {
                    // console.log(j, i-1);
                    return false;
                } else {
                    if (
                        schema[i - y][j - x] === 0 &&
                        typeof new_well[i] !== "undefined" &&
                        typeof new_well[i][j] !== "number"
                    ) {
                    } else if (
                        typeof new_well[i] !== "undefined" &&
                        typeof new_well[i][j] === "number"
                    ) {
                        if (
                            schema[i - y][j - x] === 1 &&
                            typeof well[i - 1] !== "undefined" &&
                            well[i - 1][j] === 1
                        ) {
                            return false;
                        }
                        new_well[i][j] = new_well[i][j] || schema[i - y][j - x];
                    } else {
                        return false;
                    }
                }
            }
        }
    } catch (e) {
        console.log(e);
        console.log({x, y});
        console.log(y, new_well[y]);
    }

    return new_well;
}

export function calculate_points(well: Array<Array<number>>) {
    let heights = [0];
    let lines = 0;
    let holes = 0;
    let bumpiness = 0;

    for (let row = 0; row < well.length - 1; row++) {
        if (well[row].join("") === "111111111111") {
            lines++;
            well.splice(row, 1);
            row--;
        }
    }

    for (let column = 0; column < well[0].length; column++) {
        heights[column] = 0;
        for (let row = 3; row < well.length; row++) {
            if (well[row][column] === 1) {
                heights[column] = well.length - row;
                break;
            }
        }
    }

    for (let row = 3; row < well.length; row++) {
        for (let column = 0; column < well[0].length - 1; column++) {
            if (well[row][column] === 0) {
                for (let i = row; i > 3; i--) {
                    if (well[i][column] === 1) {
                        holes++;
                        break;
                    }
                }
            }
        }
    }

    bumpiness = heights.reduce((memo, curr, idx) => {
        const next = heights[idx + 1];
        if (next) {
            memo += Math.abs(curr - next);
        }
        return memo;
    }, 0);

    // heights = Math.max.apply(null, heights) * weights.heights;
    let new_heights =
        (heights.reduce((a, b) => {
            return a + b * b;
        }, 0) /
            heights.length) *
        weights.heights;
    let pure_lines = lines;
    lines = lines * weights.lines;
    holes = holes * weights.holes;
    bumpiness = bumpiness * weights.bumpiness;

    // return heights + lines + holes + bumpiness;
    return {heights: new_heights, lines, holes, bumpiness, pure_lines};
}
