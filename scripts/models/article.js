"use strict";

/*******************************************************************************
 * @class Article model class
 ******************************************************************************/
function Article(data) {

    // crucial object data existence check
    if ( (typeof data !== 'object')
      || (!data.hasOwnProperty('id')) ) {
        throw Error('data has to be passed to initialise the Article model');
    }

    this.id = data.id;

    // init data with relative ccordinates
    // IN PERCENT!!!
    this.relHeight = data.height;
    this.relWidth = data.width;
    this.relTop = data.top;
    this.relLeft = data.left;
}


/**
 * @method calculateOwnFixedProperties
 * calculates fixed values of the properties
 * to make those known on initialisation stage
 */
Article.prototype.calculateOwnFixedProperties = function(pageWidth, pageHeight) {

    // crucial object data existence check
    if ( (typeof pageWidth !== 'number')
      || (typeof pageHeight !== 'number') ) {
        throw Error('wrong data has been passed to calculateOwnFixedProperties() method');
    }

    this.width = this.relWidth * pageWidth / 100;
    this.height = this.relHeight * pageHeight / 100;
    this.left = this.relLeft * pageWidth / 100;
    this.top = this.relTop * pageHeight / 100;
}
