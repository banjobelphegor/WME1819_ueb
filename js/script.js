function menu() {
	
	//specifying the needed element
    var elem = document.getElementById('menu-items')

    if (elem.style.display === "none") {
        document.getElementById('menu-items').style.display = "block";
        document.getElementById('content').style.paddingTop = "350px"
    } else {
        document.getElementById('menu-items').style.display = "none";
        document.getElementById('content').style.paddingTop = "100px"
    }

}

function showhideColumns(id) {

    var col;
    //switching within the different col-s
    switch (id) {
        case "birthRate":
            col = document.getElementsByClassName("col2");
            break;
        case "cellphone":
            col = document.getElementsByClassName("col3");
            break;
        case "childrenWoman":
            col = document.getElementsByClassName("col4");
            break;
        case "electricUsage":
            col = document.getElementsByClassName("col5");
            break;
        case "internetUsage":
            col = document.getElementsByClassName("col6");
            break;
    }

    var isVisible = true;
	//displaying and removing certain col
    if (col[0].style.display === "none") isVisible = false;
    for (var i = 0; i < col.length; i++) {
        if (isVisible) col[i].style.display = "none"; 
        else
            col[i].style.display = "table-cell"
    }
}

function sortTable(id, direction) {
    
	
    var table, changed, shouldSwitch, rows, i, x, y;
    table = document.getElementById("table");
	//Bubble Sort Algorithm
    changed = true;
    while (changed) {
        changed = false;
        rows = table.getElementsByTagName("tr");
        for (i = 1; i < (rows.length - 1); i++) { 
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[id];         
            y = rows[i + 1].getElementsByTagName("TD")[id];     
            if (direction === "ASC") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
            else {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            changed = true;
        }
    }
}