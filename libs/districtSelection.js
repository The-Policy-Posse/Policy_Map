let selectedDistrict = null;

// Function to highlight the selected district
function highlightDistrict(districtElement) {
    d3.selectAll(".district").style("fill", "#69b3a2");
    d3.select(`[data=id='${districtElement.properties.DISTRICT}']`).style("fill", "#2c7fb8");
}
