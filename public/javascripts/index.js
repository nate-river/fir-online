window.onload = function(){
  var socket = io(),
      sence = document.getElementById('sence'),

      //棋盘大小
      ROW = 20,NUM = ROW*ROW,

      //场景宽度
      senceWidth = sence.offsetWidth,

      //每颗棋子宽度
      blockWidth =Math.floor( (senceWidth-ROW)/ROW ) +'px',

      //用户开始默认可以落子
      canDrop = true,

      //用户默认落子为白棋
      color='white',

      //两个字典,用来存放白棋和黑子的已落子位置;以坐标为键,值为true;
      whiteBlocks = {},blackBlocks = {};


  //创建场景
  (function (){
    var el,
        //在棋盘上画横线
        rowline,
        //在棋盘上画竖线
        colline;
    for ( var i = 0;  i < ROW;  i++){

      //按照计算好的间隔放置横线
      rowline = document.createElement('div');
      rowline.setAttribute('class','row');
      rowline.style.top =  (senceWidth/ROW)/2 + (senceWidth/ROW)*i + 'px';
      sence.appendChild(rowline);

      //按照计算好的间隔放置竖线
      colline = document.createElement('div');
      colline.setAttribute('class','col');
      colline.style.left = (senceWidth/ROW)/2 + (senceWidth/ROW)*i + 'px';
      sence.appendChild(colline);

      for ( var j = 0;  j < ROW;  j++ ){
        el = document.createElement('div');
        el.style.width =  blockWidth;
        el.style.height = blockWidth;
        el.setAttribute('class','block');
        el.setAttribute('id', i + '_' + j );
        sence.appendChild(el);
      }
    }
  })();


  var  id2Position = function(id){
    return {x:Number(id.split('_')[0]),y:Number(id.split('_')[1])};
  };
  var position2Id  = function(x,y){
    return  x + '_' + y ;
  };

  //判断落子后该色棋是否连5;
  var  isHasWinner= function(id,dic){
    var x = id2Position(id).x;
    var y = id2Position(id).y;

    //用来记录横,竖,左斜,右斜方向的连续棋子数量
    var rowCount = 1,colCount = 1, leftSkewLineCount = 1, rightSkewLineCount = 1;

    //tx ty 作为游标,左移,右移,上移,下移,左上,右下,左下,右上移动,
    //每次数完某个方向的连续棋子后,游标会回到原点.
    var tx,ty;

    //注意,以下判断5连以上不算成功 如果规则有变动,条件改为大于5即可
    tx = x; ty = y; while(dic[ position2Id(tx,ty+1) ]){rowCount++;ty++;}
    tx = x; ty = y; while(dic[ position2Id(tx,ty-1) ]){rowCount++;ty--;}
    if( rowCount == 5 ) return true;

    tx = x; ty = y; while(dic[ position2Id(tx+1,ty) ]){colCount++;tx++;}
    tx = x; ty = y; while(dic[ position2Id(tx-1,ty) ]){colCount++;tx--;}
    if( colCount == 5 ) return true;

    tx = x; ty = y; while(dic[ position2Id(tx+1,ty+1) ]){leftSkewLineCount++;tx++;ty++;}
    tx = x; ty = y; while(dic[ position2Id(tx-1,ty-1) ]){leftSkewLineCount++;tx--;ty--;}
    if( leftSkewLineCount == 5 ) return true;

    tx = x; ty = y; while(dic[ position2Id(tx-1,ty+1) ]){rightSkewLineCount++;tx--;ty++;}
    tx = x; ty = y; while(dic[ position2Id(tx+1,ty-1) ]){rightSkewLineCount++;tx++;ty--;}
    if( rightSkewLineCount == 5 ) return true;

    return false;
  };

  //处理对手发送过来的信息
  socket.on('drop one',function(data){
    console.log(data);
    canDrop = true;
    var el = document.getElementById(data.id);
    el.setAttribute('has-one','true');
    if(data.color == 'white'){
      color = 'black';
      el.setAttribute('class','block white');

      whiteBlocks[data.id] = true;

      if(isHasWinner(data.id,whiteBlocks)){
        alert('白棋赢');
        location.reload();
      }
    }else{
      el.setAttribute('class','block black');

      blackBlocks[data.id] = true;

      if(isHasWinner(data.id,blackBlocks)){
        alert('黑棋赢');
        location.reload();
      }
    }
  });

  //事件委托方式处理用户下棋
  sence.onclick = function(e){
    var el = e.target;
    if( !canDrop ||  el.hasAttribute('has-one') || el == this  ) {
      return;
    }

    el.setAttribute('has-one','true');
    canDrop = false;
    var id = el.getAttribute('id');
    if( color == 'white' ){
      el.setAttribute('class','block white');
      whiteBlocks[id] = true;
      socket.emit('drop one', {id:id,color:'white'});
      if(isHasWinner(id,whiteBlocks)){
        alert('白棋赢');
        location.reload();
      }
    }
    if(color == 'black'){
      el.setAttribute('class','block black');
      blackBlocks[id] = true;
      socket.emit('drop one', {id:id,color:'black'});
      if(isHasWinner(id,blackBlocks)){
        alert('黑棋赢');
        location.reload();
      }
    }
  };
};
