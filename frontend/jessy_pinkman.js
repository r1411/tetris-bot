//ФИГНЯ ДЛЯ ПРОЛОГА

function getMatrixFromGameField() {
    var x, y, block;
    let matrix = Array(ny)
      .fill()
      .map(() => Array(nx).fill(0));
    for (y = 0; y < ny; y++) {
      for (x = 0; x < nx; x++) {
        if ((block = getBlock(x, y))) matrix[y][x] = 1;
      }
    }
    return matrix;
  }
  
  function getCurrentShape() {
    return current.type.name;
  }

  function addMovesToQuery(target_column) {
    setTimeout(1000);
    if (current.type.name == "shape_I" && ((current.dir+1) ==2 || (current.dir +1)==4)){//если палка вертикальная
    target_column = target_column -1;
    console.log("Для палки"+target_column)
    }
    if((current.type.name == "shape_J"||current.type.name == "shape_T"||current.type.name == "shape_L" )&& (current.dir+1)==4){
      target_column = target_column-1;
      console.log("Для JTL")
    }
    while (current.x!=target_column){
    setTimeout(500);
      if (current.x<target_column){
        move(DIR.RIGHT);
      }
      else{
        move(DIR.LEFT);
      }
    }
    console.log("mypos:" + current.x);
    clearActions();
  }


  function addRotatesToQuery(target_rotation) {
    console.log("dir: "+(current.dir+1));
    while ((current.dir+1) != target_rotation){
      setTimeout(500);
      rotate();
    }
    console.log("dir2: "+(current.dir+1));
  }

  function getProloguePosition(){
    let state = {
      "field_matrix":getMatrixFromGameField(),
      "shape": getCurrentShape()
    }
    fetch('http://77.105.139.229/solve',{
      method: 'post',
      body: JSON.stringify(state),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(response){
      return response.text();
    }).then(function(text){
      console.log(text);
      let column = JSON.parse(text).response.column;
      let rotation_v = JSON.parse(text).response.rotation_variant;
      console.log(column+" "+rotation_v)
      let final_rot = rotation_v[rotation_v.length-1]
      addRotatesToQuery(final_rot)
      console.log((current.dir+1)+" ___ "+final_rot)
      setTimeout(1500);
      if ((current.dir+1) == final_rot){
        console.log("Повороты совпали");
        addMovesToQuery(column);
        move(DIR.DOWN);
        move(DIR.DOWN);
      }
      else{
        console.log("Не совпали");
      }
      //return (column+" "+ rotation_v)
    }).catch(function(error){
      console.error(error)
    })
  }

//////////////////////////////////////////////////////////////////


    //-------------------------------------------------------------------------
    // base helper methods
    //-------------------------------------------------------------------------

    function get(id)        { return document.getElementById(id);  }
    function hide(id)       { get(id).style.visibility = 'hidden'; }
    function show(id)       { get(id).style.visibility = null;     }
    function html(id, html) { get(id).innerHTML = html;            }

    function timestamp()           { return new Date().getTime();                             }
    function random(min, max)      { return (min + (Math.random() * (max - min)));            }
    function randomChoice(choices) { return choices[Math.round(random(0, choices.length-1))]; }

    if (!window.requestAnimationFrame) { // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
      window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
                                     window.mozRequestAnimationFrame    ||
                                     window.oRequestAnimationFrame      ||
                                     window.msRequestAnimationFrame     ||
                                     function(callback, element) {
                                       window.setTimeout(callback, 1000 / 60);
                                     }
    }

    //-------------------------------------------------------------------------
    // game constants
    //-------------------------------------------------------------------------

    var KEY     = { ESC: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 },
        DIR     = { UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3, MIN: 0, MAX: 3 },
        stats   = new Stats(),
        canvas  = get('canvas'),
        canvas_human = get('canvas_human'),
        ctx     = canvas.getContext('2d'),
        ctx_human = canvas_human.getContext('2d'),
        ucanvas = get('upcoming'),
        ucanvas_human = get('upcoming_human'),
        uctx    = ucanvas.getContext('2d'),
        uctx_human = ucanvas_human.getContext('2d'),
        speed   = { start: 0.6, decrement: 0.005, min: 0.1 }, // how long before piece drops by 1 row (seconds)
        nx      = 10, // width of tetris court (in blocks)
        ny      = 20, // height of tetris court (in blocks)
        nu      = 5;  // width/height of upcoming preview (in blocks)

    //-------------------------------------------------------------------------
    // game variables (initialized during reset)
    //-------------------------------------------------------------------------

    var dx, dy,        // pixel size of a single tetris block
        blocks,        // 2 dimensional array (nx*ny) representing tetris court - either empty block or occupied by a 'piece'
        blocks_human,
        actions,       // queue of user actions (inputs)
        actions_human,
        playing,       // true|false - game is in progress
        dt,            // time since starting this game
        current,       // the current piece
        current_human,
        next,          // the next piece
        next_human,
        score,         // the current score
        score_human,
        vscore,        // the currently displayed score (it catches up to score in small chunks - like a spinning slot machine)
        vscore_human,
        rows,          // number of completed rows in the current game
        rows_human,
        step;          // how long before current piece drops by 1 row

    //-------------------------------------------------------------------------
    // tetris pieces
    //
    // blocks: each element represents a rotation of the piece (0, 90, 180, 270)
    //         each element is a 16 bit integer where the 16 bits represent
    //         a 4x4 set of blocks, e.g. j.blocks[0] = 0x44C0
    //
    //             0100 = 0x4 << 3 = 0x4000
    //             0100 = 0x4 << 2 = 0x0400
    //             1100 = 0xC << 1 = 0x00C0
    //             0000 = 0x0 << 0 = 0x0000
    //                               ------
    //                               0x44C0
    //
    //-------------------------------------------------------------------------

    var i = {
        size: 4,
        blocks: [0xf000, 0x4444, 0xf000, 0x4444],
        color: "cyan",
        name: "shape_I",
      };
      var j = {
        size: 3,
        blocks: [0x0e20, 0x44c0, 0x8e00, 0x6440],
        color: "blue",
        name: "shape_J",
      };
      var l = {
        size: 3,
        blocks: [0x0e80, 0xc440, 0x2e00, 0x4460],
        color: "orange",
        name: "shape_L",
      };
      var o = {
        size: 2,
        blocks: [0xcc00, 0xcc00, 0xcc00, 0xcc00],
        color: "yellow",
        name: "shape_O",
      };
      var s = {
        size: 3,
        blocks: [0x06c0, 0x8c40, 0x6c00,0x4620],
        color: "green",
        name: "shape_S",
      };
      var t = {
        size: 3,
        blocks: [0x0e40, 0x4c40, 0x4e00, 0x4640],
        color: "purple",
        name: "shape_T",
      };
      var z = {
        size: 3,
        blocks: [0x0c60, 0x4c80, 0xc600, 0x2640],
        color: "red",
        name: "shape_Z",
      };

    //------------------------------------------------
    // do the bit manipulation and iterate through each
    // occupied block (x,y) for a given piece
    //------------------------------------------------
    function eachblock(type, x, y, dir, fn) {
      var bit, result, row = 0, col = 0, blocks = type.blocks[dir];
      for(bit = 0x8000 ; bit > 0 ; bit = bit >> 1) {
        if (blocks & bit) {
          fn(x + col, y + row);
        }
        if (++col === 4) {
          col = 0;
          ++row;
        }
      }
    }

    //ЗДЕСЬ НЕТ ИЗМЕНЕНИЙ, УТОЧНИТЬ, ТАК ЛИ ЭТО
    function eachblockHuman(type, x, y, dir, fn) {
      var bit, result, row = 0, col = 0, blocks = type.blocks[dir];
      for(bit = 0x8000 ; bit > 0 ; bit = bit >> 1) {
        if (blocks & bit) {
          fn(x + col, y + row);
        }
        if (++col === 4) {
          col = 0;
          ++row;
        }
      }
    }

    //-----------------------------------------------------
    // check if a piece can fit into a position in the grid
    //-----------------------------------------------------
    function occupied(type, x, y, dir) {
      var result = false
      eachblock(type, x, y, dir, function(x, y) {
        if ((x < 0) || (x >= nx) || (y < 0) || (y >= ny) || getBlock(x,y))
          result = true;
      });
      return result;
    }

    function unoccupied(type, x, y, dir) {
      return !occupied(type, x, y, dir);
    }


    function occupiedHuman(type, x, y, dir) {
      var result = false
      eachblockHuman(type, x, y, dir, function(x, y) {
        if ((x < 0) || (x >= nx) || (y < 0) || (y >= ny) || getBlockHuman(x,y))
          result = true;
      });
      return result;
    }

    function unoccupiedHuman(type, x, y, dir) {
      return !occupiedHuman(type, x, y, dir);
    }

    //-----------------------------------------
    // start with 4 instances of each piece and
    // pick randomly until the 'bag is empty'
    //-----------------------------------------
    var pieces = [];
    function randomPiece() {
      if (pieces.length == 0)
        pieces = [i,i,i,i,j,j,j,j,l,l,l,l,o,o,o,o,s,s,s,s,t,t,t,t,z,z,z,z];
      var type = pieces.splice(random(0, pieces.length-1), 1)[0];
      return { type: type, dir: DIR.UP, x: 4, y: 0 };
    }


    //-------------------------------------------------------------------------
    // GAME LOOP
    //-------------------------------------------------------------------------

    function run() {
      console.log("inside run");
      showStats(); // initialize FPS counter
      addEvents(); // attach keydown and resize events

      var last = now = timestamp();
      function frame() {
        console.log("inside frame");
        now = timestamp();
        update(Math.min(1, (now - last) / 1000.0)); // using requestAnimationFrame have to be able to handle large delta's caused when it 'hibernates' in a background or non-visible tab
        updateHuman(Math.min(1, (now - last) / 1000.0));
        draw();
        drawHuman();
        stats.update();
        last = now;
        requestAnimationFrame(frame, canvas);

        requestAnimationFrame(frame,canvas_human);
      }

      resize(); // setup all our sizing information
      reset();
      resetHuman();  // reset the per-game variables
      frame();  // start the first frame

    }

    function showStats() {
      stats.domElement.id = 'stats';
      get('menu').appendChild(stats.domElement);
    }

    function addEvents() {
      document.addEventListener('keydown', keydown, false);
      document.addEventListener('keydown', keydownHuman, false);
      window.addEventListener('resize', resize, false);
    }

    function resize(event) {
      canvas.width   = canvas.clientWidth;  // set canvas logical size equal to its physical size
      canvas.height  = canvas.clientHeight; // (ditto)
      ucanvas.width  = ucanvas.clientWidth;
      ucanvas.height = ucanvas.clientHeight;

      canvas_human.width   = canvas_human.clientWidth;  // set canvas logical size equal to its physical size
      canvas_human.height  = canvas_human.clientHeight; // (ditto)
      ucanvas_human.width  = ucanvas_human.clientWidth;
      ucanvas_human.height = ucanvas_human.clientHeight;

      dx = canvas.width  / nx; // pixel size of a single tetris block
      dy = canvas.height / ny; // (ditto)

      invalidate();
      invalidateNext();

      invalidateHuman();
      invalidateNextHuman();
    }

    function keydown(ev) {
      var handled = false;
      if (playing) {
        switch(ev.keyCode) {
          case KEY.LEFT:   actions.push(DIR.LEFT);  handled = true; break;
          case KEY.RIGHT:  actions.push(DIR.RIGHT); handled = true; break;
          case KEY.UP:     actions.push(DIR.UP);    handled = true; break;
          case KEY.DOWN:   actions.push(DIR.DOWN);  handled = true; break;
          case KEY.ESC:    lose();                  handled = true; break;
        }
      }
      else if (ev.keyCode == KEY.SPACE) {
        play();
        handled = true;
      }
      if (handled)
        ev.preventDefault(); // prevent arrow keys from scrolling the page (supported in IE9+ and all other browsers)
    }

    function keydownHuman(ev) {
      var handled = false;
      if (playing) {
        switch(ev.keyCode) {
          case KEY.LEFT:   actions_human.push(DIR.LEFT);  handled = true; break;
          case KEY.RIGHT:  actions_human.push(DIR.RIGHT); handled = true; break;
          case KEY.UP:     actions_human.push(DIR.UP);    handled = true; break;
          case KEY.DOWN:   actions_human.push(DIR.DOWN);  handled = true; break;
          case KEY.ESC:    lose();                  handled = true; break;
        }
      }
      else if (ev.keyCode == KEY.SPACE) {
        play();
        handled = true;
      }
      if (handled)
        ev.preventDefault(); // prevent arrow keys from scrolling the page (supported in IE9+ and all other browsers)
    }

    //-------------------------------------------------------------------------
    // GAME LOGIC
    //-------------------------------------------------------------------------

    function play() { hide('start'); hide('start_human'); reset(); resetHuman(); playing = true;  }
    function lose() { show('start'); show('start_human'); setVisualScore(); setVisualScoreHuman(); playing = false; }

    function setVisualScore(n)      { vscore = n || score; invalidateScore(); }
    function setScore(n)            { score = n; setVisualScore(n);  }
    function addScore(n)            { score = score + n;   }
    function clearScore()           { setScore(0); }
    function clearRows()            { setRows(0); }
    function setRows(n)             { rows = n; step = Math.max(speed.min, speed.start - (speed.decrement*rows)); invalidateRows(); }
    function addRows(n)             { setRows(rows + n); }
    function getBlock(x,y)          { return (blocks && blocks[x] ? blocks[x][y] : null); }
    function setBlock(x,y,type)     { blocks[x] = blocks[x] || []; blocks[x][y] = type; invalidate(); }
    function clearBlocks()          { blocks = []; invalidate(); }
    function clearActions()         { actions = []; }
    function setCurrentPiece(piece) { current = piece || randomPiece(); invalidate();     }
    function setNextPiece(piece)    { next    = piece || randomPiece(); invalidateNext(); }


    function setVisualScoreHuman(n)      { vscore_human = n || score_human; invalidateScoreHuman(); }
    function setScoreHuman(n)            { score_human = n; setVisualScoreHuman(n);  }
    function addScoreHuman(n)            { score_human = score_human + n;   }
    function clearScoreHuman()           { setScoreHuman(0); }
    function clearRowsHuman()            { setRowsHuman(0); }
    function setRowsHuman(n)             { rows_human = n; step = Math.max(speed.min, speed.start - (speed.decrement*rows_human)); invalidateRowsHuman(); }
    function addRowsHuman(n)             { setRowsHuman(rows_human + n); }
    function getBlockHuman(x,y)          { return (blocks_human && blocks_human[x] ? blocks_human[x][y] : null); }
    function setBlockHuman(x,y,type)     { blocks_human[x] = blocks_human[x] || []; blocks_human[x][y] = type; invalidateHuman(); }
    function clearBlocksHuman()          { blocks_human = []; invalidateHuman(); }
    function clearActionsHuman()         { actions_human = []; }
    function setCurrentPieceHuman(piece) { current_human = piece || randomPiece(); invalidateHuman();     }
    function setNextPieceHuman(piece)    { next_human    = piece || randomPiece(); invalidateNextHuman(); }


    function reset() {
      dt = 0;
      clearActions();
      clearBlocks();
      clearRows();
      clearScore();
      setCurrentPiece(next);
      setNextPiece();
    }
    function resetHuman() {
      dt = 0;
      clearActionsHuman();
      clearBlocksHuman();
      clearRowsHuman();
      clearScoreHuman();
      setCurrentPieceHuman(next);
      setNextPieceHuman();
    }


    function update(idt) {
      if (playing) {
        if (vscore < score)
          setVisualScore(vscore + 1);
        handle(actions.shift());
        dt = dt + idt;
        if (dt > step) {
          dt = dt - step;
          drop();
        }
      }
    }

    function updateHuman(idt) {
      if (playing) {
        if (vscore_human < score_human)
          setVisualScoreHuman(vscore_human + 1);
        handleHuman(actions_human.shift());
        dt = dt + idt;
        if (dt > step) {
          dt = dt - step;
          dropHuman();
        }
      }
    }

    function handle(action) {
      switch(action) {
        case DIR.LEFT:  move(DIR.LEFT);  break;
        case DIR.RIGHT: move(DIR.RIGHT); break;
        case DIR.UP:    rotate();        break;
        case DIR.DOWN:  drop();          break;
      }
    }

    function handleHuman(action) {
      switch(action) {
        case DIR.LEFT:  moveHuman(DIR.LEFT);  break;
        case DIR.RIGHT: moveHuman(DIR.RIGHT); break;
        case DIR.UP:    rotateHuman();        break;
        case DIR.DOWN:  dropHuman();          break;
      }
    }

    function move(dir) {
      var x = current.x, y = current.y;
      switch(dir) {
        case DIR.RIGHT: x = x + 1; break;
        case DIR.LEFT:  x = x - 1; break;
        case DIR.DOWN:  y = y + 1; break;
      }
      if (unoccupied(current.type, x, y, current.dir)) {
        current.x = x;
        current.y = y;
        invalidate();
        //console.log("TYPE: "+current.type.name+" POS_x: "+current.x+ " ROT:"+current.dir)
        return true;
      }
      else {
        //console.log("TYPE: "+current.type.name+" POS_x: "+current.x+ " ROT:"+current.dir)
        return false;
      }
    }

    function moveHuman(dir) {
      var x = current_human.x, y = current_human.y;
      switch(dir) {
        case DIR.RIGHT: x = x + 1; break;
        case DIR.LEFT:  x = x - 1; break;
        case DIR.DOWN:  y = y + 1; break;
      }
      if (unoccupiedHuman(current_human.type, x, y, current_human.dir)) {
        current_human.x = x;
        current_human.y = y;
        invalidateHuman();
        //console.log("TYPE: "+current.type.name+" POS_x: "+current.x+ " ROT:"+current.dir)
        return true;
      }
      else {
        //console.log("TYPE: "+current.type.name+" POS_x: "+current.x+ " ROT:"+current.dir)
        return false;
      }
    }

    function rotate() {
      var newdir = (current.dir == DIR.MAX ? DIR.MIN : current.dir + 1);
      if (unoccupied(current.type, current.x, current.y, newdir)) {
        current.dir = newdir;
        invalidate();
      }
    }

    function rotateHuman() {
      var newdir = (current_human.dir == DIR.MAX ? DIR.MIN : current_human.dir + 1);
      if (unoccupiedHuman(current_human.type, current_human.x, current_human.y, newdir)) {
        current_human.dir = newdir;
        invalidateHuman();
      }
    }

    function drop() {
      if (!move(DIR.DOWN)) {
        addScore(10);
        dropPiece();
        removeLines();
        setCurrentPiece(next);
        setNextPiece(randomPiece());
        clearActions();
        if (occupied(current.type, current.x, current.y, current.dir)) {
          lose();
        }
      }
    }

    function dropHuman() {
      if (!moveHuman(DIR.DOWN)) {
        addScoreHuman(10);
        dropPieceHuman();
        removeLinesHuman();
        setCurrentPieceHuman(next);
        setNextPieceHuman(randomPiece());
        clearActionsHuman();
        if (occupiedHuman(current_human.type, current_human.x, current_human.y, current_human.dir)) {
          lose();
        }
      }
    }

    function dropPiece() {
      eachblock(current.type, current.x, current.y, current.dir, function(x, y) {
        setBlock(x, y, current.type);
      });
    }

    function dropPieceHuman() {
      eachblockHuman(current_human.type, current_human.x, current_human.y, current_human.dir, function(x, y) {
        setBlockHuman(x, y, current_human.type);
      });
    }

    function removeLines() {
      var x, y, complete, n = 0;
      for(y = ny ; y > 0 ; --y) {
        complete = true;
        for(x = 0 ; x < nx ; ++x) {
          if (!getBlock(x, y))
            complete = false;
        }
        if (complete) {
          removeLine(y);
          y = y + 1; // recheck same line
          n++;
        }
      }
      if (n > 0) {
        addRows(n);
        addScore(100*Math.pow(2,n-1)); // 1: 100, 2: 200, 3: 400, 4: 800
      }
    }

    function removeLine(n) {
      var x, y;
      for(y = n ; y >= 0 ; --y) {
        for(x = 0 ; x < nx ; ++x)
          setBlock(x, y, (y == 0) ? null : getBlock(x, y-1));
      }
    }

    function removeLinesHuman() {
      var x, y, complete, n = 0;
      for(y = ny ; y > 0 ; --y) {
        complete = true;
        for(x = 0 ; x < nx ; ++x) {
          if (!getBlockHuman(x, y))
            complete = false;
        }
        if (complete) {
          removeLineHuman(y);
          y = y + 1; // recheck same line
          n++;
        }
      }
      if (n > 0) {
        addRowsHuman(n);
        addScoreHuman(100*Math.pow(2,n-1)); // 1: 100, 2: 200, 3: 400, 4: 800
      }
    }

    function removeLineHuman(n) {
      var x, y;
      for(y = n ; y >= 0 ; --y) {
        for(x = 0 ; x < nx ; ++x)
          setBlockHuman(x, y, (y == 0) ? null : getBlockHuman(x, y-1));
      }
    }

    //-------------------------------------------------------------------------
    // RENDERING
    //-------------------------------------------------------------------------

    var invalid = {};
    var invalid_human = {};

    function invalidate()         { invalid.court  = true; }
    function invalidateNext()     { invalid.next   = true; }
    function invalidateScore()    { invalid.score  = true; }
    function invalidateRows()     { invalid.rows   = true; }

    function invalidateHuman()         { invalid_human.court_human  = true; }
    function invalidateNextHuman()     { invalid_human.next_human   = true; }
    function invalidateScoreHuman()    { invalid_human.score_human  = true; }
    function invalidateRowsHuman()     { invalid_human.rows_human   = true; }

    function draw() {
      ctx.save();
      ctx.lineWidth = 1;
      ctx.translate(0.5, 0.5); // for crisp 1px black lines
      drawCourt();
      drawNext();
      drawScore();
      drawRows();
      ctx.restore();
    }

    function drawHuman() {
      ctx_human.save();
      ctx_human.lineWidth = 1;
      ctx_human.translate(0.5, 0.5); // for crisp 1px black lines
      drawCourtHuman();
      drawNextHuman();
      drawScoreHuman();
      drawRowsHuman();
      ctx_human.restore();
    }

    function drawCourt() {
      if (invalid.court) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (playing)
          drawPiece(ctx, current.type, current.x, current.y, current.dir);
        var x, y, block;
        for(y = 0 ; y < ny ; y++) {
          for (x = 0 ; x < nx ; x++) {
            if (block = getBlock(x,y))
              drawBlock(ctx, x, y, block.color);
          }
        }
        ctx.strokeRect(0, 0, nx*dx - 1, ny*dy - 1); // court boundary
        invalid.court = false;
      }
    }

    function drawCourtHuman() {
      if (invalid_human.court_human) {
        ctx_human.clearRect(0, 0, canvas_human.width, canvas_human.height);
        if (playing)
          drawPieceHuman(ctx_human, current_human.type, current_human.x, current_human.y, current_human.dir);
        var x, y, block;
        for(y = 0 ; y < ny ; y++) {
          for (x = 0 ; x < nx ; x++) {
            if (block = getBlockHuman(x,y))
              drawBlockHuman(ctx_human, x, y, block.color);
          }
        }
        ctx_human.strokeRect(0, 0, nx*dx - 1, ny*dy - 1); // court boundary
        invalid_human.court_human = false;
      }
    }


    function drawNext() {
      if (invalid.next) {
        var padding = (nu - next.type.size) / 2; // half-arsed attempt at centering next piece display
        uctx.save();
        uctx.translate(0.5, 0.5);
        uctx.clearRect(0, 0, nu*dx, nu*dy);
        drawPiece(uctx, next.type, padding, padding, next.dir);
        uctx.strokeStyle = 'black';
        uctx.strokeRect(0, 0, nu*dx - 1, nu*dy - 1);
        uctx.restore();
        invalid.next = false;
        //getProloguePosition();
      }
    }


    function drawNextHuman() {
      if (invalid_human.next_human) {
        var padding = (nu - next_human.type.size) / 2; // half-arsed attempt at centering next piece display
        uctx_human.save();
        uctx_human.translate(0.5, 0.5);
        uctx_human.clearRect(0, 0, nu*dx, nu*dy);
        drawPieceHuman(uctx_human, next_human.type, padding, padding, next_human.dir);
        uctx_human.strokeStyle = 'black';
        uctx_human.strokeRect(0, 0, nu*dx - 1, nu*dy - 1);
        uctx_human.restore();
        invalid_human.next_human = false;
      }
    }


    function drawScore() {
      if (invalid.score) {
        html('score', ("00000" + Math.floor(vscore)).slice(-5));
        invalid.score = false;
      }
    }

    function drawScoreHuman() {
      if (invalid_human.score_human) {
        html('score_human', ("00000" + Math.floor(vscore_human)).slice(-5));
        invalid_human.score_human = false;
      }
    }

    function drawRows() {
      if (invalid.rows) {
        html('rows', rows);
        invalid.rows = false;
      }
    }

    function drawRowsHuman() {
      if (invalid_human.rows_human) {
        html('rows_human', rows_human);
        invalid_human.rows_human = false;
      }
    }
//Вот в этиъ функциях с параметрами подумать про ctx
    function drawPiece(ctx, type, x, y, dir) {
      eachblock(type, x, y, dir, function(x, y) {
        drawBlock(ctx, x, y, type.color);
      });
    }

    function drawPieceHuman(ctx, type, x, y, dir) {
      eachblockHuman(type, x, y, dir, function(x, y) {
        drawBlockHuman(ctx, x, y, type.color);
      });
    }

    function drawBlock(ctx, x, y, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x*dx, y*dy, dx, dy);
      ctx.strokeRect(x*dx, y*dy, dx, dy)
    }


    function drawBlockHuman(ctx, x, y, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x*dx, y*dy, dx, dy);
      ctx.strokeRect(x*dx, y*dy, dx, dy)
    }

    //-------------------------------------------------------------------------
    // FINALLY, lets run the game
    //-------------------------------------------------------------------------

    run();
