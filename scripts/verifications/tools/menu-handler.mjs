/**
 * Menu Handler - Manages menu definitions and navigation logic
 */

export class MenuHandler {
  constructor() {
    this.mainOptions = [
      "1. Count verifications of kind 30301 by pubkey",
      "2. Cross-reference backup vs relay data", 
      "3. Backup Nostr verification events",
      "4. Check relay.nostr.info",
      "5. Publish backup to relay"
    ];

    this.subOptions = [
      "A. Relay Comparison Matrix",
      "B. Missing Events Report", 
      "C. Author-Centric View",
      "D. Interactive Drill-Down",
      "← Back to Main Menu"
    ];

    this.currentMenu = 'main';
    this.selectedIndex = 0;
  }

  getOptions() {
    return this.currentMenu === 'main' ? this.mainOptions : this.subOptions;
  }

  getTitle() {
    return this.currentMenu === 'main' 
      ? "🔍 WalletScrutiny Verification Tools\n" 
      : "🔍 Cross-reference Analysis Options\n";
  }

  navigate(direction) {
    const options = this.getOptions();
    switch (direction) {
      case 'up':
        this.selectedIndex = Math.max(0, this.selectedIndex - 1);
        break;
      case 'down':
        this.selectedIndex = Math.min(options.length - 1, this.selectedIndex + 1);
        break;
    }
  }

  setMenu(menuType) {
    this.currentMenu = menuType;
    this.selectedIndex = 0;
  }

  getCurrentSelection() {
    return {
      menu: this.currentMenu,
      index: this.selectedIndex,
      option: this.getOptions()[this.selectedIndex]
    };
  }
}