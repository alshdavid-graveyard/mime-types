// Extracted from node to allow running in browser
// https://github.com/nodejs/node/blob/main/lib/path.js

const isWindows = (() => {
  if (typeof process !== 'undefined') {
    return process.platform === 'win32'
  }
  return false
})()

const Characters = Object.freeze({
  CHAR_DOT: 46, /* . */
  CHAR_COLON: 58,
  CHAR_UPPERCASE_A: 65, /* A */
  CHAR_LOWERCASE_A: 97, /* a */
  CHAR_UPPERCASE_Z: 90, /* Z */
  CHAR_LOWERCASE_Z: 122, /* z */
  CHAR_FORWARD_SLASH: 47, /* / */
  CHAR_BACKWARD_SLASH: 92, /* \ */
})

function validateString(value: any, name: string) {
  if (typeof value !== 'string')
    throw new Error(`${name}, ${value} is not a string`);
}

function isWindowsDeviceRoot(code) {
  return (code >= Characters.CHAR_UPPERCASE_A && code <= Characters.CHAR_UPPERCASE_Z) ||
         (code >= Characters.CHAR_LOWERCASE_A && code <= Characters.CHAR_LOWERCASE_Z);
}

function isPathSeparator(code) {
  return code === Characters.CHAR_FORWARD_SLASH || code === Characters.CHAR_BACKWARD_SLASH;
}

export function extnameWindows(path: string) {
  validateString(path, 'path');
  let start = 0;
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  let preDotState = 0;

  // Check for a drive letter prefix so as not to mistake the following
  // path separator as an extra separator at the end of the path that can be
  // disregarded

  if (path.length >= 2 &&
      path.charCodeAt(1) === Characters.CHAR_COLON &&
      isWindowsDeviceRoot(path.charCodeAt(0))) {
    start = startPart = 2;
  }

  for (let i = path.length - 1; i >= start; --i) {
    const code = path.charCodeAt(i);
    if (isPathSeparator(code)) {
      // If we reached a path separator that was not part of a set of path
      // separators at the end of the string, stop now
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === Characters.CHAR_DOT) {
      // If this is our first dot, mark it as the start of our extension
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 ||
      end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      (preDotState === 1 &&
       startDot === end - 1 &&
       startDot === startPart + 1)) {
    return '';
  }
  return path.slice(startDot, end)
}

export function extnamePosix(path: string) {
  validateString(path, 'path');
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  let preDotState = 0;
  for (let i = path.length - 1; i >= 0; --i) {
    const code = path.charCodeAt(i);
    if (code === Characters.CHAR_FORWARD_SLASH) {
      // If we reached a path separator that was not part of a set of path
      // separators at the end of the string, stop now
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === Characters.CHAR_DOT) {
      // If this is our first dot, mark it as the start of our extension
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 ||
      end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      (preDotState === 1 &&
       startDot === end - 1 &&
       startDot === startPart + 1)) {
    return '';
  }
  return path.slice(startDot, end)
}

export function extname(path: string) {
  if (isWindows) {
    return extnameWindows(path)
  }
  return extnamePosix(path)
}
