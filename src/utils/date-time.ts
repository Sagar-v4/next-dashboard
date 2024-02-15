export const addPrefixZeros = (number: number, lenght: number): String => {
  let givenNumber = `${number}`.toString();

  while (givenNumber.length < lenght) {
    givenNumber = `0${givenNumber}`;
  }

  return givenNumber;
};

export const getLogDateFormat = (timeStamp: Date): String => {
  const year = addPrefixZeros(timeStamp.getFullYear(), 4);
  const month = addPrefixZeros(timeStamp.getUTCMonth() + 1, 2);
  const date = addPrefixZeros(timeStamp.getDate(), 2);
  const hour = addPrefixZeros(timeStamp.getHours(), 2);
  const minute = addPrefixZeros(timeStamp.getMinutes(), 2);
  const second = addPrefixZeros(timeStamp.getSeconds(), 2);
  const milliseconds = addPrefixZeros(timeStamp.getMilliseconds(), 3);

  const time = `${year}-${month}-${date} ${hour}:${minute}:${second}.${milliseconds}`;

  return time;
};

export const getLastTime = (time: string): number => {
  let timeInNumber = parseInt(time.substring(0, time.length));
  if (time.includes("s")) {
    timeInNumber = timeInNumber * 1000;
  } else if (time.includes("m")) {
    timeInNumber = timeInNumber * 60 * 1000;
  } else if (time.includes("h")) {
    timeInNumber = timeInNumber * 60 * 60 * 1000;
  } else if (time.includes("d")) {
    timeInNumber = timeInNumber * 24 * 60 * 60 * 1000;
  }

  return timeInNumber;
};

export const isInLastTime = (
  currentTime: number,
  lastTime: string
): boolean => {
  const endTime = Date.now();
  const startTime = endTime - getLastTime(lastTime);
  return startTime < currentTime && currentTime < endTime;
};
