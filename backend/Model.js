var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var ColorGroupSchema = new Schema({
  primary: {
    type: String,
    trim: true,
  },
  secondary: {
    type: String,
    trim: true,
  },
  grayscale: {
    type: Boolean,
  },
  range: {
    type: Array
  }
});

var ColorSchema = new Schema({
  hex: {
    type: String,
    trim: true,
  },
  rgb: {
    type: Array,
  },
  group: {type: mongoose.Schema.Types.ObjectId, ref: 'ColorGroup'}
});


var ResourceSchema = new Schema({
  src: {
    type: String,
    trim: true,
  },
  options: {
    type: [String],
    trim: true,
  }
});

var SiteSchema = new Schema({
  domain: {
    type: String,
    trim: true,
  },
  resource: ResourceSchema,
  colors: [{ type : mongoose.Schema.Types.ObjectId, ref: 'Color'}]
});


var ColorGroup = mongoose.model("ColorGroup", ColorGroupSchema);
var Resource   = mongoose.model("Resource", ResourceSchema);
var Color      = mongoose.model("Color", ColorSchema);
var Site       = mongoose.model("Site", SiteSchema);

module.exports = {
    Color      : Color,
    ColorGroup : ColorGroup,
    Resource   : Resource,
    Site       : Site
}
