export function isPress(event: KeyboardEvent, key: string) {
  return key == event.key &&
    !event.ctrlKey &&
    !event.altKey &&
    !event.shiftKey
}

export function isCtrlKeyCombo(event: KeyboardEvent, key: string) {
  return key == event.key &&
    event.ctrlKey &&
    !event.altKey &&
    !event.shiftKey
}

export function isShiftKeyCombo(event: KeyboardEvent, key: string) {
  return key == event.key &&
    !event.ctrlKey &&
    !event.altKey &&
    event.shiftKey
}

export function isAltKeyCombo(event: KeyboardEvent, key: string) {
  return key == event.key &&
    !event.ctrlKey &&
    event.altKey &&
    !event.shiftKey
}

