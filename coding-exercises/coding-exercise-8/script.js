let w = 2700;
let h = 1500;
let padding = 50;

let viz = d3.select("#container").append("svg")
              .style("width", w)
              .style("height", h)
              .style("background-color", "SlateGrey")
;

viz.append("image").attr("xlink:href", "new-york-times.png")
      .attr("transform", "translate(1600, 5)")
;
viz.append("text")
      .text("Number of Occrurrences For Different Countries in the")
      .attr("x", 300)
      .attr("y", 80)
      .attr("font-size", 50)
      .attr("fill", "white")
  ;

d3.json("countries.geojson").then(function(geoData){
  d3.csv("ny_times_countries.csv").then(nytData)
  function nytData(incomingData){
    // console.log(incomingData)

    incomingData = incomingData.map(function(d, i){
      // console.log(d);
      d.numOccurrences = Number(d.numOccurrences);
      return d
    })
    console.log(incomingData)

    //create color scale for ny times countries occrurrences
    dataforRange = incomingData.filter(d=>d.country != "United States")
    let minOc = d3.min(dataforRange, d=>d.numOccurrences);
    let maxOc = d3.max(dataforRange, d=>d.numOccurrences);
    let colorScale1 = d3.scaleLinear().domain([minOc, maxOc]).range(["white","black"]);
    let colorScale2 = d3.scaleLinear().domain([minOc, maxOc]).range(["PeachPuff","red"])
    // console.log(maxOc)

    //draw map
    // console.log(geoData)
    let projection1 = d3.geoEqualEarth()
                          .fitExtent([[padding, padding], [w-padding, h-padding]], geoData)
    ;

    let projection2 = d3.geoAzimuthalEqualArea()
                          .fitExtent([[padding, padding], [w-padding, h-padding]], geoData)
    ;

    let pathMaker1 = d3.geoPath(projection1);
    let pathMaker2 = d3.geoPath(projection2);

    let map = viz.selectAll(".globe").data(geoData.features).enter()
                    .append("path")
                    .attr("class", "globe")
                    .attr("d", pathMaker1)
                    .attr("fill", function(d, i){
                      // console.log(d)
                      let correspondingDatapoint = incomingData.find(function(datapoint){
                        if(datapoint.country == d.properties.name) {
                          return true
                          // console.log(datapoint.country)
                        }else{
                          return false
                        }
                      })
                      if (d.id == "BMU") {
                        return "black"
                      }else if(d.id == "USA") {
                        return "DimGray"
                      }else if(correspondingDatapoint != undefined){
                        return colorScale1(correspondingDatapoint.numOccurrences)
                      }else{
                        return "black"
                      }
                    })
                    .style("opacity", "0.7")
                    .attr("stroke", "white")
                    .attr("stroke-width", 1)
                    .raise();
    ;

    //hover effect
    function mouseOver(d, i) {
      d3.select(this)
          .style("opacity", "1")
    }
    function mouseOut(d, i) {
      d3.select(this)
          .style("opacity", "1")
    }
    //label
    //country name
    // let countryName =
    // let label = viz.append("svg").attr("class","label").append("text")
    //                             .attr("class", "country")
    //                             .text(incomingData[0].country)
    //                             .attr("x", 50)
    //                             .attr("y", h-padding*2)
    //                             .attr("font-size", "100")
    //                             .attr("fill", "white")
    //                             .style("opacity", "0")
                                // .on("mouseover", mouseOver)
                                // .on("mouseout", mouseOut)
    ;
    // label.append("text")
    //       .text(d=>d)
    //       .attr("x", 50)
    //       .attr("y", 100)
    //       .attr("fill", "white")
    //
    // ;

    // //chart axis
    // let chartPadding = 10;
    // let xDomain = d3.extent(geoData, function(d){ return Number(d.year); })
    // let xScale = d3.scaleLinear().domain(xDomain).range([padding,w-padding]);
    // let yDomain = d3.extent(geoData, function(d){ return Number(d.birthsPerThousand); })
    // let yScale = d3.scaleLinear().domain(yDomain).range([h-padding,padding]);
    // label.append()


    map.filter(d=> d.id != "BMU").on("mouseover", function(d, i){
      d3.select(this).transition().style("opacity", "1");
      // d3.select(this).append("text")
      //                             .attr("class", "country")
      //                             .text(incomingData[0].country)
      //                             .attr("x", 50)
      //                             .attr("y", h-padding*2)
      //                             .attr("font-size", "100")
      //                             .attr("fill", "white")
      //                             .style("opacity", "0")
      // label.transition().style("opacity", "0.8")
    })
    map.filter(d=> d.id != "BMU").on("mouseout", function(d, i){
      d3.select(this).transition().style("opacity", "0.7")
      // label.transition().style("opacity", "0")
    })

    //clicking effect
    map.filter(d=> d.id != "BMU").on("click", function(d){
      d3.select(this).attr("d", pathMaker2)
                        .attr("fill",function(d, i){
                          let correspondingDatapoint = incomingData.find(function(datapoint){
                            if(datapoint.country == d.properties.name) {
                              return true
                            }else{
                              return false
                            }
                          })
                          if(d.id == "USA") {
                            return "DarkRed"
                          }else if(correspondingDatapoint != undefined){
                            return colorScale2(correspondingDatapoint.numOccurrences)
                          }else{
                            return "black"
                          }
                        })
                        .style("opacity", "1")
                        // .raise();
    });
    map.filter(d=> d.id == "BMU").on("click", function(d){
      d3.select(this).attr("d", pathMaker2)
                        .attr("fill",d=>"#AED6F1")
    });

    // document.getElementById("b2010").addEventListener("click", function(){
    //   data = incomingData.slice(2322,2557);
    //   // console.log(incomingData.slice(0,233))
    //   nytData(data)
    // })
    // document.getElementById("b2011").addEventListener("click", function(){
    //   data = incomingData.slice(2558,2791);
    //   console.log(data)
    //   nytData(data)
    // })
  }


  // map.filter(d=> d.id != "BMU").on("click", function(d){
  //
  // })

})
