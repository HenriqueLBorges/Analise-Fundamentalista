

module.exports.analisar = (application, req, res) => {
    let patrimonioLiquido = parseFloat(req.body.patrimonioLiquido);
    let vpa = parseFloat(req.body.vpa);
    let pVPA = parseFloat(req.body.pVPA);
    let numeroAcoes = parseFloat(req.body.numeroAcoes);
    let rpl = parseFloat(req.body.rpl);
    let precoAcao = parseFloat(req.body.precoAcao);
    let lucroLiquido = parseFloat(req.body.lucroLiquido);
    let lucroAcao = parseFloat(req.body.lucroAcao);
    let dividendoAcao = parseFloat(req.body.dividendoAcao);
    let payOut = parseFloat(req.body.payOut);
    let mercadoriasVendidas = parseFloat(req.body.mercadoriasVendidas);
    let despesasOperacionais = parseFloat(req.body.despesasOperacionais);
    let depreciação = parseFloat(req.body.depreciação);
    let amortizacao = parseFloat(req.body.amortizacao);
    let ebitda = parseFloat(req.body.ebitda);
    let valorMercado = parseFloat(req.body.valorMercado);
    let dividendYield = parseFloat(req.body.dividendYield);
    let pl = parseFloat(req.body.pl);
    
    //Chama as funções
    let vpaResult = calcular_vpa(vpa, patrimonioLiquido, numeroAcoes, precoAcao);
    let p_vpaResult = calcular_p_vpa(pVPA, precoAcao, vpaResult.valor)
    let ebitdaResult = calcular_ebitda(ebitda, calcular_lucroOperacional(mercadoriasVendidas, despesasOperacionais), depreciação, amortizacao);
    let payOutResult = calcular_payOut(payOut, dividendoAcao, lucroLiquido);
    let valorMercadoResult = calcular_valorMercado(valorMercado, precoAcao, numeroAcoes);
    let valorMercadoEBITDAResult = calcular_valorEmpresa_ebitda(valorMercadoResult.valor, ebitdaResult.valor);
    let dividendYieldResult = calcular_dividendYield(dividendYield, dividendoAcao, valorMercadoResult.valor);
    let rplResult = calcular_rpl(rpl, lucroLiquido, patrimonioLiquido);
    let lucroAcaoResult = calcular_lucroAcao(lucroAcao, lucroLiquido, numeroAcoes);
    let plResult = calcular_preco_lucro(pl, precoAcao, lucroAcaoResult.valor);

    let result = {
        "Valor patrimonial da ação": vpaResult,
        "Preço por valor patrimonial da ação": p_vpaResult,
        "Rentabilidade sobre patrimônio": rplResult,
        "Lucro por ação": lucroAcaoResult,
        "Índice P/L": plResult,
        "Dividend Yield": dividendYieldResult,
        "EBITDA": ebitdaResult,
        "payOut": payOutResult,
        "Valor de mercado da empresa sobre EBITDA": valorMercadoEBITDAResult,
        "Valor de mercado": valorMercadoResult
    }
    res.json(result);
}

module.exports.render = (application, req, res) => {
    res.render("home", { validacao: {} });
}

//Functions
let calcular_vpa = (vpa, patrimonioLiquido, numeroAcoes, precoAcao) => {
    let result = {
        valor: typeof vpa !== "undefined" ? vpa : (patrimonioLiquido / numeroAcoes),
        texto: "O VPA é um indicador que deve ser avaliado pelo seu crescimento."
    }
    if (typeof vpa !== "undefined" && !isNaN(vpa)) {
        result.valor = vpa;
        result.texto = result.valor > precoAcao ? "VPA ou valor patrimonial da ação é um indicador de análise fundamentalista e representa o valor intrínseco da ação, aquele valor que, do ponto de vista contábil, ela representa. Esse indicador deve ser avaliado pelo seu crescimento. As ações estão sendo negociadas  a cotações acima de seu VPA, o que indica que o mercado tem boas expectativas em relação a empresa. Porém, cuidado pois ações negociadas a cotações muito acima de seu VPA podem indicar euforia."
            : "VPA ou valor patrimonial da ação é um indicador de análise fundamentalista e representa o valor intrínseco da ação, aquele valor que, do ponto de vista contábil, ela representa. Esse indicador deve ser avaliado pelo seu crescimento. As ações estão sendo negociadas a cotações abaixo de seu VPA.";
    }
    else {
        result.valor = (patrimonioLiquido / numeroAcoes);
        result.texto = result.valor > precoAcao ? "VPA ou valor patrimonial da ação é um indicador de análise fundamentalista e representa o valor intrínseco da ação, aquele valor que, do ponto de vista contábil, ela representa. Esse indicador deve ser avaliado pelo seu crescimento. As ações estão sendo negociadas a cotações acima de seu VPA, o que indica que o mercado tem boas expectativas em relação a empresa. Porém, cuidado pois ações negociadas a cotações muito acima de seu VPA podem indicar euforia."
            : "VPA ou valor patrimonial da ação é um indicador de análise fundamentalista e representa o valor intrínseco da ação, aquele valor que, do ponto de vista contábil, ela representa. Esse indicador deve ser avaliado pelo seu crescimento. As ações estão sendo negociadas a cotações abaixo de seu VPA.";
    }
    return result;
}

let calcular_p_vpa = (p_vpa, precoAcao, vpa) => {
    let result = {
        valor: 0,
        texto: (precoAcao / vpa) > 1 ? "As ações da empresa estão sobreavaliadas pelo mercado." : "As ações estão subavaliadas pelo mercado."
    }
    if (typeof p_vpa !== "undefined" && !isNaN(p_vpa)) {
        result.valor = p_vpa;
        result.texto = result.valor > 1 ? "As ações da empresa estão sobreavaliadas pelo mercado. Um P/VPA alto não significa que as ações estejam caras e é comum em empresas de setores que não necessitam de tanto patrimônio para gerar valor para o acionista, ou em empresas com expectativas de alto crescimento de lucro, que faça o patrimônio líquido crescer a uma taxa elevada nos anos seguintes."
            : result.valor == 1 ? "As ações da empresa estão sendo negociadas pelo equivalente a seu patrimônio líquido."
                : "As ações estão subavaliadas pelo mercado. Isso pode indicar que estão ocorrendo problemas sérios com a empresa."
    }
    else {
        result.valor = precoAcao / vpa;
        result.texto = result.valor > 1 ? "As ações da empresa estão sobreavaliadas pelo mercado. Um P/VPA alto não significa que as ações estejam caras e é comum em empresas de setores que não necessitam de tanto patrimônio para gerar valor para o acionista, ou em empresas com expectativas de alto crescimento de lucro, que faça o patrimônio líquido crescer a uma taxa elevada nos anos seguintes."
            : result.valor == 1 ? "As ações da empresa estão sendo negociadas pelo equivalente a seu patrimônio líquido."
                : "As ações estão subavaliadas pelo mercado. Isso pode indicar que estão ocorrendo problemas sérios com a empresa."
    }
    return result;
}

let calcular_rpl = (rpl, lucroLiquido, patrimonioLiquido) => {
    let result = {
        valor: 0,
        texto: "Rentabilidade sobre patrimônio líquido mostra o percentual de lucro líquido ou prejuízo líquido auferido relacionado ao montante total aplicado pelos acionistas. Quanto maior a porcentagem positiva, melhor."
    }
    if (typeof rpl !== "undefined" && !isNaN(rpl))
        result.valor = rpl;
    else result.valor = ((lucroLiquido / patrimonioLiquido) * 100) + "%";

    return result;
}

let calcular_preco_lucro = (pl, precoAcao, lucroAcao) => {
    let result = {
        valor: 0,
        texto: "O P/L nos dá uma ideia do quanto o mercado está disposto a pagar pelos lucros da empresa. Assim, quanto maior o P/L, maior a disposição do mercado. Alguns investidores interpretam um P/L alto como uma ação muito cara, no entanto pode também indicar que o mercado tem grandes expectativas sobre a ação e, portanto, pressionam para cima o seu preço."
    }

    if (typeof pl !== "undefined" && !isNaN(pl))
        result.valor = pl;
    else
        result.valor = (precoAcao / lucroAcao);
    return result;
}

let calcular_dividendYield = (dividendYield, dividendoAcao, valorMercado) => {
    let result = {
        valor: 0,
        texto: ""
    }
    if (typeof dividendYield !== "undefined" && !isNaN(dividendYield)) {
        result.valor = dividendYield + "%";
        result.texto = "Dividend Yield (rendimento do dividendo) indica o retorno relativo, ou seja, percentual, em dinheiro que o investidor obteve a partir do pagamento dos proventos. Dividend yields mais elevados são característicos de empresas em estágio mais maduro de negócios, que não investem pesadamente em expansões no médio prazo. Empresas que mantém um valor elevado de dividend yields possuem papéis de menor volatilidade, já que a maior parte dos retornos ao acionista vem na forma de dividendos e não pelo aumento do valor da ação."
    }
    else {
        result.valor = ((dividendoAcao / valorMercado) * 100) + "%";
        result.texto = "Dividend Yield (rendimento do dividendo) indica o retorno relativo, ou seja, percentual, em dinheiro que o investidor obteve a partir do pagamento dos proventos. Dividend yields mais elevados são característicos de empresas em estágio mais maduro de negócios, que não investem pesadamente em expansões no médio prazo. Empresas que mantém um valor elevado de dividend yields possuem papéis de menor volatilidade, já que a maior parte dos retornos ao acionista vem na forma de dividendos e não pelo aumento do valor da ação."
    }
    return result;
}

let calcular_payOut = (payout, dividendoAcao, lucroLiquido) => {
    let result = {
        valor: 0 + "%",
        texto: "Payout é a proporção dos lucros que uma empresa paga na forma de dividendos aos acionistas. As empresas com payouts altos normalmente se encontram em mercados onde haja demanda inelástica. O payout acima de 100% significa que a empresa está pagando em dividendos mais do que ela lucra em suas atividades. Muitas vezes isso ocorre porque a empresa retira uma parte deste valor pago em forma de dividendos, de sua reserva de lucros a realizar ou reserva de capital, no caso de ações preferenciais, isso acontece para compensar o investidor por resultados ruins. As empresas que pagam taxas próximas a 25% de payout são empresas que vêem potencial de crescimento no mercado que atuam."
    }
    if (typeof payout !== "undefined" && !isNaN(payout)) result.valor = payout + "%";
    else result.valor = ((dividendoAcao / lucroLiquido) * 100) + "%";

    return result;
}

let calcular_lucroOperacional = (mercadoriasVendidas, despesasOperacionais) => {
    if (isNaN(mercadoriasVendidas) || isNaN(despesasOperacionais)) return "undefined";
    return mercadoriasVendidas - despesasOperacionais;
}

let calcular_ebitda = (ebitda, lucroOperacional, depreciação, amortizacao) => {
    let result = {
        valor: 0,
        texto: "EBITDA é um índice financeiro que representa quanto uma empresa gera de recursos através de suas atividades operacionais, sem contar impostos e outros efeitos financeiros."
    }

    if (typeof ebitda !== "undefined" && !isNaN(ebitda)) result.valor = ebitda;
    else result.valor = lucroOperacional + depreciação + amortizacao;

    return result;
}

let calcular_valorMercado = (valorMercado, precoAcao, numeroAcoes) => {
    let result = {
        valor: 0,
        texto: "O valor de mercado de uma empresa é representado pela cotação das suas ações em Bolsa, multiplicada pelo número total de ações que compõe seu capital."
    }
    if (typeof valorMercado !== "undefined" && !isNaN(valorMercado))
        result.valor = valorMercado;
    else result.valor = precoAcao * numeroAcoes;

    return result;
}

let calcular_valorEmpresa_ebitda = (valorMercado, ebitda) => {
    if(typeof valorMercado == "undefined" || isNaN(valorMercado) || typeof ebitda == "undefined" || isNaN(ebitda)) return NaN;
    let result = {
        valor: ebitda / valorMercado,
        texto: "Relaciona o valor da empresa com sua capacidade de geração de caixa, aferida pelo EBITDA."
    }
    return result
}

let calcular_lucroAcao = (lucroAcao, lucroLiquido, numeroAcoes) => {
    let result = {
        valor: 0,
        texto: ""
    }
    if (typeof lucroAcao !== "undefined" && !isNaN(lucroAcao)) result.valor = lucroAcao;
    else result.valor = (lucroLiquido / numeroAcoes);

    return result;
}   