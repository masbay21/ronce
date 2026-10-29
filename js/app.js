/* =========================================================
   Ronce — data produk, keranjang, dan checkout via WhatsApp
   Ganti nomor WA & data produk di bagian paling atas saja.
   ========================================================= */

const TOKO = {
  nama: "Ronce",
  wa: "6281234567890", // dummy, ganti dengan nomor WA toko
};

const PRODUK = [
  {
    id: "nama",
    nama: "Gelang Nama",
    harga: 39000,
    foto: "img/p-nama.svg",
    ringkas: "Huruf kubus putih, tulis nama atau kata yang kamu mau.",
    deskripsi:
      "Manik huruf akrilik 6 mm diselingi manik kaca warna pastel. Maksimal 10 huruf (A–Z, angka, dan tanda hati). Tali elastis double, jadi tidak gampang putus waktu dipakai-lepas.",
    bahan: "Akrilik, manik kaca, tali elastis 0,8 mm",
    custom: true,
  },
  {
    id: "pelangi",
    nama: "Pelangi Pasar",
    harga: 29000,
    foto: "img/p-pelangi.svg",
    ringkas: "Manik biji 4 mm, tujuh warna, enak ditumpuk.",
    deskripsi:
      "Ide awalnya dari tumpukan manik di pasar Raya Salatiga. Warnanya ramai tapi tipis di tangan, cocok dipakai dua atau tiga sekaligus.",
    bahan: "Manik kaca seed bead 4 mm, tali elastis",
  },
  {
    id: "lava",
    nama: "Batu Lava",
    harga: 55000,
    foto: "img/p-lava.svg",
    ringkas: "Batu lava hitam 8 mm dengan dua manik kuningan.",
    deskripsi:
      "Batu lava aslinya berpori, jadi teksturnya kasar dan ringan. Bisa ditetesi minyak wangi favoritmu, aromanya bertahan beberapa jam. Manik kuningan tidak berlapis emas.",
    bahan: "Batu lava alami 8 mm, kuningan, tali elastis",
  },
  {
    id: "mutiara",
    nama: "Mutiara Air Tawar",
    harga: 79000,
    foto: "img/p-mutiara.svg",
    ringkas: "Mutiara air tawar asli, bentuknya tidak seragam.",
    deskripsi:
      "Mutiara air tawar budidaya ukuran 6–7 mm. Bentuknya sedikit lonjong dan tiap butir beda, itu tanda asli, bukan cacat. Jangan kena parfum dan air sabun supaya kilaunya awet.",
    bahan: "Mutiara air tawar 6–7 mm, tali elastis",
  },
  {
    id: "kayu",
    nama: "Kayu Sawo",
    harga: 35000,
    foto: "img/p-kayu.svg",
    ringkas: "Manik kayu sawo 8 mm, finishing minyak, tanpa cat.",
    deskripsi:
      "Kayu sawo diampelas halus lalu dilapisi minyak, jadi warnanya akan sedikit menggelap seiring dipakai. Ringan, cocok untuk yang tidak suka gelang dingin di kulit.",
    bahan: "Kayu sawo 8 mm, minyak finishing, tali elastis",
  },
  {
    id: "embun",
    nama: "Embun",
    harga: 45000,
    foto: "img/p-embun.svg",
    ringkas: "Manik kaca bening biru-hijau, kalem dan dingin.",
    deskripsi:
      "Manik kaca ceko 7 mm dengan tiga gradasi: biru es, putih susu, dan hijau mint. Kelihatan paling bagus kena sinar matahari pagi.",
    bahan: "Manik kaca 7 mm, tali elastis",
  },
];

const UKURAN = [
  { kode: "S", ket: "S · 14–15 cm" },
  { kode: "M", ket: "M · 16–17 cm" },
  { kode: "L", ket: "L · 18–19 cm" },
];

/* ---------- util ---------- */
const rupiah = (n) => "Rp" + n.toLocaleString("id-ID");
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const cariProduk = (id) => PRODUK.find((p) => p.id === id);

/* ---------- penyimpanan keranjang ---------- */
const KEY = "ronce-keranjang";
let keranjang = [];
try { keranjang = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { keranjang = []; }
const simpan = () => { try { localStorage.setItem(KEY, JSON.stringify(keranjang)); } catch (e) {} };

function tambahKeKeranjang(id, ukuran = "M", teks = "", qty = 1) {
  const kunci = `${id}|${ukuran}|${teks}`;
  const ada = keranjang.find((i) => i.kunci === kunci);
  if (ada) ada.qty += qty;
  else keranjang.push({ kunci, id, ukuran, teks, qty });
  simpan();
  renderKeranjang();
  const p = cariProduk(id);
  toast(`${p.nama}${teks ? ` “${teks}”` : ""} masuk keranjang`);
  bump();
}

function ubahQty(kunci, d) {
  const item = keranjang.find((i) => i.kunci === kunci);
  if (!item) return;
  item.qty += d;
  if (item.qty <= 0) keranjang = keranjang.filter((i) => i.kunci !== kunci);
  simpan();
  renderKeranjang();
}

const totalItem = () => keranjang.reduce((a, i) => a + i.qty, 0);
const totalHarga = () => keranjang.reduce((a, i) => a + cariProduk(i.id).harga * i.qty, 0);

/* ---------- komponen bersama (header, drawer, footer) ---------- */
function pasangKerangka() {
  const halaman = document.body.dataset.page;
  const aktif = (p) => (halaman === p ? ' aria-current="page"' : "");

  document.body.insertAdjacentHTML(
    "afterbegin",
    `<a class="skip" href="#isi">Langsung ke isi</a>
    <header class="top">
      <a class="brand" href="index.html" aria-label="Ronce, ke beranda">
        <img src="img/logo.svg" alt="" width="36" height="36"><span>ronce</span>
      </a>
      <nav class="nav" aria-label="Menu utama">
        <a href="index.html#koleksi">Koleksi</a>
        <a href="index.html#ukuran">Ukuran</a>
        <a href="tentang.html"${aktif("tentang")}>Tentang</a>
        <a href="kebijakan.html"${aktif("kebijakan")}>Kebijakan</a>
        <a href="kontak.html"${aktif("kontak")}>Kontak</a>
      </nav>
      <button class="cart-btn" type="button" aria-controls="drawer" aria-expanded="false">
        Keranjang <span class="cart-count" aria-live="polite">0</span>
      </button>
    </header>
    <nav class="mnav" aria-label="Menu">
      <a href="index.html#koleksi">Koleksi</a>
      <a href="index.html#ukuran">Ukuran</a>
      <a href="tentang.html">Tentang</a>
      <a href="kebijakan.html">Kebijakan</a>
      <a href="kontak.html">Kontak</a>
    </nav>`
  );

  document.body.insertAdjacentHTML(
    "beforeend",
    `<footer class="foot">
      <div class="foot-grid">
        <div>
          <p class="foot-brand">ronce</p>
          <p>Gelang manik ronce tangan dari Salatiga.<br>Jl. Diponegoro No. 52, Sidorejo, Kota Salatiga 50711</p>
          <p class="legal">NIB 1209240078321 · PIRT tidak diperlukan (non-pangan)</p>
        </div>
        <div>
          <p class="foot-h">Belanja</p>
          <a href="index.html#koleksi">Koleksi</a>
          <a href="index.html#ukuran">Cara ukur</a>
          <a href="kebijakan.html#bayar">Cara pembayaran</a>
          <a href="kebijakan.html#kirim">Pengiriman</a>
        </div>
        <div>
          <p class="foot-h">Bantuan</p>
          <a href="kebijakan.html#retur">Retur &amp; refund</a>
          <a href="kebijakan.html#privasi">Privasi</a>
          <a href="tentang.html">Tentang kami</a>
          <a href="kontak.html">Kontak</a>
        </div>
        <div>
          <p class="foot-h">Ikuti</p>
          <a href="https://instagram.com/" target="_blank" rel="noopener">Instagram @ronce.gelang</a>
          <a href="https://tiktok.com/" target="_blank" rel="noopener">TikTok @ronce.gelang</a>
          <a href="https://wa.me/${TOKO.wa}" target="_blank" rel="noopener">WhatsApp admin</a>
        </div>
      </div>
      <p class="copy">© 2026 Ronce. Website ini rancangan tugas kuliah; data toko bersifat contoh.</p>
    </footer>

    <div class="scrim" hidden></div>
    <aside id="drawer" class="drawer" aria-label="Keranjang belanja" aria-hidden="true">
      <div class="drawer-head">
        <h2>Keranjang</h2>
        <button class="x" type="button" aria-label="Tutup keranjang">×</button>
      </div>
      <div class="drawer-body"></div>
    </aside>

    <dialog id="detail" class="detail" aria-labelledby="detail-nama"></dialog>
    <div class="toast" role="status" aria-live="polite"></div>`
  );

  $(".cart-btn").addEventListener("click", bukaDrawer);
  $(".drawer .x").addEventListener("click", tutupDrawer);
  $(".scrim").addEventListener("click", tutupDrawer);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") tutupDrawer(); });
}

function bukaDrawer() {
  $(".drawer").classList.add("open");
  $(".drawer").setAttribute("aria-hidden", "false");
  $(".cart-btn").setAttribute("aria-expanded", "true");
  $(".scrim").hidden = false;
  document.body.style.overflow = "hidden";
  setTimeout(() => $(".drawer .x").focus(), 50);
}
function tutupDrawer() {
  if (!$(".drawer")?.classList.contains("open")) return;
  $(".drawer").classList.remove("open");
  $(".drawer").setAttribute("aria-hidden", "true");
  $(".cart-btn").setAttribute("aria-expanded", "false");
  $(".scrim").hidden = true;
  document.body.style.overflow = "";
  $(".cart-btn").focus();
}

function bump() {
  const c = $(".cart-count");
  c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
}

let toastTimer;
function toast(msg) {
  const t = $(".toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
}

/* ---------- render keranjang ---------- */
function renderKeranjang() {
  $(".cart-count").textContent = totalItem();
  const body = $(".drawer-body");
  if (!body) return;

  if (!keranjang.length) {
    body.innerHTML = `<div class="empty">
        <p>Keranjangmu masih kosong.</p>
        <a class="btn" href="index.html#koleksi">Lihat koleksi</a>
      </div>`;
    body.querySelector("a").addEventListener("click", tutupDrawer);
    return;
  }

  body.innerHTML = `
    <ul class="lines">
      ${keranjang.map((i) => {
        const p = cariProduk(i.id);
        return `<li class="line">
          <img src="${p.foto}" alt="" width="64" height="64">
          <div class="line-info">
            <p class="line-nama">${p.nama}</p>
            <p class="line-var">Ukuran ${i.ukuran}${i.teks ? ` · huruf “${i.teks}”` : ""}</p>
            <div class="qty" role="group" aria-label="Jumlah ${p.nama}">
              <button type="button" data-k="${i.kunci}" data-d="-1" aria-label="Kurangi">−</button>
              <span>${i.qty}</span>
              <button type="button" data-k="${i.kunci}" data-d="1" aria-label="Tambah">+</button>
            </div>
          </div>
          <p class="line-harga">${rupiah(p.harga * i.qty)}</p>
        </li>`;
      }).join("")}
    </ul>
    <div class="sum">
      <p><span>Subtotal</span><strong>${rupiah(totalHarga())}</strong></p>
      <p class="note">Ongkir dihitung admin setelah alamat masuk. Gratis ongkir Salatiga kota untuk belanja di atas Rp100.000.</p>
    </div>
    <form class="checkout" novalidate>
      <h3>Data pengiriman</h3>
      <label>Nama penerima<input name="nama" required autocomplete="name"></label>
      <label>No. WhatsApp<input name="hp" required inputmode="tel" autocomplete="tel" placeholder="08xxxxxxxxxx"></label>
      <label>Alamat lengkap<textarea name="alamat" rows="2" required autocomplete="street-address" placeholder="Jalan, RT/RW, kelurahan, kecamatan, kota, kode pos"></textarea></label>
      <label>Kurir
        <select name="kurir">
          <option>JNE Reguler</option><option>J&amp;T Express</option><option>SiCepat</option>
          <option>GoSend (Salatiga)</option><option>Ambil sendiri di workshop</option>
        </select>
      </label>
      <label>Bayar lewat
        <select name="bayar">
          <option>Transfer BCA</option><option>Transfer BSI</option><option>QRIS</option><option>COD (Salatiga kota)</option>
        </select>
      </label>
      <p class="err" role="alert"></p>
      <button class="btn btn-wide" type="submit">Kirim pesanan lewat WhatsApp</button>
      <p class="note">Pesanan diteruskan ke WhatsApp admin. Data kamu hanya dipakai untuk pengiriman, lihat <a href="kebijakan.html#privasi">kebijakan privasi</a>.</p>
    </form>`;

  $$(".qty button", body).forEach((b) =>
    b.addEventListener("click", () => ubahQty(b.dataset.k, +b.dataset.d))
  );
  $(".checkout", body).addEventListener("submit", kirimPesanan);
}

function kirimPesanan(e) {
  e.preventDefault();
  const f = e.target;
  const d = Object.fromEntries(new FormData(f));
  const err = $(".err", f);
  if (!d.nama.trim() || !d.hp.trim() || !d.alamat.trim()) {
    err.textContent = "Nama, nomor WhatsApp, dan alamat wajib diisi supaya paket bisa dikirim.";
    return;
  }
  err.textContent = "";
  const kode = "RNC-" + Date.now().toString(36).slice(-5).toUpperCase();
  const baris = keranjang.map((i) => {
    const p = cariProduk(i.id);
    return `- ${p.nama} (${i.ukuran}${i.teks ? `, huruf "${i.teks}"` : ""}) x${i.qty} = ${rupiah(p.harga * i.qty)}`;
  });
  const pesan =
`Halo Ronce, saya mau pesan.
Kode: ${kode}

${baris.join("\n")}

Subtotal: ${rupiah(totalHarga())}
Kurir: ${d.kurir}
Bayar: ${d.bayar}

Nama: ${d.nama}
WA: ${d.hp}
Alamat: ${d.alamat}`;
  window.open(`https://wa.me/${TOKO.wa}?text=${encodeURIComponent(pesan)}`, "_blank", "noopener");
  toast(`Pesanan ${kode} dibuka di WhatsApp`);
}

/* ---------- katalog ---------- */
function renderKatalog() {
  const grid = $("#grid");
  if (!grid) return;
  grid.innerHTML = PRODUK.map((p) => `
    <article class="card">
      <button class="card-img" type="button" data-id="${p.id}" aria-label="Lihat detail ${p.nama}">
        <img src="${p.foto}" alt="Gelang ${p.nama}" width="600" height="600" loading="lazy">
      </button>
      <div class="card-body">
        <h3>${p.nama}</h3>
        <p class="tag" aria-label="Harga">${rupiah(p.harga)}</p>
        <p class="card-desc">${p.ringkas}</p>
        <div class="card-act">
          ${p.custom
            ? `<button class="btn btn-sm" type="button" data-id="${p.id}" data-open>Tulis hurufnya</button>`
            : `<button class="btn btn-sm" type="button" data-add="${p.id}">Tambah ke keranjang</button>`}
          <button class="link" type="button" data-id="${p.id}" data-open>Detail</button>
        </div>
      </div>
    </article>`).join("");

  $$("[data-add]", grid).forEach((b) => b.addEventListener("click", () => tambahKeKeranjang(b.dataset.add, "M")));
  $$(".card-img, [data-open]", grid).forEach((b) => b.addEventListener("click", () => bukaDetail(b.dataset.id)));
}

function bukaDetail(id, teksAwal = "") {
  const p = cariProduk(id);
  const dlg = $("#detail");
  dlg.innerHTML = `
    <form method="dialog" class="detail-in">
      <button class="x" value="tutup" aria-label="Tutup">×</button>
      <img src="${p.foto}" alt="Gelang ${p.nama}" width="600" height="600">
      <div class="detail-txt">
        <h2 id="detail-nama">${p.nama}</h2>
        <p class="tag">${rupiah(p.harga)}</p>
        <p>${p.deskripsi}</p>
        <p class="bahan"><strong>Bahan:</strong> ${p.bahan}</p>
        ${p.custom ? `<label class="fld">Huruf (maks. 10)
          <input name="teks" maxlength="10" value="${teksAwal}" placeholder="mis. NAYA" autocomplete="off"></label>` : ""}
        <fieldset class="sizes">
          <legend>Ukuran pergelangan <a href="index.html#ukuran">cara ukur</a></legend>
          ${UKURAN.map((u) => `<label><input type="radio" name="uk" value="${u.kode}" ${u.kode === "M" ? "checked" : ""}><span>${u.ket}</span></label>`).join("")}
        </fieldset>
        <div class="detail-act">
          <div class="qty"><button type="button" data-q="-1" aria-label="Kurangi">−</button><span class="qv">1</span><button type="button" data-q="1" aria-label="Tambah">+</button></div>
          <button class="btn" type="button" data-go>Tambah ke keranjang</button>
        </div>
        <p class="err" role="alert"></p>
      </div>
    </form>`;
  let q = 1;
  $$("[data-q]", dlg).forEach((b) => b.addEventListener("click", () => {
    q = Math.max(1, q + +b.dataset.q); $(".qv", dlg).textContent = q;
  }));
  $("[data-go]", dlg).addEventListener("click", () => {
    const uk = $("input[name=uk]:checked", dlg).value;
    let teks = "";
    if (p.custom) {
      teks = $("input[name=teks]", dlg).value.trim().toUpperCase();
      if (!teks) { $(".err", dlg).textContent = "Tulis dulu huruf yang mau dironce."; return; }
    }
    tambahKeKeranjang(p.id, uk, teks, q);
    dlg.close();
  });
  dlg.showModal();
}

/* ---------- gelang nama interaktif di hero ---------- */
function pasangHero() {
  const inp = $("#nama-hero");
  const tali = $("#tali");
  if (!inp || !tali) return;
  const warna = ["#F2D35B", "#E98A9E", "#9CC5A1", "#8FB4F0"];
  const gambar = () => {
    const teks = (inp.value.toUpperCase().replace(/[^A-Z0-9♥ ]/g, "") || "RONCE").slice(0, 10);
    const isi = [];
    for (let i = 0; i < 5; i++) isi.push(`<span class="b" style="--c:${warna[i % 4]}"></span>`);
    [...teks].forEach((h) => isi.push(h === " " ? `<span class="b" style="--c:#fff"></span>` : `<span class="h">${h}</span>`));
    for (let i = 0; i < 5; i++) isi.push(`<span class="b" style="--c:${warna[(i + 2) % 4]}"></span>`);
    tali.innerHTML = isi.join("");
    const n = isi.length;
    [...tali.children].forEach((el, i) => {
      const x = (i - (n - 1) / 2) / ((n - 1) / 2); // -1..1
      el.style.transform = `translateY(${(1 - x * x) * 34}px) rotate(${-x * 18}deg)`;
    });
  };
  inp.addEventListener("input", gambar);
  gambar();
  $("#pesan-hero").addEventListener("click", () => {
    const t = inp.value.trim().toUpperCase().slice(0, 10);
    bukaDetail("nama", t || "");
  });
}

/* ---------- jalan ---------- */
pasangKerangka();
renderKatalog();
pasangHero();
renderKeranjang();
