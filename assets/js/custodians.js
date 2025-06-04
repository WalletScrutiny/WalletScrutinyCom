document.addEventListener('DOMContentLoaded', function() {
  // Process all custodian cards
  const custodianCards = document.querySelectorAll('.custodian-card');
  
  custodianCards.forEach(function(card) {
    const logoElement = card.querySelector('.custodian-logo');
    
    // Skip if no logo is found
    if (!logoElement) {
      return;
    }
    
    // Create a new image object to ensure the image is loaded
    let imgObj = new Image();
    imgObj.crossOrigin = "Anonymous"; // Needed for CORS if images are from different origins
    imgObj.src = logoElement.src;
    
    imgObj.onload = function() {
      try {
        // Use ColorThief to extract a color palette from the logo
        let colorThief = new ColorThief();
        const colorPalette = colorThief.getPalette(imgObj, 3);
        
        // Find a suitable color from the palette (not too dark, not too light)
        for (const rgb of colorPalette) {
          // Skip colors that are too dark
          if (rgb[0] < 70 && rgb[1] < 70 && rgb[2] < 70) {
            continue;
          }
          
          // Skip colors that are too light
          if (rgb[0] > 130 && rgb[1] > 130 && rgb[2] > 130) {
            continue;
          }
          
          // Apply the linear gradient background
          card.style.backgroundImage = `linear-gradient(var(--white) -80%, rgb(${rgb[0]},${rgb[1]},${rgb[2]}) 600%)`;
          
          // Store the color as a data attribute for potential future use
          let colour = `rgba(${rgb[0]},${rgb[1]},${rgb[2]}, 0.2)`;
          card.setAttribute("data-colour", colour);
          
          // Only apply the first suitable color
          break;
        }
      } catch (error) {
        console.error("Error processing card style:", error);
      }
    };
  });
});
