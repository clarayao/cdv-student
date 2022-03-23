console.log("hi");
//data from https://towardsdatascience.com/how-to-build-animated-charts-like-hans-rosling-doing-it-all-in-r-570efc6ba382

let w = 2700;
let h = 1500;
let xPadding = 150;
let yPadding = 100;

let viz = d3.select("#container")
  .append("svg")
    .attr("width", w)
    .attr("height", h)
    .style("background-color", "black")
;

let caption = viz.append("g").attr("class", "caption")

caption.append("circle")
      .attr("r", 20)
      .attr("cx", w-350)
      .attr("cy", 110)
      .attr("fill", "#2ac6f2")
;

caption.append("text")
      .text("Africa")
      .attr("x", w-300)
      .attr("y", 130)
      .attr("font-family", "sans-serif")
      .attr("font-size", "50")
      .attr("fill", "#2ac6f2")
;

caption.append("circle")
      .attr("r", 20)
      .attr("cx", w-350)
      .attr("cy", 180)
      .attr("fill", "#f3e717")
;

caption.append("text")
      .text("Americas")
      .attr("x", w-300)
      .attr("y", 200)
      .attr("font-family", "sans-serif")
      .attr("font-size", "50")
      .attr("fill", "#f3e717")
;

caption.append("circle")
      .attr("r", 20)
      .attr("cx", w-350)
      .attr("cy", 250)
      .attr("fill", "#308740")
;

caption.append("text")
      .text("Asia")
      .attr("x", w-300)
      .attr("y", 270)
      .attr("font-family", "sans-serif")
      .attr("font-size", "50")
      .attr("fill", "#308740")
;

caption.append("circle")
      .attr("r", 20)
      .attr("cx", w-350)
      .attr("cy", 320)
      .attr("fill", "#e46a21")
;

caption.append("text")
      .text("Europe")
      .attr("x", w-300)
      .attr("y", 340)
      .attr("font-family", "sans-serif")
      .attr("font-size", "50")
      .attr("fill", "#e46a21")
;

caption.append("circle")
      .attr("r", 20)
      .attr("cx", w-350)
      .attr("cy", 390)
      .attr("fill", "#CC00CC")
;

caption.append("text")
      .text("Oceania")
      .attr("x", w-300)
      .attr("y", 410)
      .attr("font-family", "sans-serif")
      .attr("font-size", "50")
      .attr("fill", "#CC00CC")
;

function gotData(incomingData){
  console.log(incomingData);

  // min max fertility rate (for xScale)
  let fertExtent = d3.extent(incomingData, function(d, i){
    return d.fert;
  });
  console.log("fertExtent", fertExtent);

  // make the xscale which we use to locate points along the xaxis
  let xScale = d3.scaleLinear().domain(fertExtent).range([xPadding, w-xPadding]);


  // min max life expectancy
  let lifeExtent = d3.extent(incomingData, function(d, i){
    return d.life;
  });
  console.log("lifeExtent", lifeExtent);

  // make the yscale which we use to locate points along the yaxis
  let yScale = d3.scaleLinear().domain(lifeExtent).range([h-yPadding, yPadding]);

  // using the function defined at the bottom of this script to build two axis
  buildXAndYAxis(xScale, yScale);


  // min max Population
  let popExtent = d3.extent(incomingData, function(d, i){
    return d.pop;
  });
  console.log("popExtent", popExtent);
  // you may use this scale to define a radius for the circles
  let rScale = d3.scaleLinear().domain(popExtent).range([5, 50]);




  // the simple out put of this complicated bit of code,
  // is an array of all the years the data talks about.
  // the "dates" array looks like:
  // ["1962", "1963", "1964", "1965", ... , "2012", "2013", "2014", "2015"]
  let dates = incomingData.reduce(function(acc,d,i){
    if(!acc.includes(d.year)){
      acc.push(d.year)
    }
    return acc
  }, [])

  console.log("dates", dates);

  // this block of code is needed to select a subsection of the data (by year)
  let currentYearIndex = 0;
  let currentYear = dates[currentYearIndex];
  function filterYear(d, i){
    if(d.year == currentYear){
      return true;
    }else{
      return false;
    }
  }











  // make a group for all things visualization:
  let vizGroup = viz.append("g").attr("class", "vizGroup");


  // this function is called every second.
  // inside it is a data variable that always carries the "latest" data of a new year
  // inside it we want to draw shapes and deal wirth both updating and entering element.
  function drawViz(){

    let currentYearData = incomingData.filter(filterYear);
    // console.log("---\nthe currentYearData array now carries the data for year", currentYear);
    // console.log(currentYearData);

    // bind currentYearData to elements
    function getGroupLocation(d, i) {
      let x = xScale(d.fert);
      let y = yScale(d.life);
      return "translate("+x+", "+y+")"
    }
    function getIncomingLocation(d, i) {
      let x = xScale(d.fert);
      let y = -200;
      return "translate("+x+", "+y+")"
    }

    function radius(d, i) {
      let r = rScale(d.pop);
      return r*5;
    }

    function continentColor(d, i) {
      if (d.continent == "Asia") {
        color = "#308740"
      } else if (d.continent == "Americas") {
        color = "#f3e717"
      } else if (d.continent == "Europe") {
        color = "#e46a21"
      } else if (d.continent == "Oceania") {
        color = "#CC00CC"
      } else {
        color = "#2ac6f2"
      }
      return color
    }

    function captionSize(d, i) {
      let captionSize = rScale(d.pop)*5;
      if (captionSize <= 30) {
        return 30
      } else {
        return captionSize
      }
    }

    function textMouseOver(d, i) {
      d3.select(this)
          .style("opacity", 1)
      ;

    }

    function textMouseOut(d, i) {
      d3.select(this).style("opacity", 0)
    }





    let datagroups = vizGroup.selectAll(".datagroup").data(currentYearData);

    // take care of updating elements
    datagroups.transition().duration(500).attr("transform", getGroupLocation)

    // take care of entering elements
    let enteringElements = datagroups.enter()
                                      .append("g")
                                      .attr("class", "datagroup")
    ;

    enteringElements.append("circle")
                      .attr("r", radius)
                      .attr("fill", continentColor)
                      .style("opacity", 0.8)
    ;

    enteringElements.append("text")
                      .attr("class", "caption")
                      .text(function(d) {
                          return d.Country;  // Value of the text
                        })
                      .attr("x", function(d) {
                        return -rScale(d.pop)*5
                      })
                      .attr("y", function(d) {
                        return rScale(d.pop)*2
                      })
                      .attr("font-size", captionSize)
                      .attr("fill", "white")
                      .style("font-family", "sans-serif")
                      .style("opacity", 0)
                      .on("mouseover", textMouseOver)
                      .on("mouseout", textMouseOut)
    ;


    enteringElements.attr("transform", getIncomingLocation).transition().delay(500).attr("transform", getGroupLocation);















  }




  // this puts the YEAR onto the visualization
  let year = viz.append("text")
      .text("")
      .attr("x", xPadding+100)
      .attr("y", h-yPadding-50)
      .attr("font-family", "sans-serif")
      .attr("font-size", "100")
      .attr("fill", "white")
  ;

  // this called the drawViz function every second
  // and changes the year of interest
  // and updates the text element that displays the year.
  drawViz();
  year.text(currentYear)
  setInterval(function(){
    currentYearIndex++;
    if(currentYearIndex>dates.length){
      currentYearIndex = 0;
    }
    currentYear = dates[currentYearIndex];
    year.text(currentYear)
    drawViz();
  }, 1000);






}


// load data
d3.csv("data.csv").then(gotData);





// function to build x anc y axis.
// the only reasons these are down here is to make the code above look less polluted

function buildXAndYAxis(xScale, yScale){
  let xAxisGroup = viz.append("g").attr("class", 'xaxis');
  let xAxis = d3.axisBottom(xScale);
  xAxisGroup.style("font-size", 20).attr("stroke-size", 2).call(xAxis);
  xAxisGroup.attr("transform", "translate(0, "+ (h-yPadding) +")")
  xAxisGroup.append("g").attr('class', 'xLabel')
    .attr("transform", "translate("+(w/2+xPadding/2)+", 75)")
    .append("text")
    .text("Fertility")
    .attr("font-family", "sans-serif")
    .attr("font-size", "50")
  ;

  let yAxisGroup = viz.append("g").attr("class", 'yaxis');
  let yAxis = d3.axisLeft(yScale);
  yAxisGroup.style("font-size", 20).call(yAxis);
  yAxisGroup.attr("transform", "translate("+xPadding+", 0)")

  yAxisGroup.append("g").attr('class', 'xLabel')
    .attr("transform", "translate(-55, "+(h/2-yPadding)+") rotate(-90)")
    .append("text")
    .text("Life expectancy")
    .attr("font-family", "sans-serif")
    .attr("font-size", "50")

  ;
}
