function processFile() {
  const fileInput = document.getElementById('file-input');
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor, escolha um arquivo.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    const data = event.target.result;
    const workbook = XLSX.read(data, { type: 'binary' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    // Processa os dados
    processData(json);
  };
  reader.readAsBinaryString(file);
}

function processData(data) {
  const contactCount = {};

  // Supondo que as colunas no Excel sejam: Data e Hora
  data.forEach(row => {
    const datetime = row["Data e Hora"];
    if (datetime) {
      const date = datetime.split(" ")[0]; // Pega a data (ignore a hora)
      if (contactCount[date]) {
        contactCount[date]++;
      } else {
        contactCount[date] = 1;
      }
    }
  });

  displayResults(contactCount);
}

function displayResults(contactCount) {
  const tbody = document.querySelector("#result-table tbody");
  tbody.innerHTML = "";  // Limpa resultados anteriores

  for (const date in contactCount) {
    const tr = document.createElement("tr");
    const tdDate = document.createElement("td");
    tdDate.textContent = date;
    const tdCount = document.createElement("td");
    tdCount.textContent = contactCount[date];

    tr.appendChild(tdDate);
    tr.appendChild(tdCount);
    tbody.appendChild(tr);
  }
}
