pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

let products = [];

async function loadPDF() {
  const pdf = await pdfjsLib.getDocument("pdfs/SKF/skf.pdf").promise;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const text = await page.getTextContent();
    const content = text.items.map(t => t.str).join(" ");

    extractProducts(content);
  }
}

function extractProducts(text) {
  const regex = /([A-Z0-9\-\/\.]+)\s+([0-9,]{2,})/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    products.push({
      code: match[1],
      price: match[2]
    });
  }
}

function searchProducts() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const table = document.getElementById("results");

  table.innerHTML = `
    <tr>
      <th>Product</th>
      <th>MRP (₹)</th>
      <th>PDF</th>
    </tr>`;

  products
    .filter(p => p.code.toLowerCase().includes(input))
    .slice(0, 50)
    .forEach(p => {
      const row = table.insertRow();
      row.insertCell(0).innerText = p.code;
      row.insertCell(1).innerText = "₹" + p.price;
      row.insertCell(2).innerHTML =
        `<a href="pdfs/Taparia/taparia.pdf" target="_blank">View</a>`;
    });
}

loadPDF();
