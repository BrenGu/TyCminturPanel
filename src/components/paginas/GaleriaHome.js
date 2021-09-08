import React,{ Component }  from 'react'
import ReactDOM from 'react-dom';

class GaleriaHome extends Component {
 constructor(props){
    super(props);
    this.state= {
        
   
    }
    
    var gallery = document.querySelector('.gallery');
    var galleryItems = document.querySelectorAll('.gallery-item');
   // var numOfItems = gallery.children.length;
    var itemWidth = 23; // percent: as set in css

    var featured = document.querySelector('.featured-item');

    var leftBtn = document.querySelector('.move-btn.left');
    var rightBtn = document.querySelector('.move-btn.right');
    var leftInterval;
    var rightInterval;

    var scrollRate = 0.2;
    var left;

    function selectItem(e) {
        if (e.target.classList.contains('active')) return;
        
        featured.style.backgroundImage = e.target.style.backgroundImage;
        
        for (var i = 0; i < galleryItems.length; i++) {
            if (galleryItems[i].classList.contains('active'))
                galleryItems[i].classList.remove('active');
        }
        
        e.target.classList.add('active');
    }
    
    function galleryWrapLeft() {
        var first = gallery.children[0];
        gallery.removeChild(first);
        gallery.style.left = -itemWidth + '%';
        gallery.appendChild(first);
        gallery.style.left = '0%';
    }
    
    function galleryWrapRight() {
        var last = gallery.children[gallery.children.length - 1];
        gallery.removeChild(last);
        gallery.insertBefore(last, gallery.children[0]);
        gallery.style.left = '-23%';
    }
    
    function moveLeft() {
        left = left || 0;
    
        leftInterval = setInterval(function() {
            gallery.style.left = left + '%';
    
            if (left > -itemWidth) {
                left -= scrollRate;
            } else {
                left = 0;
                galleryWrapLeft();
            }
        }, 1);
    }
    
    function moveRight() {
        //Make sure there is element to the leftd
        if (left > -itemWidth && left < 0) {
            left = left  - itemWidth;
            
            var last = gallery.children[gallery.children.length - 1];
            gallery.removeChild(last);
            gallery.style.left = left + '%';
            gallery.insertBefore(last, gallery.children[0]);	
        }
        
        left = left || 0;
    
        leftInterval = setInterval(function() {
            gallery.style.left = left + '%';
    
            if (left < 0) {
                left += scrollRate;
            } else {
                left = -itemWidth;
                galleryWrapRight();
            }
        }, 1);
    }
    
    function stopMovement() {
        clearInterval(leftInterval);
        clearInterval(rightInterval);
    }
    
    leftBtn.addEventListener('mouseenter', moveLeft);
    leftBtn.addEventListener('mouseleave', stopMovement);
    rightBtn.addEventListener('mouseenter', moveRight);
    rightBtn.addEventListener('mouseleave', stopMovement);
    
    
    //Start this baby up
    (function init() {
        var images = [
            'https://s3-us-west-2.amazonaws.com/forconcepting/800Wide50Quality/car.jpg',
            'https://s3-us-west-2.amazonaws.com/forconcepting/800Wide50Quality/city.jpg',
            'https://s3-us-west-2.amazonaws.com/forconcepting/800Wide50Quality/deer.jpg',
            'https://s3-us-west-2.amazonaws.com/forconcepting/800Wide50Quality/flowers.jpg',
            'https://s3-us-west-2.amazonaws.com/forconcepting/800Wide50Quality/food.jpg',
            'https://s3-us-west-2.amazonaws.com/forconcepting/800Wide50Quality/guy.jpg',
            'https://s3-us-west-2.amazonaws.com/forconcepting/800Wide50Quality/landscape.jpg',
            'https://s3-us-west-2.amazonaws.com/forconcepting/800Wide50Quality/lips.jpg',
            'https://s3-us-west-2.amazonaws.com/forconcepting/800Wide50Quality/night.jpg',
            'https://s3-us-west-2.amazonaws.com/forconcepting/800Wide50Quality/table.jpg'
        ];
        
        //Set Initial Featured Image
        featured.style.backgroundImage = 'url(' + images[0] + ')';
        
        //Set Images for Gallery and Add Event Listeners
        for (var i = 0; i < galleryItems.length; i++) {
            galleryItems[i].style.backgroundImage = 'url(' + images[i] + ')';
            galleryItems[i].addEventListener('click', selectItem);
        }
    })();

    return (
        <div class="container">
	
        <div class="feature">
            <figure class="featured-item image-holder r-3-2 transition"></figure>
        </div>
        
        <div class="gallery-wrapper">
            <div class="gallery">
                    <div class="item-wrapper">
                        <figure class="gallery-item image-holder r-3-2 active transition"></figure>
                    </div>
                    <div class="item-wrapper">
                        <figure class="gallery-item image-holder r-3-2 transition"></figure>
                    </div>
                    <div class="item-wrapper">
                        <figure class="gallery-item image-holder r-3-2 transition"></figure>
                    </div>
                    <div class="item-wrapper">
                        <figure class="gallery-item image-holder r-3-2 transition"></figure>
                    </div>
                    <div class="item-wrapper">
                        <figure class="gallery-item image-holder r-3-2"></figure>
                    </div>
                    <div class="item-wrapper">
                        <figure class="gallery-item image-holder r-3-2 transition"></figure>
                    </div>
                    <div class="item-wrapper">
                        <figure class="gallery-item image-holder r-3-2 transition"></figure>
                    </div>
                    <div class="item-wrapper">
                        <figure class="gallery-item image-holder r-3-2 transition"></figure>
                    </div>
                    <div class="item-wrapper">
                        <figure class="gallery-item image-holder r-3-2 transition"></figure>
                    </div>
                    <div class="item-wrapper">
                        <figure class="gallery-item image-holder r-3-2 transition"></figure>
                    </div>
            </div>
        </div>
        
        <div class="controls">
            <button class="move-btn left">&larr;</button>
            <button class="move-btn right">&rarr;</button>
        </div>
        <style>{`
            *,
            *::before,
            *::after {
                margin: 0;
                padding: 0;
                outline: none;
                box-sizing: border-box;
            }
            
            body {
                margin: 0;
                font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
                color: #707070;
                background-color: #333;
            }
            
            .container {
                margin: 0 auto;
                max-width: 700px;
                max-height: 100vh;
                background-color: white;
            }
            
            
            /* Useful Classes */
            .xy-center {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            
            .transition {
                transition: all 350ms ease-in-out;
            }
            
            .r-3-2 {
                width: 100%;
                padding-bottom: 66.667%;
                background-color: #ddd;
            }
            
            .image-holder {
                background-size: cover;
                background-position: center center;
                background-repeat: no-repeat;
            }
            
            /* Main Styles */
            .gallery-wrapper {
                position: relative;
                overflow: hidden;
            }
            
            .gallery {
                position: relative;
                white-space: nowrap;
                font-size: 0;
            }
            
            .item-wrapper {
                cursor: pointer;
                width: 23%; /* arbitrary value */
                display: inline-block;
                background-color: white;
            }
            
            .gallery-item { opacity: 0.5; }
            .gallery-item.active { opacity: 1; }
            
            .controls {
                font-size: 0;
                border-top: none;
            }
            .move-btn {
                display: inline-block;
                width: 50%;
                border: none;
              color: #ccc;
                background-color: transparent;
                padding: 0.2em 1.5em;
            }
            .move-btn:first-child {border-right: none;}
            .move-btn.left  { cursor: w-resize; }
            .move-btn.right { cursor: e-resize; }
            
            `}

        </style>
    </div>
           
           )
        }
    }
export default GaleriaHome;
