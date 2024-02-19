export function shuffle(arr) {
  return Array.from(arr).sort(() => Math.random() - 0.5);
}

export function wrappingSlice(arr, startIndex, length) {
    let result = [];
    let arrLength = arr.length;

    for (let i = 0; i < length; i++) {
        // Calculate the current index, wrapping around if it exceeds the array length
        let currentIndex = (startIndex + i) % arrLength;
        result.push(arr[currentIndex]);
    }

    return result;
}

export function seededRandInt(rng, min, max) {
  min = Math.ceil(min); // Ensure min is rounded up to the nearest whole number
  max = Math.floor(max); // Ensure max is rounded down to the nearest whole number
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function getRandomIntInRange(min, max) {
  return seededRandInt(Math.random, min, max);
}