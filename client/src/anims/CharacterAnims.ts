/* Character Animation function */
const createCharacterAnims = (anims: any) => {
  const animsFrameRate = 10;

  /* male1 animation */
  anims.create({
    key: 'male1-idle-down',
    frames: [{ key: 'male1', frame: 'down-1' }],
  });

  anims.create({
    key: 'male1-idle-up',
    frames: [{ key: 'male1', frame: 'up-2' }],
  });

  anims.create({
    key: 'male1-idle-left',
    frames: [{ key: 'male1', frame: 'left-1' }],
  });

  anims.create({
    key: 'male1-idle-right',
    frames: [{ key: 'male1', frame: 'right-1' }],
  });

  anims.create({
    key: 'male1-walk-down',
    frames: anims.generateFrameNames('male1', {
      start: 0,
      end: 2,
      prefix: 'down-',
    }),
    frameRate: animsFrameRate,
    repeat: -1,
  });

  anims.create({
    key: 'male1-walk-left',
    frames: anims.generateFrameNames('male1', {
      start: 0,
      end: 2,
      prefix: 'left-',
    }),
    frameRate: animsFrameRate,
    repeat: -1,
  });

  anims.create({
    key: 'male1-walk-right',
    frames: anims.generateFrameNames('male1', {
      start: 0,
      end: 2,
      prefix: 'right-',
    }),
    frameRate: animsFrameRate,
    repeat: -1,
  });

  anims.create({
    key: 'male1-walk-up',
    frames: anims.generateFrameNames('male1', {
      start: 0,
      end: 2,
      prefix: 'up-',
    }),
    frameRate: animsFrameRate,
    repeat: -1,
  });
};

export { createCharacterAnims };
