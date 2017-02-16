/**
 * Constructor for the Vote Percentage Chart
 */
function VotePercentageChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
VotePercentageChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};
    var divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divvotesPercentage.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 200;

    //creates svg element within the div
    self.svg = divvotesPercentage.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
VotePercentageChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R"){
        return "republican";
    }
    else if (party == "D"){
        return "democrat";
    }
    else if (party == "I"){
        return "independent";
    }
}

/**
 * Renders the HTML content for tool tip
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for toop tip
 */
VotePercentageChart.prototype.tooltip_render = function (tooltip_data) {
    var self = this;
    var text = "<ul>";
    tooltip_data.result.forEach(function(row){
        if (row.nominee !== ' ') {
            text += '<li class = ' + self.chooseClass(row.party) + '>' +
                row.nominee + ':\t\t'+row.votecount+'('+row.percentage+'%)' +
                '</li>';
        } else {
            text += '<li class = ' + self.chooseClass(row.party) + '>' +
                'No Nonimee' +
                '</li>';
        }
    });

    return text;
}

/**
 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
 *
 * @param electionResult election data for the year selected
 */
VotePercentageChart.prototype.update = function(electionResult,colorScale){
    var self = this;
    data=electionResult;
    self.colorScale=colorScale;
    //Use this tool tip element to handle any hover over the chart
    tip = d3.tip().attr('class', 'd3-tip')
        .direction('s')
        .offset(function(d) {
            if (d[0].length!=0){return [0,180]}
            else {return [0,0]}
        })
        .html(function(d) {
             //populate data in the following format
              var tooltip_data = {
              "result":[
              {"nominee": d[0].D_Nominee_prop,"votecount": d[0].D_Votes_Total,"percentage": d[0].D_PopularPercentage,"party":"D"} ,
              {"nominee": d[0].R_Nominee_prop,"votecount": d[0].R_Votes_Total,"percentage": d[0].R_PopularPercentage,"party":"R"} ,
              {"nominee": d[0].I_Nominee_prop,"votecount": d[0].I_Votes_Total,"percentage": d[0].I_PopularPercentage,"party":"I"}
              ]
              }

            return self.tooltip_render(tooltip_data);
        });


    // ******* TODO: PART III *******
    // We first select the svg //
    var vote_svg=d3.select("#votes-percentage").select("svg");
    // The height, width, and margins of the svg //
    svg_width=self.svgWidth;
    svg_height=self.svgHeight;
    svg_margin_top=self.margin.top;
    svg_margin_bottom=self.margin.bottom;
    svg_margin_left=self.margin.left;
    svg_margin_right=self.margin.right;
    // We extract the total number of votes for all three campaigns //
    data_to_use=[data[0].I_Votes_Total, data[0].D_Votes_Total, data[0].R_Votes_Total];
    data_to_use_old=data_to_use;
    console.log(data_to_use);



    //Break the entire dataset into 3: depending on which party wins. This will seperate into three catalogues, based on region (state) //
    data_democrat=data.filter(function(d,i){return d.State_Winner=="D"});
    data_republican=data.filter(function(d,i){return d.State_Winner=="R"});
    data_independent=data.filter(function(d,i){return d.State_Winner=="I"});
    console.log(data_democrat);
    console.log(data_republican);
    console.log(data_independent);


    // Calculate the location and width of each stacked bar //
    // outputs are location_set and each_width //
    if (data_to_use[0]==""){
    total_length=parseFloat(data_to_use[1])+parseFloat(data_to_use[2]);
    data_to_use=[0,parseFloat(data_to_use[1]),parseFloat(data_to_use[2])];}

    else {total_length=parseFloat(data_to_use[0])+parseFloat(data_to_use[1])+parseFloat(data_to_use[2]);
    data_to_use=[parseFloat(data_to_use[0]),parseFloat(data_to_use[1]),parseFloat(data_to_use[2])]}

    console.log(total_length);
    console.log(data_to_use);
    each_width=[];


    for (var i=0;i<3;i++){y=parseFloat(data_to_use[i])/total_length*self.svgWidth;
    each_width.push(y)};
    var location=0;
    var location_set=[0];
    for (var i=1;i<3;i++){location=each_width[i-1]+location; location_set.push(location)}
    console.log(each_width);
    console.log(location_set);




    // Emerge all the three different groups for use: data_after_sort//
    console.log(data_independent.length==0)
        if (data_independent.length==0){
        data_sorted = [data, data_democrat, data_republican]}
        else {data_sorted = [data_independent, data_democrat, data_republican]}


   console.log(data_sorted);
    // Before we add rects, we let the remove //
    vote_svg.selectAll("rect").remove();

    // And then we create all the retangles //
    var vote_bars=vote_svg.selectAll("rect").data(data_sorted).enter().append("rect");
    console.log(vote_bars);
    // Now we set attributes for all the rectangles //
    vote_bars.attr("x",function(d,i){return location_set[i]})
        .attr("width",function(d,i){return each_width[i]})
        .attr("y",svg_height*3/4)
        .attr("height",svg_height/4)

        .style("fill", function(d,i){
            if (data_sorted.length==2){
                if (i==0){return "#3182bd"}
                else {return "#de2d26"}
            }
            if (data_sorted.length==3){
                if (i==0){return "#45AD6A"}
                else if (i==1){return "#3182bd"}
                else {return "#de2d26"}
            }
        })
        .classed("votePercentage",true);

    // Append texts //
    // First determine whether we have the independent party //
    if (data[0].I_PopularPercentage==""){data_percent=[data[0].D_PopularPercentage, data[0].R_PopularPercentage]}
    else {data_percent=[data[0].I_PopularPercentage,data[0].D_PopularPercentage, data[0].R_PopularPercentage]}
    console.log(data_percent);
    console.log(data_percent.length);

    // Now we formally append all the texts (for each campaign, not lncluding the one above)
    vote_svg.selectAll("text").remove();

    var vote_svg_texts=vote_svg.selectAll("text").data(data_percent).enter().append("text");
    vote_svg_texts.attr("x", function(d,i){
        if (data_percent.length==2){
            if (i==0){return 0}
            else {return svg_width}
        }
        if (data_percent.length==3){
            if (i==0){return 0}
            else if (i==1){return (location_set[1]+each_width[1])/2}
            else if (i==2){return svg_width}
        }
    })
        .attr("y",svg_height*3/4*0.9)
        .text(function(d,i){return d})
        .style("text-anchor", function(d,i){
            if (data_percent.length==2){
                if (i==1){return "end"}
            }
            if (data_percent.length==3){
                if (i==2){return "end"}
            }
        })

        .attr("class", function(d,i){
            if (data_percent.length==2){
                if (i==0){return "democrat"}
                if (i==1){return "republican"}

            }
            if (data_percent.length==3){
                if (i==0){return "independent"}
                if (i==1){return "democrat"}
                if (i==2){return "republican"}
            }
        } )
        .text(function(d,i){return d})
        .classed("votesPercentageText",true);

    // Now We append a middle bar //
    // Remove path before enter //
    vote_svg.selectAll("path")
        .remove();

    // Append a middle bar //
    vote_svg.append("path")
        .attr("d", function(d,i){return "M"+svg_width/2 +","+ svg_height*3/4*0.9+ "L"+svg_width/2+","+svg_height*1.1})
        .style("stroke","black")
        .style("stroke-width",5)
        .classed("middlePoint",true);
    // Append the text "note" above //
    vote_svg
        .append("text")
        .attr("x", svg_width/2)
        .attr("y",svg_height*3/4*0.9)
        .classed("votesPercentageNote",true)
        .text("Popular Vote (50%)");

    // Data President //
    if (data[0].I_Nominee==""){data_president=[data[0].D_Nominee, data[0].R_Nominee]}
    else (data_president=[data[0].I_Nominee,data[0].D_Nominee,data[0].R_Nominee])

    vote_svg
        .append("g")
        .selectAll("text")
        .data(data_president)
        .enter()
        .append("text")
        .attr("x", function(d,i){
            if (data_president.length==2){
                if (i==0){return each_width[1]/3}
                if (i==1){return svg_width}
            }

            if (data_president.length==3){
                if (i==0){return 0}
                if (i==1){return  each_width[1]/2}
                if (i==2){return svg_width}
            }
        })
        .attr("y", svg_height*2/5)
        .text(function(d,i){return d})
        .style("text-anchor",function(d,i){
            if (i==data_president.length-1){return "end"}
        })
        .attr("class", function(d,i){
            if (data_president.length==2){
                if (i==0){return "votesPercentageText democrat"}
                if (i==1){return "votesPercentageText republican"}
            }
            if (data_president.length==3){
                if (i==0){return "votesPercentageText independent"}
                if (i==1){return "votesPercentageText democrat"}
                if (i==2){return "votesPercentageText republican"}
            }
        })

        self.svg.call(tip);
        vote_bars
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)


    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .votesPercentage class to style your bars.

    //Display the total percentage of votes won by each party
    //on top of the corresponding groups of bars.
    //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning details about this mark on top of this bar
    //HINT: Use .votesPercentageNote class to style this text element

    //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
    //then, vote percentage and number of votes won by each party.

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

};
