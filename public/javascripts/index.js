window.onload = function(){
  var socket = io();
  var ROW = 15,NUM = ROW*ROW,
      sence = document.getElementById('sence'),
      senceWidth = parseInt(getComputedStyle(sence).width),
      blockOffset =(senceWidth-ROW)/ROW +'px',
      canDrop = true,color='bai',dict1 = {},dict2 = {};
  //创建场景
  (function (){
    var el,rowline,colline;
    for ( var i = 0;  i < ROW;  i++){

      rowline = document.createElement('div');
      rowline.setAttribute('class','row');
      rowline.style.top =  (senceWidth/ROW)/2 + (senceWidth/ROW)*i + 'px';
      sence.appendChild(rowline);

      colline = document.createElement('div');
      colline.style.left = (senceWidth/ROW)/2 + (senceWidth/ROW)*i + 'px';
      colline.setAttribute('class','col');
      sence.appendChild(colline);

      for ( var j = 0;  j < ROW;  j++){
        el = document.createElement('div');
        el.style.width =  blockOffset; el.style.height = blockOffset;
        el.setAttribute('class','block');
        el.setAttribute('data',i + '_' + j);
        el.setAttribute('id',i + '_' + j);
        sence.appendChild(el);
      }
    }
  })();
  var  isHasWinner= function(id,dic){
    var x = Number(id.split('_')[0]);
    var y = Number(id.split('_')[1]);
    var hang = 1,shu = 1, zuoxiexian = 1, youxiexian = 1;
    var tx,ty;
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

  socket.on('drop one',function(data){
    canDrop = true;
    var el = document.getElementById(data.id);
    if(data.color == 'bai'){
      color='hei'; el.setAttribute('class','block white');
      dict1[data.id] = true;
      if(isHasWinner(data.id,dict1)){alert('白棋赢'); location.reload()}
    }else{
      el.setAttribute('class','block black');
      dict2[data.id] = true;
      if(isHasWinner(data.id,dict2)){alert('黑棋赢');location.reload()}
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
    if( color == 'bai' ){
      el.setAttribute('class','block white');
      dict1[id] = true;
      if(isHasWinner(id,dict1)){alert('白棋赢');location.reload()}
      socket.emit('drop one', {id:id,color:'bai'});
    }
    if(color == 'hei'){
      el.setAttribute('class','block black');
      dict2[id] = true;
      if(isHasWinner(id,dict2)){alert('黑棋赢');location.reload()}
      socket.emit('drop one', {id:id,color:'hei'});
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
