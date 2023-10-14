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
    if (current.type.name == "shape_I" && ((current.dir+1) ==2 || (current.dir +1)==4)){//если палка вертикальная
    target_column = target_column -1;
    console.log("Для палки"+target_column)
    }
    if((current.type.name == "shape_J"||current.type.name == "shape_T"||current.type.name == "shape_L" )&& (current.dir+1)==4){
      target_column = target_column-1;
      console.log("Для JTL")
    }
    current.x = target_column

    if(get("turbo").checked){
    let timerId = setInterval(() => instantlyMoveDown(timerId), 80);
    }
    
    //console.log("mypos:" + current.x);
    clearActions();
  }

  function instantlyMoveDown(timerID){
    move(DIR.DOWN);
    if(!unoccupied(current.type,current.x,current.y+1,current.dir) || !(get("turbo").checked)){
    setTimeout(() => { clearInterval(timerID); }, 30);
    }
  }


  function addRotatesToQuery(target_rotation) {
    console.log("dir: "+(current.dir+1));
    current.dir = target_rotation - 1;
    console.log("dir2: "+(current.dir+1));
  }

  function getProloguePosition(){
    let state = {
      "field_matrix":getMatrixFromGameField(),
      "shape": getCurrentShape()
    }
    fetch('/solve',{
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
      if ((current.dir+1) == final_rot){
        console.log("Повороты совпали");
        addMovesToQuery(column);
        //move(DIR.DOWN);
        //move(DIR.DOWN);
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
        ctx     = canvas.getContext('2d'),
        ucanvas = get('upcoming'),
        uctx    = ucanvas.getContext('2d'),
        speed   = { start: 0.6, decrement: 0.005, min: 0.1 }, // how long before piece drops by 1 row (seconds)
        nx      = 10, // width of tetris court (in blocks)
        ny      = 20, // height of tetris court (in blocks)
        nu      = 5;  // width/height of upcoming preview (in blocks)

      var KEY_human     = { ESC: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 },
      DIR_human     = { UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3, MIN: 0, MAX: 3 },
      canvas_human  = get('canvas_human'),
      ctx_human     = canvas_human.getContext('2d'),
      ucanvas_human = get('upcoming_human'),
      uctx_human    = ucanvas_human.getContext('2d'),
      speed_human   = { start: 0.6, decrement: 0.005, min: 0.1 }, // how long before piece drops by 1 row (seconds)
      nx_human      = 10, // width of tetris court (in blocks)
      ny_human      = 20, // height of tetris court (in blocks)
      nu_human      = 5;  // width/height of upcoming preview (in blocks)

    //-------------------------------------------------------------------------
    // game variables (initialized during reset)
    //-------------------------------------------------------------------------

    var dx, dy,        // pixel size of a single tetris block
        blocks,        // 2 dimensional array (nx*ny) representing tetris court - either empty block or occupied by a 'piece'
        actions,       // queue of user actions (inputs)
        playing,       // true|false - game is in progress
        dt,            // time since starting this game
        current,       // the current piece
        next,          // the next piece
        score,         // the current score
        vscore,        // the currently displayed score (it catches up to score in small chunks - like a spinning slot machine)
        rows,          // number of completed rows in the current game
        step;          // how long before current piece drops by 1 row

  var dx_human, dy_human,        // pixel size of a single tetris block
        blocks_human,        // 2 dimensional array (nx*ny) representing tetris court - either empty block or occupied by a 'piece'
        actions_human,       // queue of user actions (inputs)
        playing_human,       // true|false - game is in progress
        dt_human,            // time since starting this game
        current_human,       // the current piece
        next_human,          // the next piece
        score_human,         // the current score
        vscore_human,        // the currently displayed score (it catches up to score in small chunks - like a spinning slot machine)
        rows_human,          // number of completed rows in the current game
        step_human;          // how long before current piece drops by 1 row

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

    function eachblock_human(type, x, y, dir, fn) {
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

    function occupied_human(type, x, y, dir) {
      var result = false
      eachblock_human(type, x, y, dir, function(x, y) {
        if ((x < 0) || (x >= nx_human) || (y < 0) || (y >= ny_human) || getBlock_human(x,y))
          result = true;
      });
      return result;
    }

    function unoccupied(type, x, y, dir) {
      return !occupied(type, x, y, dir);
    }

    function unoccupied_human(type, x, y, dir) {
      return !occupied_human(type, x, y, dir);
    }


    //-----------------------------------------
    // start with 4 instances of each piece and
    // pick randomly until the 'bag is empty'
    //-----------------------------------------
    var bag_of_pieces = [];
    var bag_of_pieces_human = [];


    var pieces = [];
    function randomPiece() {
      //if (pieces.length == 0)
      //  pieces = [i,i,i,i,j,j,j,j,l,l,l,l,o,o,o,o,s,s,s,s,t,t,t,t,z,z,z,z];
      //var type = pieces.splice(random(0, pieces.length-1), 1)[0];
      if (bag_of_pieces.length == 0)
        fillTheBag();
      var type = bag_of_pieces.splice(0,1)[0];
      return { type: type, dir: DIR.UP, x: 4, y: 0 };
    }

    var pieces_human = [];
    function randomPiece_human() {
      //if (pieces_human.length == 0)
      //  pieces_human = [i,i,i,i,j,j,j,j,l,l,l,l,o,o,o,o,s,s,s,s,t,t,t,t,z,z,z,z];
      //var type = pieces_human.splice(random(0, pieces_human.length-1), 1)[0];
      if(bag_of_pieces_human.length == 0)
        fillTheBag();
        var type = bag_of_pieces_human.splice(0,1)[0];
      return { type: type, dir: DIR.UP, x: 4, y: 0 };
    }


    function fillTheBag(){
      var all_pieces = [i,j,l,o,s,t,z];
      for(l =0;l<1000;l++){
        bag_of_pieces.push(all_pieces[Math.floor((Math.random()*all_pieces.length))]);
      }
      bag_of_pieces_human = bag_of_pieces.slice();
    }
    
    

    //-------------------------------------------------------------------------
    // GAME LOOP
    //-------------------------------------------------------------------------

    function run() {

      showStats(); // initialize FPS counter
      addEvents(); // attach keydown and resize events

      var last = now = timestamp();
      function frame() {
        now = timestamp();
        update(Math.min(1, (now - last) / 1000.0)); // using requestAnimationFrame have to be able to handle large delta's caused when it 'hibernates' in a background or non-visible tab
        draw();
        stats.update();
        last = now;
        requestAnimationFrame(frame, canvas);
      }

      resize(); // setup all our sizing information
      reset();  // reset the per-game variables
      frame();  // start the first frame


      addEvents_human(); // attach keydown and resize events

      var last_human = now_human = timestamp();
      function frame_human() {
        now_human = timestamp();
        update_human(Math.min(1, (now_human - last_human) / 1000.0)); // using requestAnimationFrame have to be able to handle large delta's caused when it 'hibernates' in a background or non-visible tab
        draw_human();
        last_human = now_human;
        requestAnimationFrame(frame_human, canvas_human);
      }

      resize_human(); // setup all our sizing information
      reset_human();  // reset the per-game variables
      frame_human();  // start the first frame

    }

    function showStats() {
      stats.domElement.id = 'stats';
      get('menu').appendChild(stats.domElement);
    }

    function addEvents() {
      document.addEventListener('keydown', keydown, false);
      window.addEventListener('resize', resize, false);
    }

    function addEvents_human() {
      document.addEventListener('keydown', keydown_human, false);
      window.addEventListener('resize', resize_human, false);
    }

    function resize(event) {
      canvas.width   = canvas.clientWidth;  // set canvas logical size equal to its physical size
      canvas.height  = canvas.clientHeight; // (ditto)
      ucanvas.width  = ucanvas.clientWidth;
      ucanvas.height = ucanvas.clientHeight;
      dx = canvas.width  / nx; // pixel size of a single tetris block
      dy = canvas.height / ny; // (ditto)
      invalidate();
      invalidateNext();
    }

    function resize_human(event) {
      canvas_human.width   = canvas_human.clientWidth;  // set canvas logical size equal to its physical size
      canvas_human.height  = canvas_human.clientHeight; // (ditto)
      ucanvas_human.width  = ucanvas_human.clientWidth;
      ucanvas_human.height = ucanvas_human.clientHeight;
      dx_human = canvas_human.width  / nx_human; // pixel size of a single tetris block
      dy_human = canvas_human.height / ny_human; // (ditto)
      invalidate_human();
      invalidateNext_human();
    }

    function keydown(ev) {
      var handled = false;
      handled = true;
      ev.preventDefault();
      /*if (playing) {
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
        ev.preventDefault(); // prevent arrow keys from scrolling the page (supported in IE9+ and all other browsers)*/
    }

    function keydown_human(ev) {
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

    function play() { fillTheBag(); hide('start'); hide('start_human'); reset(); reset_human(); playing = true;  }
    function lose() { show('start'); show('start_human'); setVisualScore(); setVisualScore_human(); playing = false; }

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


    function setVisualScore_human(n)      { vscore_human = n || score_human; invalidateScore_human(); }
    function setScore_human(n)            { score_human = n; setVisualScore_human(n);  }
    function addScore_human(n)            { score_human = score_human + n;   }
    function clearScore_human()           { setScore_human(0); }
    function clearRows_human()            { setRows_human(0); }
    function setRows_human(n)             { rows_human = n; step_human = Math.max(speed_human.min, speed_human.start - (speed_human.decrement*rows_human)); invalidateRows_human(); }
    function addRows_human(n)             { setRows_human(rows_human + n); }
    function getBlock_human(x,y)          { return (blocks_human && blocks_human[x] ? blocks_human[x][y] : null); }
    function setBlock_human(x,y,type)     { blocks_human[x] = blocks_human[x] || []; blocks_human[x][y] = type; invalidate_human(); }
    function clearBlocks_human()          { blocks_human = []; invalidate_human(); }
    function clearActions_human()         { actions_human = []; }
    function setCurrentPiece_human(pieces_human) { current_human = pieces_human || randomPiece_human(); invalidate_human();}
    function setNextPiece_human(pieces_human)    { next_human = pieces_human || randomPiece_human(); invalidateNext_human(); }

    function reset() {
      dt = 0;
      clearActions();
      clearBlocks();  
      clearRows();
      clearScore();
      setCurrentPiece(next);
      setNextPiece();
    }

    function reset_human() {
      dt_human = 0;
      clearActions_human();
      clearBlocks_human();  
      clearRows_human();
      clearScore_human();
      setCurrentPiece_human(next_human);
      setNextPiece_human();
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

    function update_human(idt) {
      if (playing) {
        if (vscore_human < score_human)
          setVisualScore_human(vscore_human + 1);
        handle_human(actions_human.shift());
        dt_human = dt_human + idt;
        if (dt_human > step_human) {
          dt_human = dt_human - step_human;
          drop_human();
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

    function handle_human(action) {
      switch(action) {
        case DIR.LEFT:  move_human(DIR.LEFT);  break;
        case DIR.RIGHT: move_human(DIR.RIGHT); break;
        case DIR.UP:    rotate_human();        break;
        case DIR.DOWN:  drop_human();          break;
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

    function move_human(dir) {
      var x = current_human.x, y = current_human.y;
      switch(dir) {
        case DIR.RIGHT: x = x + 1; break;
        case DIR.LEFT:  x = x - 1; break;
        case DIR.DOWN:  y = y + 1; break;
      }
      if (unoccupied_human(current_human.type, x, y, current_human.dir)) {
        current_human.x = x;
        current_human.y = y;
        invalidate_human();
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

    function rotate_human() {
      var newdir = (current_human.dir == DIR.MAX ? DIR.MIN : current_human.dir + 1);
      if (unoccupied_human(current.type, current_human.x, current_human.y, newdir)) {
        current_human.dir = newdir;
        invalidate_human();
      }
    }

    function drop() {
      if(get("turbo").checked){
        let timerId = setInterval(() => instantlyMoveDown(timerId), 50);
        }

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

    function drop_human() {
      if (!move_human(DIR.DOWN)) {
        addScore_human(10);
        dropPiece_human();
        removeLines_human();
        setCurrentPiece_human(next_human);
        setNextPiece_human(randomPiece_human());
        clearActions_human();
        if (occupied_human(current_human.type, current_human.x, current_human.y, current_human.dir)) {
          lose();
        }
      }
    }

    function dropPiece() {
      eachblock(current.type, current.x, current.y, current.dir, function(x, y) {
        setBlock(x, y, current.type);
      });
    }

    function dropPiece_human() {
      eachblock_human(current_human.type, current_human.x, current_human.y, current_human.dir, function(x, y) {
        setBlock_human(x, y, current_human.type);
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


    function removeLines_human() {
      var x, y, complete, n = 0;
      for(y = ny_human ; y > 0 ; --y) {
        complete = true;
        for(x = 0 ; x < nx_human ; ++x) {
          if (!getBlock_human(x, y))
            complete = false;
        }
        if (complete) {
          removeLine_human(y);
          y = y + 1; // recheck same line
          n++;
        }
      }
      if (n > 0) {
        addRows_human(n);
        addScore_human(100*Math.pow(2,n-1)); // 1: 100, 2: 200, 3: 400, 4: 800
      }
    }

    function removeLine(n) {
      var x, y;
      for(y = n ; y >= 0 ; --y) {
        for(x = 0 ; x < nx ; ++x)
          setBlock(x, y, (y == 0) ? null : getBlock(x, y-1));
      }
    }


    function removeLine_human(n) {
      var x, y;
      for(y = n ; y >= 0 ; --y) {
        for(x = 0 ; x < nx_human ; ++x)
          setBlock_human(x, y, (y == 0) ? null : getBlock_human(x, y-1));
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

    function invalidate_human()         { invalid_human.court  = true; }
    function invalidateNext_human()     { invalid_human.next   = true; }
    function invalidateScore_human()    { invalid_human.score  = true; }
    function invalidateRows_human()     { invalid_human.rows   = true; }

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

    function draw_human() {
      ctx_human.save();
      ctx_human.lineWidth = 1;
      ctx_human.translate(0.5, 0.5); // for crisp 1px black lines
      drawCourt_human();
      drawNext_human();
      drawScore_human();
      drawRows_human();
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

    function drawCourt_human() {
      if (invalid_human.court) {
        ctx_human.clearRect(0, 0, canvas_human.width, canvas_human.height);
        if (playing)
          drawPiece_human(ctx_human, current_human.type, current_human.x, current_human.y, current_human.dir);
        var x, y, block;
        for(y = 0 ; y < ny_human ; y++) {
          for (x = 0 ; x < nx_human; x++) {
            if (block = getBlock_human(x,y))
              drawBlock_human(ctx_human, x, y, block.color);
          }
        }
        ctx_human.strokeRect(0, 0, nx_human*dx_human - 1, ny_human*dy_human - 1); // court boundary
        invalid_human.court = false;
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
        getProloguePosition();
      }
    }

    function drawNext_human() {
      if (invalid_human.next) {
        var padding = (nu_human - next_human.type.size) / 2; // half-arsed attempt at centering next piece display
        uctx_human.save();
        uctx_human.translate(0.5, 0.5);
        uctx_human.clearRect(0, 0, nu_human*dx_human, nu_human*dy_human);
        drawPiece_human(uctx_human, next_human.type, padding, padding, next_human.dir);
        uctx_human.strokeStyle = 'black';
        uctx_human.strokeRect(0, 0, nu_human*dx_human - 1, nu_human*dy_human - 1);
        uctx_human.restore();
        invalid_human.next = false;
      }
    }

    function drawScore() {
      if (invalid.score) {
        html('score', ("00000" + Math.floor(vscore)).slice(-5));
        invalid.score = false;
      }
    }

    function drawScore_human() {
      if (invalid_human.score) {
        html('score_human', ("00000" + Math.floor(vscore_human)).slice(-5));
        invalid_human.score = false;
      }
    }

    function drawRows() {
      if (invalid.rows) {
        html('rows', rows);
        invalid.rows = false;
      }
    }

    function drawRows_human() {
      if (invalid_human.rows) {
        html('rows_human', rows_human);
        invalid_human.rows = false;
      }
    }

    function drawPiece(ctx, type, x, y, dir) {
      eachblock(type, x, y, dir, function(x, y) {
        drawBlock(ctx, x, y, type.color);
      });
    }

    function drawPiece_human(ctx_human, type, x, y, dir) {
      eachblock_human(type, x, y, dir, function(x, y) {
        drawBlock_human(ctx_human, x, y, type.color);
      });
    }

    function drawBlock(ctx, x, y, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x*dx, y*dy, dx, dy);
      ctx.strokeRect(x*dx, y*dy, dx, dy)
    }

    function drawBlock_human(ctx_human, x, y, color) {
      ctx_human.fillStyle = color;
      ctx_human.fillRect(x*dx_human, y*dy_human, dx_human, dy_human);
      ctx_human.strokeRect(x*dx_human, y*dy_human, dx_human, dy_human)
    }

    //-------------------------------------------------------------------------
    // FINALLY, lets run the game
    //-------------------------------------------------------------------------

    run();
