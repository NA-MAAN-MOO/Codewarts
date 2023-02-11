/* Character Animation function */
const createCharacterAnims = (charKey: string, anims: any) => {
  const animsFrameRate = 10;

  /* male1 animation */
  anims.create({
    key: `${charKey}-idle-down`,
    frames: [{ key: `${charKey}`, frame: 'down-1' }],
  });

  anims.create({
    key: `${charKey}-idle-up`,
    frames: [{ key: `${charKey}`, frame: 'up-2' }],
  });

  anims.create({
    key: `${charKey}-idle-left`,
    frames: [{ key: `${charKey}`, frame: 'left-1' }],
  });

  anims.create({
    key: `${charKey}-idle-right`,
    frames: [{ key: `${charKey}`, frame: 'right-1' }],
  });

  anims.create({
    key: `${charKey}-walk-down`,
    frames: anims.generateFrameNames(`${charKey}`, {
      start: 0,
      end: 2,
      prefix: 'down-',
    }),
    frameRate: animsFrameRate,
    repeat: -1,
  });

  anims.create({
    key: `${charKey}-walk-left`,
    frames: anims.generateFrameNames(`${charKey}`, {
      start: 0,
      end: 2,
      prefix: 'left-',
    }),
    frameRate: animsFrameRate,
    repeat: -1,
  });

  anims.create({
    key: `${charKey}-walk-right`,
    frames: anims.generateFrameNames(`${charKey}`, {
      start: 0,
      end: 2,
      prefix: 'right-',
    }),
    frameRate: animsFrameRate,
    repeat: -1,
  });

  anims.create({
    key: `${charKey}-walk-up`,
    frames: anims.generateFrameNames(`${charKey}`, {
      start: 0,
      end: 2,
      prefix: 'up-',
    }),
    frameRate: animsFrameRate,
    repeat: -1,
  });
};

export { createCharacterAnims };
