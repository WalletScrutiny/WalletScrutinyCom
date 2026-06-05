import QRCode from 'qrcode';

function showZapModal({ onClose, setZapped, zapEvent } = {}) {
  const resolveZapEvent = () => zapEvent || window.currentVerification || window.profileEvent;
  const style = document.createElement('style');
  style.textContent = `
    .zap-amount-selected {
      background: #1caaa2 !important;
      color: #222 !important;
      font-weight: bold;
      border: 2px solid #ff9800;
    }
    body.dark .zap-amount-selected {
      background: #1caaa2 !important;
      color: #222 !important;
      font-weight: bold;
      border: 2px solid #ff9800;
    }
    .zap-modal {
      position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.5); z-index: 10010; display: flex; align-items: center; justify-content: center;
    }
    .zap-modal-content {
      background: #fff; padding: 2em; border-radius: 8px; min-width: 320px; max-width: 90vw; position: relative;
      color: #222;
    }
    body.dark .zap-modal-content {
      background: #232323;
      color: #f5f5f5;
    }
    .zap-modal-close {
      position: absolute; right: 1em; top: 1em; font-size: 1.5em; background: none; border: none; cursor: pointer;
      color: #888;
    }
    body.dark .zap-modal-close {
      color: #ccc;
    }
    .zap-modal-content h2 {
      margin-top: 0;
    }
    .zap-amounts {
      display: flex; gap: 0.5em; flex-wrap: wrap; margin-bottom: 1em;
    }
    .zap-amounts button {
      background: #f5f5f5;
      color: #222;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 0.5em 1em;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }
    body.dark .zap-amounts button {
      background: #333;
      color: #f5f5f5;
      border: 1px solid #555;
    }
    #customZapAmount {
      width: 100%; margin-bottom: 0.5em;
      background: #fff;
      color: #222;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 0.5em;
    }
    body.dark #customZapAmount {
      background: #232323;
      color: #f5f5f5;
      border: 1px solid #555;
    }
    #zapMessage {
      width: 100%; margin-bottom: 0.5em;
      background: #fff;
      color: #222;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 0.5em;
    }
    body.dark #zapMessage {
      background: #232323;
      color: #f5f5f5;
      border: 1px solid #555;
    }
    #zapSendBtn {
      width: 100%; margin-bottom: 0.5em;
      background: #1caaa2;
      color: #222;
      border: none;
      border-radius: 5px;
      font-weight: bold;
      padding: 0.7em 0;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }
    body.dark #zapSendBtn {
      background: #1caaa2;
      color: #222;
    }
    #zapError {
      color: red; margin-bottom: 0.5em;
    }
    #zapQR {
      display: none; text-align: center;
    }
    #zapQR.active {
      display: block;
    }
    #bolt11-short {
      word-break: break-all;
    }
    #bolt11-copy-btn {
      margin-left: 6px; cursor: pointer;
      background: none;
      border: none;
      color: #222;
      font-size: 1em;
    }
    body.dark #bolt11-copy-btn {
      color: #1caaa2;
    }
    #zapQR p:last-child {
      font-size: 0.9em; opacity: 0.7;
    }`;
  document.head.appendChild(style);

  const event = resolveZapEvent();
  if (!event) {
    console.error('No event found for zap');
    return;
  }

  const modal = document.createElement('div');
  modal.className = 'zap-modal';
  modal.style = '';
  modal.innerHTML = `
    <div class="zap-modal-content">
      <button class="zap-modal-close">&times;</button>

      <div id="zap-modal-content-inner">
        <label>Zap amount in sats</label>
        <div class="zap-amounts"></div>
        <input type="number" min="1" id="customZapAmount" placeholder="Custom amount (sats)" />
        <textarea id="zapMessage" placeholder="Optional message"></textarea>
        <button id="zapSendBtn">Zap</button>
        <div id="zapError"></div>
        <div id="zapQR"></div>
      </div>
      <div id="zap-modal-content-result"></div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('.zap-modal-close').onclick = () => {
    document.getElementById('loadingSpinner').style.display = 'none';
    modal.remove();
    if (onClose) onClose();
  };

  const amounts = {
    "1000": "👍",
    "5000": "💜",
    "10000": "😍",
    "20000": "🤩",
    "50000": "🔥",
    "100000": "🚀",
    "1000000": "🤯",
  };
  const zapAmountsDiv = modal.querySelector('.zap-amounts');
  let selectedAmount = null;
  let amountButtons = [];

  Object.entries(amounts).forEach(([amt, emoji]) => {
    const btn = document.createElement('button');
    btn.textContent = `${emoji} ${formatZapAmount(amt)}`;
    btn.style = 'flex:1 1 30%; min-width:60px;';
    if (amt == selectedAmount) btn.classList.add('zap-amount-selected');
    btn.onclick = () => {
      selectedAmount = amt;
      modal.querySelector('#customZapAmount').value = amt;
      amountButtons.forEach(b => b.classList.remove('zap-amount-selected'));
      btn.classList.add('zap-amount-selected');
    };
    zapAmountsDiv.appendChild(btn);
    amountButtons.push(btn);
  });

  modal.querySelector('#customZapAmount').oninput = (e) => {
    selectedAmount = e.target.value;
    amountButtons.forEach(b => b.classList.remove('zap-amount-selected'));
  };

  modal.querySelector('#zapSendBtn').onclick = async () => {
    document.getElementById('loadingSpinner').style.display = 'block';

    const errorDiv = modal.querySelector('#zapError');
    errorDiv.textContent = '';
    const zapMessage = modal.querySelector('#zapMessage').value;
    let amount = Number(selectedAmount);

    if (!amount || amount < 1) {
      errorDiv.textContent = 'Zap amount must be greater than 0';
      return;
    }

    try {
      const zapTarget = resolveZapEvent();
      if (!zapTarget) {
        errorDiv.textContent = 'Verification context was lost. Close and reopen the verification modal.';
        document.getElementById('loadingSpinner').style.display = 'none';
        return;
      }

      const lnPay = async ({ pr }) => {
        showZapQR(pr, modal);
        return undefined;
      };

      const currentInvoice = await createZap({ event: zapTarget, amount, comment: zapMessage });

      await lnPay({ pr: currentInvoice });

      await subscribeToZapReceipts(zapTarget, currentInvoice, async (event) => {
        if (event) {
          modal.querySelector('#zap-modal-content-inner').style.display = 'none';
          modal.querySelector('#zap-modal-content-result').innerHTML = '<p style="color: green; font-weight: bold; font-size: 2.2em;">Zap sent!</p>';
          if (onClose) onClose();
        }
      });
    } catch (err) {
      errorDiv.textContent = err.message || 'Failed to process zap. Please try again.';
    } finally {
      document.getElementById('loadingSpinner').style.display = 'none';
    }
  };

  function showZapQR(bolt11, modal) {
    const qrDiv = modal.querySelector('#zapQR');
    qrDiv.classList.add('active');

    const shortBolt11 = `${bolt11.slice(0, 8)}...${bolt11.slice(-8)}`;
    qrDiv.innerHTML = `
      <p style="margin-bottom: 8px;">Scan the QR with your Lightning wallet to send the zap:</p>
      <canvas id="zapQRCode"></canvas>
      <p>
        <code id="bolt11-short">${shortBolt11}</code>
        <button id="bolt11-copy-btn" title="Copy full invoice">📋</button>
      </p>
    `;
    if (QRCode) {
      QRCode.toCanvas(
        document.getElementById('zapQRCode'),
        `lightning:${bolt11}`,
        function (error) {
          if (error) qrDiv.innerHTML += '<p>Error generating QR</p>';
        }
      );

      const qrCanvas = document.getElementById('zapQRCode');
      qrCanvas.style.cursor = 'pointer';
      qrCanvas.title = 'Click to open zap invoice in LN wallet';
      qrCanvas.onclick = () => {
        window.open(`lightning:${bolt11}`, '_blank');
      };
    } else {
      qrDiv.innerHTML += '<p>QRCode lib not loaded</p>';
    }

    document.getElementById('bolt11-copy-btn').onclick = (e) => {
      e.stopPropagation();

      navigator.clipboard.writeText(bolt11).then(() => {
        showToast('Lightning invoice copied to clipboard', 'success');
      });
    };
  }
}

export { showZapModal };
window.showZapModal = showZapModal;