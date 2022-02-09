//button action
function drawSquares() {
  // get the background of the squares
  var squares = document.getElementById('square_canvas');

  // get the value of the number form
  let num = document.getElementById('number').value;
  console.log(num);

  //clear canvas when clicking the button again
  squares.innerHTML = "";

  //change square color
  var r=0;
  var g=255;
  var b=255;

  //color gradation var
  var x=255/num;

  //draw squares
  for(let i=0;i<num;i++){
    //create square
    var one_square = document.createElement('div');
    one_square.className = 'one_square';
    squares.appendChild(one_square);
    //change square color
    one_square.style.backgroundColor = "rgb("+r+i*x+","+g+","+b+")";
  };
}
