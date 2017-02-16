/**
 * Constructor for the Year Chart
 *
 * @param electoralVoteChart instance of ElectoralVoteChart
 * @param tileChart instance of TileChart
 * @param votePercentageChart instance of Vote Percentage Chart
 * @param electionInfo instance of ElectionInfo
 * @param electionWinners data corresponding to the winning parties over mutiple election years
 */
function YearChart(electoralVoteChart, tileChart, votePercentageChart, electionWinners, shiftChart) {
    var self = this;
    self.electoralVoteChart = electoralVoteChart;
    self.tileChart = tileChart;
    self.votePercentageChart = votePercentageChart;
    self.electionWinners = electionWinners;
    self.shiftChart= shiftChart;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
YearChart.prototype.init = function(){

    var self = this;
    self.margin = {top: 10, right: 20, bottom: 30, left: 50};
    var divyearChart = d3.select("#year-chart").classed("fullView",true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divyearChart.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 100;

    //creates svg element within the div
    self.svg = divyearChart.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)

};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
YearChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R") {
        return "yearChart republican";
    }
    else if (party == "D") {
        return "yearChart democrat";
    }
    else if (party == "I") {
        return "yearChart independent";
    }
}


/**
 * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
 */
YearChart.prototype.update = function(){
    var self = this;
    //Domain definition for global color scale
    var domain = [-60,-50,-40,-30,-20,-10,0,10,20,30,40,50,60 ];

    //Color range for global color scale
    var range = ["#0066CC", "#0080FF", "#3399FF", "#66B2FF", "#99ccff", "#CCE5FF", "#ffcccc", "#ff9999", "#ff6666", "#ff3333", "#FF0000", "#CC0000"];

    //Global colorScale to be used consistently by all the charts
    self.colorScale = d3.scaleQuantile()
        .domain(domain).range(range);


    // ******* TODO: PART I *******

    console.log(self);
    // The data of eectionWinners //
    var self_electionWinners=self.electionWinners;
    console.log(self_electionWinners);

    // Define the length of the svg //
    var self_electionWinners_length=self_electionWinners.length;
    var year_chart_svg=d3.select("#year-chart").select("svg");
    console.log(year_chart_svg);

    // Find the width of the svg //
    var year_chart_svg_width=self.svgWidth;
    // Find the distance between each circle //
    var year_chart_svg_width_each=year_chart_svg_width/self_electionWinners_length;
    // select all the circles //
    var year_chart_svg_circles=year_chart_svg.selectAll("circle").data(self_electionWinners).enter().append("circle");
    console.log(year_chart_svg_circles);
    // TO find the height and width of the svg //
    var year_chart_svg_height=self.svgHeight;
    // Define the radius of all the circles //
    var circle_radius =year_chart_svg_height/4 ;
    // Set attributes for all the circles //
    year_chart_svg_circles.attr("cx",function(d,i){return year_chart_svg_width_each*i+self.margin.left-self.margin.right})
                          .attr("r", function(d,i){return circle_radius})
                          .attr("cy", function(d,i){return circle_radius+self.margin.top})
                          .attr('class', function(d) { return self.chooseClass(d.PARTY); });

    // Highlight the year with hovering //
    openhigh=year_chart_svg_circles.on("mouseover", function(){d3.select(this).classed("highlighted", true)});
    openlow=year_chart_svg_circles.on("mouseout", function(){d3.select(this).classed("highlighted",false)});

    // Add a dotted line through all the points//
    year_chart_svg.append("line")
                  .attr("stroke-dasharray","1,5")
                  .attr("x1", 0)
                  .attr("y1", circle_radius+self.margin.top)
                  .attr("x2", year_chart_svg_width)
                  .attr("y2", circle_radius+self.margin.top)
                  .attr("stroke",'black')
                  .attr("stroke-width",1);




    // Let all the texts in  //
    var year_chart_svg_texts=year_chart_svg.selectAll("text")
                  .data(self.electionWinners)
                  .enter()
                  .append("text");

    console.log(year_chart_svg_texts);

    // Append texts //
    year_chart_svg_texts.text(function(d,i){return d.YEAR})
                        .classed("yeartext",true)
                        .attr("y",function(d,i){return self.margin.top+year_chart_svg_height/1-self.margin.bottom})
                        .attr("x",function(d,i){return year_chart_svg_width_each*i+self.margin.left-self.margin.right});

    year_chart_svg_circles.attr("id", function(d,i){return i});
    console.log(year_chart_svg_circles);

    // Populate when clicking //
    year_chart_svg_circles.on("click", function(){
        d3.select("#stateList").select("ul").remove();
        year_chart_svg_circles.classed("selected",false);
        d3.select(this).classed("selected",true);
        year=d3.select(this).attr("id");
        year=1940+year*4;
        console.log(year);
        console.log(self.electoralVoteChart);
        d3.csv("data/Year_Timeline_"+year+".csv", function(error,data){var y= self;
            self.electoralVoteChart.update(data,self.colorScale)})
        d3.csv("data/Year_Timeline_"+year+".csv", function(error,data){var y= self;
            self.votePercentageChart.update(data,self.colorScale)})
        d3.csv("data/Year_Timeline_"+year+".csv", function(error,data){var y= self;
            self.tileChart.update(data,self.colorScale)})

    })




    // Create the chart by adding circle elements representing each election year
    //The circles should be colored based on the winning party for that year
    //HINT: Use the .yearChart class to style your circle elements
    //HINT: Use the chooseClass method to choose the color corresponding to the winning party.

    //Append text information of each year right below the corresponding circle
    //HINT: Use .yeartext class to style your text elements

    //Style the chart by adding a dashed line that connects all these years.
    //HINT: Use .lineChart to style this dashed line

    //Clicking on any specific year should highlight that circle and  update the rest of the visualizations
    //HINT: Use .highlighted class to style the highlighted circle

    //Election information corresponding to that year should be loaded and passed to
    // the update methods of other visualizations


    //******* TODO: EXTRA CREDIT *******

    //Implement brush on the year chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.



    count=1;

    function brushed() {
        console.log(count)
        if (count%2==0){d3.select("#text_2").remove();y=d3.select("#text_1");y.append("text").append("strong").attr("id","text_2").text("Activated (Click to De-Activate)")}
        if (count%2==1){d3.select("#text_2").remove();y=d3.select("#text_1");y.append("text").append("strong").attr("id","text_2").text("Non-Activated (Click to Re-Activate)")}
    }


    console.log(brushed());

    // Create a button //
    var year_chart_button =d3.select("body")
        .select("div")
        .append("div")
        .style("float","right")
        .style("width","100%")
        .style("height",60+"px")
        .append("button")
        .style("float","left")
        .style("height","90%")
        .style("width","30%");

    console.log(year_chart_button)

    year_chart_button
        .append("text")
        .attr("id","text_1")
        .text("Year Chart Brush: ")
        .style("font-size",22+"px")


    year_chart_button
        .append("text")
        .append("strong")
        .attr("id","text_2")
        .text(function(){return "Non-Activated (Click to Activate)"})
        .style("font-size",22+"px");

    console.log(year_chart_button);

    year_chart_button
        .on("click", function(){count=count+1;console.log(count); brush_control()} );

    console.log(count);


    var brush= d3.brushX()
        .extent([[0, year_chart_svg_height/1.8],
            [year_chart_svg_width, year_chart_svg_height]])
        .on('end', brushed);

function brush_control(){
    if (count%2==0){brushed();
        brush_g= self.svg.append('g').attr("class", "brush").call(brush);}
    else{brushed();brush_g.remove()}
}











};
