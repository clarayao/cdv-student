let numColumns = 4;

let viz = d3.select("#viz-container")
              .append("svg")
                .attr("id", "viz")
                .attr("width", window.innerWidth)
                .attr("height", window.innerHeight)
;

//position the svg group
function getGroupTranslation(d, i){
  let x = 10 + i%numColumns*350;
  let y = 20 + Math.floor(i/numColumns)*230;
  return "translate("+x+","+y+")";
}

//Type of Book --> color of the book cover
function coverColor(d, i) {
  let coverColor
  if (d.typeOfBook == "Fiction") {
    console.log(d.typeOfBook);
    coverColor = "#ED553B";
  } else {
    coverColor = "#3CAEA3";
  }
  return coverColor;
}

//How much I like the book --> roundness of the bookcover
function roundness(d, i) {
  return d.iLikedIt*10
}

//Pages --> thickness of the stroke of the Pages
function pages(d, i) {
  let pages = Math.floor(d.numberOfPagesRoughly/100);
  console.log(Number(pages)*100);
  // for (j = 0; j++; j <= pages){
  //   datagroups.append("rect")
  //               .attr("x", 10 + j)
  //               .attr("y", 10 + j)
  //               .attr("width", 120 - j)
  //               .attr("height", 160  - j)
  //               .attr("fill", "white")
  //               .attr("stroke", "black")
  //   ;
  // }
  return Number(pages);
}

function pagesNum(d, i) {
  return d.numberOfPagesRoughly;
}

//get book name
function bookName(d, i) {
  return d.name;
}

//get author name
function authorName(d, i) {
  return d.author;
}

//Language --> bookmark color (triangle)
function bookmarkColor(d, i) {
  let bookmarkColor
  if (d.language == "Chinese") {
    bookmarkColor = "#F6D55C";
  } else {
    bookmarkColor = "#20639B";
  }
  return bookmarkColor;
}


function gotData(incomingData) {
  console.log("the incoming data is:", incomingData)
  let datagroups = viz.selectAll(".dataGroup").data(incomingData).enter().append("g")
                                                        .attr("class", "dataGroup")
  ;

//position the svg group
  datagroups.attr("transform", getGroupTranslation);

//draw bookcover (the rectangle with color)
  datagroups.append("rect")
              .attr("x", 0)
              .attr("y", 0)
              .attr("rx", roundness)
              .attr("width", 260)
              .attr("height", 180)
              .attr("fill", coverColor)
              .attr("stroke", "black")
              .attr("stroke-width", 3)
  ;

  //draw bookmark
  datagroups.append("polygon")
                .attr("points", "240,25 240,45 255,35")
                .attr("fill", bookmarkColor)
                .attr("stroke", "black")
                .attr("stroke-width", 3)
  ;

//draw the left page
  datagroups.append("rect")
              .attr("x", 20)
              .attr("y", 15)
              .attr("width", 110)
              .attr("height", 150)
              .attr("fill", "white")
              .attr("stroke", "black")
              .attr("stroke-width", pages)
  ;

//draw the right page
datagroups.append("rect")
            .attr("x", 130)
            .attr("y", 15)
            .attr("width", 110)
            .attr("height", 150)
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("stroke-width", pages)
;

//pages --> the page written on the bottom right forner
datagroups.append("text")
            .text(pagesNum)
            .attr("y", 160)
            .attr("x", 213)
            .style("font-family", "serif")
            .style("font-size", "15")
;

//write book name
datagroups.append("text")
            .text(bookName)
            .attr("y", 50)
            .attr("x", 25)
            .style("font-family", "fantasy")
            .style("font-size", 19)
            .call(cdvTextWrap(100))
            .selectAll("tspan")
            .attr("text-anchor" ,"middle")
;

//write author name
datagroups.append("text")
            .text(authorName)
            .attr("y", 55)
            .attr("x", 145)
            .style("font-family", "serif")
            .style("font-weight", "bold")
            .style("font-size", "18")
            .call(cdvTextWrap(60))
;




}

d3.json("data.json").then(gotData);
