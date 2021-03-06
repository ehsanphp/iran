var striptags = require('striptags');
var crypto = require('crypto');
var persian = require('persianjs');
var schema = [
  'id',
  'city_name',
  'city_creation_date',
  'city_division_code',
  'district_name',
  'county_name',
  'province_name'
];

module.exports = {
  pars: function (data) {
    //convert html string to array
    var tables = data
      //remove "<tbody>" html tag and new lines
      .replace(/(<tbody>|<\/tbody>|\r\n|\n|\r|\t|)/gm,'')
      //trim white spaces
      .trim()
      //create array of each table
      .split('</table>');

    var cities = [];

    tables.forEach(function (table, index, array) {
      if (table) {
        table.split('</tr>').forEach(function (tableRow, index, array) {
          //city info object
          var city = {};

          //skip first table row contain header data and empty table row
          if(tableRow && index > 0) {
            tableRow.split('</td>').forEach(function (tableRowData, index, array) {
              if(tableRowData) {
                //remove html tag and trim
                var item = striptags(tableRowData).trim();
                //convert arabic character to persian number
                item = persian(item)
                  .arabicChar()
                  .toString();

                //create city object based on schema
                city[schema[index]] = item;
              }
            });

            city.id = 'city_'
              + crypto
              .createHash('sha1')
              .update(tableRow)
              .digest('hex');

            //add to cities array
            cities.push(city);
          }
        });
      }
    });

    return cities;
  }
};
