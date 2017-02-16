
/**
 * Constructor for the ElectoralVoteChart
 *
 * @param shiftChart an instance of the ShiftChart class
 */
function ElectoralVoteChart(shiftChart){
    var self = this;
    console.log(shiftChart);
    self.shiftChart= shiftChart;
    console.log(self);
    self.init();

};

/**
 * Initializes the svg elements required for this chart
 */
ElectoralVoteChart.prototype.init = function(){
    var self = this;
    console.log(self);
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};

    //Gets access to the div element created for this chart from HTML
    var divelectoralVotes = d3.select("#electoral-vote").classed("content", true);
    self.svgBounds = divelectoralVotes.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 150;

    //creates svg element within the div
    self.svg = divelectoralVotes.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
ElectoralVoteChart.prototype.chooseClass = function (party) {
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
 * Creates the stacked bar chart, text content and tool tips for electoral vote chart
 *
 * @param electionResult election data for the year selected
 * @param colorScale global quantile scale based on the winning margin between republicans and democrats
 */



ElectoralVoteChart.prototype.update = function(electionResult, colorScale){
    console.log(this);
    self=this;
    self.colorScale=colorScale;
    data=electionResult;
    console.log(data);
    year=parseFloat(data[0].Year);
    console.log(year);
    var data_entire;
    d3.csv("data/Year_Timeline_"+year+".csv", function(error,data){data_entire=data; console.log(data_entire)});
    console.log(data_entire);

    // ******* TODO: PART II *******
    console.log(data);
    console.log(data.length);
    console.log(typeof(data.length));

    // Here we select the svg //
    var ele_chart_svg=d3.select("#electoral-vote").select("svg");
    console.log(ele_chart_svg);
    var ele_chart_svg_width=ele_chart_svg.attr("width");
    var ele_chart_svg_height=ele_chart_svg.attr("height");

    // Get the number of the year //
    var year_number_d=parseFloat(data[0].D_EV_Total);
    var year_number_r=parseFloat(data[0].R_EV_Total);
    var year_number=Math.floor((year_number_d+year_number_r+1)/2);
    console.log(year_number);

    // Calculate the total of all the Total E_v//
        var bar_length=0;
        for (var i=0;i<data.length;i++){
            var y=parseFloat(data[i].Total_EV);
            bar_length=bar_length+y;
        }

    // Define a function to re-arrange the order of all the bars according to RD_difference //
    // We first extract all the states for which independent win //
    data_after_delete=[];
    data_to_delete=[];
    for (var k=0;k<data.length;k++){
        y=data[k];
        z=data[k].State_Winner;
        console.log(z);
        if (z=="I"){data_to_delete.push(y)}
        else {data_after_delete.push(y)}
    }
    console.log(data_after_delete);
    console.log(data_to_delete);

    var data_after_sort=data_after_delete.sort(function (a,b){
        a_diff=(parseFloat(a.RD_Difference));
        b_diff=(parseFloat(b.RD_Difference));
        if (a_diff>b_diff){return 1}
        else if(a_diff<b_diff) {return -1}
        else {return 0}});

    // We now break the entire data_after_sort into 2 distinct sets depending on assumed color: blue, red, which depends on RD_Difference //

    data_blue=data_after_sort.filter(function(d,i){if (d.RD_Difference<0){return true}});
    console.log(data_blue);
    data_red=data_after_sort.filter(function(d,i){if (d.RD_Difference>0){return true}});
    console.log(data_red);

    // Now we merge data_after_delete(sorted) and data_to_delete (green ones)//
    data_after_sort=data_to_delete.concat(data_after_sort);
    console.log(data_after_sort);

    // Now we write a program to check whether the data has been truly sorted successfully //
    var check_loc=[];
    for(i=0;i<data_after_sort.length;i++){
        y=data_after_sort[i].RD_Difference;
        check_loc.push(y);
    }
    // Check //
    console.log(check_loc);
    // Check whether the length of data_after_sort is the same that of data //
    console.log(data_after_sort.length==data.length);

    // Calculate the width of each small bar //
    var each_bar_length=[];
    for (var i=0;i<data_after_sort.length;i++){
        each_numeric_length=parseFloat(data_after_sort[i].Total_EV);
        each_svg_length=each_numeric_length/bar_length*self.svgWidth;
        each_bar_length.push(each_svg_length);
    }
    console.log(each_bar_length);
    console.log(each_bar_length.length==data_after_sort.length);


    // Now based on the width of each small bar, we determine the location of them by the method of cumulation //
    var each_bar_location=[0];
    var bar_location=0;
    for (var i=1;i<data_after_sort.length;i++){
        bar_location=bar_location+each_bar_length[i-1];
        each_bar_location.push(bar_location);
    }
    console.log(each_bar_location);
    console.log(each_bar_location.length==data_after_sort.length);
    console.log(data_after_sort);

    // Remove all the bars before enter //
    ele_chart_svg.selectAll("rect")
        .remove();


    // Append all the stack bars //
    var ele_chart_svg_bars=ele_chart_svg.selectAll("rect")
        .data(data_after_sort)
        .enter()
        .append("rect");

    //// Create all the bars in the svg ////
    ele_chart_svg_bars.attr("y",ele_chart_svg_height*7/11)
                      .attr("height",ele_chart_svg_height*3.5/11)
                      .attr("x",function(d,i){return each_bar_location[i]})
                      .attr("width",function(d,i){return each_bar_length[i]})
                      .attr("width",function(d,i){return each_bar_length[i]})
                      .attr("class","electoralVotes")
            .style("fill", function(d,i){
                if(d.State_Winner=="I"){return "green"}
                else{return colorScale(d.RD_Difference)}
            })



    // Remove path before enter //
    ele_chart_svg.selectAll("path")
        .remove();

    // Append a middle bar //
    ele_chart_svg.append("path")
                 .attr("d", function(d,i){return "M"+ele_chart_svg_width/2 +","+ ele_chart_svg_height/2+ "L"+ele_chart_svg_width/2+","+ele_chart_svg_height*1.1})
                 .style("stroke","black")
                 .style("stroke-width",5)
                 .classed("middlePoint",true)

    ele_chart_svg.selectAll("text")
        .remove();

    // Append the text for "Electoral Vote (blalala) ", which is a number //
    var ele_chart_svg_alltexts=ele_chart_svg.selectAll("text")
        .data([data_to_delete, data_blue, data_red, data_after_sort])  // top, blue, red, green //
        .enter()
        .append("text")
        .text(function(d,i){
           if (i==0) {return "Electoral Vote needed "+year_number+" to win"}
           else if (i==1) { var total=0;
               for (var j=0;j<data_after_sort.length;j++){
                   if (parseFloat(data_after_sort[j].RD_Difference)>0){break}
                   else {total=total+parseFloat(data_after_sort[j].Total_EV);}
               }
               return total;}
            else if(i==2) {total_republican=0;
               for (var j=0;j<data_after_sort.length;j++){
                   x=parseFloat(data_after_sort[j].RD_Difference);
                   if (x>0){total_republican=total_republican+parseFloat(data_after_sort[j].Total_EV)}
               }
               return total_republican;}
            else {if (data_to_delete.length==0){return} else{total_nonparty=0; for (var k=0;k<data_to_delete.length;k++){total_nonparty=total_nonparty+parseFloat(data_to_delete[k].Total_EV)}return total_nonparty}}
        })
        .attr("y",function(d,i){
            if (i==0) {return self.svgHeight/2-self.margin.top}
            else {return self.svgHeight/2}
        })
        .attr("x",function(d,i){
            if (i==0)  {return self.svgWidth/2}
            else if (i==1) { for(var j=0;j<data_after_sort.length;j++){
                if (data_after_sort[j].RD_Difference<0){break}
            }
                console.log(each_bar_location[j])
                return each_bar_location[j];}
            else if (i==2){return self.svgWidth}
            else {if (data_to_delete.length==0) {return} else{return 0}}

        })
        .attr("class", function(d,i){
            if (i==0){return "electoralVotesNote"}
            else if (i==1){return "electoralVoteText democrat"}
            else if (i==2){return "electoralVoteText republican"}
            else {if (data_to_delete.length==0){return } else {return "electoralVoteText independent"}}
        })




    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.

    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.


    function brushed() {
        var range_selected=d3.brushSelection(this);
        if (range_selected==null){return null}
        else {

            d3.select("#stateList").select("ul").remove();

            console.log(range_selected); // this would return an array of 2 //
            console.log(typeof(range_selected));
            console.log(range_selected.length);
            x_min=range_selected[0];
            x_max=range_selected[1];
            console.log(x_min);
            console.log(x_max);
            console.log(ele_chart_svg_bars);
            console.log(each_bar_location);
            console.log(each_bar_length);

            to_show_bars=[];

                for (var k=0;k<data_entire.length;k++){
                    if ((each_bar_length[k]+each_bar_location[k]>x_min) && (each_bar_location[k]<x_max))
                    {to_show_bars.push(each_bar_location[k])}
                }

            console.log(to_show_bars);
            console.log(to_show_bars.length);


            if (to_show_bars.length!=1){
            bar_min=to_show_bars[0];
            bar_max=to_show_bars[to_show_bars.length-1];}

            if (to_show_bars.length==1){bar_min=to_show_bars[0]; bar_max=to_show_bars[0];console.log(bar_max)}
            console.log(bar_min);
            console.log(bar_max);


            function left_control(){
            for (var k=0;k<data_entire.length;k++){
                if (each_bar_location[k]==bar_min){break}
            }
            return k;
            }

            function right_control(){
            for (var k=0;k<data_entire.length;k++){
                if (each_bar_location[k]==bar_max){break}
            }
            return k;
            }

            var i=left_control();
            var j=right_control();


            console.log(i);    // the first state that will appear //
            console.log(j);    // the last state that will appear //
            console.log(data_entire);
            states_to_show=[]; // Create an array comtaining all the names of the states //
            for (var k=i;k<j+1;k++){
                state_to_include=data_entire[k].State;
                states_to_show.push(state_to_include);
            }
            console.log(states_to_show);
            console.log(states_to_show.length);

            console.log(self.shiftChart);
            self.shiftChart.update(states_to_show);



        }
    }

    console.log(brushed());

    var brush = d3.brushX()
        .extent([[0, ele_chart_svg_height*6/11],
            [ele_chart_svg_width, ele_chart_svg_height]])
        .on('end', brushed);

    var brush_g=self.svg.append('g').attr('class', 'brush').call(brush);
    console.log(brush_g);
    console.log(brush);






};
