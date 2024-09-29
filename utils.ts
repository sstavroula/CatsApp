export const notReached = (_: never): never => {
  throw new Error('Should not be reachable');
};
