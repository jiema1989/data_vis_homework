// Global var for FIFA world cup data
var allWorldCupData;
qwe=0;

function updateBarChart(selectedDimension) {
qwe=qwe+1;
x=selectedDimension

    var svgBounds = d3.select("#barChart").node().getBoundingClientRect(),
        xAxisWidth = 100,
        yAxisHeight = 70;

    var data=[];
    var data1=[];
    var data2=[];

    for (var i=0;i<20;i++){
        newthing1=allWorldCupData[19-i].year
        if (x=='attendance'){
        newthing2=allWorldCupData[19-i].attendance}
        else if (x=='goals'){
       newthing2=allWorldCupData[19-i].goals}
     else if (x=='teams'){
       newthing2=allWorldCupData[19-i].teams}
   else{
    newthing2=allWorldCupData[19-i].matches}
        newthing=[newthing1,newthing2]
        data.push(newthing)
        data1.push(newthing1)
        data2.push(newthing2)
    }          
console.log(data)

    // Create the x and y scales; make
    // sure to leave room for the axes
            w=500;
            h=400;
            padding=80;
            paddingy=60;

if (qwe==1){svg=d3.select("body").select("#barChart");
                svg.selectAll("rect").data(data).enter().append("rect")}


            var xScale = d3.scaleBand()
                            .domain(data1)
                            .range([padding,w])

            var yScale = d3.scaleLinear()
                            .domain([0, d3.max(data,function(d,i){return d[1]})])
                            .range([h-paddingy,0.1*padding]);
            
winmin=d3.min(data,function(d,i){return d[1]})
winmax=d3.max(data,function(d,i){return d[1]})

            var xAxis = d3.axisBottom(xScale)
                                  .ticks(20)

            var yAxis = d3.axisLeft()
                              .scale(yScale)
                              .ticks(20)
                              
 var colorScale = d3.scaleLinear()
                .domain([winmin, 0.5*(winmin+winmax), winmax])
                // each color matches to an interpolation point
                .range(["rgb(0,20,120)", "rgb(0,20,170)", "rgb(0,20,220)"]);

              
      if (qwe!=1){svg.selectAll("rect")
                     .data(data)
                     .transition()
                     .duration(2000)
               .attr("y", function(d, i) {
                    return yScale(d[1])-paddingy;
               })
               .attr("x", function(d,i) {
                    return padding+i*(w-padding)/data.length;
               })
               .attr("width",19)
               .attr("height", function(d) {
                    return h-yScale(d[1]);
               })
               .attr("fill", function(d,i) {
                    return colorScale(d[1]);
                      })}
        else {svg.selectAll("rect")
               .attr("y", function(d, i) {
                    return yScale(d[1])-paddingy;
               })
               .attr("x", function(d,i) {
                    return padding+i*(w-padding)/data.length;
               })
               .attr("width",19)
               .attr("height", function(d) {
                    return h-yScale(d[1]);
               })
               .attr("fill", function(d,i) {
                    return colorScale(d[1]);
                      })}



    if (qwe==1) {svg.select("#xAxis")
                .attr("class", "x axis")
               .attr("transform", "translate(0," + (h-paddingy) + ")")
                .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                 .attr("dx", "-0.8em")
                 .attr("dy", ".05em")
                .attr("transform","rotate(270)");

            svg.select("#yAxis")
                .attr("class", "y axis")
                .attr("transform", "translate(" + padding + ",0)")
                .call(yAxis);}

    else  {svg.select(".y.axis")
               .transition()
               .duration(2000)
                .call(yAxis);

            svg.select(".x.axis")
                 .transition()
               .duration(2000)
                .call(xAxis)
                 .selectAll("text")
                  .style("text-anchor", "end")
                 .attr("dx", "-0.8em")
                 .attr("dy", ".05em")
                .attr("transform","rotate(270)")}

                svg.selectAll("rect")
                      .on("mouseover", function(){
                        d3.select(this)
                            .attr("fill","red")
                      })
                      .on("mouseout", function(d) {
                           d3.select(this)
                          .attr("fill", function(d,i) {
                    return colorScale(d[1]);
                    
               })
               })

                      .on("click", function(d,i){
                        svg.selectAll("rect").attr("fill",function(d){return colorScale(d[1])})
                        svg.selectAll("rect").on("mouseout", function(d,i){d3.select(this).attr("fill", function(d,i){return colorScale(d[1])})})
                        y=d3.select(this)
                            .attr("fill","red")
                            .on("mouseout", function(){d3.select(this).attr("fill","red")})
                        x=d[0];
                        leftfunction(x);
                        clearMap();
                        updateMap(x);
                      })
         

}
 function leftfunction(a){
                for (var j=0;j<20;){
                    if (allWorldCupData[j].year==a){break}
                    else {j=j+1}
                }
                y1=allWorldCupData[j].host;
                y2=allWorldCupData[j].winner;
                y3=allWorldCupData[j].runner_up;
                y4=allWorldCupData[j].TEAM_NAMES;

                teamdata=[];
                newa=' ';
            for (var k=0;k<y4.length;){
                if (y4[k]!=',') {newa=newa+y4[k]; k=k+1}
                else {teamdata.push(newa); k=k+1;  newa='';}
            }
            console.log(teamdata[3])
                d3.select("#host")           
                    .text(y1)
                d3.select("#winner")                
                    .text(y2)
                d3.select("#silver")         
                    .text(y3)
        function namefunction(){
    var x="";
    for (var i=0;i<teamdata.length;i++){
        x=x + teamdata[i]+ "<br>";
    }
    document.getElementById("teams").innerHTML=x;
}
        namefunction()
}


function chooseData() {
  var dataFile = document.getElementById('dataset').value;
  updateBarChart(dataFile);

}

function updateInfo(oneWorldCup) {
}

function drawMap(world) {

     projection = d3.geoConicConformal().scale(150).translate([400, 350]);
     var path= d3.geoPath().projection(projection);
     var toputindata=topojson.feature(world,world.objects.countries).features;
     console.log(world)
     console.log(world.objects.countries.geometries)
     var svg1=d3.select("#map")

    console.log(toputindata)

    svg1.selectAll("path")
            .data(toputindata)
            .enter()
            .append("path")
            .attr("class","countries")
            .attr("d",path)
            .attr("id",function(d) {return d.id})
console.log(svg1.selectAll("path"))


    svg1.append("path")
           .datum(d3.geoGraticule())
           .attr("class","grat")
           .attr("d",path)
           .attr("fill","none")

}

function clearMap() {
d3.select("#points").selectAll("circle").remove();
}


function updateMap(worldcupData) {
  a=worldcupData;
  for (var j=0;j<20;j++){
        if (allWorldCupData[j].year==a)
          {break}
  }
console.log(j)
thatyeardata=allWorldCupData[j];
console.log(thatyeardata)

 for (var j=0;j<20;){
                    if (allWorldCupData[j].year==a){break}
                    else {j=j+1}
                }
                y1=allWorldCupData[j].host;
                y2=allWorldCupData[j].winner;
                y3=allWorldCupData[j].runner_up;
                y4=allWorldCupData[j].TEAM_NAMES;
                y5=allWorldCupData[j].TEAM_LIST;
                y6=allWorldCupData[j].host_country_code;
console.log(y6)
                teamdata=[];
                teamdatashort=[];
                newa=' ';
                newb=' ';
            for (var k=0;k<y4.length;){
                if (y4[k]!=',') {newa=newa+y4[k]; k=k+1}
                else {teamdata.push(newa); k=k+1;  newa='';}
            }
           for (var k=0;k<y5.length;){
                if (y5[k]!=',') {newb=newb+y5[k]; k=k+1}
                else {teamdatashort.push(newb); k=k+1;  newb='';}
            }

console.log(teamdatashort)
console.log(teamdata)
console.log(teamdatashort.length)
console.log(teamdata.length)

selectmap=d3.select("#map")
console.log(selectmap.selectAll(".countries"))
console.log(thatyeardata.teams_iso)

selectmap.selectAll(".countries")
       .attr("class", function(d,i){
              if (d.id==y6){return "host countries"}
                else if (thatyeardata.teams_iso.includes(d.id)) {return "countries team"}
                  else {return "countries"}

       })

 var ww=projection(thatyeardata.win_pos)     
 var rr=projection(thatyeardata.ru_pos)
var win=d3.select("#points").append("circle")
                .attr("class","gold")
                .attr("r",7)
                .attr("cx",ww[0])
                .attr("cy",ww[1]);

var silvermedal=d3.select("#points").append("circle")
                .attr("class","silver")
                .attr("r",7)
                .attr("cx",rr[0])
                .attr("cy",rr[1]);
  }

  
    clearMap();

//Load in json data to make map
d3.json("data/world.json", function (error, world) {
    if (error) throw error;
    console.log(world)
    drawMap(world);
});

// Load CSV file
d3.csv("data/fifa-world-cup.csv", function (error, csv) {

    csv.forEach(function (d) {

        // Convert numeric values to 'numbers'
        d.year = +d.YEAR;
        d.teams = +d.TEAMS;
        d.matches = +d.MATCHES;
        d.goals = +d.GOALS;
        d.avg_goals = +d.AVERAGE_GOALS;
        d.attendance = +d.AVERAGE_ATTENDANCE;
        //Lat and Lons of gold and silver medals teams
        d.win_pos = [+d.WIN_LON, +d.WIN_LAT];
        d.ru_pos = [+d.RUP_LON, +d.RUP_LAT];

        //Break up lists into javascript arrays
        d.teams_iso = d3.csvParse(d.TEAM_LIST).columns;
        d.teams_names = d3.csvParse(d.TEAM_NAMES).columns;

    });

    // Store csv data in a global variable
    allWorldCupData = csv;
    // Draw the Bar chart for the first time
    updateBarChart('attendance');
});


