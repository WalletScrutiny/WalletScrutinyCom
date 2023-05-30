---
permalink: /about/
author_profile: true
---

{% include base_path %}

<script>
function lsTest(){

    var test = 'test';
    try {
        localStorage.setItem(test, test)
        localStorage.removeItem(test)
        return true
    } catch(e) {
        return false
    }

}
</script>

<div class="atf-head">
<h1>Transparency first, second, and third.</h1>
<h3>We get to know wallets. Here’s where you get to know us.</h3>
<p>The WalletScrutiny team is a small, non-profit collection of privacy and security-focused engineers helping everyone from bitcoin newcomers to full-fledged cypherpunks make informed decisions about how they store and send their bitcoin. So it’s only fitting to be as transparent about ourselves as we encourage wallet developers to be. 
</p>
<p>To better understand our methodology, check out our <a href="/methodology/?faq">FAQ</a> or the podcast appearances below.</p>
</div>

{% include press.html %}

{% include about/meetTheTeam.html %}

{% include about/sponsors.html %}

<script src="{{ base_path }}/assets/js/widgetBadgeDetails.js"></script>
<script src="{{ base_path }}/assets/js/scripts.js"></script>
<script src="{{ base_path }}/assets/js/landingPage.js"></script>

<style type="text/css">
.atf-head, .sponsored-by {
  text-align: center; 
}
.atf-head h1{
font-size: 48px;
font-weight: 500;
}
.atf-head h3{
font-size: 24px;
font-weight: 500;
margin: 10px;
}
.atf-head p{
font-size: 21px;
font-weight: 200;
}
h1,h2{
  text-align: center;
}
h2{
    font-size: 24px;

}
p{
    font-weight: 300;
}


</style>
