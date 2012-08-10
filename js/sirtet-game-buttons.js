function startGame()
{
  dge('start_button').blur();
  resetLayers();
  cleanPlayingField();
  functDrop();
  resetGameTimer();
  dge('pause_button').disabled = false;
  dge('pause_button').onclick = pauseGame;
}

function pauseGame()
{
  dge('pause_button').blur();
  clearTimeout(gameTimer);
  gameTimer = null;
  activeShape.hide();
  hidePlayingField();
  dge('pause_button').value = 'Unpause Game';
  dge('pause_button').onclick = unpauseGame;
}

function unpauseGame()
{
  dge('pause_button').blur();
  dge('pause_button').value = 'Pause Game';
  dge('pause_button').onclick = pauseGame;
  activeShape.show();
  showPlayingField();
  resetGameTimer();
}
