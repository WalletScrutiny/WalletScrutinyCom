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
<p>The Wallet Scrutiny team is a small, non-profit collection of privacy and security-focused engineers helping everyone from bitcoin newcomers to full-fledged cypherpunks make informed decisions about how they store and send their bitcoin. So it’s only fitting to be as transparent about ourselves as we encourage wallet developers to be. 
</p>
<p>To better understand our methodology, check out our <a href="/methodology/?faq">FAQ</a> or the podcast appearances below.</p>
</div>

<h2 id="featuredOn"></h2>

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
.team{
    display: flex;
justify-content: center;
flex-wrap: wrap;
}
.team-member{
  display:grid; 
  gap: 5px; 
  justify-content: center;
    width: 200px;
    text-align: center;
}
.team-member h3{margin:auto; font-size: 17px; font-weight: 300px;}
.team-member p{margin:auto;font-weight: 200;font-size: 17px;}
.team-member .image {
  height: 100px;
  width: 100px;
  background-position: 50% 50%;
  border-radius: 100px;
  background-size: cover;
  margin: auto;
  background-repeat: no-repeat;
  background-image: url(/images/avatarPlaceholder.jpg);
}
.sponsors {
display: flex;
flex-direction: row;
flex-wrap: wrap;
justify-content: center;
}
.sponsors a {
color: var(--text); 
text-decoration: none; 
font-size: 17px; font-weight: 300px;
}
.sponsors a:hover {
    color: var(--accent-text);
} 
.sponsors a .image {
    max-width: 100px;
    height: 100px;
}

</style>
