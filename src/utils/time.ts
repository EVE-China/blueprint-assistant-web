const UNIT_NAMES = ['秒', '分钟', '小时', '天'];

const UNIT_VALUS = [60, 60, 24, 0];

export function formatBySecond(time: number) {
  const stack = new Array();
  let index = 0;
  let mod: number;
  do {
    const tmp = Math.floor(time / UNIT_VALUS[index]);
    mod = time % UNIT_VALUS[index];
    time = tmp;
    stack.push(mod);
    if (0 === tmp) {
      break;
    }
    index++;
  } while (index < UNIT_NAMES.length - 1);
  if (0 !== time) {
    stack.push(time);
  }
  let buffer = '';
  let lastIndex = stack.length - 1;
  while (!(stack.length === 0)) {
    const i = lastIndex--;
    const value = stack.pop();
    if (0 === value) {
      continue;
    }
    buffer += value;
    buffer += UNIT_NAMES[i];
  }
  return buffer;
}
