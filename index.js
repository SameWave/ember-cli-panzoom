/* eslint-env node */
'use strict';
const path = require('path');
const Funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');
const BroccoliDebug = require('broccoli-debug');
const fbTransform = require('fastboot-transform');

module.exports = {
  name: 'ember-cli-panzoom',

  blueprintsPath: function() {
    return path.join(__dirname, 'blueprints');
  },

  treeForVendor: function(vendorTree) {
    const panzoomDir = path.dirname(require.resolve('jquery.panzoom'));

    let panzoomTree = new Funnel(panzoomDir, {
      files: ['jquery.panzoom.js', 'jquery.panzoom.min.js'],
      destDir: 'jquery.panzoom'
    });

    panzoomTree = new BroccoliDebug(
      panzoomTree, 'ember-cli-panzoom:panzoom-tree'
    );

    if (vendorTree) {
      vendorTree = mergeTrees([vendorTree, panzoomTree]);
    } else {
      vendorTree = mergeTrees(panzoomTree);
    }

    return new BroccoliDebug(
      fbTransform(vendorTree), 'ember-cli-panzoom:vendor-tree'
    );
  },

  included: function(app) {
    this._super.included(app);

    app.import({
      development: 'vendor/jquery.panzoom/jquery.panzoom.js',
      production: 'vendor/jquery.panzoom/jquery.panzoom.min.js'
    });
  }
};
