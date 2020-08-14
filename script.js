
//getting data for making county map
const req1 = new XMLHttpRequest();
req1.open("GET","https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json",true)
req1.send()
req1.onload=function(){
    let jsonCounty = JSON.parse(req1.responseText);     //data for county map
    //getting data for education details for each county
    const req2 = new XMLHttpRequest();
    req2.open("GET","https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json",true)
    req2.send()
    req2.onload=function(){
        const jsonEducation = JSON.parse(req2.responseText);    //data for education
        const w = 1000;
        const h = 700;
        const svg = d3.select(".container-fluid")   
                        .append("svg")
                        .attr("width",w)
                        .attr("height",h);

        const legend = svg.append("g")
                        .attr("id","legend");

        const tooltip = d3.select(".container-fluid")
                        .append("div")
                        .attr("id","tooltip")

        let path = d3.geoPath();    //draws path 
        
        svg.selectAll("path")
            .data(
                topojson.feature(jsonCounty,jsonCounty.objects.counties)    //using topojson library with county topography data
                        .features
            )
            .enter()
            .append("path")     
            .attr("d",path)
            .attr("class","county")
            .attr("data-fips",(d)=>(d.id))
            .attr("data-education",(d)=>{
                let eduId = null;       
                jsonEducation.forEach((e)=>{        
                     if(e.fips==d.id){      //matching id of county map with fips of education map
                         eduId= e;          //if id and fips are same return the object from education
                     }
                 }) 
                 return eduId.bachelorsOrHigher;    //getting percentage
            })
            .style("fill",(d)=>{
                let eduId = null;
               jsonEducation.forEach((e)=>{
                    if(e.fips==d.id){
                        eduId= e;
                    }
                }) 
                return getColor(parseInt(eduId.bachelorsOrHigher));  //getting color based on number of percentage and filling it in current county
            })
            .on("mouseover",(d,i)=>{
                d3.select(event.currentTarget)      //highlight current county
                    .style("stroke","blue")
                    .style("stroke-width","3px")
                    let eduId = null;
                    jsonEducation.forEach((e)=>{
                         if(e.fips==d.id){          //finds object in education with same fips as id in county
                             eduId=e;       
                         }
                     }) 
                tooltip.style("left",event.pageX-450+"px")   //adjust position of tooltip
                        .style("top",event.pageY-130+"px")
                        .style("display","inline-block")
                        .style("background-color","black")
                        .style("color","white")
                        .style("opacity","0.8")
                        .html("County : " + eduId.area_name +
                            "<br> State: " + eduId.state +
                            "<br> Bachelor's or higher degree: "+eduId.bachelorsOrHigher+" %")
                        .attr("data-education",eduId.bachelorsOrHigher)
            })
            .on("mouseout",()=>{
                d3.select(event.currentTarget)  //remove highlight
                    .style("stroke","black")
                    .style("stroke-width","1px")
                tooltip.style("display","none") //remove tooltip
            })
        
     //add rects to the legend 
     legend.append("rect")
            .attr("x",w-480)
            .attr("y",h-75)
            .attr("width",50)
            .attr("height",20)
            .style("fill","#C3F2F5")
     legend.append("rect")
            .attr("x",w-430)
            .attr("y",h-75)
            .attr("width",50)
            .attr("height",20)
            .style("fill","#9BE9EE")
     legend.append("rect")
            .attr("x",w-380)
            .attr("y",h-75)
            .attr("width",50)
            .attr("height",20)
            .style("fill","#73E0E7")
     legend.append("rect")
            .attr("x",w-330)
            .attr("y",h-75)
            .attr("width",50)
            .attr("height",20)
            .style("fill","#37D4DE")
     legend.append("rect")
            .attr("x",w-280)
            .attr("y",h-75)
            .attr("width",50)
            .attr("height",20)
            .style("fill","#26949B")
     legend.append("rect")
            .attr("x",w-230)
            .attr("y",h-75)
            .attr("width",50)
            .attr("height",20)
            .style("fill","#103F42")
     
     //give details of rects showing percentage of people with bachelors in legend
     legend.append("text")
            .attr("x",w-485)
            .attr("y",h-38)
            .text("0%")
     legend.append("text")
            .attr("x",w-442)
            .attr("y",h-38)
            .text("10%")
     legend.append("text")
            .attr("x",w-389)
            .attr("y",h-38)
            .text("20%")
     legend.append("text")
            .attr("x",w-340)
            .attr("y",h-38)
            .text("30%")
     legend.append("text")
            .attr("x",w-290)
            .attr("y",h-38)
            .text("50%")
     legend.append("text")
            .attr("x",w-240)
            .attr("y",h-38)
            .text("70%")
    }
};

//gets different shades of blue (dark to light in descending order) based on value of percentage
function getColor(d){
    if(d>70){
        return "#103F42";
    }else if(d>50){
        return "#26949B";
    }else if(d>30){
        return "#37D4DE";
    }else if(d>20){
        return "#73E0E7";
    }else if (d>10){
        return "#9BE9EE";
    }else{
        return "#C3F2F5"
    }
}