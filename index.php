<?php
/**
 * The main template file
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file 
 *
 * Please see /external/starkers-utilities.php for info on Starkers_Utilities::get_template_parts()
 *
 * @package 	WordPress
 * @subpackage 	Starkers
 * @since 		Starkers 4.0
 * Template Name: Home
 */
?>
<?php Starkers_Utilities::get_template_parts( array( 'parts/shared/html-header', 'parts/shared/header' ) ); ?>
<div class="shop-container wrap">
<?php if ( have_posts() ): ?>
<?php $counter = 0 ?>
<?php while ( have_posts() ) : the_post(); ?>
  <div class="item-container <?php if ($counter % 5 == 0){echo 'full-width';} else if ($counter % 5 == 2 || $counter % 5 == 4) {echo 'right';} ?>">
    <div class="item">
      <div class="item_info">
        <h1 class="item_title item_name section-heading"><?php the_title(); ?></h1>
        <div class="price item_price"><span>$</span><?php the_field('price'); ?></div>
        <div class="item_image-column">
          <div class="item_image-area">
            <div class="item_image-container">
            <?php if ($counter % 5 == 0 && get_field('2nd_image')) { 
            /* Grab the 2nd image url */
            $second_id = get_field('2nd_image');
            $numImages = 2;
            /*If there's a 3rd image*/
            if (get_field('3rd_image')) {
              $numImages = 3;
              $third_id = get_field('3rd_image');
            } ?>
            <?php if (get_field('3rd_image')) { ?>
              <img src="<?php echo $third_id[url]; ?>" class="item_image"  data-image-id="<?php echo $third_id[id]; ?>"/>
            <?php }?>
              <img src="<?php echo $second_id[url]; ?>" class="item_image"  data-image-id="<?php echo $second_id[id]; ?>"/>
            <?php }
              $firstFull = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'full' );
              $firstImageUrl = $firstFull['0'];
              ?>
              <img src="<?php echo $firstImageUrl; ?>" class="item_image is-active"  data-image-id="<?php echo get_post_thumbnail_id($post->ID); ?>"/>
            </div><!--item_image-container-->
          <div class="mag_glass"></div>
          </div><!--item_image-area-->
          <!-- if it's a full sized post and have additional images -->
          <?php if ($counter % 5 == 0 && get_field('2nd_image')) { 
          /* Grab the feature image thumb url */
          $firstThumb = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'thumbnail' );
          $firstThumbUrl = $firstThumb['0'];
          ?>
          <div class="item-image-selectors">
            <ul class="item-image-selector-list">
              <?php if (get_field('3rd_image')) { ?>
              <li class="item-image-selector-list-item">
                <a href="<?php echo $third_id[url]; ?>" class="image-selector" data-image-id="<?php echo $third_id[id]; ?>" data-num-images="<?php echo $numImages; ?>">
                  <img src="<?php echo $third_id[sizes][thumbnail]; ?>" alt="" data-image-id="<?php echo $third_id[id]; ?>" data-aspect-ratio="auto" class="item-thumbnail" />
                </a>
              </li>
              <?php }?>
              <li class="item-image-selector-list-item">
                <a href="<?php echo $second_id[url]; ?>" class="image-selector" data-image-id="<?php echo $second_id[id]; ?>" data-num-images="<?php echo $numImages; ?>">
                  <img src="<?php echo $second_id[sizes][thumbnail]; ?>" alt="" data-image-id="<?php echo $second_id[id]; ?>" data-aspect-ratio="auto" class="item-thumbnail" />
                </a>
              </li>
              <li class="item-image-selector-list-item">
                <a href="<?php echo $firstThumbUrl; ?>" class="image-selector" data-image-id="<?php echo get_post_thumbnail_id($post->ID); ?>" data-num-images="<?php echo $numImages; ?>">
                  <img src="<?php echo $firstThumbUrl; ?>" alt="" data-image-id="<?php echo get_post_thumbnail_id($post->ID); ?>" data-aspect-ratio="auto" class="item-thumbnail is-active" />
                </a>
              </li>
            </ul>
          </div> <!-- .listing-image-selectors -->
          <?php }?>
          <div class="item_caption">
            <?php the_content(); ?>
          </div>
        </div><!--item-image-column-->
      </div><!--item-info-->
      <div class="item_option-container">
        <div class="size">
          <div class="shim-select"><span class="label">Select Size</span> <div class="arrows"></div></div>
          <select name="size" data-name="<?php the_title(); ?>" data-id="<?php the_ID(); ?>" data-price="<?php the_field('price'); ?>">
            <option selected disabled value="">Select Size</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
            <option value="XL">X Large</option>
            <option value="2XL">2X Large</option>
          </select>
        </div>
      </div>
      <div class="item_details">
        <?php the_content(); ?>
      </div>
    </div><!--item-->
  </div>
<?php 
  $counter++ ;
  endwhile; ?>
<?php else: ?>
<h2>No posts to display</h2>
<?php endif; ?>
</div>

  

<?php Starkers_Utilities::get_template_parts( array( 'parts/shared/footer','parts/shared/html-footer') ); ?>