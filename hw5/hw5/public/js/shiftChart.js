
/**
 * Constructor for the ShiftChart
 */
function ShiftChart(){
    var self = this;
    console.log(self);
    self.init();
};

/**
 * Initializes the svg elements required for this chart;
 */
ShiftChart.prototype.init = function(){
    var self = this;
    console.log(self);
    self.divShiftChart = d3.select("#shiftChart").classed("sideBar", true);
    console.log(self.divShiftChart);
};

/**
 * Creates a list of states that have been selected by brushing over the Electoral Vote Chart
 *
 * @param selectedStates data corresponding to the states selected on brush
 */
ShiftChart.prototype.update = function(selectedStates){
    var self = this;
    console.log(self);
    data=selectedStates;
    console.log(data);

    // ******* TODO: PART V *******
    //Display the names of selected states in a list

    //Select the tspan element and append list elements inside it //

    //Select the tspan element and append list elements inside it //
    var states_ul=d3.select("#stateList");
    var states_li= states_ul.append("ul")
        .selectAll("li")
        .data(states_to_show)
        .enter()
        .append("li");
    console.log(states_li);


    var states_texts=states_li.append("text")
        .attr("y", function(d,i){return 20*(i+1)})
        .attr("x",40)
        .text(function(d){return d})
        .classed("brushtext",true);




    //******** TODO: PART VI*******
    //Use the shift data corresponding to the selected years and sketch a visualization
    //that encodes the shift information

    //******** TODO: EXTRA CREDIT I*******
    //Handle brush selection on the year chart and sketch a visualization
    //that encodes the shift informatiomation for all the states on selected years

    //******** TODO: EXTRA CREDIT II*******
    //Create a visualization to visualize the shift data
    //Update the visualization on brush events over the Year chart and Electoral Vote Chart

};
