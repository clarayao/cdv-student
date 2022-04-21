This is a visualization of the number of occrurrences for different countries in the New York Times from 2000 to 2016. The darker the color, the more times that the country had appeared in the New York Times articles. And we you click each country on the map, it will change from d3.geoEqualEarth() view to d3.geoAzimuthalEqualArea() view, pieces by pieces.

However, there are many minor issues and things that I failed to accomplish.
1. Because the geojson dataset for the world map is not specific for each country, namely the "BMU" piece include Australia, the ocean, Argentina... Thus when I wanted to seperate the ocean from the other countries, these other countries are seperated as well.
2. I wanted to use buttons to filter the data by years, however, I failed to do that. I think the problem lies in when I filter the data, I was only able to use .slice() and the other data was gone.
3. I also wanted to create a chart for each year whenever the user hover onto the country. However, I struggle to find a way to use the data. Whenever I tried to do that, it always says that the data is undefined and I don't know why...
