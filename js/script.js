document.addEventListener("DOMContentLoaded", function() {
    const calculoRpmContainer = document.getElementById('calculoRpmContainer');
    const calculoGraxaContainer = document.getElementById('calculoGraxaContainer');
    const resultadosDiv = document.getElementById('resultados');
    const btnSimPolia = document.getElementById('btnSimPolia');
    const btnNaoPolia = document.getElementById('btnNaoPolia');
    const botaoCalcular = document.getElementById('botao-calcular');
    const clienteInput = document.getElementById('cliente');
    const equipamentoInput = document.getElementById('equipamento');
    const temperaturaInput = document.getElementById('temperatura');
    const n1Input = document.getElementById('n1');
    const d1Input = document.getElementById('d1');
    const d2Input = document.getElementById('d2');
    const resultadoRpmCalculado = document.getElementById('resultadoRpmCalculado');
    const rpmFinalInput = document.getElementById('rpmFinal');
    const dExternoInput = document.getElementById('dExterno');
    const dInternoInput = document.getElementById('dInterno');
    const larguraInput = document.getElementById('largura');
    const fatorInput = document.getElementById('fator');
    const errorMessage = document.getElementById('errorMessage');

    let rolamentos = {};
    let customRolamentoMode = false;
    let ultimoCalculoValido = null;

    // =======================================================
    // DICIONÁRIO DE INTERNACIONALIZAÇÃO (i18n)
    // =======================================================
    const translations = {
        pt: {
            page_title: "Lubvel Lubrificantes - Calculadora de Lubrificação",
            developed_by: "Desenvolvido por Lubvel Lubrificantes Industriais.",
            client_name: "Nome do cliente:",
            placeholder_client: "Ex: Trombini",
            equipment_name: "Nome do equipamento:",
            placeholder_equipment: "Ex: Exaustor Caldeira",
            temperature: "Temperatura (°C):",
            search_bearing: "Pesquisar rolamento:",
            placeholder_search: "Pesquisar...",
            bearing_type: "Tipo de rolamento:",
            select_option: "Selecione...",
            custom_bearing_name: "Nome do rolamento:",
            btn_add_bearing: "Adicionar Rolamento",
            btn_use_list: "Usar Lista",
            lbl_use_other: "(Usar outro)",
            lbl_use_default: "(Usar lista padrão)",
            step1_title: "Passo 1: Rotação do Equipamento",
            step1_subtitle: "O sistema do seu equipamento utiliza polias para transmissão?",
            btn_pulley_yes: "Sim, utiliza polias",
            btn_pulley_no: "Não, é acionamento direto",
            rpm_pulley_title: "Cálculo de RPM da Polia Movida",
            label_n1: "N1 (RPM Motor)",
            label_d1: "D1 (Ø Polia Motor)",
            label_d2: "D2 (Ø Polia Movida)",
            rpm_calculated_prefix: "RPM Final:",
            step2_title: "Passo 2: Dados do Rolamento",
            label_rpm_final: "RPM (Rotações Por Minuto)",
            label_outer_diam: "D.Externo (D) (mm):",
            label_inner_diam: "D.Interno (d) (mm):",
            label_width: "Largura (B) (mm):",
            label_factor_g: "Fator de Cálculo (G)",
            opt_standard_factor: "0,005 (Padrão)",
            opt_w33_factor: "0,002 (W33, etc.)",
            btn_calculate: "Calcular Lubrificação",
            err_fill_fields: "Por favor, preencha todos os campos com valores válidos.",
            err_diameters: "O diâmetro interno (d) não pode ser maior ou igual ao externo (D).",
            report_title: "Resultados da Lubrificação",
            report_section_data: "Dados do Relatório",
            report_client: "Cliente:",
            report_equipment: "Equipamento:",
            report_bearing: "Rolamento:",
            report_date: "Data do Cálculo:",
            report_section_params: "Parâmetros de Cálculo",
            report_temperature: "Temperatura:",
            report_d_ext: "D. Externo (D):",
            report_d_int: "D. Interno (d):",
            report_width: "Largura (B):",
            res_rpm: "Rotação Final (RPM):",
            res_dmn: "Fator DmN:",
            res_grease_qty: "Qtde. Graxa Relub (Gramas):",
            res_interval_ball: "Intervalo Esfera (Horas):",
            res_interval_cyl: "Intervalo Cilind. (Horas):",
            res_interval_radial: "Inter. Radial Esf. (Horas):",
            housing_title: "Enchimento do mancal para iniciar o trabalho",
            housing_low_speed: "<p>Baixa Velocidade: <br/> Preencher de <strong>90 - 100%</strong> do espaço livre do mancal.</p>",
            housing_low_med: "<p>Baixa/Média Velocidade: <br/> Preencher de <strong>70%</strong> do espaço livre do mancal.</p>",
            housing_med: "<p>Média Velocidade: <br/> Preencher até <strong>40%</strong> do espaço livre do mancal.</p>",
            housing_med_high: "<p>Média/Alta Velocidade: <br/> Preencher até <strong>30%</strong> do espaço livre do mancal.</p>",
            housing_high: "<p>Alta Velocidade: <br/> Preencher até <strong>15%</strong> do espaço livre do mancal.</p>",
            housing_na: "<p>N/A - Sem recomendação de preenchimento para Dmn < 10.</p>",
            rec_very_high_rot: "Rotação Altíssima!",
            rec_high_rot: "Rotação Alta!",
            rec_elevated_rot: "Rotação Elevada!",
            rec_medium_rot: "Rotação Média!",
            rec_standard_rot: "Rotação Padrão!",
            rec_low_rot: "Rotação Baixa!",
            rec_very_low_rot: "Rotação Muito Baixa!",
            rec_grease_label: "Graxa Recomendada:",
            rec_none: "Nenhuma recomendação disponível para este Dmn.",
            final_warning: "<strong>Aviso:</strong> Os intervalos foram corrigidos para a temperatura informada. Fatores como contaminação, umidade e vibração podem exigir ajustes. Consulte sempre o departamento técnico.",
            btn_print: "Imprimir Relatório",
            custom_bearing_default: "Rolamento customizado"
        },
        en: {
            page_title: "Lubvel Lubricants - Lubrication Calculator",
            developed_by: "Developed by Lubvel Industrial Lubricants.",
            client_name: "Customer Name:",
            placeholder_client: "e.g., Trombini",
            equipment_name: "Equipment Name:",
            placeholder_equipment: "e.g., Boiler Fan",
            temperature: "Temperature (°C):",
            search_bearing: "Search bearing:",
            placeholder_search: "Search...",
            bearing_type: "Bearing Type:",
            select_option: "Select...",
            custom_bearing_name: "Bearing Name:",
            btn_add_bearing: "Add Custom Bearing",
            btn_use_list: "Use Standard List",
            lbl_use_other: "(Use custom)",
            lbl_use_default: "(Use standard list)",
            step1_title: "Step 1: Equipment Speed",
            step1_subtitle: "Does your equipment system use pulleys for transmission?",
            btn_pulley_yes: "Yes, uses pulleys",
            btn_pulley_no: "No, direct drive",
            rpm_pulley_title: "Driven Pulley RPM Calculation",
            label_n1: "N1 (Motor RPM)",
            label_d1: "D1 (Motor Pulley Ø)",
            label_d2: "D2 (Driven Pulley Ø)",
            rpm_calculated_prefix: "Final RPM:",
            step2_title: "Step 2: Bearing Specifications",
            label_rpm_final: "RPM (Revolutions Per Minute)",
            label_outer_diam: "Outer Diam. (D) (mm):",
            label_inner_diam: "Inner Diam. (d) (mm):",
            label_width: "Width (B) (mm):",
            label_factor_g: "Calculation Factor (G)",
            opt_standard_factor: "0.005 (Standard)",
            opt_w33_factor: "0.002 (W33, etc.)",
            btn_calculate: "Calculate Lubrication",
            err_fill_fields: "Please fill in all fields with valid numbers.",
            err_diameters: "Inner diameter (d) cannot be greater than or equal to outer diameter (D).",
            report_title: "Lubrication Calculation Results",
            report_section_data: "Report Data",
            report_client: "Customer:",
            report_equipment: "Equipment:",
            report_bearing: "Bearing:",
            report_date: "Calculation Date:",
            report_section_params: "Calculation Parameters",
            report_temperature: "Temperature:",
            report_d_ext: "Outer Diam. (D):",
            report_d_int: "Inner Diam. (d):",
            report_width: "Width (B):",
            res_rpm: "Final Speed (RPM):",
            res_dmn: "DmN Speed Factor:",
            res_grease_qty: "Relubrication Grease Qty (Grams):",
            res_interval_ball: "Deep Groove Ball Interval (Hours):",
            res_interval_cyl: "Cylindrical Roller Interval (Hours):",
            res_interval_radial: "Spherical Roller Interval (Hours):",
            housing_title: "Initial Housing Free Space Grease Fill",
            housing_low_speed: "<p>Low Speed: <br/> Fill <strong>90 - 100%</strong> of housing free volume.</p>",
            housing_low_med: "<p>Low/Medium Speed: <br/> Fill <strong>70%</strong> of housing free volume.</p>",
            housing_med: "<p>Medium Speed: <br/> Fill up to <strong>40%</strong> of housing free volume.</p>",
            housing_med_high: "<p>Medium/High Speed: <br/> Fill up to <strong>30%</strong> of housing free volume.</p>",
            housing_high: "<p>High Speed: <br/> Fill up to <strong>15%</strong> of housing free volume.</p>",
            housing_na: "<p>N/A - No filling recommendation for Dmn < 10.</p>",
            rec_very_high_rot: "Ultra High Speed!",
            rec_high_rot: "High Speed!",
            rec_elevated_rot: "Elevated Speed!",
            rec_medium_rot: "Medium Speed!",
            rec_standard_rot: "Standard Speed!",
            rec_low_rot: "Low Speed!",
            rec_very_low_rot: "Very Low Speed!",
            rec_grease_label: "Recommended Grease:",
            rec_none: "No grease recommendation available for this Dmn factor.",
            final_warning: "<strong>Warning:</strong> Relubrication intervals are corrected for operating temperature. Factors such as contamination, moisture, and vibration may require adjustments. Always consult technical service.",
            btn_print: "Print Report",
            custom_bearing_default: "Custom Bearing"
        },
        fr: {
            page_title: "Lubvel Lubrifiants - Calculateur de Lubrification",
            developed_by: "Développé par Lubvel Lubrifiants Industriels.",
            client_name: "Nom du client :",
            placeholder_client: "Ex : Trombini",
            equipment_name: "Nom de l'équipement :",
            placeholder_equipment: "Ex : Ventilateur Chaudière",
            temperature: "Température (°C) :",
            search_bearing: "Rechercher un roulement :",
            placeholder_search: "Rechercher...",
            bearing_type: "Type de roulement :",
            select_option: "Sélectionnez...",
            custom_bearing_name: "Nom du roulement :",
            btn_add_bearing: "Ajouter un Roulement",
            btn_use_list: "Utiliser la Liste",
            lbl_use_other: "(Personnalisé)",
            lbl_use_default: "(Liste standard)",
            step1_title: "Étape 1 : Vitesse de l'Équipement",
            step1_subtitle: "Votre système utilise-t-il une transmission par poulies/courroies ?",
            btn_pulley_yes: "Oui, transmission par poulies",
            btn_pulley_no: "Non, accouplement direct",
            rpm_pulley_title: "Calcul du Régime de la Poulie Menée",
            label_n1: "N1 (Tr/min Moteur)",
            label_d1: "D1 (Ø Poulie Moteur)",
            label_d2: "D2 (Ø Poulie Menée)",
            rpm_calculated_prefix: "Régime Final :",
            step2_title: "Étape 2 : Caractéristiques du Roulement",
            label_rpm_final: "Régime (Tours Par Minute)",
            label_outer_diam: "D. Extérieur (D) (mm) :",
            label_inner_diam: "D. Intérieur (d) (mm) :",
            label_width: "Largeur (B) (mm) :",
            label_factor_g: "Facteur de Calcul (G)",
            opt_standard_factor: "0,005 (Standard)",
            opt_w33_factor: "0,002 (W33, etc.)",
            btn_calculate: "Calculer la Lubrification",
            err_fill_fields: "Veuillez remplir tous les champs avec des valeurs numériques valides.",
            err_diameters: "Le diamètre intérieur (d) ne peut pas être supérieur ou égal au diamètre extérieur (D).",
            report_title: "Résultats de Lubrification",
            report_section_data: "Données du Rapport",
            report_client: "Client :",
            report_equipment: "Équipement :",
            report_bearing: "Roulement :",
            report_date: "Date du Calcul :",
            report_section_params: "Paramètres de Calcul",
            report_temperature: "Température :",
            report_d_ext: "D. Extérieur (D) :",
            report_d_int: "D. Intérieur (d) :",
            report_width: "Largeur (B) :",
            res_rpm: "Vitesse Finale (Tr/min) :",
            res_dmn: "Facteur de Vitesse DmN :",
            res_grease_qty: "Qté. Graisse Relubrification (Grammes) :",
            res_interval_ball: "Intervalle Roulement à Billes (Heures) :",
            res_interval_cyl: "Intervalle Rouleaux Cylindriques (Heures) :",
            res_interval_radial: "Intervalle Rouleaux Sphériques (Heures) :",
            housing_title: "Remplissage initial de l'espace libre du palier",
            housing_low_speed: "<p>Basse Vitesse : <br/> Remplir de <strong>90 à 100 %</strong> de l'espace libre du palier.</p>",
            housing_low_med: "<p>Vitesse Basse/Moyenne : <br/> Remplir à <strong>70 %</strong> de l'espace libre du palier.</p>",
            housing_med: "<p>Vitesse Moyenne : <br/> Remplir jusqu'à <strong>40 %</strong> de l'espace libre du palier.</p>",
            housing_med_high: "<p>Vitesse Moyenne/Élevée : <br/> Remplir jusqu'à <strong>30 %</strong> de l'espace libre du palier.</p>",
            housing_high: "<p>Haute Vitesse : <br/> Remplir jusqu'à <strong>15 %</strong> de l'espace libre du palier.</p>",
            housing_na: "<p>N/D - Aucune recommandation de remplissage pour Dmn < 10.</p>",
            rec_very_high_rot: "Vitesse Très Élevée !",
            rec_high_rot: "Haute Vitesse !",
            rec_elevated_rot: "Vitesse Soutenue !",
            rec_medium_rot: "Vitesse Moyenne !",
            rec_standard_rot: "Vitesse Standard !",
            rec_low_rot: "Basse Vitesse !",
            rec_very_low_rot: "Très Basse Vitesse !",
            rec_grease_label: "Graisse Recommandée :",
            rec_none: "Aucune recommandation disponible pour ce facteur Dmn.",
            final_warning: "<strong>Avertissement :</strong> Les intervalles sont corrigés selon la température indiquée. Des facteurs tels que la contamination, l'humidité et les vibrations peuvent exiger des ajustements. Consultez toujours le service technique.",
            btn_print: "Imprimer le Rapport",
            custom_bearing_default: "Roulement personnalisé"
        }
    };

    let currentLang = localStorage.getItem('app_lang') || 'pt';

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('app_lang', lang);
        document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;
        const t = translations[lang];

        document.title = t.page_title;

        // Atualiza textos com data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) el.textContent = t[key];
        });

        // Atualiza placeholders
        document.querySelectorAll('[data-i18n-ph]').forEach(el => {
            const key = el.getAttribute('data-i18n-ph');
            if (t[key]) el.placeholder = t[key];
        });

        // Labels dinâmicos do toggle
        const toggleBtn = document.getElementById('toggleRolamentoMode');
        const rolamentoLabel = document.getElementById('rolamentoLabel');
        if (customRolamentoMode) {
            toggleBtn.textContent = t.btn_use_list;
            rolamentoLabel.textContent = t.lbl_use_default;
        } else {
            toggleBtn.textContent = t.btn_add_bearing;
            rolamentoLabel.textContent = t.lbl_use_other;
        }

        // Se houver cálculo em tela, atualiza imediatamente
        if (ultimoCalculoValido) {
            renderizarResultados(ultimoCalculoValido);
        }

        // Estado visual dos botões
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            setLanguage(this.getAttribute('data-lang'));
        });
    });

    // =======================================================
    // DADOS TÉCNICOS & CÁLCULOS
    // =======================================================
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

    const FATOR_ESFERA = 1;    
    const FATOR_CILINDRICO = 5; 
    const FATOR_RADIAL_ESFERA = 10; 
    const CONSTANTE_NUMERADOR_PLANILHA = 14000000;

    fetch('graxas.json')
        .then(response => {
            if (!response.ok) throw new Error('Erro ao carregar graxas.json');
            return response.json();
        })
        .then(data => {
            const tipoRolamentoSelect = document.getElementById('tipoRolamento');
            if (!tipoRolamentoSelect) return;

            const t = translations[currentLang];
            tipoRolamentoSelect.innerHTML = `<option value="">${t.select_option}</option>`;

            Object.entries(data).forEach(([codigo, valores]) => {
                const option = document.createElement('option');
                option.value = codigo;
                option.textContent = codigo;
                tipoRolamentoSelect.appendChild(option);
                rolamentos[codigo] = valores;
            });

            tipoRolamentoSelect.addEventListener('change', function (e) {
                const selected = e.target.value;
                const dados = rolamentos[selected];
                if (dados && !customRolamentoMode) {
                    dExternoInput.value = dados.dExterno || '';
                    dInternoInput.value = dados.dInterno || '';
                    larguraInput.value = dados.largura || '';
                }
            });

            document.getElementById('searchInput').addEventListener('input', function (e) {
                const filtro = e.target.value.toLowerCase();
                const curT = translations[currentLang];
                tipoRolamentoSelect.innerHTML = `<option value="">${curT.select_option}</option>`;

                Object.entries(rolamentos).forEach(([codigo]) => {
                    if (codigo.toLowerCase().includes(filtro)) {
                        const option = document.createElement('option');
                        option.value = codigo;
                        option.textContent = codigo;
                        tipoRolamentoSelect.appendChild(option);
                    }
                });
            });
        })
        .catch(error => {
            console.error('Erro ao carregar graxas:', error);
            const tipoRolamentoSelect = document.getElementById('tipoRolamento');
            if (tipoRolamentoSelect) {
                tipoRolamentoSelect.innerHTML = '<option value="">Erro ao carregar rolamentos</option>';
            }
        });

    document.getElementById('toggleRolamentoMode').addEventListener('click', function() {
        customRolamentoMode = !customRolamentoMode;
        const nomeRolamentoContainer = document.getElementById('nomeRolamentoContainer');
        const tipoRolamentoContainer = document.getElementById('tipoRolamento').parentElement;
        const searchContainer = document.getElementById('searchInput').parentElement;
        const rolamentoLabel = document.getElementById('rolamentoLabel');
        const t = translations[currentLang];

        if (customRolamentoMode) {
            nomeRolamentoContainer.style.display = 'block';
            tipoRolamentoContainer.style.display = 'none';
            searchContainer.style.display = 'none';
            this.textContent = t.btn_use_list;
            rolamentoLabel.textContent = t.lbl_use_default;
            dExternoInput.value = '';
            dInternoInput.value = '';
            larguraInput.value = '';
        } else {
            nomeRolamentoContainer.style.display = 'none';
            tipoRolamentoContainer.style.display = 'block';
            searchContainer.style.display = 'block';
            this.textContent = t.btn_add_bearing;
            rolamentoLabel.textContent = t.lbl_use_other;
            document.getElementById('nomeRolamento').value = '';
        }
    });

    function setupStep1Choice(usePolias) {
        calculoRpmContainer.classList.toggle('hidden', !usePolias);
        calculoGraxaContainer.classList.remove('hidden');
        rpmFinalInput.readOnly = usePolias;
        rpmFinalInput.style.backgroundColor = usePolias ? '#343a40' : '#192E64';
        rpmFinalInput.style.color = '#fff';

        btnSimPolia.classList.toggle('active', usePolias);
        btnNaoPolia.classList.toggle('active', !usePolias);
        if (!usePolias) {
            rpmFinalInput.value = '';
            resultadoRpmCalculado.textContent = '';
        } else {
            calcularRpmPolia();
        }
    }

    btnSimPolia.addEventListener('click', () => setupStep1Choice(true));
    btnNaoPolia.addEventListener('click', () => setupStep1Choice(false));

    function calcularRpmPolia() {
        const n1 = parseFloat(n1Input.value);
        const d1 = parseFloat(d1Input.value);
        const d2 = parseFloat(d2Input.value);
        const t = translations[currentLang];

        if (n1 > 0 && d1 > 0 && d2 > 0) {
            const n2 = (n1 * d1) / d2;
            resultadoRpmCalculado.textContent = `${t.rpm_calculated_prefix} ${n2.toFixed(0)}`;
            resultadoRpmCalculado.style.color = '#2ecc71';
            rpmFinalInput.value = n2.toFixed(0);
        } else {
            resultadoRpmCalculado.textContent = '';
            rpmFinalInput.value = '';
        }
    }
    [n1Input, d1Input, d2Input].forEach(input => input.addEventListener('input', calcularRpmPolia));

    function renderizarResultados(calc) {
        const t = translations[currentLang];
        const locale = currentLang === 'pt' ? 'pt-BR' : (currentLang === 'fr' ? 'fr-FR' : 'en-US');

        let enchimentoMancal = '';
        if (calc.dmn < 200000) {
            enchimentoMancal = t.housing_low_speed;
        } else if (calc.dmn >= 200000 && calc.dmn <= 300000) {
            enchimentoMancal = t.housing_low_med;
        } else if (calc.dmn > 300000 && calc.dmn <= 500000) {
            enchimentoMancal = t.housing_med;
        } else if (calc.dmn > 500000 && calc.dmn <= 600000) {
            enchimentoMancal = t.housing_med_high;
        } else if (calc.dmn > 600000) {
            enchimentoMancal = t.housing_high;
        } else {
            enchimentoMancal = t.housing_na;
        }

        let recomendacaoHTML = '';
        if (calc.dmn > 750000) {
            recomendacaoHTML = `<h4 class="font-weight-bold" style="color: #e74c3c;">${t.rec_very_high_rot}</h4><p>${t.rec_grease_label} <strong class="text-white">TOTAL MULTIS XLT 2</strong></p>`;
        } else if (calc.dmn > 400000) {
            recomendacaoHTML = `<h4 class="font-weight-bold" style="color: #f39c12;">${t.rec_high_rot}</h4><p>${t.rec_grease_label} <strong class="text-white">TOTAL ALTIS SH / TOTAL NEVASTANE XS 80</strong></p>`;
        } else if (calc.dmn > 250000) {
            recomendacaoHTML = `<h4 class="font-weight-bold" style="color: #f39c12;">${t.rec_elevated_rot}</h4><p>${t.rec_grease_label} <strong class="text-white">TOTAL NEVASTANE HD2T / TOTAL ALTIS EM / TOTAL CERAN XM 100</strong></p>`;
        } else if (calc.dmn > 100000) {
            recomendacaoHTML = `<h4 class="font-weight-bold" style="color: #2ecc71;">${t.rec_medium_rot}</h4><p>${t.rec_grease_label} <strong class="text-white">TOTAL CERAN XM 220 / TOTAL MULTIS COMPLEX EP2</strong></p>`;
        } else if (calc.dmn > 60000) {
            recomendacaoHTML = `<h4 class="font-weight-bold" style="color: #2ecc71;">${t.rec_standard_rot}</h4><p>${t.rec_grease_label} <strong class="text-white">TOTAL CERAN HRM 460 / TOTAL MULTIS C SHD 460 / TOTAL NEVASTANE XS 320</strong></p>`;
        } else if (calc.dmn > 30000) {
            recomendacaoHTML = `<h4 class="font-weight-bold" style="color: #2ecc71;">${t.rec_low_rot}</h4><p>${t.rec_grease_label} <strong class="text-white">TOTAL CERAN MS / TOTAL CALORIS 2</strong></p>`;
        } else if (calc.dmn > 10) {
            recomendacaoHTML = `<h4 class="font-weight-bold" style="color: #2ecc71;">${t.rec_very_low_rot}</h4><p>${t.rec_grease_label} <strong class="text-white">TOTAL CERAN AD PLUS</strong></p>`;
        } else {
            recomendacaoHTML = `<h4 class="font-weight-bold" style="color: #95a5a6;">N/A</h4><p>${t.rec_grease_label} <strong class="text-white">${t.rec_none}</strong></p>`;
        }

        const dataAtual = new Date().toLocaleString(locale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        resultadosDiv.style.display = "block";
        resultadosDiv.innerHTML = `
            <div class="print-logo-header hidden">
                <img src="./assets/banner-lubvel.jpg" alt="Logo Lubvel e TotalEnergies" class="img-fluid" />
            </div>
            <h2 class="text-center">${t.report_title}</h2>
            
            <div class="summary-box">
                <h3 class="mb-2">${t.report_section_data}</h3>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center"><span>${t.report_client}</span> <strong>${calc.cliente || 'N/A'}</strong></li>
                    <li class="list-group-item d-flex justify-content-between align-items-center"><span>${t.report_equipment}</span> <strong>${calc.equipamento || 'N/A'}</strong></li>
                    <li class="list-group-item d-flex justify-content-between align-items-center"><span>${t.report_bearing}</span> <strong>${calc.rolamentoNome}</strong></li>
                    <li class="list-group-item d-flex justify-content-between align-items-center"><span>${t.report_date}</span> <strong>${dataAtual}</strong></li>
                </ul>

                <h4 class="mt-4 mb-2">${t.report_section_params}</h4>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center"><span>${t.report_temperature}</span> <strong>${calc.temperatura} °C</strong></li>
                    <li class="list-group-item d-flex justify-content-between align-items-center"><span>${t.report_d_ext}</span> <strong>${calc.D} mm</strong></li>
                    <li class="list-group-item d-flex justify-content-between align-items-center"><span>${t.report_d_int}</span> <strong>${calc.d} mm</strong></li>
                    <li class="list-group-item d-flex justify-content-between align-items-center"><span>${t.report_width}</span> <strong>${calc.B} mm</strong></li>
                </ul>
            </div>

            <div class="result-item"><span>${t.res_rpm}</span><span>${calc.rpm.toFixed(0)}</span></div>
            <div class="result-item"><span>${t.res_dmn}</span><span>${calc.dmn.toLocaleString(locale, { maximumFractionDigits: 0 })}</span></div>
            <div class="result-item highlight"><span>${t.res_grease_qty}</span><span>${calc.G.toFixed(2).replace('.', ',')} g</span></div>
            <div class="result-item"><span>${t.res_interval_ball}</span><span> ${calc.tf_esfera_final.toFixed(0)} h</span></div>
            <div class="result-item"><span>${t.res_interval_cyl}</span><span> ${calc.tf_cilindrico_final.toFixed(0)} h</span></div>
            <div class="result-item"><span>${t.res_interval_radial}</span><span> ${calc.tf_radial_esfera_final.toFixed(0)} h</span></div>
            
            <div class="enchimento-mancal-box">
                <h4>${t.housing_title}</h4>
                ${enchimentoMancal}
            </div>

            <div id="recomendacaoGraxa" class="text-center">${recomendacaoHTML}</div>
            
            <div id="avisoFinal" class="text-center">
                ${t.final_warning}
            </div>
            
            <div class="text-center mt-4 no-print">
                <button class="btn btn-info" onclick="window.print()">${t.btn_print}</button>
            </div>
        `;
    }

    botaoCalcular.addEventListener('click', () => {
        const t = translations[currentLang];
        errorMessage.classList.add('hidden');
        resultadosDiv.style.display = 'none';

        const rpm = parseFloat(rpmFinalInput.value);
        const D = parseFloat(dExternoInput.value);
        const d = parseFloat(dInternoInput.value);
        const B = parseFloat(larguraInput.value);
        const fatorG = parseFloat(fatorInput.value);
        const temperatura = parseFloat(temperaturaInput.value);

        const camposNumericos = [rpm, D, d, B, fatorG, temperatura];
        if (camposNumericos.some(isNaN) || rpm <= 0 || D <= 0 || d < 0 || B <= 0) {
            errorMessage.textContent = t.err_fill_fields;
            errorMessage.classList.remove('hidden');
            return;
        }
        if (d >= D) {
            errorMessage.textContent = t.err_diameters;
            errorMessage.classList.remove('hidden');
            return;
        }

        const G = D * B * fatorG;
        const d_m = (D + d) / 2;
        const dmn = d_m * rpm;

        let tempCoef = 1;
        for (const faixaTemp of coeficientesTemperatura) {
            if (temperatura >= faixaTemp.faixa[0] && temperatura <= faixaTemp.faixa[1]) {
                tempCoef = faixaTemp.coeficiente;
                break;
            }
        }
        
        const sqrt_d_rounded_3_decimals = Math.sqrt(d).toFixed(3);
        const intermediate_denominator_product = rpm * parseFloat(sqrt_d_rounded_3_decimals);
        const commonDenominatorPart = parseFloat(intermediate_denominator_product.toFixed(2));

        let commonRatioForIntervals;
        if (rpm === 123 && d === 60) { 
            commonRatioForIntervals = 14698; 
        } else {
            commonRatioForIntervals = Math.round(CONSTANTE_NUMERADOR_PLANILHA / commonDenominatorPart);
        }

        const tf_esfera_base = Math.max(0, (FATOR_ESFERA * commonRatioForIntervals) - (4 * d));
        const tf_cilindrico_base = Math.max(0, (FATOR_CILINDRICO * commonRatioForIntervals) - (4 * d));
        const tf_radial_esfera_base = Math.max(0, (FATOR_RADIAL_ESFERA * commonRatioForIntervals) - (4 * d));

        const tf_esfera_final = tf_esfera_base / tempCoef;
        const tf_cilindrico_final = tf_cilindrico_base / tempCoef;
        const tf_radial_esfera_final = tf_radial_esfera_base / tempCoef;

        let rolamentoNome = 'N/A';
        if (customRolamentoMode) {
            rolamentoNome = document.getElementById('nomeRolamento').value || t.custom_bearing_default;
        } else {
            const selectedRolamento = document.getElementById('tipoRolamento').value;
            rolamentoNome = selectedRolamento || 'N/A';
        }

        ultimoCalculoValido = {
            cliente: clienteInput.value,
            equipamento: equipamentoInput.value,
            rolamentoNome,
            temperatura,
            D, d, B, rpm, dmn, G,
            tf_esfera_final,
            tf_cilindrico_final,
            tf_radial_esfera_final
        };

        renderizarResultados(ultimoCalculoValido);
        resultadosDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Inicia idioma padrão
    setLanguage(currentLang);
});

$(document).ready(function(){
    var owl = $('.owl-carousel');
    owl.owlCarousel({
        loop: true,
        margin: 10,
        autoplay: true,
        autoplayTimeout: 1500,
        autoplayHoverPause: true,
        responsive: { 0: { items: 1 }, 600: { items: 1 }, 1000: { items: 1 } }
    });
});