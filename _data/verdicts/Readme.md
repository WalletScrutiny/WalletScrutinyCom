
## Step-by-Step Process of Adding Verdicts 

### Step 1

Navigate to the _data/verdicts folder and duplicate one of the .yml files. Change the file name and the contents of the new .yml file. 

To add verdicts still involves touching several places in the project but the
main definition is here in this folder. The fields are:

* **short**: a brief name of this verdict. <16 letters. Capitalization
* **title**: a brief description of this verdict. <40 letters
* **message**: a longer summary of the verdict. <80 letters
* **color**: css color
* **redflag**: boolean. Show warning about potential for all users losing all funds at once or not. For Review footer "verdict explained".
* **question**: question asked when coming to this verdict upon a negative response. For the methodology and "verdict explained".
* **details**: an explanation with markdown. For the methodology and "verdict explained".

For example, a new verdict can be named “newverdict.yml”

### Step 2

Look out for these three files. Each of them has a list of all the site’s verdicts. 

- _includes/grid_of_wallets.html
- _includes/grid_of_wallets_proportional.html
- scripts/migrate.mjs

New verdicts might need addition to lists like in [grid_of_wallets](/_includes/grid_of_wallets.html)
or the two `verdictOrder` variables.

It will typically look like this: 

> *verdicts = "nobinary,reproducible,diy,nonverifiable,ftbfs,nosource,custodial,nosendreceive,sealed-noita,noita,sealed-plainkey,plainkey,prefilled"*

Add the new verdict:

> *verdicts = "nobinary,reproducible,diy,nonverifiable,ftbfs,nosource,custodial,nosendreceive,sealed-noita,noita,sealed-plainkey,plainkey,prefilled,newverdict"*

Note: The position matters. The new verdict needs to be inserted accordingly.
Currently, these lists are used for all platforms but the "newverdict" might apply to only one platform. One has to fit it in such that the corresponding platform's verdicts are in order.

Make sure to modify each of the three files with the list of all verdicts.

### Step 3

**Edit the Methodology**

Search for and open “methodology.md”

Paste “{% include verdictMethodology.html verdict="Replace this with the name of your new verdict. Do not include the file extension." %}” in the methodology.

For example: 

> {% include verdictMethodology.html verdict="newverdict" %}
