/********************************************************
 ********************* AJAX *****************************
 ********************************************************/
 // get all properties
 function load_properties(callback){
   $.ajax({
     type: "GET",
     url: "http://localhost:3000/properties",
     dataType: "json",
     async: false,
     success: function(data){
       callback(data);
     },
     error: function(){
       alert('error');
     }
   });
 }

 // get all items
 function load_items(callback){
   $.ajax({
     type: "GET",
     url: "http://localhost:3000/items",
     dataType: "json",
     async: false,
     success: function(data){
       callback(data);
     },
     error: function(){
       alert('error');
     }
   });
 }

var properties;
var items;
var prop_index;
var mouseOverCountry;

// load content on page load
$(document).ready(function() {
  //load properties via API
  load_properties(function(data){
    properties = data;
  });

  set_options(properties);

  // birth rate default displayed
  prop_index = 2;
  refresh_map(prop_index);
});

//checkbox with recieved properties from API
function set_options(properties){
  var op = "";
  //birth rate default displayed, last two attributes are lat and long
  for (var i=2; i<properties.length - 2;i++){
    op += "<option> " + properties[i] + "</option>";
  }
  $('#legend').append(op);
}

//when option changed
$("#legend").change(function(){
  prop_index =  $(this).find(":selected").index();
  refresh_map(prop_index);
});

//get position of all listed countries
function get_position(){
  var items;
  load_items(function(data){
    items = data;
  });
  for(var i=0; i<items.length; i++){
    for(var key=0; key<=properties.length; key++){
      if(key!=1 && key!=12 && key!=13){
        delete items[i][properties[key]];
      }
    }
  }
  return items;
}

//keep name and selected data
function item_filter(property_id, items){
  for(var i=0; i<items.length; i++){
    for(var key=0; key<=properties.length; key++){
      if(key!=property_id && key!=1){
        delete items[i][properties[key]];
      }
    }
  }
  return items;
}

function refresh_map(prop_index){
  var items;
  load_items(function(data){
    items = data;
  });
  var filter_result = item_filter(prop_index, items);
  var selected_property = properties[prop_index];

  set_map(filter_result, selected_property);
}
/********************************************************
 ********************* Map ******************************
 ********************************************************/

function set_map(filter_result, selected_property){
  //Scene Configuration
  const WIDTH = window.width;
  const HEIGHT = window.height;
  const ASPECT = WIDTH/ HEIGHT;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, ASPECT, 0.1, 10000);
  const canvas = document.getElementById('map');
  const renderer = new THREE.WebGLRenderer({ alpha: true, canvas: canvas });

  camera.position.z = 300;
  scene.add(camera);
  renderer.setSize(WIDTH, HEIGHT);

  // Light
  const light = new THREE.PointLight(0xffffff, 1.2);
  light.position.set(0, 0, 6);
  scene.add(light);

  var height = 30;

  var meteorites;
  const meshes =[];
  const material = new THREE.MeshLambertMaterial({ color: 0x5faae3, side: 2, shading: THREE.FlatShading });
  const allPositions = get_position();

  meteorites = filter_result;
  //var height = selected_property;
  for (var i = 0; i < meteorites.length; i++){
    const cube = new THREE.CubeGeometry(30, height, 30);
    meshes.push(new THREE.Mesh(cube, material));
  }

  const mappa = new Mappa('MapboxGL', "pk.eyJ1IjoicmljYXJkb2xhbmduZXIiLCJhIjoiY2pxano2enh2MG1qazN4bm5lajIzeDl3eiJ9.wK0MtuxLgJxDcGUksKMeKg");
  const option = {
      lat: 0,
      lng: 0,
      style: "mapbox://styles/mapbox/satellite-v9",
      zoom: 3,
      pitch: 50
  };
  const myMap = mappa.tileMap(option);
  myMap.overlay(canvas);
  myMap.onChange(function(){
    meshes.forEach((mesh, i) => {
      const pos = myMap.latLngToPixel(allPositions[i].gps_lat, allPositions[i].gps_lng);
      const vector = new THREE.Vector3();
      vector.set((pos.x / WIDTH) * 2 - 1, -(pos.y / HEIGHT) * 2 + 1, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const newPos = camera.position.clone().add(dir.multiplyScalar(distance));

      mesh.position.set(newPos.x, newPos.y, newPos.z);
      scene.add(mesh);
    })
  });
}
