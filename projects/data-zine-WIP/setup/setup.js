


















// Please do not make changes to this file


















let docw = 1200;
let doch = 800;
let page;


function init(){
  var path = window.location.pathname;
  page = path.split("/").pop().split(".")[0];
  page = page==""?"index":page;
  console.log("page", page)
  let container = document.getElementById("container");

  if(page == "index" || page == ""){
    container.className = "page cover-container"
  }else if(page == "middlespread"){
    container.className = "page middle-spread-container"
  }else if(page == "back"){
    container.className = "page back-container"
  }

  function checkPage(tocheck){

    return page==tocheck?"open-page":"";
  }

  var str = `
  <div id="nav-wrapper">
    <p id="header-p-tag">CDV Data Zine (w1200xh800)</p>
    <nav id="page-nav"><a class="button `+ checkPage('index') +`" href=".">Cover</a><a class="button `+ checkPage('middlespread') +`" href="middlespread.html">Page 2 & 3</a><a class="button `+ checkPage('back') +`" href="back.html">Back</a></nav>
  </div>
  `;
  document.body.insertAdjacentHTML( 'afterbegin', str );

  let css = `<link rel="stylesheet" href="setup/setup.css">
  `
  document.head.insertAdjacentHTML( 'beforeend', css );

}
window.addEventListener("load", init);
