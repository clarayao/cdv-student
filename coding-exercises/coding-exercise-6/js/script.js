let w = 800;
let h = 500;
let padding = 50;
let viz, xAxisGroup, graphGroup;
let xScale, xAxis, yMax, yDomain, yScale;

let surpriseColors = ["#C0392B", "#E74C3C", "#9B59B6", "#8E44AD", "#2980B9", "#3498DB", "#1ABC9C", "#16A085", "#27AE60", "#2ECC71", "#F1C40F", "#F39C12", "#E67E22", "#D35400"]

let ease = d3.easePoly();

// just some console.logging at the start to make
// sure the script runs and we have data (from dataManager.js)
console.log("\n\n\nWelcome!\n\n\n");
console.log("script runs.");
console.log("do we have data?");
// check if variable exists: https://stackoverflow.com/a/519157
console.log("data:", typeof data !== 'undefined' ? data : "nothing here");
console.log(typeof data !== 'undefined' ? "seems like it ;-) it comes from the dataManager.js script." : "...damnit! let's see what is going wrong in the dataManager.js script.");

viz = d3.select("#container")
    .append("svg")
    .style("width", w)
    .style("height", h)

xAxisGroup = viz.append("g").classed("xAxis", true);
graphGroup = viz.append("g").classed("graphGroup", true)

//group location
function getBarLocation(d, i) {
  let x = xScale(d.key);
  let y = h-padding;
  return "translate("+ x +","+(h-padding)+")"
}

// AXIS
function updateAxis() {
    let allKeys = data.map(function(d){return d.key})
    xScale = d3.scaleBand()
        .domain(allKeys)
        .range([padding, w - padding])
        .paddingInner(0.1)
    xAxis = d3.axisBottom(xScale)
    xAxis.tickFormat(d => {return data.filter(dd => dd.key == d)[0].name})
    xAxisGroup.transition().ease(d3.easePoly).duration(500).delay(500).call(xAxis).selectAll("text").attr("font-size", 24).attr("y",9);
    xAxisGroup.selectAll('line').remove();
    xAxisGroup.attr("transform","translate(0,"+(h-padding)+")");

    yMax = d3.max(data, function(d){return d.value});
    yDomain = [0, yMax]
    yScale = d3.scaleLinear().domain(yDomain).range([0, h - padding * 2])
}

// GRAPH
function drawGraph() {
    let elementsForPage = graphGroup.selectAll('.datapoint').data(data, function(d) {return d.key});
    let enteringElements = elementsForPage.enter();
    let exitingElements = elementsForPage.exit();

    //existing data
    elementsForPage
        .transition()
        .ease(d3.easePoly)
        .duration(500)
        .delay(500)
        .attr('transform', getBarLocation);
    elementsForPage
        .select('rect')
        .transition()
        .ease(d3.easePoly)
        // .duration(100)
        // .delay(500)
        .attr('width', function(){
                      return xScale.bandwidth();
                   })
        .attr("y", function(d,i){
                      return -yScale(d.value);
                   })
        .attr("height", function(d, i){
                      return yScale(d.value);
                   })
        .attr('fill', 'black')

    // entering data
    let enteringDataGroups = enteringElements.append('g').classed('datapoint', true);
    enteringDataGroups.attr('transform', getBarLocation);
    enteringDataGroups
        .append('rect')
        .attr("y", function(d,i){
        return 0;
      })
      .attr("height", function(d, i){
        return 0;
      })
      .attr("width", function(){
        return xScale.bandwidth();
      })
      .attr("fill", "black")
      .transition()
      .ease(d3.easePoly)
      .delay(500)
      .attr("y", function(d,i){
        return -yScale(d.value);
      })
      .attr("height", function(d, i){
        return yScale(d.value);
      })
      .attr("fill", "#F27294")
    ;

    // exiting data
    exitingElements.select('rect')
                     .attr("fill", "#04ADBF")
                     .transition()
                     .ease(d3.easePoly)
                     .duration(500)
                    .attr("y", function(d,i){
                      return 0;
                    })
                    .attr("height", function(d, i){
                      return 0
                    })
}

updateAxis()
drawGraph();

function add() {
    addDatapoints(1);
    updateAxis();
    drawGraph();
}
document.getElementById("buttonA").addEventListener("click", add);

function remove() {
    removeDatapoints(1);
    updateAxis();
    drawGraph();
}
document.getElementById("buttonB").addEventListener("click", remove);

function removeAndAdd(d) {
  random = d3.randomUniform(1,6);
  let randA = random();
  let randR = random();
  removeAndAddDatapoints(randA,randR);
  updateAxis();
  drawGraph();
}
document.getElementById("buttonC").addEventListener("click", removeAndAdd);

function sortData() {
    sortDatapoints();
    updateAxis();
    drawGraph();
}
document.getElementById("buttonD").addEventListener("click", sortData);

function shuffleData() {
    shuffleDatapoints();
    updateAxis();
    drawGraph();
}
document.getElementById("buttonE").addEventListener("click", shuffleData);

function surpriseButton() {
  sortDatapoints();
  updateAxis();
  let elementsForPage = graphGroup.selectAll(".datapoint").data(data);
  elementsForPage.exit().remove();
  elementsForPage.transition().ease(d3.easePoly).attr("transform", function(d, i){
                                return "translate("+ xScale(d.key)+ "," + (h - padding) + ")"
  });
  console.log("suprise elements", elementsForPage)
  elementsForPage .select("rect")
                  .transition()
                  .ease(d3.easePoly)
                  .delay(200)
                  .duration(200)
                  .attr("width", function(){
                     return xScale.bandwidth();
                  })
                  .attr("y", function(d,i){
                    return -yScale(d.value);
                  })
                  .attr("height", function(d, i){
                    return yScale(d.value);
                  })
                  .transition()
                  .ease(d3.easePoly)
                  .duration(500)
                  .attr("fill",function(d,i){
                    return surpriseColors[i];
                  })
  ;
}
document.getElementById("buttonF").addEventListener("click", surpriseButton);
