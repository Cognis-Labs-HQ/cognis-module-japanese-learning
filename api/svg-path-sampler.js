const COMMAND_ARGUMENTS = Object.freeze({
    M: 2,
    L: 2,
    H: 1,
    V: 1,
    C: 6,
    S: 4,
    Q: 4,
    T: 2,
    A: 7,
    Z: 0,
});

function tokenize(pathData) {
    return (
        pathData.match(
            /[AaCcHhLlMmQqSsTtVvZz]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g,
        ) ?? []
    );
}

function curvePoint(start, controlOne, controlTwo, end, progress) {
    const inverse = 1 - progress;
    return {
        x:
            inverse ** 3 * start.x +
            3 * inverse ** 2 * progress * controlOne.x +
            3 * inverse * progress ** 2 * controlTwo.x +
            progress ** 3 * end.x,
        y:
            inverse ** 3 * start.y +
            3 * inverse ** 2 * progress * controlOne.y +
            3 * inverse * progress ** 2 * controlTwo.y +
            progress ** 3 * end.y,
    };
}

function quadraticPoint(start, control, end, progress) {
    const inverse = 1 - progress;
    return {
        x:
            inverse ** 2 * start.x +
            2 * inverse * progress * control.x +
            progress ** 2 * end.x,
        y:
            inverse ** 2 * start.y +
            2 * inverse * progress * control.y +
            progress ** 2 * end.y,
    };
}

function coordinate(values, index, relative, current, axis) {
    return values[index] + (relative ? current[axis] : 0);
}

function pathPolyline(pathData) {
    const tokens = tokenize(pathData);
    const points = [];
    let tokenIndex = 0;
    let command;
    let current = { x: 0, y: 0 };
    let start = { x: 0, y: 0 };
    let previousControl;
    while (tokenIndex < tokens.length) {
        if (/^[A-Za-z]$/.test(tokens[tokenIndex]))
            command = tokens[tokenIndex++];
        if (!command) throw new Error("stroke_path_command_missing");
        const upper = command.toUpperCase();
        const argumentCount = COMMAND_ARGUMENTS[upper];
        if (argumentCount === undefined)
            throw new Error("stroke_path_command_invalid");
        if (upper === "Z") {
            points.push({ ...start });
            current = { ...start };
            previousControl = undefined;
            command = undefined;
            continue;
        }
        if (tokenIndex + argumentCount > tokens.length)
            throw new Error("stroke_path_arguments_invalid");
        const values = tokens
            .slice(tokenIndex, tokenIndex + argumentCount)
            .map(Number);
        if (values.some((value) => !Number.isFinite(value)))
            throw new Error("stroke_path_number_invalid");
        tokenIndex += argumentCount;
        const relative = command === command.toLowerCase();
        const point = (xIndex, yIndex) => ({
            x: coordinate(values, xIndex, relative, current, "x"),
            y: coordinate(values, yIndex, relative, current, "y"),
        });
        if (upper === "M") {
            current = point(0, 1);
            start = { ...current };
            points.push({ ...current });
            command = relative ? "l" : "L";
        } else if (upper === "L" || upper === "T") {
            current = point(0, 1);
            points.push({ ...current });
        } else if (upper === "H") {
            current = {
                x: coordinate(values, 0, relative, current, "x"),
                y: current.y,
            };
            points.push({ ...current });
        } else if (upper === "V") {
            current = {
                x: current.x,
                y: coordinate(values, 0, relative, current, "y"),
            };
            points.push({ ...current });
        } else if (upper === "C") {
            const controlOne = point(0, 1);
            const controlTwo = point(2, 3);
            const end = point(4, 5);
            for (const progress of [0.25, 0.5, 0.75, 1])
                points.push(
                    curvePoint(current, controlOne, controlTwo, end, progress),
                );
            current = end;
            previousControl = controlTwo;
        } else if (upper === "S") {
            const controlOne = previousControl
                ? {
                      x: 2 * current.x - previousControl.x,
                      y: 2 * current.y - previousControl.y,
                  }
                : { ...current };
            const controlTwo = point(0, 1);
            const end = point(2, 3);
            for (const progress of [0.25, 0.5, 0.75, 1])
                points.push(
                    curvePoint(current, controlOne, controlTwo, end, progress),
                );
            current = end;
            previousControl = controlTwo;
        } else if (upper === "Q") {
            const control = point(0, 1);
            const end = point(2, 3);
            for (const progress of [0.25, 0.5, 0.75, 1])
                points.push(quadraticPoint(current, control, end, progress));
            current = end;
            previousControl = control;
        } else if (upper === "A") {
            current = point(5, 6);
            points.push({ ...current });
            previousControl = undefined;
        }
        if (!["C", "S", "Q"].includes(upper)) previousControl = undefined;
    }
    return points;
}

function distance(left, right) {
    return Math.hypot(right.x - left.x, right.y - left.y);
}

export function sampleSvgPath(pathData) {
    const polyline = pathPolyline(pathData);
    if (polyline.length < 2) throw new Error("stroke_path_points_invalid");
    const lengths = [0];
    for (let index = 1; index < polyline.length; index += 1)
        lengths.push(
            lengths[index - 1] + distance(polyline[index - 1], polyline[index]),
        );
    const total = lengths.at(-1);
    if (!total) throw new Error("stroke_path_length_invalid");
    const sampleCount = Math.max(4, Math.min(32, Math.ceil(total / 6)));
    return Array.from({ length: sampleCount }, (_, sampleIndex) => {
        const target = (total * sampleIndex) / (sampleCount - 1);
        let segment = 1;
        while (segment < lengths.length - 1 && lengths[segment] < target)
            segment += 1;
        const segmentLength = lengths[segment] - lengths[segment - 1];
        const progress = segmentLength
            ? (target - lengths[segment - 1]) / segmentLength
            : 0;
        return {
            x:
                polyline[segment - 1].x +
                (polyline[segment].x - polyline[segment - 1].x) * progress,
            y:
                polyline[segment - 1].y +
                (polyline[segment].y - polyline[segment - 1].y) * progress,
        };
    });
}
