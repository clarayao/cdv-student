let w = 1500;
let h = 800;
let padding = 20;

let viz = d3.select("#container").append("svg")
              .style("width", w)
              .style("height", h)
              .style("background-color", "SlateGrey")
;

// viz.append("text")
//       .text("Number of Occrurrences For Different Countries in the")
//       .attr("x", 300)
//       .attr("y", 80)
//       .attr("font-size", 50)
//       .attr("fill", "white")
//   ;

let countryName = viz.append("text")
                        .text("Country")
                        .attr("x", 50)
                        .attr("y", h-padding)
                        .attr("font-size", 50)
                        .attr("fill", "white")
;


d3.json("data/countries.geojson").then(function(geoData){
  d3.json("data/cannes-awards.json").then(cannesData)
  function cannesData(incomingData){
    console.log(incomingData)
    newData = [];
    incomingData = incomingData.map(function(d, i){
      // console.log(d);
      // d.directo = Number(d.numOccurrences);
      for (let i = 0; i < d.director.length; i++){
        let datapoint = {};
        // console.log(d.movie_name)
        datapoint.movie_name = d.movie_name;
        datapoint.movie_url = d.movie_url;
        datapoint.poster = d.poster;
        datapoint.year = d.year;
        datapoint.director = d.director[i]
        console.log(datapoint)
        newData.push(datapoint)
        // console.log(d.director[i])
      }
      // console.log(newData)
      // return d.director
    })
    console.log(newData)

    //create color scale for ny times countries occrurrences
    // dataforRange = incomingData.filter(d=>d.country != "United States")
    // let minOc = d3.min(dataforRange, d=>d.numOccurrences);
    // let maxOc = d3.max(dataforRange, d=>d.numOccurrences);
    // let colorScale1 = d3.scaleLinear().domain([minOc, maxOc]).range(["white","black"]);
    // let colorScale2 = d3.scaleLinear().domain([minOc, maxOc]).range(["PeachPuff","red"])
    // console.log(maxOc)

    //draw map
    // console.log(geoData)
    let projection = d3.geoEqualEarth()
                          .fitExtent([[padding, padding], [w-padding, h-padding]], geoData)
    ;
    let pathMaker = d3.geoPath(projection);
    let map = viz.selectAll(".globe").data(geoData.features).enter()
                    .append("path")
                    .attr("class", "globe")
                    .attr("d", pathMaker)
                    .attr("fill", "black")
                    .style("opacity", "0.5")
                    .attr("stroke", "white")
                    .attr("stroke-width", 1)
                    .raise();
    ;

    // console.log(geoData.lon)
    // //draw dots on map
    // let nationalityDots = viz.selectAll(".nationality").data(newData).enter()
    //                             .append("circle")
    //                             .attr("class", "nationality")
    //                             .attr("cx", function(d) {
    //                               return projection([geoData.lon, geoData.lat])[0];
    //                             })
    //                             .attr("cy", 20)
    //                             .attr("r", 10)
    //                             .attr("fill", "white")
    // ;

    //hover effect
    function mouseOver(d, i) {
      d3.select(this)
          .style("opacity", "1")
    }
    function mouseOut(d, i) {
      d3.select(this)
          .style("opacity", "1")
    }

    map.filter(d=> d.id != "BMU").on("mouseover", function(event, d){
      d3.select(this).transition().style("opacity", "1");
      // console.log(d)
      countryName.text(d.properties.name)
    })
    map.filter(d=> d.id != "BMU").on("mouseout", function(event, d){
      d3.select(this).transition().style("opacity", "0.5")
      // label.transition().style("opacity", "0")
      countryName.text("Country")
    })

  }

})
