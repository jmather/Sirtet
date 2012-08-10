var activeShape = null;

function handleKeys(e) {
    var evt = (e) ? e : window.event;       //IE reports window.event not arg
    var code = evt.keyCode;

    // Left - 37
    // Up - 38
    // Right - 39
    // Down - 40

    if (code == 80 && dge('pause_button').disabled == false)
      dge('pause_button').onclick();

    if (code == 78)
    {
      if (nextBlockEnabled == false)
      {
        if (nextBlock == null)
          nextBlock = generateRandomShape();
        displayInNextPiece(nextBlock);
        nextBlockEnabled = true;
        nextBlockThisShape = true;
      } else {
        nextBlock.hide();
        nextBlockEnabled = false;
      }
    }

    if (activeShape && gameTimer != null)
    {
      if (code == 37)
        activeShape.moveLeft();
      if (code == 38)
        activeShape.rotate(null, true);
      if (code == 39)
        activeShape.moveRight();
      if (code == 40)
      {
        functDrop();
        resetGameTimer();
      }
      if (code == 32)
      {
        while(functDrop())
        {
          // something
        }
      }
    }
}
