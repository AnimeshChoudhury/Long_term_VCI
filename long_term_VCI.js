//choose study region and save it in the name ‘table’ which is default name for feature collection
// function to scale the Images
function scale (image) {
  var ndvi=image.select('NDVI').multiply(0.0001).rename('scaled_NDVI');
  return image.addBands(ndvi);
}

var collection= ee.ImageCollection('MODIS/006/MOD13Q1')
                  .select('NDVI')
                  .filter(ee.Filter.date('2000-01-01', '2021-12-31'))
                  .filterBounds(table)
                  .map(scale);
//print(collection);                  
var dataset=collection.select(1);                  
print(dataset);
var june_ndvi = dataset.filter(ee.Filter.calendarRange(6,6,'month')); //print(june_ndvi);
var july_ndvi = dataset.filter(ee.Filter.calendarRange(7,7,'month'));// print(july_ndvi);
var aug_ndvi = dataset.filter(ee.Filter.calendarRange(8,8,'month')); //print(aug_ndvi);
var sep_ndvi = dataset.filter(ee.Filter.calendarRange(9,9,'month')); //print(sep_ndvi);
var oct_ndvi = dataset.filter(ee.Filter.calendarRange(10,10,'month'));// print(oct_ndvi);

//NDVI MAX
var june_ndvi_max=june_ndvi.max();
var july_ndvi_max=july_ndvi.max();
var aug_ndvi_max=aug_ndvi.max();
var sep_ndvi_max=sep_ndvi.max();
var oct_ndvi_max=oct_ndvi.max();

//NDVI MIN
var june_ndvi_min=june_ndvi.min();
var july_ndvi_min=july_ndvi.min();
var aug_ndvi_min=aug_ndvi.min();
var sep_ndvi_min=sep_ndvi.min();
var oct_ndvi_min=oct_ndvi.min();


//calcultion of VCI
function VCI_june(image) {
  var ndvi= image.select(0);
  var vci=((ndvi.subtract(june_ndvi_min)).divide(june_ndvi_max.subtract(june_ndvi_min))).multiply(100).rename('VCI');

  return image.addBands(vci);
}
function VCI_july(image) {
  var ndvi= image.select(0);
  var vci=((ndvi.subtract(july_ndvi_min)).divide(july_ndvi_max.subtract(july_ndvi_min))).multiply(100).rename('VCI');

  return image.addBands(vci);
}
function VCI_aug(image) {
  var ndvi= image.select(0);
  var vci=((ndvi.subtract(aug_ndvi_min)).divide(aug_ndvi_max.subtract(aug_ndvi_min))).multiply(100).rename('VCI');

  return image.addBands(vci);
}
function VCI_sep(image) {
  var ndvi= image.select(0);
  var vci=((ndvi.subtract(sep_ndvi_min)).divide(sep_ndvi_max.subtract(sep_ndvi_min))).multiply(100).rename('VCI');

  return image.addBands(vci);
}
function VCI_oct(image) {
  var ndvi= image.select(0);
  var vci=((ndvi.subtract(oct_ndvi_min)).divide(oct_ndvi_max.subtract(oct_ndvi_min))).multiply(100).rename('VCI');

  return image.addBands(vci);
}

// VCI for each month
var june_vci=june_ndvi.map(VCI_june);
var july_vci=july_ndvi.map(VCI_july);
var aug_vci=aug_ndvi.map(VCI_aug);
var sep_vci=sep_ndvi.map(VCI_sep);
var oct_vci=oct_ndvi.map(VCI_oct);

var all_vci=june_vci.merge(july_vci).merge(aug_vci).merge(sep_vci).merge(oct_vci);
var all_vci_sorted=all_vci.sort('system:time_start').select('VCI')
print(all_vci);


////////////////////// plot full time series///////////////////
print(
  ui.Chart.image.series({
    imageCollection: all_vci_sorted,
    region: table,
    reducer: ee.Reducer.mean(),
    scale: 250
  }).setOptions({title: 'VCI over time'})
);


print(
  ui.Chart.image.doySeriesByYear({
    imageCollection: all_vci_sorted,
    bandName:'VCI',
    region: table,
    regionReducer: ee.Reducer.mean(),
    scale: 250
  }).setOptions({title: 'VCI over time'})
);
