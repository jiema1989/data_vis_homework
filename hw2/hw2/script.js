/*globals alert, document, d3, console*/
// These keep JSHint quiet if you're using it (highly recommended!)
//THE PART TO GET X AND Y COORDINTAES OF POINTS///////////////




function staircase() {
    var allrects = document.getElementsByTagName("rect");
    var x=0;
    for ( ;x < 11; ) {
        allrects[x].setAttribute("height", x* 20);
    x=x+1;
}
}


function update(error, data) {
    if (error !== null) {
        alert("Couldn't load the dataset!");
    } else {
        // D3 loads all CSV data as strings;
        // while Javascript is pretty smart
        // about interpreting strings as
        // numbers when you do things like
        // multiplication, it will still
        // treat them as strings where it makes
        // sense (e.g. adding strings will
        // concatenate them, not add the values
        // together, or comparing strings
        // will do string comparison, not
        // numeric comparison).

        // We need to explicitly convert values
        // to numbers so that comparisons work
        // when we call d3.max()
        data.forEach(function (d) {
            d.a = parseInt(d.a);
            d.b = parseFloat(d.b);
        });
    }

    // Set up the scales
    var aScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.a;
        })])
        .range([0, 150]);
    var bScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.b;
        })])
        .range([0, 150]);
    var iScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 110]);



    // ****** TODO: PART III (you will also edit in PART V) ******

    // TODO: Select and update the 'a' bar chart bars
   var leftbarsvg = d3.select("#leftverticalbars").select("g");
    var leftbars=leftbarsvg.selectAll("rect").data(data);
    var newleftbars=leftbars.enter().append("rect") 
                             .attr("width",10)
                .attr("x", function(d, i) {
                return (i+1)*10;
                })
                .attr("height", function(d, i) {
                return aScale(d.a);
                });
                                       

    leftbars.exit()
        .attr("opacity",1)
        .transition()
        .duration(1500)
        .attr("opacity", 0)
        .remove();

            leftmerge=newleftbars.merge(leftbars);

    leftmerge
                .transition()
                .duration(1500)                
                .attr("width",10)
                .attr("x", function(d, i) {
                return (i+1)*10;
                })
                .attr("height", function(d, i) {
                return aScale(d.a);
                });

         
                leftmerge
        .on("mouseenter", function(d) {
            d3.select(this).style("fill", "red");
        })
        .on("mouseleave", function(d) {
            d3.select(this).style("fill", "steelblue");
        });

    // TODO: Select and update the 'b' bar chart bars
var rightbarsvg = d3.select("#rightverticalbars").select("g");
    var rightbars=rightbarsvg.selectAll("rect").data(data);
    var newrightbars=rightbars.enter().append("rect") 
                                           
                                              .attr("width",10)
                                              .attr("x", function(d,i){return (i+1)*10})
                                              .attr("height", function(d,i){return bScale(d.b)});

  rightbars.exit()
        .attr("opacity",1)
        .transition()
        .duration(1500)
        .attr("opacity", 0)
        .remove();

        rightmerge=newrightbars.merge(rightbars);
        rightmerge
                .transition()
                .duration(1500)
                
                .attr("width",10)
                .attr("x", function(d, i) {
                return (i+1)*10;
                })
                .attr("height", function(d, i) {
                return bScale(d.b);
                });

        rightbars
        .on("mouseenter", function(d) {
            d3.select(this).style("fill", "green");
        })
        .on("mouseleave", function(d) {
            d3.select(this).style("fill", "steelblue");
        });

    // TODO: Select and update the 'a' line chart path using this line generator
    var aLineGenerator = d3.line()
        .x(function (d, i) {
            return iScale(i);
        })
        .y(function (d) {
            return aScale(d.a);
        });
 var leftlines = d3.select("#leftlines").select("path").data(data);
     leftlines.transition()
                  .duration(1500)
                 .attr("d", aLineGenerator(data));

    // TODO: Select and update the 'b' line chart path (create your own generator)

 var bLineGenerator = d3.line()
        .x(function (d, i) {
            return iScale(i);
        })
        .y(function (d) {
            return bScale(d.b);
        });


var rightlines= d3.select("#rightlines").selectAll("lines")
        rightlines
            .transition()
            .duration(1500)
            rightlines.exit().remove();

    // TODO: Select and update the 'a' area chart path using this line generator
    var aAreaGenerator = d3.area()
        .x(function (d, i) {
            return iScale(i);
        })
        .y0(0)
        .y1(function (d) {
            return aScale(d.a);
        });
var areaA = d3.select("#leftareachart").select("path").data(data);
    areaA.transition()
        .duration(1500)
        .attr("d", aAreaGenerator(data));

    // TODO: Select and update the 'b' area chart path (create your own generator)
  var bAreaGenerator = d3.area()
        .x(function (d, i) {
            return iScale(i);
        })
        .y0(0)
        .y1(function (d) {
            return bScale(d.b);
        });
var areaB = d3.select("#rightareachart").select("path").data(data);
    areaB.transition()
        .duration(1500)
        .attr("d", bAreaGenerator(data));

    // TODO: Select and update the scatterplot points
var aa=d3.select("#points")
                .select("g");
var points=aa.selectAll("circle")    
                .data(data);

var newpoints=points.enter().append("circle")
        .attr("cx", function(d,i){return aScale(d.a)})
         .attr("cy", function(d,i){return bScale(d.b)})
         .attr("r",5);
 
         points.exit()
                    .attr("opacity",1)
                    .transition()
                    .duration(1500)
                    .attr("opacity",0)
                    .remove();

        mergepoints=newpoints.merge(points);
        mergepoints
                            .transition()
                            .duration(1500)
                            .attr("cx",function(d,i){return aScale(d.a)})
                            .attr("cy",function(d,i) {return bScale(d.b)});

        


// TO GET COORDINATES ////
//document.getElementById("cir1").addEventListener("click",myFunction1)
//document.getElementById("cir2").addEventListener("click",myFunction2)
//document.getElementById("cir3").addEventListener("click",myFunction3)
//document.getElementById("cir4").addEventListener("click",myFunction4)
//document.getElementById("cir5").addEventListener("click",myFunction5)
//document.getElementById("cir6").addEventListener("click",myFunction6)
//document.getElementById("cir7").addEventListener("click",myFunction7)
//document.getElementById("cir8").addEventListener("click",myFunction8)
//document.getElementById("cir9").addEventListener("click",myFunction9)
//document.getElementById("cir10").addEventListener("click",myFunction10)
//document.getElementById("cir11").addEventListener("click",myFunction11)
//
//
//function myFunction1(){console.log(document.getElementById("cir1").cx)}
//function myFunction2(){console.log(document.getElementById("cir2"))}
//function myFunction3(){console.log(document.getElementById("cir3"))}
//function myFunction4(){console.log(document.getElementById("cir4"))}
//function myFunction5(){console.log(document.getElementById("cir5"))}
//function myFunction6(){console.log(document.getElementById("cir6"))}
//function myFunction7(){console.log(document.getElementById("cir7"))}
//function myFunction8(){console.log(document.getElementById("cir8"))}
//function myFunction9(){console.log(document.getElementById("cir9"))}
//function myFunction10(){console.log(document.getElementById("cir10"))}
//function myFunction11(){console.log(document.getElementById("cir11"))}

mergepoints
    .on("click", function(d)
        {console.log("x coordinate is "+d.a+"; "+ "y coordinate is " + d.b)});

    // ****** TODO: PART IV ******
}

function changeData() {
    // // Load the file indicated by the select menu
    var dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        randomSubset();
    }
    else{
        d3.csv('data/' + dataFile + '.csv', update);
    }
}

function randomSubset() {
    // Load the file indicated by the select menu,
    // and then slice out a random chunk before
    // passing the data to update()
    var dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        d3.csv('data/' + dataFile + '.csv', function (error, data) {
            var subset = [];
            data.forEach(function (d) {
                if (Math.random() > 0.5) {
                    subset.push(d);
                }
            });
            update(error, subset);
        });
    }
    else{
        changeData();
    }
}

window.onload=changeData;