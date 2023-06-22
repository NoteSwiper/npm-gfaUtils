function isLetter(char: string) {
    return /^\p{L}/u.test(char);
}

function isUppercase(char: string) {
    return char === char.toUpperCase();
}

export function getCapitalPercentage(str: string): number {
    let totalLetters = 0;
    let upperLetters = 0;

    for (const currentLetter of str) {
        if (!isLetter(currentLetter)) continue;

        if (isUppercase(currentLetter)) {
            upperLetters++;
        }

        totalLetters++;
    }

    return upperLetters / totalLetters;
}

export function InitModifierParam() {
    return (target: { [key: string]: any }, key: string): void => {
        let value = target[key];
        let sum = 0;

        const getter = () => value;
        const setter = (next: number | Record<string, number>) => {
            if (typeof next === "object") {
                sum = Object.values(next).reduce((a,b) => a + b);
            }

            if (next < 0 || sum < 0 || next > 1 || sum > 1) {
                throw new Error(
                    `${key} modifier value must be a number between 0 and 1`,
                );
            }

            value = next;
        };

        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true,
        });
    };
}

export function isUri(value: string): boolean {
    if (!value) return false;

    if (
        /[^a-z0-9\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\.\-\_\~\%]/i.test(value)
    ) {
        return false;
    }

    if (
        /%[^0-9a-f]/i.test(value) || /%[0-9a-f](:?[^0-9a-f]|$)/i.test(value)
    ) {
        return false;
    }

    const split = value.match(
        /(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/,
    );

    if (!split) return false;

    const [, scheme, authority, path] = split;

    if (!(scheme && scheme.length && path.length >= 0)) return false;

    if (authority && authority.length) {
        if (!(path.length === 0 || /^\//.test(path))) return false;
    } else if (/^\/\//.test(path)) {
        return false;
    }

    if (!/^[a-z][a-z0-9\+\-\.]*$/.test(scheme.toLowerCase())) return false;

    return true;
}

export function isAt(value: string): boolean {
    const first = value.charAt(0);
    return first === "@";
}