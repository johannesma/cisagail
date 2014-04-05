<?php
require_once(ABSPATH . '/stripe/lib/Stripe.php');

// Set your secret key: remember to change this to your live secret key in production
// See your keys here https://manage.stripe.com/account
Stripe::setApiKey("sk_test_n4omFetPqQcRgfGPcfUS06PE");

// Get the credit card details submitted by the form
$token = $_POST['stripeToken'];
$amount = $_POST['amount'];
$description = $_POST['description'];


if ($_POST) {
  Stripe::setApiKey("sk_test_n4omFetPqQcRgfGPcfUS06PE");
  $error = '';
  $success = '';
  // Create the charge on Stripe's servers - this will charge the user's card
    try {
    $charge = Stripe_Charge::create(array(
      "amount" => $amount, // amount in cents, again
      "currency" => "usd",
      "card" => $token,
      "description" => $description)
    );
    $success = 'Thanks! Order complete! Receipt sent via email.';
    } catch(Stripe_CardError $e) {
      $error = $e->getMessage();
    }

}
 
?>
<?php if (!empty($error)){ ?>
  <div class="payment-errors site-header payment-header">
    <div class="wrap">
      <div class="payment-message"><?php echo $error ?> - Try Again?</div>
    </div>
  </div>
<?php }
  if (!empty($success)){ ?>
    <div class="payment-success site-header payment-header">
      <div class="wrap">
        <div class="payment-message"><?php echo $success ?></div></span>
      </div>
    </div>
<?php }?>
<header role="banner" class="site-header">
  <div class="wrap">
  <div class="interface">
    <div class="logo">
      <h1 class="site-title"><a href="/"><strong>Cisa</strong>gail</a></h1>
    </div>

    <!-- bag -->
    <div id="bag" class="bag">

      <!-- button -->
      <div id="button" class="button bag-button">
        <span class="label">Your Bag</span> <span class="total-quantity"></span>
      </div>
      <!-- /button -->

      <!-- dropdown -->
      <div id="dropdown" class="dropdown">

        <div class="cart-item-container">
          <div class="error-message"></div>

          <div class="each-items">
            <!-- items are inserted by js -->
          </div>

          <div class="total">
            <p class="total-value">
              <!-- value inserted by js -->
            </p>
            <p class="label">Total</p>
          </div>
          
          
          <form action="" method="POST">
            <input type="hidden" name="amount" class="stripe-amount" value="" />
            <input type="hidden" name="description" class="stripe-description" value="" />
            <script
              src="https://checkout.stripe.com/checkout.js" class="stripe-button"
              data-key="pk_test_VUnhkE9sknBP55yLuJWWJyMd"
              data-image="//placekitten.com/200/200"
              data-name="Cisagail"
              data-description=""
              data-amount=""
              data-shippingAddress="true">
            </script>
          </form>
        </div>
      </div>
      <!-- /dropdown -->

    </div>
    <!-- /bag -->
  </div>
</header>
<script type="text/template" id="item-template">
  <div class="cart-item">
    <div class="inner">
      <div class="name"><%= item.name %> (<%= item.size %>)</div>
      <div class="price-qty">
        <input class="qty" name="qty" value="<%= item.quantity %>" type="number" data-id="<%= item.id %><%= item.size %>"/>
        <div class="price">
          <span class="value">$<%= item.price %></span> &times;
        </div>
      </div>
      <span class="remove" data-id="<%= item.id %><%= item.size %>"></span>
    </div>
  </div>
</script>