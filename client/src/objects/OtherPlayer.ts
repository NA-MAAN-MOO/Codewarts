import Phaser from 'phaser';
import { createCharacterAnims } from 'anims/CharacterAnims';
import Player from './Player';

export default class OtherPlayer extends Player {
  constructor(data: any) {
    super(data);

    this.playerNameBubble.setStyle({
      backgroundColor: 'black',
      color: 'white',
    });

    createCharacterAnims(this.playerTexture, this.anims);
  }
}
