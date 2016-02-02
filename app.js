"use strict";

/*******************************************************************************
 * @module article preview module
 ******************************************************************************/
var App = (function AppModule(window, document, undefined) {

    var page = undefined, // page object
        image = new Image(),
        CONFIG = {
            selectionColor: 'rgba(255,255,0,.5)',
            animationDuration: 120, // in frames; 60 frames = 1 sec
        },
        // current state properties
        current = {
            selection: false,
            // animationInProgress: false,
            scale: 1,
            page: {
                left: undefined,
                top: undefined,
                width: undefined,
                height: undefined
            },
            // shift: {x:0, y: 0},
        };

    // DOM references
    var $viewzone = document.getElementsByClassName('page-preview-section')[0],
        $canvas = document.getElementsByClassName('page-preview-image')[0],
        $ctx = $canvas.getContext('2d'),
        $nav = document.getElementsByClassName('article-list-section')[0];




    /***************************************************************************
     * INITIALISATION FUNCTIONS
     **************************************************************************/
    function init(articlesJsonURL, pageImageURL, params) {

        // additional params for CONFIGuration
        if (typeof params !== 'undefined') {
            for (var prop in params) {
                CONFIG[prop] = params[prop];
            }
        }

        window.addEventListener('resize', renderCanvas);

        // show all page btn
        document.getElementsByClassName('btn-100')[0].addEventListener('click', function(){
            current.selection = undefined;
            renderCanvas();
        })


        // load image -> load json -> create models -> render page
        // no promises use
        // ~ 4 circles of of a callback h.
        loadPageImage(pageImageURL, function() {
            requestArticlesData(articlesJsonURL, function(data) {
                parseDataToPageModel(data, function() {
                    renderHTML();
                });
            });
        });
    }


    /**
     * loadPageImage
     */
    function loadPageImage(url, callback) {
        image = new Image();
        image.onload = function() {
            callback();
        }
        image.src = url;
    }

    /**
     * requestArticlesData
     */
    function requestArticlesData(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            callback(JSON.parse(this.responseText));
        };
        xhr.open('GET', url, true);
        xhr.send();
    }


    /**
     * parseDataToPageModel
     */
    function parseDataToPageModel(data, callback) {
        page = new Page({image: image});
        page.addArticles(data);
        callback();
    }




    /***************************************************************************
     * RENDER FUNCTIONS
     **************************************************************************/
    function renderHTML() {
        renderNavHTML();
        renderCanvas();
    }


    /**
     * parseDataToPageModel
     */
    function renderNavHTML() {
        // init nav events
        $nav.addEventListener('click', function(e){
            if (e.target) {
                var article = page.articles[e.target.dataset.articleId];
                current.selection = article;

                renderCanvas();
            }
        });

        // create li elements
        var $navFragment = document.createDocumentFragment(),
            $el, $elTxt, dataAttr;

        for (var id in page.articles) {
            $el = document.createElement('li');

            dataAttr = document.createAttribute("data-article-id");
            dataAttr.value = id;
            $el.setAttributeNode(dataAttr);

            $elTxt = document.createTextNode(id);
            $el.appendChild($elTxt);

            $navFragment.appendChild($el);
        };

        $nav.appendChild($navFragment);
    }


    /**
     * parseDataToPageModel
     */
    function calculateScaleAndShift() {
        // canvas and elem ratios
        var canvasRatio = $canvas.width / $canvas.height,
            elem = current.selection ? current.selection : page,
            elemRatio = elem.width / elem.height,
            centeringShiftLeft, centeringShiftTop;

        // selection area is wider than preview section
        if ( elemRatio > canvasRatio ) {
            current.scale =  $canvas.width / elem.width;
        } else {
            current.scale = $canvas.height / elem.height;
        }

        // dont zoom
        current.scale = (current.scale < 1) ? current.scale : 1;

        // centering shift
        centeringShiftLeft = ($canvas.width - elem.width * current.scale) / 2;
        centeringShiftTop = ($canvas.height - elem.height * current.scale) / 2;

        current.page.left = centeringShiftLeft - ( current.selection ? current.selection.left * current.scale : 0 );
        current.page.top = centeringShiftTop - ( current.selection ? current.selection.top * current.scale : 0 );
    }


    /**
     * renderCanvas
     */
    function renderCanvas() {

        if (typeof image === 'undefined' || typeof page === 'undefined') {
            return false;
        }

        // resize canvas to parent element
        setCanvasSize();

        // clean canvas
        $ctx.clearRect(0, 0, $canvas.width, $canvas.height);

        calculateScaleAndShift();

        // page render
        $ctx.drawImage(image,
            current.page.left,
            current.page.top,
            page.width * current.scale,
            page.height * current.scale
        );

        // selection coordinates calculation and render
        // with respect to current page shift
        if (current.selection) {

            // render selection
            $ctx.beginPath();
            $ctx.rect(
                 current.page.left + current.selection.left * current.scale,
                 current.page.top + current.selection.top * current.scale,
                 current.selection.width * current.scale,
                 current.selection.height * current.scale
             );

            $ctx.fillStyle = CONFIG.selectionColor;
            $ctx.fill();
        }
    }




    /**
     * setCanvasSize
     * resize canvas to parent element
     */
    function setCanvasSize() {
        // take sizes from the parent element
        $canvas.width = $viewzone.offsetWidth;
        $canvas.height = $viewzone.offsetHeight;
    }




    /***************************************************************************
     * DESTROY FUNCTIONS
     **************************************************************************/
    function destroy() {
        // clean navigation
        while ($nav.hasChildNodes()) {
            $nav.removeChild($nav.lastChild);
        }

        current.selecton = undefined;
        image = undefined;

        // clean canvas
        $ctx.clearRect(0, 0, $canvas.width, $canvas.height);
    }




    /***************************************************************************
     * FACADE DECLARATIONS
     **************************************************************************/
    return {
        init: init,
        destroy: destroy
    }

})(window, document);
