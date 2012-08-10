function hasCollision(moveMap)
{
  for(var i in moveMap)
  {
    var c = moveMap[i];
    if (c.x < 1 || c.x > cols)
    {
//      alert(c.x+" is out of bounds");
      return true;
    }
    if (c.y < 1)
    {
//      alert(c.y+" is out of bounds");
      return true;
    }
    if (collisionMap[c.y][c.x] == true)
    {
//      alert(c.x+","+c.y+" has collided.");
      return true;
    }
  }
  return false;
}
function markCollisionMap(shape)
{
  var blockMap = shape.getBlockMap();
  for(var i in blockMap)
  {
//    alert("Marking ("+blockMap[i].x+","+blockMap[i].y+") as collision.");
    collisionMap[blockMap[i].y][blockMap[i].x] = true;
  }
}
function markDisplayLayer(shape)
{
  var blockMap = shape.getBlockMap();
  for(var i in shape.blocks)
    displayLayer[blockMap[i].y][blockMap[i].x] = shape.blocks[i];
}

function alertDisplayMap()
{
  var map = '';
  var tmap = '';
  for (var i = 1; i <= rows; i++)
  {
    map = '';
    for (var j = 1; j <= cols; j++)
    {
      if (displayLayer[i][j] == null)
        map = map + '-';
      else
        map = map + 'x';
    }
    tmap = map + '\r\n' + tmap;
  }
  alert(tmap);
}
