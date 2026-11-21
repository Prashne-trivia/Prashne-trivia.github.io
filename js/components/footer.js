/**
 * Footer quote
 * Edit the markup below; logic for this component lives in this file too.
 */
const FooterComponent = {
  html: `<footer id="app-footer" class="w-full max-w-xl mx-auto px-4 py-5 text-center text-xs text-gray-500 dark:text-gray-400"><p>“- If you fail, never give up because F.A.I.L. means "first Attempt In Learning" - APJ Abdul Kalam</p></footer>`,
  mount() { document.getElementById('app-footer-slot').innerHTML = this.html; },
};
