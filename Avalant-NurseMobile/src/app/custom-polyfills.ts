
let originalSetSelectionRange = HTMLInputElement.prototype.setSelectionRange;

function newSetselectionRange() {
  try {
    originalSetSelectionRange.apply(this, arguments);
  } catch (error) {
    console.warn('SetSelectionRange error :', error);
  }
}

HTMLInputElement.prototype.setSelectionRange = newSetselectionRange;