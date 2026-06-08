// Wrap every character (including inside links) in a span, preserving HTML structure
function wrapChars(el) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) textNodes.push(node);

  textNodes.forEach(textNode => {
    const frag = document.createDocumentFragment();
    for (const ch of textNode.textContent) {
      const span = document.createElement('span');
      span.textContent = ch;
      span.classList.add('scroll-char');
      frag.appendChild(span);
    }
    textNode.parentNode.replaceChild(frag, textNode);
  });
}

const fixedText = document.querySelector('.fixed-text');
wrapChars(fixedText);

// Build a shuffled order for all character spans
const chars = Array.from(fixedText.querySelectorAll('.scroll-char'));
const order = chars.map((_, i) => i).sort(() => Math.random() - 0.5);
// Map from char index -> position in disappear sequence
const disappearAt = new Array(chars.length);
order.forEach((charIdx, seqIdx) => { disappearAt[charIdx] = seqIdx; });

let lastVisible = chars.length;

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const vh = window.innerHeight;
  const startDistance = vh * 0.2;  // nothing happens before 20vh
  const endDistance = vh * 0.5;    // all gone by 50vh

  const progress = Math.min(1, Math.max(0, (scrolled - startDistance) / (endDistance - startDistance)));
  const targetVisible = Math.round((1 - progress) * chars.length);

  if (targetVisible === lastVisible) return;
  lastVisible = targetVisible;

  chars.forEach((span, i) => {
    span.style.visibility = disappearAt[i] < (chars.length - targetVisible) ? 'hidden' : 'visible';
  });
});
