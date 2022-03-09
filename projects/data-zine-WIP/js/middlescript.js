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

function gotData(incomingData) {
  console.log(incomingData);

  let datagroups = viz.selectAll(".dataGroup").data(incomingData).enter()
                                                                    .append("g")
                                                                      .attr("class", "dataGroup")
  ;
  //locate svg
  datagroups.attr("transform", getPosition);

  function getPosition(d, i) {
    let x = 300 + i%numColumns*300;
    let y = 100 + Math.floor(i/numColumns)*270;
    return "translate("+x+", "+y+")"
  }

  // function successColor(d, i) {
  //   if (d.successLevelInDealingWithIt == 1) {
  //     return "#F1D302"
  //   } else if (d.successLevelInDealingWithIt == 2) {
  //     return "#EA7317"
  //   } else {
  //     return "#FC440F"
  //   }
  // }

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
  //---Other's behavior-rectangle
  datagroups.filter(d=>d.topic =="Actual interaction").append("rect")
              .attr("x", -70)
              .attr("y", -70)
              .attr("width", 140)
              .attr("height", 140)
              .attr("fill", "#30BCED")
              .attr("stroke", "black")
              .attr("stroke-width", 8)
  ;
  //---Actual Interaction-triangle
  datagroups.filter(d=>d.topic =="Other's behavior").append("polygon")
              .attr("points", "0,-80 -80,70 80,70")
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
              .attr("d", "M-15 15 Q-12.5,10 -10,15 -7.5,10 -5,15 -2.5,10 0,15 2.5,10 5,15 7.5,10 10,15 12.5,10 15,15")
              .attr("fill", "nofill")
              .attr("stroke", "black")
              .attr("stroke-width", 3)
  ;

  //location
  //---Dorm
  datagroups.filter(d=>d.location =="Dorm").append("rect")
                .attr("x", -83)
                .attr("y", 60)
                .attr("width", 166)
                .attr("height", 52)
                .attr("fill", "white")
                .attr("stroke", "black")
                .attr("stroke-width", 3)
    ;
  //---AB
  datagroups.filter(d=>d.location =="AB").append("rect")
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
  datagroups.filter(d=>d.location =="Transportation").append("rect")
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
  datagroups.filter(d=>d.location =="Off-Campus").append("rect")
                .attr("x", -83)
                .attr("y", 60)
                .attr("width", 166)
                .attr("height", 52)
                .attr("fill", "white")
                .attr("stroke", "black")
                .attr("stroke-width", 3)
    ;
  datagroups.filter(d=>d.location =="Off-Campus").append("rect")
                .attr("x", -83)
                .attr("y", 60)
                .attr("width", 166)
                .attr("height", 52)
                .attr("fill", "white")
                .style("stroke-dasharray", ("3,3"))
                .attr("stroke", "black")
                .attr("stroke-width", 3)
    ;
  //---Virtual
  datagroups.filter(d=>d.location =="Virtual").append("rect")
                .attr("x", -83)
                .attr("y", 60)
                .attr("width", 166)
                .attr("height", 52)
                .attr("fill", "white")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
    ;
    datagroups.filter(d=>d.location =="Virtual").append("rect")
                  .attr("x", -80)
                  .attr("y", 63)
                  .attr("width", 160)
                  .attr("height", 46)
                  .attr("fill", "white")
                  .attr("stroke", "black")
                  .attr("stroke-width", 1)
      ;

  //detail
  datagroups.append("rect")
              .attr("id", "textRect")
              .attr("x", -75)
              .attr("y", 68)
              .attr("width", 150)
              .attr("height", 36)
              .attr("fill", "white")
              .attr("stroke", "black")
              .attr("stroke-width", 6)
  ;

// var bbox = textRect.getBBox();
//   console.log(textRect.getBBox().x)
//   function getSize(d) {
//     let bbox = textRect.getBBox();
//     // console.log(textRect.getBBox())
//     let cbbox = textRect.parentNode.getBBox();
//     let scale = Math.min(cbbox.width/bobox.width, cbbox.height/bbox.height)
//     d.scale = scale;
//   }




  datagroups.append("text")
              .text(d=>d.detail)
              .attr("x", -70)
              .attr("y", 80)
              .style("font-family", "'Anton', sans-serif")
              .style("font-size", "11px")
              .call(cdvTextWrap(148))
  ;
}


d3.json("setup/data.json").then(gotData);
