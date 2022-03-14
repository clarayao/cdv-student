let w = 2400;
let h = 800;

let numColumns = 7;

let viz = d3.select('#container')
              .append("svg")
                .attr("id","viz")
                .attr("width", w)
                .attr("height", h)
                .attr("margin", "20px")
                .style("background-color","#FCF3CF")
;

// transform time in to integer time
function transformTime(dataToTransform) {
  return dataToTransform.map(d=>{
    d.date = new Date(d.date);
    d.time = new Date(d.time);
    return d
})
}

// group a certain time span
function formGroup(dataToTransform) {
  let groupedData = d3.group(dataToTransform, function(datapoint){
    let hour = datapoint.time.getHours();

    if(hour ==  8){
      return "8"
    }else if(hour ==  9){
      return "9"
    }else if(hour ==  10){
      return "10"
    } else if(hour ==  11){
      return "11"
    } else if(hour ==  12){
      return "12"
    } else if(hour ==  13){
      return "13"
    } else if(hour ==  15){
      return "15"
    } else if(hour ==  16){
      return "16"
    } else if(hour ==  18){
      return "18"
    } else if(hour ==  19){
      return "19"
    } else if(hour ==  20){
      return "20"
    } else {
      return "21-23"
    }
  })
  let normalArrayVersion = Array.from(groupedData);
  return normalArrayVersion;
}

// draw each time group's pattern
function gotData(incomingData) {
  //organize time format
  let sortedData = incomingData.slice().sort((a, b) => d3.ascending(a.time, b.time));
  let transformedTime = transformTime(sortedData);

  //make datagroup for each hour
  let formedGroup = formGroup(transformedTime);

  // position each time group
  let timeGroups = viz.selectAll(".timeGroup").data(formedGroup).enter().append("g")
      .attr("class","timeGroup")
      .attr("transform", function(d,i){
        let x = 5+i*w/12;
        let y = 50;
        return "translate("+x+","+y+")"
      })
  ;

  // the bottom time label
  let timebox = timeGroups.append("rect")
              .attr("x", 50)
              .attr("y", 670)
              .attr("fill", "white")
              .attr("width", "130")
              .attr("height", "70")
              .attr("stroke", "black")
              .attr("stroke-width", 4)
  ;
  timeGroups.append("text")
              .attr("x", 70)
              .attr("y", 720)
              .text(function(d){
                let time = d[0]
                return time+":00"})
              .attr("font-family", "'Anton', sans-serif")
              .style("font-size","30px")
  ;

  // draw each data point
  function getTimeData(d,i){
    return d[1]
  }
  let datagroups = timeGroups.selectAll(".dataGroup").data(getTimeData).enter()
                                                                    .append("g")
                                                                      .attr("class", "dataGroup")
  ;
  //locate each head shot
  datagroups.attr("transform", getPosition);
  function getPosition(d, i) {
    let x = 100;
    let y = i*250+50
    return "translate("+x+", "+y+")"
  }

  //howDidIDealWithIt-->clothes color
  function how(d, i) {
    if (d.howDidIDealWithIt == "Endure") {
      return "#F1D302"
    } else if (d.howDidIDealWithIt == "Avoid") {
      return "#D72483"
    } else {
      return "#49D49D"
    }
  }

  //Topic (shape)
  //---Environment-circle
  datagroups.filter(d=>d.topic =="Environment").append("circle")
              .attr("cx", 0)
              .attr("cy", 0)
              .attr("r", 80)
              .attr("fill", "#30BCED")
              .attr("stroke", "black")
              .attr("stroke-width", 8)

  ;

  //----Other's behavior triangle
  datagroups.filter(d=>d.topic =="Other's behavior").append("polygon")
              .attr("points", "0,-80 -80,70 80,70")
              .attr("fill", "#30BCED")
              .attr("stroke", "black")
              .attr("stroke-width", 8)
  ;

  //---Actual Interaction-rectangle
  datagroups.filter(d=>d.topic =="Actual interaction").append("rect")
              .attr("x", -70)
              .attr("y", -70)
              .attr("width", 140)
              .attr("height", 140)
              .attr("fill", "#30BCED")
              .attr("stroke", "black")
              .attr("stroke-width", 8)
  ;

  //success Level In Dealing With It
  //---level1
  datagroups.filter(d=>d.successLevelInDealingWithIt ==1).append("polyline")
              .attr("points", "0,-37 0,-50")
              .attr("stroke", "black")
              .attr("stroke-width", 3)
  ;
  //---level2
  datagroups.filter(d=>d.successLevelInDealingWithIt ==2).append("polyline")
              .attr("points", "-5,-38 -8,-48")
              .attr("stroke", "black")
              .attr("stroke-width", 3)
  ;
  datagroups.filter(d=>d.successLevelInDealingWithIt ==2).append("polyline")
              .attr("points", "5,-38 8,-48")
              .attr("stroke", "black")
              .attr("stroke-width", 3)
  ;
  //---level3
  datagroups.filter(d=>d.successLevelInDealingWithIt ==3).append("polyline")
              .attr("points", "0,-37 0,-50")
              .attr("stroke", "black")
              .attr("stroke-width", 3)
  ;
  datagroups.filter(d=>d.successLevelInDealingWithIt ==3).append("polyline")
              .attr("points", "10,-35 15,-47")
              .attr("stroke", "black")
              .attr("stroke-width", 3)
  ;
  datagroups.filter(d=>d.successLevelInDealingWithIt ==3).append("polyline")
              .attr("points", "-10,-35 -15,-47")
              .attr("stroke", "black")
              .attr("stroke-width", 3)
  ;

  //how Did I Deal With It
  //---body
  datagroups.append("path")
              .attr("d", "M-10,0 L-40,55 Q0,80 40,55 L10,0 Z")
              .attr("fill", how)
              .attr("stroke", "black")
              .attr("stroke-width", 3)
  ;
  //---left arm
  datagroups.append("polyline")
              .attr("points", "-20,40 -30,60")
              .attr("stroke", "black")
              .attr("stroke-width", 3)
  ;
  //---right arm
  datagroups.append("polyline")
              .attr("points", "20,40 30,60")
              .attr("stroke", "black")
              .attr("stroke-width", 3)
  ;


  //---degreeOfAwkwardness
  datagroups.append("circle")
              .attr("cx", 0)
              .attr("cy", 0)
              .attr("r", 37)
              .attr("fill", "white")
              .attr("stroke", "black")
              .attr("stroke-width", 3)
  ;
  //faces
  //--face1
  //----eyes
  datagroups.filter(d=>d.degreeOfAwkwardness ==1).append("circle")
              .attr("cx", -20)
              .attr("cy", 0)
              .attr("r", 3)
              .attr("fill", "black")
  ;
  datagroups.filter(d=>d.degreeOfAwkwardness ==1).append("circle")
              .attr("cx", 20)
              .attr("cy", 0)
              .attr("r", 3)
              .attr("fill", "black")
  ;
  //----mouth
  datagroups.filter(d=>d.degreeOfAwkwardness ==1).append("path")
              .attr("d", "M-15,15 Q0,25 15,15")
              .attr("fill", "none")
              .attr("stroke", "black")
              .attr("stroke-width", 3)
  ;

  //--face2
  //----left eyes
  datagroups.filter(d=>d.degreeOfAwkwardness ==2).append("circle")
              .attr("cx", -20)
              .attr("cy", 0)
              .attr("r", 7)
              .attr("fill", "white")
              .attr("stroke", "black")
              .attr("stroke-width", 2)
  ;
  datagroups.filter(d=>d.degreeOfAwkwardness ==2).append("circle")
              .attr("cx", -20)
              .attr("cy", 0)
              .attr("r", 3)
              .attr("fill", "black")
  ;
  //----right eyes
  datagroups.filter(d=>d.degreeOfAwkwardness ==2).append("circle")
              .attr("cx", 20)
              .attr("cy", 0)
              .attr("r", 7)
              .attr("fill", "white")
              .attr("stroke", "black")
              .attr("stroke-width", 2)
  ;
  datagroups.filter(d=>d.degreeOfAwkwardness ==2).append("circle")
              .attr("cx", 20)
              .attr("cy", 0)
              .attr("r", 3)
              .attr("fill", "black")
  ;
  //----mouth
  datagroups.filter(d=>d.degreeOfAwkwardness ==2).append("polyline")
              .attr("points", "-15,15 15,15")
              .attr("stroke", "black")
              .attr("stroke-width", 3)
  ;

  //--face3
  //----left eyes
  datagroups.filter(d=>d.degreeOfAwkwardness ==3).append("circle")
              .attr("cx", -35)
              .attr("cy", 0)
              .attr("r", 10)
              .attr("fill", "white")
              .attr("stroke", "black")
              .attr("stroke-width", 2)
  ;
  datagroups.filter(d=>d.degreeOfAwkwardness ==3).append("circle")
              .attr("cx", -35)
              .attr("cy", 0)
              .attr("r", 5)
              .attr("fill", "black")
  ;
  //----right eyes
  datagroups.filter(d=>d.degreeOfAwkwardness ==3).append("circle")
              .attr("cx", 35)
              .attr("cy", 0)
              .attr("r", 10)
              .attr("fill", "white")
              .attr("stroke", "black")
              .attr("stroke-width", 2)
  ;
  datagroups.filter(d=>d.degreeOfAwkwardness ==3).append("circle")
              .attr("cx", 35)
              .attr("cy", 0)
              .attr("r", 5)
              .attr("fill", "black")
  ;
  //----mouth
  datagroups.filter(d=>d.degreeOfAwkwardness ==3).append("path")
              .attr("d", "M-19,12.5 Q-17,15 -15,12.5 -13,10 -11,12.5 -9,15 -7,12.5 -5,10 -3,12.5 -1,15 1,12.5 3,10 5,12.5 7,15 9,12.5 11,10 13,12.5 15,15 17,12.5 19,15")
              .attr("fill", "transparent")
              .attr("stroke", "black")
              .attr("stroke-width", 2)
  ;

  //location
  //---Dorm
  let frameD = datagroups.filter(d=>d.location =="Dorm").append("rect")
                .attr("x", -83)
                .attr("y", 60)
                .attr("width", 166)
                .attr("height", 52)
                .attr("fill", "white")
                .attr("stroke", "black")
                .attr("stroke-width", 3)
    ;
  //---AB
  let frameA = datagroups.filter(d=>d.location =="AB").append("rect")
                .attr("x", -83)
                .attr("y", 60)
                .attr("width", 166)
                .attr("height", 52)
                .attr("fill", "white")
                .style("stroke-dasharray", ("3,3"))
                .attr("stroke", "black")
                .attr("stroke-width", 3)
    ;
  //---Transportation
  let frameT = datagroups.filter(d=>d.location =="Transportation").append("rect")
                .attr("x", -83)
                .attr("y", 60)
                .attr("width", 166)
                .attr("height", 52)
                .attr("fill", "white")
                .style("stroke-dasharray", ("10,3"))
                .attr("stroke", "black")
                .attr("stroke-width", 3)
    ;
  //---Off-campus
  let frameO1 = datagroups.filter(d=>d.location =="Off-Campus").append("rect")
                .attr("x", -83)
                .attr("y", 60)
                .attr("width", 166)
                .attr("height", 52)
                .attr("fill", "white")
                .style("stroke-dasharray", ("3,3"))
                .attr("stroke", "black")
                .attr("stroke-width", 3)
    ;
    let frameO2 = datagroups.filter(d=>d.location =="Off-Campus").append("rect")
                  .attr("x", -80)
                  .attr("y", 62.5)
                  .attr("width", 160)
                  .attr("height", 47)
                  .attr("fill", "white")
                  .attr("stroke", "black")
                  .attr("stroke-width", 3)
      ;
  //---Virtual
  let frameV1 = datagroups.filter(d=>d.location =="Virtual").append("rect")
                .attr("x", -83)
                .attr("y", 60)
                .attr("width", 166)
                // .attr("height", 52)
                .attr("fill", "white")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
    ;
  let frameV2 = datagroups.filter(d=>d.location =="Virtual").append("rect")
                  .attr("x", -80)
                  .attr("y", 63)
                  .attr("width", 160)
                  .attr("height", 46)
                  .attr("fill", "white")
                  .attr("stroke", "black")
                  .attr("stroke-width", 1)
      ;

  //detail
  let captionFrames = datagroups.append("rect")
              .attr("id", "textRect")
              .attr("x", -75)
              .attr("y", 68)
              .attr("width", 150)
              .attr("height", 36)
              .attr("fill", "white")
              .attr("stroke", "black")
              .attr("stroke-width", 6)
  ;

let texts = datagroups.append("text")
            .text(d=>d.detail)
            .attr("x", -70)
            .attr("y", 82)
            .attr("font-family", "'Anton', sans-serif")
            .style("font-size", "11px")
;
setTimeout(function(){
  texts.call(cdvTextWrap(148))

  captionFrames.attr("height", function(d, i) {
    let textHeight = d3.select(this.parentNode).select("text").node().getBBox().height;
    return textHeight + 5;
  })
  frameD.attr("height", function(d, i) {
    let textHeight = d3.select(this.parentNode).select("text").node().getBBox().height;
    return textHeight + 22;
  })
  frameA.attr("height", function(d, i) {
    let textHeight = d3.select(this.parentNode).select("text").node().getBBox().height;
    return textHeight + 22;
  })
  frameO1.attr("height", function(d, i) {
    let textHeight = d3.select(this.parentNode).select("text").node().getBBox().height;
    return textHeight + 21;
  })
  frameO2.attr("height", function(d, i) {
    let textHeight = d3.select(this.parentNode).select("text").node().getBBox().height;
    return textHeight + 16;
  })
  frameV1.attr("height", function(d, i) {
    let textHeight = d3.select(this.parentNode).select("text").node().getBBox().height;
    return textHeight+21;
  })
  frameV2.attr("height", function(d, i) {
    let textHeight = d3.select(this.parentNode).select("text").node().getBBox().height;
    return textHeight+15;
  })
  frameT.attr("height", function(d, i) {
    let textHeight = d3.select(this.parentNode).select("text").node().getBBox().height;
    return textHeight + 22;
  })
  timebox.attr("width", function(d, i) {
    let textWidth = d3.select(this.parentNode).select("text").node().getBBox().width;
    return textWidth + 40;
  })
})

}


d3.json("setup/data.json").then(gotData);
