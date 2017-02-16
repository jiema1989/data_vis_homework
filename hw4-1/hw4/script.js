/** Global var to store all match data for the 2014 Fifa cup */
var teamData;

// TO COUNT HOW MANY TIME EACH  HAS BEEN SELECTED (Global Variable) //
var count=[];
for (j=0;j<32;j++){
x=0;
count.push(x)
}
console.log(count);
console.log(count.length);

//TO COUNT HOW MANY TIMES EACH HEADER HAS BEEN SELECTED (Global Variable )//
var count_header={"Team":0, "Goals":0, "Round/Result":0, "Wins": 0, "Losses": 0, "Total Games": 0};
console.log(count_header)

/** Global var for list of all elements that will populate the table.*/
var tableElements;


/** Variables to be used when sizing the svgs in the table cells.*/
var cellWidth = 70,
    cellHeight = 20,
    cellBuffer = 15,
    barHeight = 20;

/**Set variables for commonly accessed data columns*/
var goalsMadeHeader = 'Goals Made',
    goalsConcededHeader = 'Goals Conceded';

/** Setup the scales*/
var goalScale = d3.scaleLinear()
    .range([cellBuffer, 2 * cellWidth - cellBuffer]);

/**Used for games/wins/losses*/
var gameScale = d3.scaleLinear()
    .range([0, cellWidth - cellBuffer]);

/**Color scales*/
/**For aggregate columns*/
var aggregateColorScale = d3.scaleLinear()
    .range(['#ece2f0', '#016450']);

/**For goal Column*/
var goalColorScale = d3.scaleQuantize()
    .domain([-1, 1])
    .range(['#cb181d', '#034e7b']);

/**json Object to convert between rounds/results and ranking value*/
var rank = {
    "Winner": 7,
    "Runner-Up": 6,
    'Third Place': 5,
    'Fourth Place': 4,
    'Semi Finals': 3,
    'Quarter Finals': 2,
    'Round of Sixteen': 1,
    'Group': 0
};
console.log(rank)
console.log(rank["Semi Finals"])


//For the HACKER version, comment out this call to d3.json and implement the commented out
// d3.csv call below.




// // ********************** HACKER VERSION ***************************
// /**

d3.csv("data/fifa-matches.csv", function (error, csvData) {

    // ******* TODO: PART I *******
teamData = d3.nest()
.key(function (d) {
      return d.Team;
        })
.rollup(function (leaves) {
var goals_Made =d3.sum(leaves, function(d){return d["Goals Made"]});
var goals_Lost =d3.sum(leaves, function(d){return d["Goals Conceded"]});
var goals_Difference=d3.sum(leaves,function(d){return d["Delta Goals"]})
var ranking =d3.max(leaves, function(d){return rank[d.Result]});
var label;
for(var x in leaves) {
if(rank[leaves[x].Result] ==ranking) {label = leaves[x].Result;}   //rank was defined before to convert between str and num //
}

var games = leaves.map(function(d) {
                    var value = {"Goals Made": d["Goals Made"],
                             "Goals Conceded": d["Goals Conceded"],
                             "Delta Goals": [],
                             "Wins": [],
                             "Losses": [],
                             "type": "game",
                             "Result": {"label": d.Result, "ranking": rank[d.Result]},
                             "Opponent": d.Team}
 return {'key': d.Opponent, 'value': value}
})
.sort(function(a, b) {
                if (a.value.Result.ranking > b.value.Result.ranking) {return -1}
                else if (a.value.Result.ranking == b.value.Result.ranking) {return 0;} 
                else if (a.value.Result.ranking<b.value.ranking){return -1};
                });

var all_Attribute = {"Goals Made": goals_Made,
            "Goals Conceded": goals_Lost,
            "Delta Goals": goals_Difference,
            "games": games,
            "Result": {"label": label, "ranking": ranking},
            "TotalGames": leaves.length,
            "type": "aggregate",
            "Wins": d3.sum(leaves,function(l) {return l.Wins}),
            "Losses": d3.sum(leaves,function(l){return l.Losses}),
            "games": games
            };
return all_Attribute
        
})
.entries(csvData);


console.log(teamData);

createTable();
updateTable();

});

// // ********************** END HACKER VERSION ***************************

/**
 * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
 *
 */
d3.csv("data/fifa-tree.csv", function (error, csvData) {

    //Create a unique "id" field for each game
    csvData.forEach(function (d, i) {
        d.id = d.Team + d.Opponent + i;
    });

    createTree(csvData);
});

/**
 * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
 * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
 *
 */
function createTable() {
tableElements=teamData;
// ******* TODO: PART II *******
var goalScaleMin=0;
var goalScaleMax=d3.max(teamData,function(d,i){return d.value["Goals Made"]});
/* Setup the domain for goalScale */
goalScale.domain([goalScaleMin, goalScaleMax]);
/* Create X-axis at the top of that column */
var xAxis=d3.axisTop(goalScale);
      
d3.select("#goalHeader")
        .append('svg')
        .attr("width",2*cellWidth)
        .attr("height",cellHeight)
        .append('g')
        .attr('transform', 'translate(0, ' + (cellHeight-1) + ')')
        .call(xAxis);

// ******* TODO: PART V *******
var get_teams_click=d3.select("#tdteams")
var get_rr_click=d3.select("#tdrr")
var get_goals_click=d3.select("#tdgoals")
var get_wins_click=d3.select("#tdwins")
var get_losses_click=d3.select("#tdlosses")
var get_totalgames_click=d3.select("#tdtotalgames")
console.log(get_wins_click)
console.log(get_losses_click)
console.log(get_totalgames_click)
console.log(get_teams_click)
console.log(get_rr_click)
console.log(get_goals_click)

get_wins_click.on("click", function() {sortFunction(d3.select(this).text())})
get_losses_click.on("click", function() {sortFunction(d3.select(this).text())})
get_totalgames_click.on("click",function() {sortFunction(d3.select(this).text())})
get_teams_click.on("click",function() {sortFunction(d3.select(this).text())})
get_goals_click.on("click",function(){sortFunction(d3.select(this).text())})
get_rr_click.on("click",function(){sortFunction(d3.select(this).text())})


}


/**
 * Updates the table contents with a row for each element in the global variable tableElements.
 *
 */
function updateTable() {

// ******* TODO: PART III *******
var MatchTable=d3.select("#matchTable");
var matchTablebody=MatchTable.select("tbody");
console.log(tableElements);
var tableRows=matchTablebody.selectAll("tr").data(tableElements).enter().append("tr")
                        .on("click", function(d,i){
                          if (d.value.type=="aggregate"){updateList(i,d3.select(this))}
                          else {}
                          })
                        .on("mouseover", function(d,i){
                              updateTree(tableElements[i])
                        })
                        .on('mouseout', function() { 
                          clearTree() 
                        });
console.log(tableRows)
console.log(teamData)

// TO CREATE THE TEAMNAME COLUMN OF THE TABLE //
var thFirstcolumn=tableRows.selectAll("th")
                                                .data(function(d){
                                                  return [{'type': d.value.type, 'value': d.key}]
                                                })
                                                .enter()
                                                .append("th")

// Set attribute for the first column, either "aggregate" or "team" //                                                
thFirstcolumn.attr("class", function(d){return d.type});
console.log(thFirstcolumn)                                               

//append texts to the first column //
var firstColumntext=thFirstcolumn.append("text")
                      .text(function(d,i){if (d.type=='aggregate') {return d.value} else {return 'x'+d.value}})
console.log(firstColumntext)

// For the rest of all th columns after the first clumn "team" is done //
var td=tableRows.selectAll("td")
           .data(function(d){
            return[
                       {'type':d.value.type,'vis':'goals','value':[d.value[goalsMadeHeader], d.value[goalsConcededHeader], d.value['Delta Goals']]},
                       {'type':d.value.type,'vis':'text2','value':d.value.Result.label},
                       {'type': d.value.type,'vis':'barWins','value':d.value.Wins},
                       {'type':d.value.type,'vis':'barLosses','value':d.value.Losses},
                       {'type':d.value.type,'vis':'barTotal','value':d.value.TotalGames}
            ]
           })
           .enter()
           .append("td")
console.log(td)


// TO CREATE THE ROUND COLUMN OF THE TABLE //
var secondColumn=td.filter(function(d){return d.vis=='text2'});
secondColumn.attr("class","column2")
console.log(secondColumn);
var secondColumntext=secondColumn.append("text")
                         .text(function(d){return String(d.value)+" "+" "+" "});
console.log(secondColumntext)


//TO CREATE THE WINS BARCHART OF THE TABLE //
var winsColumn=td.filter(function(d){return d.vis=='barWins'});
console.log(winsColumn);
//domain setup //
gameScale.domain([0,6]);
aggregateColorScale.domain([0,6]);
//append svg//
var winsColumnSvg=winsColumn.append("svg")
             .attr("width",cellWidth)
             .attr("height",cellHeight)
//append rect//
winsColumnSvg.append("rect")
             .attr("width", function(d){return gameScale(d.value)})
             .attr("x",0)
             .attr("height", cellHeight)
             .style("fill", function(d){return aggregateColorScale(d.value)});
//append text//
winsColumnSvg.append("text")
                          .text(function(d,i){return d.value})
                          .attr("y",cellHeight-3.5)
                          .attr("x", function(d){return gameScale(d.value)})
                          .attr("text-anchor","end")
                          .style("font-size",15)
                          .style("opacity",function(d){return d.value/1.2})
                          .style("fill","white");

//TO CREATE THE LOSSES BARCHART OF THE TABLE //
var lossesColumn=td.filter(function(d){return d.vis=='barLosses'});
console.log(lossesColumn);
//domain setup //
gameScale.domain([0,3]);
aggregateColorScale.domain([0,3]);
//append svg//
var lossesColumnSvg=lossesColumn.append("svg")
             .attr("width",cellWidth)
             .attr("height",cellHeight)
//append rect//
lossesColumnSvg.append("rect")
             .attr("width", function(d){return gameScale(d.value)})
             .attr("height", cellHeight)
             .style("fill", function(d){return aggregateColorScale(d.value)});
//append text//
lossesColumnSvg.append("text")
                          .style("fill",'white')
                          .text(function(d,i){return d.value})
                          .attr("y",cellHeight-3.5)
                          .attr("x", function(d){return gameScale(d.value)})
                          .attr("text-anchor","end")
                          .style("font-size",15)
                          .style("opacity",function(d){return d.value/1.5});



//TO CREATE THE TOTALGAMES BARCHART OF THE TABLE //
var totalColumn=td.filter(function(d){return d.vis=='barTotal'});
console.log(totalColumn);
//domain setup //
gameScale.domain([0,7]);
aggregateColorScale.domain([0,7]);
//append svg//
var totalColumnSvg=totalColumn.append("svg")
             .attr("width",cellWidth)
             .attr("height",cellHeight)
//append rect//
totalColumnSvg.append("rect")
             .attr("width", function(d){if (d.value!=undefined){return gameScale(d.value)} else {return 0}})
             .attr("height", cellHeight)
             .style("fill", function(d){if (d.value!=undefined){return aggregateColorScale(d.value)} else {return "none"}});
//append text//
totalColumnSvg.append("text")
                          .style("fill",'white')
                          .text(function(d,i){if (d.value!=undefined){return d.value} else {return ''}})
                          .attr("y",cellHeight-3.5)
                          .attr("x", function(d){if (d.value!=undefined){return gameScale(d.value)}})
                          .attr("text-anchor","end")
                          .style("font-size",15)
                          .style("opacity",function(d){if (d.value!=undefined){return d.value/1.5} else {return 0}});


//TO CREATE THE GOALS CHART OF THE TABLE //
var goalScaleMin=0;
var goalScaleMax=d3.max(teamData,function(d,i){return d.value["Goals Made"]});
goalScale.domain([goalScaleMin, goalScaleMax]);
var goalsColumn=td.filter(function(d){return d.vis=="goals"})
console.log(goalsColumn);
var goalsSvg=goalsColumn.append("svg")
                    .attr("width",2*cellWidth)
                    .attr("height",cellHeight);


goalsSvg.append("rect")
               .attr("x",function(d,i){if (d.value[0]>d.value[1]){return goalScale(d.value[1])} else {return goalScale(d.value[0])}})
               .attr("width",function(d,i){
                return Math.abs(goalScale(d.value[0])-goalScale(d.value[1]));
                })
               .attr("height",function(d,i){
                if (d.type=="aggregate"){return 10}
                else {return 5}

               })
               .attr("y", function(d,i){
                if (d.type=="aggregate"){return 5}
                  else {return 7.5}

               })
               .style("fill",function(d,i){if (d.value[0]>d.value[1]){return "steelblue"} else {return "red"}})
               .attr("class","goalBar");
               

goalsSvg.append("circle")
                    .attr("cx", function(d,i){return goalScale(d.value[0])})
                    .attr("cy",cellHeight/2)
                    .attr("r",5)
                    .style("stroke-width",2)
                    .style("stroke",function(d,i){
                      if (d.type=="aggregate"){
                      return goalColorScale(d.value[0])}
                      else {return goalColorScale(d.value[0])}

                    })
                    .style("fill", function(d,i){
                     if (d.type=='aggregate') {
                      if (d.value[0]!=d.value[1])
                      {return goalColorScale(d.value[0])}
                      else {return "grey"}
                    }
                    else {return 'white'}
                    })
                  

goalsSvg.append("circle")
                    .attr("cx", function(d,i){return goalScale(d.value[1])})
                    .attr("cy",cellHeight/2)
                    .attr("r",5)
                    .style("stroke-width",2)
                    .style("stroke",function(d,i){
                      if (d.type=="aggregate"){
                        if (d.value[0]==d.value[1]){
                      return "grey"}
                      else {return goalColorScale(-d.value[1])}
                    }
                      else{
                      if (d.value[0]==d.value[1]) 
                        {return 'grey'}
                      else {return "red"}
                    }
                    
                    })
                    .style("fill", function(d,i){
                     if (d.type=='aggregate') {
                      if (d.value[0]!=d.value[1])
                      {return goalColorScale(-d.value[1])}
                    else {return "grey"}
                    }
                    else {return 'white'}
                    })

};




/**
 * Collapses all expanded countries, leaving only rows for aggregate values per country.
 *
 */
function collapseList() {
for (k=0;k<teamData.length;k++){
count[k]=0;
}

var x=tableElements; 
var xlength=x.length; // define the length of tableElements //
var y=[];  //create an empty array and we begin to push "aggregate" teams in //

// search for elements whose first attribute is 'team' (aggregate) //
for (j=0;j<xlength;j++){
      if (x[j].value.type=="aggregate"){
        y.push(x[j])
      }
}

// pass //
tableElements=y;
//remove current table //
d3.select("#matchTable").select("tbody").selectAll("tr").remove();
// generate a new one consisting only teams, no games //
updateTable();

}

/**
 * Updates the global tableElements variable, with a row for each row to be rendered in the table.
 *
 */
function updateList(i,qq) {
    // ******* TODO: PART IV *******
//TO GET THE INCOMING TEAM NUMBER IN THE ORIGINAL TEAMDATA///    

console.log(tableElements[i].key);
var r=0;
for (l=0;l<32;l++){
if (teamData[l].key==tableElements[i].key)
r=l;
}

//INCREASE THE COUNT OF THE CORRESPONDING TEAM BY 1//
count[r]=count[r]+1;
console.log(count);

// TO VERIFY WHTHER THE SELECTED TEAM MOD 2 ==1 !!!///    
if (count[r]%2==1) {
console.log(tableElements);

//////////THIS IS TO EXPAND THE ROWS!!!!///////
var toAdd=tableElements[i];
console.log(toAdd);

var toAdd_value_games=toAdd.value.games;
console.log(toAdd_value_games);
//to compute how many games the selected games played during the cup //
var num_of_games=toAdd_value_games.length;

// reserve all the team data before the selected team //
var set=[];
for (j=0;j<i+1;j++){
  x=tableElements[j];
  set.push(x);
}
console.log(set);
console.log(set.length);

//append the data of the games played by the selected team //
for (k=0;k<num_of_games;k++){
x=toAdd_value_games[k];
set.push(x);
}
console.log(set);
console.log(set.length);

//finally append the rest of the original team data to beneath the selected 
/* to form the whole table */
for (m=i+1;m<tableElements.length;m++){
x=tableElements[m];
set.push(x);
}
console.log(set);
console.log(set.length);
tableElements=set;
console.log(tableElements);
// Now that the list has been updated to the newest, including games, we remove the previous table 
//elements and then updateTable()
d3.select("#matchTable").select("tbody").selectAll("tr").remove();
updateTable();

}

//ELSE FOR WHEN THE CURRENT TEAM IS BEING RE-CLICKED //
// BASICALY WE PERFORM THE INVERSE OPERATION AS OPPOSED TO THE ADDING 
//GAMES //
else{
var set=[];
for (j=0;j<i+1;j++){
x=tableElements[j];
set.push(x);
}

if (tableElements[i+1].value.type=="game"){
var toEliminate=tableElements[i].value.games;
var num_of_toEliminate=toEliminate.length;
var m=num_of_toEliminate;

for (j=i+m+1;j<tableElements.length;j++){
  x=tableElements[j];
  set.push(x);
}

tableElements=set;
d3.select("#matchTable").select("tbody").selectAll("tr").remove();
updateTable();
}
else { }

}


};


// THE SORT FUNCTION WILL BE IMPLEMENTED ONCE THE THREE ARE CLICKED//
function  sortFunction(z){
 //first fold the list to exclude all the `games' content // 
collapseList();
//z is the text of the head that is being selected: Total Games, Wins or Losses, etc //
console.log(z)
console.log(tableElements);

count_header[z]=count_header[z]+1;
console.log(count_header)

if (count_header[z]%2==1){
x=tableElements;
xleng=x.length;

if (z=="Team"){
var teamname=[];
for (j=0;j<tableElements.length;j++){
a=tableElements[j].key;
teamname.push(a);
}
console.log(teamname)
teamname=teamname.sort();
console.log(teamname)

var set_sort_team=[];

for (k=0;k<tableElements.length;k++){
  for (j=0;j<tableElements.length;j++){
    if (tableElements[j].key==teamname[k]){set_sort_team.push(tableElements[j])}
  }
}
console.log(set_sort_team)
after_sort_table=set_sort_team;
}


else{
var after_sort_table=x.sort(function(a,b){
// Convert the RR labels to Numbers to be commparable //  
a_rr_label=a.value.Result.label;
b_rr_label=b.value.Result.label;
a_rr_value=rank[a_rr_label];
b_rr_value=rank[b_rr_label];

// Define all the return functions here //
  if (z=="Total Games"){return -a.value.TotalGames+b.value.TotalGames}
  else if (z=="Wins"){return -a.value.Wins+b.value.Wins}
  else if (z=="Losses") {return -a.value.Losses+b.value.Losses}
  else if (z=="Round/Result"){return -a_rr_value+b_rr_value}
  else if (z=="Goals")  {return -a.value["Goals Made"]+b.value["Goals Made"]}

})}

console.log(after_sort_table)
tableElements=after_sort_table;
d3.select("#matchTable").select("tbody").selectAll("tr").remove();
updateTable();

}


else{
  x=tableElements;
xleng=x.length;

if (z=="Team"){
var teamname=[];
for (j=0;j<tableElements.length;j++){
a=tableElements[j].key;
teamname.push(a);
}
console.log(teamname)
teamname=teamname.sort();
console.log(teamname)

var set_sort_team=[];

for (k=31;k>-1;k--){
  for (j=0;j<tableElements.length;j++){
    if (tableElements[j].key==teamname[k]){set_sort_team.push(tableElements[j])}
  }
}
console.log(set_sort_team)
after_sort_table=set_sort_team;
}
else{
var after_sort_table=x.sort(function(a,b){
// Convert the RR labels to Numbers to be commparable //  
a_rr_label=a.value.Result.label;
b_rr_label=b.value.Result.label;
a_rr_value=rank[a_rr_label];
b_rr_value=rank[b_rr_label];

// Define all the return functions here //
  if (z=="Total Games"){return a.value.TotalGames-b.value.TotalGames}
  else if (z=="Wins"){return a.value.Wins-b.value.Wins}
  else if (z=="Losses") {return a.value.Losses-b.value.Losses}
  else if (z=="Round/Result"){return a_rr_value-b_rr_value}
  else if (z=="Goals")  {return a.value["Goals Made"]-b.value["Goals Made"]}

})}

console.log(after_sort_table)
tableElements=after_sort_table;
d3.select("#matchTable").select("tbody").selectAll("tr").remove();
updateTable();

}

}







/**
 * Creates a node/edge structure and renders a tree layout based on the input data
 *
 * @param treeData an array of objects that contain parent/child information.
 */
function createTree(treeData) {
var svg=d3.select("svg");
var width=svg.attr("width");
console.log(width);
var height=svg.attr("height");
console.log(height);

var bound = d3.select('#tree').node().parentNode.getBoundingClientRect();
var width = bound.width;
var height = bound.height;
console.log(bound);
console.log(width);
console.log(height);

var thetree = d3.select('#tree');
thetree.attr('transform',  'translate(' + 90 + ',' + 0 + ')');
var stratify = d3.stratify()
        .id(function(d) { return d.id; })
        .parentId(function(d) {
                    var x =  treeData[d.ParentGame];
                    if (x!=undefined){return x.id} else {return ""};
});
console.log(stratify)
var root=stratify(treeData);
var d3_tree=d3.tree();
d3_tree.size([height,width-200]);
d3_tree(root);

// Creation of Nodes //
var nodes = thetree.selectAll('.node')
                  .data(root.descendants())
                  .enter().append('g')
                  .attr("class",function(d) {
                  if (d.data.Wins=='1'){return "winner"}
                  if (d.data.Wins=='0'){return "node"} })
                  .attr("id", function(d,i){return d.id})

                  

nodes.attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')'; })
          .append('circle')
          .attr('r', 6);

nodes.append('text')
        .text(function(d) { return d.data.Team; })
        .attr('dy', 4)
        .attr('x', function(d) { if (d.children==undefined){return 12} else{return -15}})
        .style('text-anchor', function(d) {if (d.children==undefined) {return 'start'} else {return 'end'}  })


var links = thetree.selectAll(".link")
.data(root.descendants().slice(1))
.enter().append("path")
.attr("class", "link")
.attr("d", function(d) {
        return "M" + d.y + "," + d.x
            + "C" + (d.y + d.parent.y) / 2 + "," + d.x
            + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
            + " " + d.parent.y + "," + d.parent.x;
      })
  .attr("id", function(d,i){return d.id});

console.log(nodes);
console.log(typeof(nodes));
//d3.select("#tree").selectAll("g")
  //                          .attr("id", )

};

/**
 * Updates the highlighting in the tree based on the selected team.
 * Highlights the appropriate team nodes and labels.
 *
 * @param team a string specifying which team was selected in the table.
 */
function updateTree(row) {
console.log(row);
var x=row;
console.log(x);
if (x.value.type=="aggregate"){
var nodes_to_stay=d3.select("#tree").selectAll("g").filter(function(){
return d3.select(this).text()==x.key
})
console.log(nodes_to_stay);
nodes_to_stay.selectAll("text").classed("selectedLabel",true)

d3.select("#tree").selectAll("path").filter(function(d){
if (d["id"].indexOf(x.key)>=0 && d.data["Wins"]==1 && d.data["Team"]== x.key)
  {return true}
})
.classed("selected",true)


}

else {
a=x.key; // name of first team//
b=x.value.Opponent; // name of the second team //
console.log(a)
console.log(b)
a_b=String(a)+String(b);
console.log(a_b);
b_a=String(b)+String(a);
console.log(b_a);

var nodes_to_stay=d3.select("#tree").selectAll("g").filter(function(){
var y=d3.select(this).attr('id');
console.log(y);
for (j=0;j<2;j++){
 if (typeof(y[-j])=="number"){y.pop}
}
console.log(y)
console.log(a_b)
return y==a_b;
})

console.log(nodes_to_stay);
nodes_to_stay.selectAll("text").classed("selectedLabel",true)



}



}

/**
 * Removes all highlighting from the tree.
 */
function clearTree() {
d3.select('#tree')
    .selectAll('text')
    .classed('selectedLabel', false);

d3.select('#tree')
    .selectAll('path')
    .classed('selected', false);




    // ******* TODO: PART VII *******
    

}



