const express = require("express");
const router = express();
const {Color, ColorGroup, Resource, Site} = require('./Model.js')

// ================== // CREATE // ================== //
// POST COLOR
router.post(, function(req, res) {
  Color.create(req.body)
    .then(function(dbColor) {
      res.json(dbColor);
    })
    .catch(function(err) {
      res.json(err);
    });
});
// POST COLOR GROUP
router.post("/group", function(req, res) {
  ColorGroup.create(req.body)
    .then(function(dbColorGroup) {
      res.json(dbColorGroup);
    })
    .catch(function(err) {
      res.json(err);
    });
});
// POST RESOURCE
router.post("/resource", function(req, res) {
  Resource.create(req.body)
    .then(function(dbResource) {
      res.json(dbResource);
    })
    .catch(function(err) {
      res.json(err);
    });
});
// POST SITE
router.post("/site", function(req, res) {
  Site.create(req.body)
    .then(function(dbSite) {
      res.json(dbSite);
    }).catch(function(err) {
      res.json(err);
    })
});
// ================== // READ // ================== //
/**
 * GET Color By Hex
 * Note doesn't use '#' or '0x'
 * @param  {String} val URL Parameter, Hex value(ffffff)
 * @param  {Object} req Request Object
 * @param  {Object} res Result Object
 * @return { JSON }     Returns JSON in Http response
 */
router.get("/color/hex/:val", function(req, res) {
  let val = req.params.val
  Color.findOne({hex: val})
   .exec()
   .then(function(dbColor) {
     res.json(dbColor);
   }).catch(function(err) {
     res.json(err)
   })
})
/**
 * GET ColorGroup by primary and secondary group
 * @param  {String} primary   URL Parameter, primary group
 * @param  {String} secondary URL Parameter, secondary group
 * @param  {Object} req       Request Object
 * @param  {Object} res       Result Object
 * @return { JSON }           Returns JSON in Http response
 */
router.get("/group/:primary/:secondary", function(req, res) {
  let primary = req.params.primary
  let secondary = req.params.secondary
  ColorGroup.findOne({primary: primary, secondary: secondary})
    .exec()
    .then(function(dbColorGroup) {
      res.json(dbColorGroup)
    }).catch(function(err) {
      res.json(err)
    })
})
/**
 * GET Site By id
 * @param  {String} id  Mongo Document Id
 * @param  {Object} req Request Object
 * @param  {Object} res Result Object
 * @return { JSON }     Returns JSON in Http response
 */
router.get("/site/:id", function(req, res) {
  let id = req.params.id
  Site.findOne({_id: id})
    .exec()
    .then(function(dbSite) {
      res.json(dbSite)
    }).catch(function(err) {
      res.json(err)
    })
})
/**
 * GET Resource By id
 * @param  {String} id  Mongo Document Id
 * @param  {Object} req Request Object
 * @param  {Object} res Result Object
 * @return { JSON }     Returns JSON in Http response
 */
router.get("/resource/:id", function(req, res) {
  let id = req.params.id
  Resource.findOne({_id: id})
    .exec()
    .then(function(dbResource) {
      res.json(dbResource)
    }).catch(function(err) {
      res.json(err)
    })
})
// ================== // UPDATE // ================== //
/**
 * PUT Site By id
 * @param  {String} id  Mongo Document Id
 * @param  {Object} req Request Object
 * @param  {Object} res Result Object
 * @return { JSON }     Returns JSON in Http response
 */
router.put("/site/:id", function(req, res) {
  let id = req.params.id
  let body = req.body
  Site.findOneAndUpdate(id, body, {new: true})
    .exec()
    .then(function(dbSite) {
      res.json(dbSite)
    }).catch(function(err) {
      res.json(err)
    })
})
/**
 * PUT Color By id
 * @param  {String} id  Mongo Document Id
 * @param  {Object} req Request Object
 * @param  {Object} res Result Object
 * @return { JSON }     Returns JSON in Http response
 */
router.put("/color/:id", function(req, res) {
  let id = req.params.id
  let body = req.body
  Color.findOneAndUpdate(id, body, {new: true})
    .exec()
    .then(function(dbColor) {
      res.json(dbColor)
    }).catch(function(err) {
      res.json(err)
    })
})
/**
 * PUT ColorGroup By id
 * @param  {String} id  Mongo Document Id
 * @param  {Object} req Request Object
 * @param  {Object} res Result Object
 * @return { JSON }     Returns JSON in Http response
 */
router.put("/group/:id", function(req, res) {
  let id = req.params.id
  let body = req.body
  ColorGroup.findOneAndUpdate(id, body, {new: true})
    .exec()
    .then(function(dbColorGroup) {
      res.json(dbColorGroup)
    }).catch(function(err) {
      res.json(err)
    })
})

// ================== // DELETE // ================== //
/**
 * DELETE Site By id
 * @param  {String} id  Mongo Document Id
 * @param  {Object} req Request Object
 * @param  {Object} res Result Object
 * @return { JSON }     Returns JSON in Http response
 */
router.delete("/site/:id", function(req, res) {
  let id = req.params.id
  Site.findOneAndRemove({_id: id})
    .exec()
    .then(function(dbSite) {
      res.json(dbSite)
    }).catch(function(err) {
      res.json(err)
    })
})
/**
 * DELETE Color By id
 * @param  {String} id  Mongo Document Id
 * @param  {Object} req Request Object
 * @param  {Object} res Result Object
 * @return { JSON }     Returns JSON in Http response
 */
router.delete("/color/:id", function(req, res) {
  let id = req.params.id
  Color.findOneAndRemove({_id: id})
    .exec()
    .then(function(dbColor) {
      res.json(dbColor)
    }).catch(function(err) {
      res.json(err)
    })
})
/**
 * DELETE ColorGroup By id
 * @param  {String} id  Mongo Document Id
 * @param  {Object} req Request Object
 * @param  {Object} res Result Object
 * @return { JSON }     Returns JSON in Http response
 */
router.delete("/group/:id", function(req, res) {
  let id = req.params.id
  ColorGroup.findOneAndRemove({_id: id})
    .exec()
    .then(function(dbColorGroup) {
      res.json(dbColorGroup)
    }).catch(function(err) {
      res.json(err)
    })
})

module.exports = router;
