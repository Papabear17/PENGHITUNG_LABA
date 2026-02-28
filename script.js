// Initial Data
let bahanBaku = [
    // Empty default - no ingredients pre-filled
];

let biayaOperasional = 0;
let jumlahProduk = 1;
let hargaJualAktual = 0;

// Currency Formatter
const formatRp = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
};

// DOM Elems
const tbody = document.getElementById('bahanTbody');
const addBtn = document.getElementById('addBahanBtn');

const labelTotalBahan = document.getElementById('labelTotalBahan');
const inputBiayaOperasional = document.getElementById('inputBiayaOperasional');
const inputTotalProduk = document.getElementById('inputTotalProduk');
const valTotalProduksi = document.getElementById('valTotalProduksi');
const valHppPerPcs = document.getElementById('valHppPerPcs');
const valSaranJual = document.getElementById('valSaranJual');

// New elements for Pack/Profit calculation
const inputIsiPerPack = document.getElementById('inputIsiPerPack');
const valHppPerPack = document.getElementById('valHppPerPack');
const inputHargaJualPack = document.getElementById('inputHargaJualPack');
const inputHargaJualPcs = document.getElementById('inputHargaJualPcs');
const valHargaPerPackDariPcs = document.getElementById('valHargaPerPackDariPcs');
const valLabaPerPack = document.getElementById('valLabaPerPack');
const valTotalLabaPack = document.getElementById('valTotalLabaPack');
const valTotalPackDidapat = document.getElementById('valTotalPackDidapat');

// New elements for Sales Data section
const valModalPerPack = document.getElementById('valModalPerPack');
const valUntungPerPack = document.getElementById('valUntungPerPack');
const valMarginProfit = document.getElementById('valMarginProfit');
const valTargetPenjualan = document.getElementById('valTargetPenjualan');
const valEstimasiCuan = document.getElementById('valEstimasiCuan');
const valBreakEven = document.getElementById('valBreakEven');
const valAnalisisPenjualan = document.getElementById('valAnalisisPenjualan');

const toast = document.getElementById('toast');

// Local Storage Helper
const loadData = () => {
    const saved = localStorage.getItem('cirengData');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            bahanBaku = data.bahanBaku || [];
            biayaOperasional = data.biayaOperasional || 0;
            jumlahProduk = data.jumlahProduk || 1;

            if (data.isiPerPack) inputIsiPerPack.value = data.isiPerPack;
            if (data.hargaJualPack) inputHargaJualPack.value = data.hargaJualPack;
            if (data.hargaJualPcs) inputHargaJualPcs.value = data.hargaJualPcs;
        } catch (e) {
            console.error('Error loading data', e);
        }
    }
};

const saveData = () => {
    const data = {
        bahanBaku,
        biayaOperasional: parseFloat(inputBiayaOperasional.value) || 0,
        jumlahProduk: parseInt(inputTotalProduk.value) || 1,
        isiPerPack: parseInt(inputIsiPerPack.value) || 5,
        hargaJualPack: parseFloat(inputHargaJualPack.value) || 0,
        hargaJualPcs: parseFloat(inputHargaJualPcs.value) || 0
    };
    localStorage.setItem('cirengData', JSON.stringify(data));
};

// Calculate modal cost per item
const getHargaModal = (item) => {
    if (!item.isiKemasan || item.isiKemasan <= 0) return 0;
    return (item.hargaBeli / item.isiKemasan) * item.terpakai;
};

// Render Cards
const renderBahan = () => {
    tbody.innerHTML = '';
    let totalBiayaBahan = 0;

    bahanBaku.forEach(item => {
        let hargaModal = getHargaModal(item);
        totalBiayaBahan += hargaModal;

        const card = document.createElement('div');
        card.className = 'bahan-item';
        card.innerHTML = `
            <div class="item-header">
                <div class="item-info">
                    <input type="text" value="${item.nama}" placeholder="Nama Bahan" onchange="updateItem(${item.id}, 'nama', this.value)">
                </div>
                <button class="btn-delete" onclick="removeItem(${item.id})" title="Hapus Bahan">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </div>
            
            <div class="item-grid">
                <div class="field">
                    <label>Harga Beli Total (Rp)</label>
                    <input type="number" value="${item.hargaBeli}" min="0" onchange="updateItem(${item.id}, 'hargaBeli', this.value)">
                </div>
                <div class="field">
                    <label>Isi Bawaan Per Kemasan</label>
                    <div style="display: flex; gap: 5px;">
                        <input type="number" value="${item.isiKemasan}" min="0" onchange="updateItem(${item.id}, 'isiKemasan', this.value)" style="width: 60%;">
                        <select onchange="updateItem(${item.id}, 'satuan', this.value)" style="width: 40%; font-size: 0.8rem; padding: 0.5rem;">
                            <option value="gr" ${item.satuan === 'gr' || item.satuan === 'gram' ? 'selected' : ''}>gr</option>
                            <option value="ml" ${item.satuan === 'ml' ? 'selected' : ''}>ml</option>
                            <option value="biji" ${item.satuan === 'biji' ? 'selected' : ''}>biji</option>
                        </select>
                    </div>
                </div>
                <div class="field">
                    <label>Jumlah Terpakai</label>
                    <input type="number" value="${item.terpakai}" min="0" onchange="updateItem(${item.id}, 'terpakai', this.value)">
                </div>
            </div>

            <div class="item-total">
                <i class="ri-arrow-right-line" style="color:var(--text-muted)"></i>
                <span>Modal Terpakai:</span>
                <strong>${formatRp(hargaModal)}</strong>
            </div>
        `;
        tbody.appendChild(card);
    });

    // Update Overall Total Bahan
    labelTotalBahan.innerText = formatRp(totalBiayaBahan);
    calculateTotal(totalBiayaBahan);
};

// Main Calculations
const calculateTotal = (totalBahan) => {
    biayaOperasional = parseFloat(inputBiayaOperasional.value) || 0;
    jumlahProduk = parseInt(inputTotalProduk.value) || 1; // Prevent div by 0

    let totalProduksi = totalBahan + biayaOperasional;
    let hppPerPcs = totalProduksi / jumlahProduk;
    let saranJual = hppPerPcs * 1.5; // Target Profit 50%

    // Update Output
    valTotalProduksi.innerText = formatRp(totalProduksi);
    valHppPerPcs.innerText = formatRp(hppPerPcs);
    valSaranJual.innerText = formatRp(saranJual);

    // Pack calculations
    const isiPerPack = parseInt(inputIsiPerPack.value) || 5;
    const hppPerPack = hppPerPcs * isiPerPack;
    valHppPerPack.innerText = formatRp(hppPerPack);

    // Calculate price per pack from pcs (1 pack = 5 pcs)
    const hargaJualPcs = parseFloat(inputHargaJualPcs.value) || 0;
    const hargaPerPackDariPcs = hargaJualPcs * isiPerPack;
    valHargaPerPackDariPcs.innerText = formatRp(hargaPerPackDariPcs);

    // Use pack price for profit calculation (from either input)
    let hargaJualPack = parseFloat(inputHargaJualPack.value) || 0;
    // If pcs price is entered and pack price is not, use the calculated pack price
    if (hargaJualPcs > 0 && hargaJualPack === 0) {
        hargaJualPack = hargaPerPackDariPcs;
    }

    // Profit Calculation per Pack
    let labaPerPack = hargaJualPack - hppPerPack;
    let totalPack = Math.floor(jumlahProduk / isiPerPack);
    let sisaPcs = jumlahProduk % isiPerPack;
    let totalLabaPack = labaPerPack * totalPack;

    // Update profit display
    valLabaPerPack.innerText = formatRp(labaPerPack);
    valTotalLabaPack.innerText = formatRp(totalLabaPack);
    valTotalPackDidapat.innerHTML = `${totalPack} Pack (Sisa ${sisaPcs} Pcs)`;

    // Style profit based on positive/negative
    valLabaPerPack.style.color = labaPerPack >= 0 ? 'var(--success)' : 'var(--danger)';
    valTotalLabaPack.parentElement.style.background = labaPerPack >= 0 ? 'var(--success)' : 'var(--danger)';

    // Update Dynamic Label Title
    const judulDataPenjualan = document.getElementById('judulDataPenjualan');
    if (judulDataPenjualan) {
        judulDataPenjualan.innerText = `Data Penjualan 1 Pack (Isi ${isiPerPack})`;
    }

    // New Sales Data Calculation for 1 Pack
    if (hargaJualPack > 0) {
        const modalPerPack = hppPerPcs * isiPerPack;
        const untungPerPack = hargaJualPack - modalPerPack;
        const marginProfit = modalPerPack > 0 ? (untungPerPack / modalPerPack) * 100 : 0;
        const targetPenjualan = 100; // Default target
        const estimasiCuan = untungPerPack * targetPenjualan;
        const breakEvenPoint = modalPerPack > 0 ? Math.ceil(modalPerPack / untungPerPack) : 0;

        // Update display values
        valModalPerPack.innerText = formatRp(modalPerPack);
        valUntungPerPack.innerText = formatRp(untungPerPack);
        valMarginProfit.innerText = marginProfit.toFixed(1) + '%';
        valTargetPenjualan.innerText = targetPenjualan + ' Pack';
        valEstimasiCuan.innerText = formatRp(estimasiCuan);
        valBreakEven.innerText = breakEvenPoint + ' Pack';

        // Style based on profit
        valUntungPerPack.style.color = untungPerPack >= 0 ? 'var(--success)' : 'var(--danger)';
        valMarginProfit.style.color = marginProfit >= 20 ? 'var(--success)' : marginProfit >= 0 ? 'var(--warning)' : 'var(--danger)';

        // Analysis message
        let analisis = '';
        if (untungPerPack < 0) {
            analisis = 'Harga terlalu rendah, akan rugi!';
        } else if (marginProfit < 10) {
            analisis = 'Margin kecil, pertimbangkan kenaikan harga';
        } else if (marginProfit < 20) {
            analisis = 'Margin cukup, bisa dipertimbangkan';
        } else {
            analisis = 'Margin bagus! Harga sudah optimal';
        }
        valAnalisisPenjualan.innerHTML = analisis;
    } else {
        // Reset values when no price entered
        valModalPerPack.innerText = formatRp(hppPerPcs * isiPerPack);
        valUntungPerPack.innerText = 'Rp 0';
        valMarginProfit.innerText = '0%';
        valTargetPenjualan.innerText = '0';
        valEstimasiCuan.innerText = 'Rp 0';
        valBreakEven.innerText = '0 Pack';
        valAnalisisPenjualan.innerHTML = 'Masukkan harga jual untuk melihat analisis';
        valUntungPerPack.style.color = 'var(--text-main)';
        valMarginProfit.style.color = 'var(--text-main)';
    }

    // Auto-save data setiap kali kalkulasi terjadi
    saveData();
};

// CRUD Event Listner
window.updateItem = (id, field, value) => {
    const item = bahanBaku.find(i => i.id === id);
    if (item) {
        item[field] = field === 'nama' || field === 'satuan' ? value : Number(value);
        renderBahan(); // triggers re-render and re-calc
    }
};

window.removeItem = (id) => {
    bahanBaku = bahanBaku.filter(i => i.id !== id);
    renderBahan();
    showToast("Bahan dihapus!");
};

addBtn.addEventListener('click', () => {
    const newId = bahanBaku.length > 0 ? Math.max(...bahanBaku.map(i => i.id)) + 1 : 1;
    bahanBaku.push({ id: newId, nama: "", hargaBeli: 0, satuan: "gr", isiKemasan: 0, terpakai: 0 });
    renderBahan();
    saveData();
});

// Input Listeners
inputBiayaOperasional.addEventListener('input', () => renderBahan());
inputTotalProduk.addEventListener('input', () => renderBahan());
inputHargaJualPack.addEventListener('input', () => renderBahan());
inputHargaJualPcs.addEventListener('input', () => renderBahan());
inputIsiPerPack.addEventListener('input', () => renderBahan());

// Toast func
const showToast = (msg) => {
    toast.innerHTML = `<i class="ri-check-line"></i> <span>${msg}</span>`;
    toast.style.opacity = 1;
    toast.style.bottom = "30px";

    setTimeout(() => {
        toast.style.opacity = 0;
        toast.style.bottom = "-100px";
    }, 2500);
}

// Initializing Data to DOM
window.onload = () => {
    loadData();
    inputBiayaOperasional.value = biayaOperasional;
    inputTotalProduk.value = jumlahProduk;
    renderBahan();
};

/* PWA App Install Logic */
let deferredPrompt;
const installBtn = document.getElementById('installAppBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.classList.remove('hidden');
});

installBtn.addEventListener('click', async () => {
    if (deferredPrompt !== null) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            installBtn.classList.add('hidden');
        }
        deferredPrompt = null;
    }
});
