// State logic is separate so check.mjs can test it without a browser.
const CounterModel = {
  nextCount(count, action) {
    if (action === 'plus') return count + 1;
    if (action === 'minus') return Math.max(0, count - 1);
    if (action === 'reset') return 0;
    return count;
  }
};
globalThis.CounterModel = CounterModel;
if (typeof document !== 'undefined') {
  let count = 0;
  const value = document.querySelector('#value');
  const render = () => { value.textContent = count; };
  document.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => {
      count = CounterModel.nextCount(count, button.dataset.action);
      render();
    });
  });
  render();
}
