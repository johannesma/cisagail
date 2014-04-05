'use strict';

var HOME = {};

(function(context) {

  $(document).ready(function() {

    //Cart Functionality
    CART.init();

    //image zoom
    IMAGEZOOM.init();
    $('.overlay_content').mouseover(function(){
      $(this).drags();
    });

    //thumbnail switcher
    IMAGESWAPPER.init();

  });

  var CART = {};

  (function(context) {

    //$.removeCookie("cisa_cookie")
    var cartItems = { total_quantity: 0, total_price: 0 };
    var itemTemplate = _.template($('#item-template').html());
    //Check for cookie
    if ($.cookie("cisa_cookie") != null) {
      var previousVisit = $.cookie("cisa_cookie");
      cartItems = $.parseJSON(previousVisit);
      updateCartContent(cartItems);
    }

    $( ".payment-success" ).delay(5000).animate({
      opacity: 0
        }, 500, 
      function() {
        $(this).remove();
        emptyCart();
    });

    $( ".payment-error" ).delay(5000).animate({
      opacity: 0,
        }, 500, 
      function() {
        $(this).remove();
    });

    function emptyCart() {
      cartItems = { total_quantity: 0, total_price: 0 };
      updateCartContent(cartItems);
    }

    function updateCartContent(items){
      $(".each-items").empty();

      _.each(items,function(item,key){
        // create variables
        if (typeof item === 'object') {
          $(".each-items").append(itemTemplate({ item: item }));
        }
      });

      updateCartTotal(items);
    }

    function updateCartTotal(items){
      
      var totalQuantity = 0;
      var totalPrice = 0;
      var productDescription = []

      _.each(items,function(item,key,list){

        if (typeof item === 'object') {
          var subTotal = item.quantity*item.price;
          productDescription.push('(' + item.quantity +') '+ item.name +' size '+ item.size);
          totalQuantity += item.quantity;
          totalPrice += subTotal;
        }
      });

      //update total
      cartItems.total_quantity = parseInt(totalQuantity);
      cartItems.total_price = totalPrice*100;

      $('.total-value').text('$' + totalPrice);

      //update amt
      $('.stripe-button').attr('data-amount', cartItems.total_price);
      $('.stripe-button').attr('data-description', productDescription.join(', '));
      $('.stripe-amount').val(cartItems.total_price);
      $('.stripe-description').val(productDescription.join(', '));

      if (items.total_quantity === 0 || items.total_quantity === 'undefined') {
        $('.total-quantity').empty();
        $('.button').removeClass('items-in-cart');
        $('.dropdown').removeClass('visible');
      } else {
        $('.total-quantity').text(items.total_quantity);
        $('.button').addClass('items-in-cart');
      }

      storeCookie(cartItems);

    }

    context.init = function() {
      $(".size").on("change", "select[name='size']", _on_select_change);
      $(".cart-item-container").on("click", ".remove", _remove_item);
      $(".bag").on("click", ".bag-button", _on_bag_click);
      
      if (Modernizr.touch) {
        $(".cart-item-container").on("change", "input[name='qty']", _on_quantity_change);
      } else {
        $(".cart-item-container").on("keyup", "input[name='qty']", _on_quantity_change);
      }
    };

    function _on_bag_click(event) {
      if (cartItems.total_quantity !=0) {
        $(this).siblings('.dropdown').toggleClass('visible');
      }
    }

    function _on_quantity_change(event) {
      cartItems[this.dataset.id].quantity = parseInt(this.value);
      updateCartContent(cartItems);
    }

    function _remove_item(event) {
      delete cartItems[this.dataset.id];
      updateCartContent(cartItems);
    }

    function _on_select_change(event) {
      event.preventDefault();

      var $this = $(this);
      var selectedProduct = event.currentTarget;
      var selectedProductSize = this.value; 

      //update shim select
      $(selectedProduct).siblings('.shim-select').find('.label').text(this.selectedOptions[0].label);
      $(this).parent().addClass('added').delay(2500)
        .queue(
          function(next){
            $(this).removeClass('added');
            next();
          });
      
      addToCart($this);
    }

    function itemDetails(id, name, price, quantity, size) {
      this.id = id;
      this.name = name;
      this.price = price;
      this.size = size;
      this.quantity = quantity;
    }

    function addToCart(item) {
      item = item.context;
      var cartItemId = item.dataset.id + item.value;
      var cartItemSize = item.value;
      
      //check if object is logged
      if (typeof cartItems[cartItemId] === "undefined") {
        cartItems[cartItemId] = new itemDetails(item.dataset.id, item.dataset.name, item.dataset.price, 1, cartItemSize);
      } else {
        cartItems[cartItemId].quantity++;
      }
      
      updateCartContent(cartItems);
      $('.dropdown').addClass('visible');
      //console.log(cartItems);
    }

    function storeCookie(data) {
      $.cookie('cisa_cookie', JSON.stringify(cartItems), { expires: 7, path: '/' });
    }

  })(CART);
  
  var IMAGESWAPPER = {};

  (function(context) {

    context.init = function() {
      $(".item-image-selectors").on("click", ".image-selector", _on_thumb_click);
    };

    function _on_thumb_click(event) {
      event.preventDefault();

      var $thumb_anchor = $(event.currentTarget);
      var image_index = $thumb_anchor.attr("data-image-id");

      $thumb_anchor.closest(".item-image-selector-list").find(".item-thumbnail").removeClass("is-active");
      $thumb_anchor.children('.item-thumbnail').addClass("is-active");

      var $image_active = $('.item_image[data-image-id="' + image_index + '"]');
      var $image_container = $image_active.parent();

      $image_active.siblings().removeClass('is-active');
      $image_active.addClass('is-active');
    }

  })(IMAGESWAPPER);

  var IMAGEZOOM = {};

  (function(context) {

    context.init = function() {
      $(".item_image-container").on("click", ".item_image", _on_main_click);
      $(".overlay").on("click", ".overlay_cancel", _on_cancel_click);
    };

    function _on_main_click(event) {
      event.preventDefault();

      var $image_anchor = $(event.currentTarget);
      //console.log($image_anchor.context.src);
    
      $('body').find('.overlay_content').append('<img src="'+ $image_anchor.context.src + '" class="overlay_image">')
        .end().addClass('show-overlay');
    }

    function _on_cancel_click(event) {
      event.preventDefault();
      
      $('body').removeClass('show-overlay');
      $('.overlay_content').empty();
    }

  })(IMAGEZOOM);

})(HOME);

//Draggable function: http://css-tricks.com/snippets/jquery/draggable-without-jquery-ui/
(function($) {
  $.fn.drags = function(opt) {

      opt = $.extend({handle:"",cursor:"move"}, opt);

      if(opt.handle === "") {
          var $el = this;
      } else {
          var $el = this.find(opt.handle);
      }

      return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
          if(opt.handle === "") {
              var $drag = $(this).addClass('draggable');
          } else {
              var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
          }
          var z_idx = $drag.css('z-index'),
              drg_h = $drag.outerHeight(),
              drg_w = $drag.outerWidth(),
              pos_y = $drag.offset().top + drg_h - e.pageY,
              pos_x = $drag.offset().left + drg_w - e.pageX;
          $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
              $('.draggable').offset({
                  top:e.pageY + pos_y - drg_h,
                  left:e.pageX + pos_x - drg_w
              }).on("mouseup", function() {
                  $(this).removeClass('draggable').css('z-index', z_idx);
              });
          });
          e.preventDefault(); // disable selection
      }).on("mouseup", function() {
          if(opt.handle === "") {
              $(this).removeClass('draggable');
          } else {
              $(this).removeClass('active-handle').parent().removeClass('draggable');
          }
      });

  }
})(jQuery);

$(window).load(function() {    
  //height adjustments
  HEIGHT();
});

$(window).scroll(function() {    
    var scroll = $(window).scrollTop();

    if (scroll >= 3) {
      $(".site-header").addClass("shadow");
    } else {
      $(".site-header").removeClass("shadow");
    }
});

function HEIGHT(){
    
  if ($(window).width() > 1295) {
    //height for floated items;
    $(".item-container.right").each(function( index ) {
      var $heading = $(this).find('.item_title'),
          $prevHeading = $(this).prev('.item-container').find('.item_title'),
          headingHeight = $heading.height(),
          prevHeadingHeight = $prevHeading.height(),
          maxHeadingHeight = Math.max(headingHeight,prevHeadingHeight);

      $prevHeading.height(maxHeadingHeight).css('paddingTop', maxHeadingHeight - prevHeadingHeight);
      $heading.height(maxHeadingHeight).css('paddingTop', maxHeadingHeight - headingHeight);
    });

    //height for fullwidth
    $(".item-container.full-width").each(function( index ) {
      var imageColHeight = $(this).find('.item_image-column').height();
      var $item = $(this).find('.item').css('min-height', imageColHeight);
    });
  }
  
}

var body = document.body,
    timer;

window.addEventListener('scroll', function() {
  clearTimeout(timer);
  if(!body.classList.contains('disable-hover')) {
    body.classList.add('disable-hover')
  }
  
  timer = setTimeout(function(){
    body.classList.remove('disable-hover')
  },50);
}, false);