"use strict";

/*******************************************************************************
 * @class Page model class
 ******************************************************************************/
function Page(data) {

    // crucial object data existence check
    if ( (typeof data !== 'object')
      || (!data.hasOwnProperty('image')) ) {
        throw Error('data has to be passed to initialise the Page model');
    }

    // fixed predefined data
    this.image = data.image;
    this.width = data.image.width;
    this.height = data.image.height;

    // articles collection
    this.articles = {};
}


/**
 * @method addArticles
 * fills article collection from crude data
 */
Page.prototype.addArticles = function(data) {
    var self = this;

    // articles from data
    data.forEach(function(item){
        self.addArticle(item);
    });
}


/**
 * @method addArticle
 * adds an article object to collection
 * does preliminary calculations
 */
Page.prototype.addArticle = function(item) {
    this.articles[item.id] = new Article(item);
    this.articles[item.id].calculateOwnFixedProperties(this.width, this.height);
}
