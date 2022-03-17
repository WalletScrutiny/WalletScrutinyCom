To add verdicts still involves touching several places in the project but the
main definition is here in this folder. The fields are:

* **short**: a brief name of this verdict. <16 letters. Capitalization
* **title**: a brief description of this verdict. <40 letters
* **message**: a longer summary of the verdict. <80 letters
* **color**: css color
* **redflag**: boolean. Show warning about potential for all users losing all funds at once or not. For Review footer "verdict explained".
* **question**: question asked when coming to this verdict upon a negative response. For the methodology and "verdict explained".
* **details**: an explanation with markdown. For the methodology and "verdict explained".

New verdicts might need addition to lists like in [grid_of_wallets](/_includes/grid_of_wallets.html)
or the two `verdictOrder` variables.
