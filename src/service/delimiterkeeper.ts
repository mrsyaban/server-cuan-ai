export function splitKeepDelimiter(s: string, pattern: any) {
    // Use regex to find all delimiters
    let delimiters = s.match(new RegExp(pattern, 'g'));
    // Use regex to split the string based on the pattern
    let parts = s.split(new RegExp(pattern));

    let result = [];
    for (let i = 0; i < parts.length; i++) {
        if (i === 0) {
            result.push(parts[i]);
        } else if (delimiters && delimiters[i - 1]) {
            result.push(`${delimiters[i - 1]} ${parts[i]}`);
        } else {
            result.push(parts[i]);
        }
    }
    return result;
}