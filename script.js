// Escopo global
const container = document.querySelector(".newcontainer");
let cachorros = JSON.parse(localStorage.getItem("cachorros")) || [];

document.addEventListener("DOMContentLoaded", () => {
    // Puxar elementos do HTML
    const addButton = document.querySelector(".button-primary");
    const inputDog = document.getElementById("form_name");
    const inputDescription = document.getElementById("form_description");
    const fileInput = document.getElementById("fileInput");
    const backButton = document.querySelector(".button-back");

    // Variável para guardar até 3 imagens temporárias
    let previewUrls = [];

    // Só ativa se existir input de arquivos (index.html)
    if (fileInput) {
        fileInput.addEventListener("change", async () => {
            previewUrls = [];
            const files = Array.from(fileInput.files);

            for (let file of files.slice(0, 3)) {
                const base64 = await fileToBase64(file);
                previewUrls.push(base64); // já guarda em base64
            }
        });
    }

    // Converte File para Base64
    function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        });
    }

    // Só ativa se existir botão adicionar (index.html)
    if (addButton) {
        addButton.addEventListener("click", async () => {
            const dogName = inputDog.value.trim();
            const dogDescription = inputDescription.value.trim();


            if (!dogName || !dogDescription || previewUrls.length === 0) {
                alert("Preencha os campos e selecione até 3 imagens!");
                return;
            }

            // Cria objeto do novo cachorro
            const novoCachorro = {
                nome: dogName,
                descricao: dogDescription.split("\n"),
                fotos: previewUrls
            };

            // Salva no localStorage
            cachorros.push(novoCachorro);
            localStorage.setItem("cachorros", JSON.stringify(cachorros));

            // Cria visualmente o card
            criarCard(novoCachorro, cachorros.length - 1);

            // Limpa os campos
            inputDog.value = "";
            inputDescription.value = "";
            fileInput.value = "";
            previewUrls = [];
        });

        // Renderiza todos os cards existentes ao carregar (index.html)
        cachorros.forEach((c, i) => criarCard(c, i));
    }

    // Só ativa se existir botão voltar (detalhes.html)
    if (backButton) {
        backButton.addEventListener("click", voltar);
    }
});

// Função para criar card
function criarCard(cachorro, i) {
    const col = document.createElement("div");
    col.className="column";

    const primeiraFoto = cachorro.fotos && cachorro.fotos.length > 0
        ? cachorro.fotos[0]
        : "imagens/default.jpg";

    // junta a descrição em <li>
    const descricaoHTML = cachorro.descricao
    .map(desc => `<li>${desc}</li>`)
    .join("");

col.innerHTML = `
    <img src="${primeiraFoto}" alt="${cachorro.nome}">
    <h3>${cachorro.nome}</h3>
    <div class="details">
        <button onclick="detalhes(${i})" class="btn-circle">
            <i class="fa-solid fa-plus"></i>
        </button>
    </div>
    <div class="conteudo"></div>
`;


    const formColumn = document.querySelector(".form_column");
    container.insertBefore(col, formColumn);
}

// Função para abrir detalhes
function detalhes(i) {
    localStorage.setItem("cachorroSelecionado", i);
    window.location.href = "detalhes.html";
}

// Função voltar
function voltar() {
    window.location.href = "index.html";
}

// Limpar tudo
function limparLocalStorage() {
    localStorage.removeItem("cachorros");
    window.location.reload();
}
