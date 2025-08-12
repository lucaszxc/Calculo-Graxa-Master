document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("registroForm");
    const inputs = form.querySelectorAll("input");
    const calcularButton = document.getElementById("botao-calcular");
    const tipoRolamentoInput = document.getElementById("tipoRolamento");
    const dExternoInput = document.getElementById("dExterno");
    const dInternoInput = document.getElementById("dInterno");
    const larguraInput = document.getElementById("largura");
    const searchInput = document.getElementById("searchInput"); // Campo de pesquisa de rolamento
    const toggleRolamentoModeButton = document.getElementById("toggleRolamentoMode");
    const nomeRolamentoContainer = document.getElementById("nomeRolamentoContainer");
    const nomeRolamentoInput = document.getElementById("nomeRolamento");
    const selectRolamentoContainer = tipoRolamentoInput.parentElement;
    const searchInputContainer = searchInput.parentElement; // Container do campo de pesquisa
    const rolamentoLabel = document.getElementById("rolamentoLabel"); // Label que mudará de acordo com o modo de rolamento
    const manualIntervalsContainer = document.getElementById("manualIntervalsContainer"); // NOVO: Container para os campos manuais de intervalo

    let isManualRolamento = false;

    // Tabela de coeficientes baseada na imagem fornecida (C21 da planilha)
    const coeficientesTemperatura = [
        { faixa: [0, 65], coeficiente: 1 },
        { faixa: [66, 80], coeficiente: 2 },
        { faixa: [81, 95], coeficiente: 4 },
        { faixa: [96, 110], coeficiente: 8 },
        { faixa: [111, 125], coeficiente: 16 },
        { faixa: [126, 140], coeficiente: 32 },
        { faixa: [141, 155], coeficiente: 64 },
        { faixa: [156, 170], coeficiente: 128 },
        { faixa: [171, 185], coeficiente: 255 },
        { faixa: [186, 200], coeficiente: 509 }
    ];

    // Alternar entre "Adicionar Rolamento" e "Escolher Rolamento"
    toggleRolamentoModeButton.addEventListener("click", function() {
        isManualRolamento = !isManualRolamento;
        if (isManualRolamento) {
            nomeRolamentoContainer.style.display = "block"; // Exibir o campo manual
            selectRolamentoContainer.style.display = "none"; // Esconder o campo de seleção
            searchInputContainer.style.display = "none"; // Esconder o campo de pesquisa
            manualIntervalsContainer.style.display = "block"; // EXIBIR OS NOVOS CAMPOS MANUAIS
            toggleRolamentoModeButton.textContent = "Escolher Rolamento";
            rolamentoLabel.textContent = "Usar existentes"; // Alterar o texto da label
            limparMedidas(); // Limpar os campos de medidas
            // Limpar o tipo de rolamento selecionado quando muda para manual
            tipoRolamentoInput.value = "";
        } else {
            nomeRolamentoContainer.style.display = "none"; // Esconder o campo manual
            selectRolamentoContainer.style.display = "block"; // Exibir o campo de seleção
            searchInputContainer.style.display = "block"; // Exibir o campo de pesquisa
            manualIntervalsContainer.style.display = "none"; // ESCONDER OS NOVOS CAMPOS MANUAIS
            toggleRolamentoModeButton.textContent = "Adicionar Rolamento";
            rolamentoLabel.textContent = "Rolamento personalizado"; // Alterar o texto da label
            limparMedidas(); // Limpar os campos de medidas
            // Limpar o nome do rolamento manual quando muda para seleção
            nomeRolamentoInput.value = "";
            // Limpar os campos de intervalo manual ao mudar de volta para "Escolher Rolamento"
            document.getElementById("intervaloEsferaManual").value = "";
            document.getElementById("intervaloCilindroManual").value = "";
            document.getElementById("intervaloRadialEsferaManual").value = "";
        }
    });

    let rolamentosData = {};
    let originalOptions = [];

    // Fetch JSON data
    fetch('graxas.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar graxas.json');
            }
            return response.json();
        })
        .then(data => {
            rolamentosData = data;
            populateSelectOptions(rolamentosData);
            originalOptions = Array.from(document.getElementById("tipoRolamento").options);
        })
        .catch(error => {
            console.error("Erro ao carregar graxas.json", error);
        });

    function populateSelectOptions(data) {
        const tipoRolamentoSelect = document.getElementById("tipoRolamento");
        tipoRolamentoSelect.innerHTML = '<option value="">Selecione...</option>';
        for (const key in data) {
            const option = document.createElement("option");
            option.value = key;
            option.textContent = key;
            tipoRolamentoSelect.appendChild(option);
        }
    }

    form.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            const activeElement = document.activeElement;
            const currentIndex = Array.from(inputs).indexOf(activeElement);
            if (currentIndex < inputs.length - 1) {
                inputs[currentIndex + 1].focus();
                event.preventDefault(); // Previne a submissão do formulário
            } else {
                calcularButton.click();
                event.preventDefault(); // Previne a submissão do formulário
            }
        }
    });

    tipoRolamentoInput.addEventListener("change", function() {
        const tipoRolamento = tipoRolamentoInput.value;
        preencherMedidasAutomaticamente(tipoRolamento);
    });

    function preencherMedidasAutomaticamente(tipoRolamento) {
        const medidas = rolamentosData[tipoRolamento];
        if (medidas) {
            dExternoInput.value = medidas.dExterno;
            dInternoInput.value = medidas.dInterno;
            larguraInput.value = medidas.largura;
        } else {
            limparMedidas();
        }
    }

    function preencherMedidas(dExterno, dInterno, largura) {
        dExternoInput.value = dExterno;
        dInternoInput.value = dInterno;
        larguraInput.value = largura;
    }

    function limparMedidas() {
        dExternoInput.value = "";
        dInternoInput.value = "";
        larguraInput.value = "";
    }

    searchInput.addEventListener("input", function() {
        searchFunction();
    });

    function searchFunction() {
        const filter = searchInput.value.toUpperCase();
        const select = document.getElementById("tipoRolamento");

        originalOptions.forEach(option => {
            if (option.value === "") {
                option.style.display = "";
                return;
            }
            if (option.textContent.toUpperCase().includes(filter)) {
                option.style.display = "";
            } else {
                option.style.display = "none";
            }
        });

        if (select.options[select.selectedIndex] && select.options[select.selectedIndex].style.display === "none") {
            select.value = "";
            limparMedidas();
        }
    }

    function calcularValorCalculo() {
        const nomeCliente = document.getElementById("nomeCliente").value;
        const nomeEquipamento = document.getElementById("nomeEquipamento").value;
        const tipoRolamentoSelecionadoOuManual = isManualRolamento ? nomeRolamentoInput.value : tipoRolamentoInput.value;
        const temperatura = parseFloat(document.getElementById("temperatura").value); // C19 da planilha
        const rpm = parseFloat(document.getElementById("rpm").value);
        const dExterno = parseFloat(document.getElementById("dExterno").value);
        const dInterno = parseFloat(document.getElementById("dInterno").value);
        const largura = parseFloat(document.getElementById("largura").value);
        const useGraxa = parseFloat(document.getElementById("useGraxa").value);

        if (!nomeCliente || !nomeEquipamento || !tipoRolamentoSelecionadoOuManual || isNaN(temperatura) || isNaN(rpm) || isNaN(dExterno) || isNaN(dInterno) || isNaN(largura) || isNaN(useGraxa)) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        const DMN = ((dExterno + dInterno) / 2) * rpm;
        const DMNFormatado = parseInt(DMN);
        const quantidade = dExterno * largura * (useGraxa === 0.002 ? 0.002 : 0.005);

        let graxaRecomendada;
        let imagemGraxaUrl;

        if (DMN > 750000) {
            graxaRecomendada = "Total Multis XLT 2";
            imagemGraxaUrl = "./assets/750000.jpeg";
        } else if (DMN > 400000) {
            graxaRecomendada = "Total Altis SH/ Total Nevastane XS 80";
            imagemGraxaUrl = "./assets/400000.jpeg";
        } else if (DMN > 250000) {
            graxaRecomendada = "Total Nevastane HD2T/ Total Altis EM/ Total Ceran XM 100";
            imagemGraxaUrl = "./assets/250000.jpeg";
        } else if (DMN > 100000) {
            graxaRecomendada = "Total Ceran XM 220/Total Multis Complex EP2";
            imagemGraxaUrl = "./assets/10000.jpeg";
        } else if (DMN > 60000) {
            graxaRecomendada = "Total Ceran HRM 460/Total Multis C SHD 460/Total Nevastane XS 320";
            imagemGraxaUrl = "./assets/60000.jpeg";
        } else if (DMN > 30000) {
            graxaRecomendada = "Total Ceran MS";
            imagemGraxaUrl = "./assets/30000.jpeg";
        } else if (DMN > 10) {
            graxaRecomendada = "Total Ceran AD Plus";
            imagemGraxaUrl = "./assets/10.jpeg";
        }

        // --- Início da lógica de correção de intervalos ---
        let intervalo_esfera_original = 0; // C24 da planilha
        let intervalo_cilindro_original = 0; // C25 da planilha
        let intervalo_radial_esfera_original = 0; // C26 da planilha

        // Se o modo for "Escolher Rolamento" e um rolamento foi selecionado
        if (!isManualRolamento && tipoRolamentoInput.value) {
            const medidasDoRolamento = rolamentosData[tipoRolamentoInput.value];
            if (medidasDoRolamento) {
                // Estes valores serão puxados do graxas.json
                // VERIFIQUE SE ELES ESTÃO NO graxas.json!
                intervalo_esfera_original = medidasDoRolamento.intervalo_esfera_base || 0;
                intervalo_cilindro_original = medidasDoRolamento.intervalo_cilindro_base || 0;
                intervalo_radial_esfera_original = medidasDoRolamento.intervalo_radial_esfera_base || 0;
            }
        } else if (isManualRolamento) {
            // No modo "Adicionar Rolamento" (manual), puxamos dos novos campos de input
            intervalo_esfera_original = parseFloat(document.getElementById("intervaloEsferaManual").value) || 0;
            intervalo_cilindro_original = parseFloat(document.getElementById("intervaloCilindroManual").value) || 0;
            intervalo_radial_esfera_original = parseFloat(document.getElementById("intervaloRadialEsferaManual").value) || 0;
        }

        let coeficiente = 1; // C21 da planilha
        for (const faixaTemp of coeficientesTemperatura) {
            if (temperatura >= faixaTemp.faixa[0] && temperatura <= faixaTemp.faixa[1]) {
                coeficiente = faixaTemp.coeficiente;
                break;
            }
        }

        // Implementação da fórmula exata do Excel:
        // =(ValorBase*(14000000/(CoeficienteTemperatura*(RAIZ(Temperatura))))) - (4*Temperatura)
        const CONSTANTE_NUMERICA = 14000000;

        const calcularIntervaloCorrigido = (intervaloBase, temp, coef) => {
            if (intervaloBase === 0) {
                return 0; // Se o intervalo base é 0, o corrigido também é 0.
            }
            if (isNaN(temp) || temp <= 0 || isNaN(coef) || coef === 0) {
                // Prevenção de divisão por zero ou raiz quadrada de número negativo/zero.
                // Retornar 'intervaloBase' é um comportamento padrão razoável se não for possível calcular.
                return intervaloBase;
            }

            const denominador = coef * Math.sqrt(temp);
            if (denominador === 0) { // Proteção extra para garantir que não haja divisão por zero
                return intervaloBase;
            }

            let resultado = (intervaloBase * (CONSTANTE_NUMERICA / denominador)) - (4 * temp);
            return Math.max(0, resultado); // Garante que o resultado nunca seja negativo
        };

        const intervalo_esfera_corrigido = calcularIntervaloCorrigido(intervalo_esfera_original, temperatura, coeficiente);
        const intervalo_cilindro_corrigido = calcularIntervaloCorrigido(intervalo_cilindro_original, temperatura, coeficiente);
        const intervalo_radial_esfera_corrigido = calcularIntervaloCorrigido(intervalo_radial_esfera_original, temperatura, coeficiente);

        // --- Fim da lógica de correção de intervalos ---

        const resultadosDiv = document.getElementById("resultados");
        resultadosDiv.style.display = "block";
        resultadosDiv.innerHTML = `
            <div class="watermark">
                <img src="./assets/Logo.png" alt="Marca d'água">
            </div>
            <h2 class="titulo1" style="color:#fff !important; font-weight:700;">Resultados de Lubvel Lubrificantes:</h2>
            
            <p class="mb-2 p-2" style="text-align:left !important; border-radius:4px !important; font-size:.8rem !important; font-weight:500;">Nome do Cliente: <span style="font-weight:700">${nomeCliente}</span></p>
            <p class="mb-2 p-2" style="text-align:left !important; border-radius:4px !important; font-size:.8rem !important; font-weight:500;">Nome do Equipamento: <span style="font-weight:700">${nomeEquipamento}</span></p>
            <p class="mb-2 p-2" style="text-align:left !important; border-radius:4px !important; font-size:.8rem !important; font-weight:500;">Tipo de Rolamento: <span style="font-weight:700">${tipoRolamentoSelecionadoOuManual || "Não especificado"}</span></p>
            <p class="mb-2 p-2" style="text-align:left !important; border-radius:4px !important; font-size:.8rem !important; font-weight:500;">Temperatura (em Celsius): <span style="font-weight:700">${temperatura} °C</span></p>
            <p class="mb-2 p-2" style="text-align:left !important; border-radius:4px !important; font-size:.8rem !important; font-weight:500;">D.Externo (D) (mm): <span style="font-weight:700">${dExterno} mm</span></p>
            <p class="mb-2 p-2" style="text-align:left !important; border-radius:4px !important; font-size:.8rem !important; font-weight:500;">D.Interno (d) (mm): <span style="font-weight:700">${dInterno} mm</span></p>
            <p class="mb-2 p-2" style="text-align:left !important; border-radius:4px !important; font-size:.8rem !important; font-weight:500;">Largura (B) (mm): <span style="font-weight:700">${largura} mm</p>
            <p class="mb-2 p-2" style="text-align:left !important; border-radius:4px !important; font-size:.8rem !important; font-weight:500;">Use 0,002 p/ W33 ou 0,005 p/ demais: <span style="font-weight:700">${useGraxa}</span></p>
            <p class="mb-2 p-2" style="text-align:left !important; border-radius:4px !important; font-size:.8rem !important; font-weight:500;">RPM (Rotações Por Minuto): <span style="font-weight:700">${rpm}</span></p>
            <p class="mb-2 p-2" style="text-align:left !important; border-radius:4px !important; font-size:.8rem !important; font-weight:500;">DMN: <span style="font-weight:700">${DMNFormatado}</span></p>
            <p class="mb-2 p-2" style="text-align:left !important; border-radius:4px !important; font-size:.8rem !important; font-weight:500;">Quantidade de Graxa (Gramas): <span style="font-weight:700">${quantidade.toFixed(0)}</span></p>
            
            <p class="mb-2 p-2 graxaRecomendada" style="text-align:left !important; border-radius:4px !important; font-size:.8rem !important; font-weight:500; background-color: green; color: black;">Graxa Recomendada: <span style="font-weight:700">${graxaRecomendada}</span></p>
            
            <h3 class="mt-4 mb-2 p-2" style="color:#fff !important; font-weight:700; background-color: #3498DB;">Intervalos de Lubrificação Corrigidos:</h3>
            <p class="mb-2 p-2" style="text-align:left !important; border-radius:4px !important; font-size:.8rem !important; font-weight:500;">Intervalo Esfera (Horas): <span style="font-weight:700">${intervalo_esfera_corrigido.toFixed(2)} h</span></p>
            <p class="mb-2 p-2" style="text-align:left !important; border-radius:4px !important; font-size:.8rem !important; font-weight:500;">Intervalo Cilíndrico (Horas): <span style="font-weight:700">${intervalo_cilindro_corrigido.toFixed(2)} h</span></p>
            <p class="mb-2 p-2" style="text-align:left !important; border-radius:4px !important; font-size:.8rem !important; font-weight:500;">Intervalo Radial Esferas (Horas): <span style="font-weight:700">${intervalo_radial_esfera_corrigido.toFixed(2)} h</span></p>

            <p class="mb-2 p-2 intervalos" style="text-align:left !important; border-radius:4px !important; font-size:.8rem !important; font-weight:700; background-color: #3498DB !important; color: black !important;">*Intervalos devem ser corrigidos conforme temperatura de trabalho e possíveis contaminações. Solicitar informações com nosso departamento técnico.* <br>Mauricio Deuner (45) 9 9971-2081</p>
            
            <img id="graxaImagem" src="${imagemGraxaUrl || './assets/umparceirolocal.png'}" alt="Sua Imagem" class="imagem-resultado">
            
            <br/>
            <button id="imprimirRelatorio" class="mb-5 btn btn-primary" style="background-color: #3498DB; color: #000; font-weight:700;" onclick="window.print()">Imprimir</button>
        `;

        const graxaImagem = document.getElementById("graxaImagem");
        if (graxaImagem && imagemGraxaUrl) {
            graxaImagem.src = imagemGraxaUrl;
            graxaImagem.style.display = "block";
        } else {
            if (graxaImagem) {
                graxaImagem.style.display = "none";
            }
        }
    }

    window.searchFunction = searchFunction;
    window.calcularValorCalculo = calcularValorCalculo;
});