window.onload = function(){
  var socket = io(),
      sence = document.getElementById('sence'),

      //棋盘大小
      ROW = 15,NUM = ROW*ROW,

      //场景宽度
      senceWidth = sence.offsetWidth,

      //每科棋子宽度
      blockWidth =(senceWidth-ROW)/ROW +'px',

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
      rowline = document.createElement('div');
      rowline.setAttribute('class','row');
      //计算横线间隔
      rowline.style.top =  (senceWidth/ROW)/2 + (senceWidth/ROW)*i + 'px';
      sence.appendChild(rowline);
      colline = document.createElement('div');
      //计算竖线间隔
      colline.style.left = (senceWidth/ROW)/2 + (senceWidth/ROW)*i + 'px';
      colline.setAttribute('class','col');
      sence.appendChild(colline);
      for ( var j = 0;  j < ROW;  j++){
        el = document.createElement('div');
        el.style.width =  blockWidth; el.style.height = blockWidth;
        el.setAttribute('class','block');
        el.setAttribute('data',i + '_' + j);
        el.setAttribute('id',i + '_' + j);
        sence.appendChild(el);
      }
    }
  })();


  //判断落子后该色棋是否连5;
  var  isHasWinner= function(id,dic){
    var x = Number(id.split('_')[0]);
    var y = Number(id.split('_')[1]);

    //用来记录横,竖,左斜,右斜方向的连续棋子数量
    var hang = 1,shu = 1, zuoxiexian = 1, youxiexian = 1;

    //作为游标,左移,右移,上移,下移,左上,右下,左下,右上移动,
    //每次数完某个方向的连续棋子后,游标会回到原点.
    var tx,ty;

    //注意,以下判断5连以上不算成功 如果规则有变动,条件改为大于5即可

    tx = x; ty = y; while(dic[ tx + '_'+ (ty+1) ]){hang++;ty++;}
    tx = x; ty = y; while(dic[ tx + '_'+ (ty-1) ]){hang++;ty--;}
    if(hang == 5) return true;

    tx = x; ty = y; while(dic[ (tx+1) + '_'+ ty ]){shu++;tx++;}
    tx = x; ty = y; while(dic[ (tx-1) + '_'+ ty ]){shu++;tx--;}
    if(shu == 5) return true;

    tx = x; ty = y; while(dic[ (tx+1) + '_'+ (ty+1) ]){zuoxiexian++;tx++;ty++;}
    tx = x; ty = y; while(dic[ (tx-1) + '_'+ (ty-1) ]){zuoxiexian++;tx--;ty--;}
    if(zuoxiexian == 5) return true;

    tx = x; ty = y; while(dic[ (tx-1) + '_'+ (ty+1) ]){youxiexian++;tx--;ty++;}
    tx = x; ty = y; while(dic[ (tx+1) + '_'+ (ty-1) ]){youxiexian++;tx++;ty--;}
    if(youxiexian == 5) return true;

    return false;
  };

  //处理对手发送过来的信息
  socket.on('drop one',function(data){
    canDrop = true;
    var el = document.getElementById(data.id);
    if(data.color == 'white'){
      color='black'; el.setAttribute('class','block white');
      whiteBlocks[data.id] = true;
      if(isHasWinner(data.id,whiteBlocks)){alert('白棋赢'); location.reload();}
    }else{
      el.setAttribute('class','block black');
      blackBlocks[data.id] = true;
      if(isHasWinner(data.id,blackBlocks)){alert('黑棋赢');location.reload();}
    }
    el.setAttribute('has-one','true');
  });

  sence.onclick = function(e){
    var el = e.target;
    if( el == this) return;
    if( el.hasAttribute('has-one') ) return;
    if( !canDrop ) return;
    canDrop = false;

    var id = el.getAttribute('data');
    if( color == 'white' ){
      el.setAttribute('class','block white');
      whiteBlocks[id] = true;
      if(isHasWinner(id,whiteBlocks)){alert('白棋赢');location.reload();}
      socket.emit('drop one', {id:id,color:'white'});
    }
    if(color == 'black'){
      el.setAttribute('class','block black');
      blackBlocks[id] = true;
      if(isHasWinner(id,blackBlocks)){alert('黑棋赢');location.reload();}
      socket.emit('drop one', {id:id,color:'black'});
    }
    el.setAttribute('has-one','true');
  };
};
// -------------------------------------------------

// var loginButton = document.getElementById('login'),
//     loginBox = document.getElementById('login-box');
// loginButton.addEventListener('click',function(){
//   loginBox.setAttribute('class','login-box animated rollOut');
//   setTimeout(function(){
//     loginBox.style.display = 'none';
//     sence.style.display = 'block';
//     sence.setAttribute('class','sense animated rollIn');
//   },600);
// },true);
