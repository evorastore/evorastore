document.documentElement.classList.add("js");

// ====== PENGATURAN (ganti dengan datamu) ======
const WA = "6281412442485"; // 081412442485 dalam format 62

// ====== DATA PRODUK ======
const products = [
  { nama: "Bintang Bunny Headphone", kategori: "bintang", harga: 20000, img: "p-bunny-headphone.jpg", desk: "Bintang denim dengan bordir kelinci berheadphone. Lucu dipasang di tas atau kunci." },
  { nama: "Bintang Hero", kategori: "bintang", harga: 20000, img: "p-hero-star.jpg", desk: "Bintang denim dengan bordir karakter merah, tampil beda dan berani." },
  { nama: "Bintang Bunny Pink", kategori: "bintang", harga: 18000, img: "p-bunny-pink.jpg", desk: "Bintang denim dengan kelinci imut dan detail hati kecil." },
  { nama: "Bintang Galaksi", kategori: "bintang", harga: 20000, img: "galaksi.jpg", desk: "Bintang dari jeans bekas, dilukis motif pusaran galaksi dan dijahit tepi manual." },
  { nama: "Bunny Denim", kategori: "karakter", harga: 18000, img: "p-bunny.jpg", desk: "Gantungan kelinci dari denim bekas dengan kancing sebagai mata." },
  { nama: "Mini Bag Charm", kategori: "karakter", harga: 15000, img: "p-mini-bag.jpg", desk: "Tas mungil dari denim dengan patch bintang dan kancing putih." },
  { nama: "Charm Pita Bintang", kategori: "charm", harga: 17000, img: "p-pita-star.jpg", desk: "Bintang denim dengan pita, rantai, dan tali warna biru." },
  { nama: "Charm Pita Hati", kategori: "charm", harga: 17000, img: "p-pita-heart.jpg", desk: "Hati denim dengan pita merah dan charm beruang mungil." }
];

const gallery = [
  { img: "hero.jpg", t: "Koleksi gantungan denim EvoraStore" },
  { img: "galaksi.jpg", t: "Bintang motif galaksi" },
  { img: "pita.jpg", t: "Charm pita bintang dan hati" },
  { img: "p-bunny-pink.jpg", t: "Bintang bunny pink" },
  { img: "p-mini-bag.jpg", t: "Mini bag charm" },
  { img: "p-bunny.jpg", t: "Bunny denim" }
];

const rupiah = n => "Rp " + n.toLocaleString("id-ID");
const $ = s => document.querySelector(s);

// ====== RENDER PRODUK + FILTER ======
function renderProducts(filter = "all") {
  const list = filter === "all" ? products : products.filter(p => p.kategori === filter);
  $("#productGrid").innerHTML = list.map(p => `
    <article class="product">
      <img src="${p.img}" alt="${p.nama}" loading="lazy">
      <div class="pbody">
        <h3>${p.nama}</h3>
        <p>${p.desk}</p>
        <p class="price">${rupiah(p.harga)}</p>
        <button class="btn" data-nama="${p.nama}">Detail</button>
      </div>
    </article>`).join("");
}
renderProducts();

document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelector(".chip.active").classList.remove("active");
    chip.classList.add("active");
    renderProducts(chip.dataset.filter);
  });
});

// ====== MODAL ======
const modal = $("#modal");
const openModal = html => { $("#modalBody").innerHTML = html; modal.hidden = false; };
const closeModal = () => (modal.hidden = true);
$("#close").onclick = closeModal;
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

$("#productGrid").addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  const p = products.find(x => x.nama === b.dataset.nama);
  const text = encodeURIComponent("Halo EvoraStore, aku mau pesan " + p.nama + " (" + rupiah(p.harga) + ")");
  openModal(`
    <img src="${p.img}" alt="${p.nama}">
    <div class="mtext">
      <h3>${p.nama}</h3><p>${p.desk}</p>
      <p class="price">${rupiah(p.harga)}</p>
      <a class="btn" href="https://wa.me/${WA}?text=${text}" target="_blank" rel="noopener">Pesan via WhatsApp</a>
      <a class="btn ghost" href="toko.html">Lihat di Toko</a>
    </div>`);
});

// ====== GALERI ======
$("#gallery").innerHTML = gallery.map((g, i) =>
  `<img src="${g.img}" alt="${g.t}" data-i="${i}" loading="lazy">`).join("");
$("#gallery").addEventListener("click", e => {
  const im = e.target.closest("img");
  if (!im) return;
  const g = gallery[im.dataset.i];
  openModal(`<img src="${g.img}" alt="${g.t}"><div class="mtext"><h3>${g.t}</h3></div>`);
});

// ====== MENU MOBILE ======
$("#burger").onclick = () => $("#menu").classList.toggle("open");
$("#menu").addEventListener("click", e => { if (e.target.tagName === "A") $("#menu").classList.remove("open"); });

// ====== DARK / LIGHT MODE ======
const root = document.documentElement;
function setTheme(t) { root.dataset.theme = t; $("#themeBtn").textContent = t === "dark" ? "☀️" : "🌙"; }
setTheme(matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
$("#themeBtn").onclick = () => setTheme(root.dataset.theme === "dark" ? "light" : "dark");

// ====== ANIMASI SAAT SCROLL ======
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// ====== VALIDASI FORM ======
$("#form").addEventListener("submit", e => {
  e.preventDefault();
  const nama = $("#nama").value.trim(), email = $("#email").value.trim(), pesan = $("#pesan").value.trim();
  const msg = $("#formMsg");
  const show = (t, ok) => { msg.textContent = t; msg.className = ok ? "ok" : "err"; };
  if (nama.length < 3) return show("Nama minimal 3 karakter.", false);
  if (!/^\S+@\S+\.\S+$/.test(email)) return show("Format email belum benar.", false);
  if (pesan.length < 10) return show("Pesan minimal 10 karakter.", false);
  show("Terima kasih, " + nama + "! Pesanmu sudah terkirim 👖", true);
  e.target.reset();
});
