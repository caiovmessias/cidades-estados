import { promises as fs } from 'fs';

init();

async function init() {
  try {
    await criarArquivosEstadosCidades();

    const uf = 'AC';
    const totalCidades = await retornaQuantidadeCidades(uf);
    console.log(`Quantidade de Cidades do estado(${uf}): \n${totalCidades}`);
    console.log('\nEstados com mais cidades:');
    await estadosComMaisCidades();
    console.log('\nEstados com menos cidades:');
    await estadosComMenosCidades();
    console.log('\nMaiores cidades de cada estado: ');
    await maioresCidadesEstado(true);
    console.log('\nMenores cidades de cada estado: ');
    await menoresCidadesEstado(true);
    console.log('\nMaior nome cidade de todas:');
    await maiorCidadeEstados();
    console.log('\nMenor nome cidade de todas:');
    await menorCidadeEstados();
  } catch (err) {
    console.log(err);
  }
}

async function criarArquivosEstadosCidades() {
  try {
    const estados = JSON.parse(await fs.readFile('Estados.json'));
    const cidades = JSON.parse(await fs.readFile('Cidades.json'));
    await estados.forEach(async (estado) => {
      const cidadesEstados = cidades.filter((cidade) => {
        return cidade.Estado === estado.ID;
      });
      const caminhoArquivo = `./estados/${estado.Sigla}.json`;
      await fs.writeFile(caminhoArquivo, JSON.stringify(cidadesEstados));
    });
  } catch (err) {
    console.log(err);
  }
}

async function retornaQuantidadeCidades(uf) {
  try {
    const caminhoArquivo = `./estados/${uf}.json`;
    const estado = JSON.parse(await fs.readFile(caminhoArquivo));
    const totalCidades = estado.length;
    return totalCidades;
  } catch (err) {
    console.log(err);
  }
}

async function estadosComMaisCidades() {
  try {
    let quantidadeCidadesEstados = await montaVetorTotalCidades();
    quantidadeCidadesEstados.sort((a, b) => {
      return b.cidades - a.cidades;
    });

    let cincoPrimeiros = [];
    for (let i = 0; i < 5; i++) {
      cincoPrimeiros.push({
        nome: quantidadeCidadesEstados[i].cidades,
        uf: quantidadeCidadesEstados[i].uf,
      });
    }
    cincoPrimeiros.forEach((cidade) => {
      console.log(`${cidade.uf} - ${cidade.nome}`);
    });
  } catch (err) {
    console.log(err);
  }
}

async function estadosComMenosCidades() {
  try {
    let quantidadeCidadesEstados = await montaVetorTotalCidades();
    quantidadeCidadesEstados.sort((a, b) => {
      return a.cidades - b.cidades;
    });

    let cincoPrimeiros = [];
    for (let i = 4; i >= 0; i--) {
      cincoPrimeiros.push({
        nome: quantidadeCidadesEstados[i].cidades,
        uf: quantidadeCidadesEstados[i].uf,
      });
    }
    cincoPrimeiros.forEach((cidade) => {
      console.log(`${cidade.uf} - ${cidade.nome}`);
    });
  } catch (err) {
    console.log(err);
  }
}

async function montaVetorTotalCidades() {
  let quantidadeCidadesEstados = [];
  const estados = JSON.parse(await fs.readFile('Estados.json'));
  await Promise.all(
    await estados.map(async (estado) => {
      const quantidadeCidade = await retornaQuantidadeCidades(estado.Sigla);
      quantidadeCidadesEstados.push({
        uf: estado.Sigla,
        cidades: quantidadeCidade,
      });
    })
  );
  return quantidadeCidadesEstados;
}

async function maioresCidadesEstado(imprimirEstados) {
  try {
    let maioresCidades = [];
    let maiorCidade = null;
    const estados = JSON.parse(await fs.readFile('Estados.json'));
    await Promise.all(
      await estados.map(async (estado) => {
        const cidades = JSON.parse(
          await fs.readFile(`./estados/${estado.Sigla}.json`)
        );
        maiorCidade = cidades[0].Nome;
        await Promise.all(
          await cidades.map((cidade) => {
            if (cidade.Nome.length > maiorCidade.length) {
              maiorCidade = cidade.Nome;
            } else {
              if (cidade.Nome.length === maiorCidade.length) {
                let aux = [cidade.Nome, maiorCidade];
                aux.sort((a, b) => {
                  return a.localeCompare(b);
                });
                maiorCidade = aux[0];
              }
            }
          })
        );
        maioresCidades.push({
          uf: estado.Sigla,
          nome: maiorCidade,
        });
      })
    );
    if (imprimirEstados) {
      maioresCidades.forEach((cidade) => {
        console.log(`${cidade.nome} - ${cidade.uf}`);
      });
    } else {
      return maioresCidades;
    }
  } catch (err) {
    console.log(err);
  }
}

async function menoresCidadesEstado(imprimirEstados) {
  try {
    let menoresCidades = [];
    let menorCidade = null;
    const estados = JSON.parse(await fs.readFile('Estados.json'));
    await Promise.all(
      await estados.map(async (estado) => {
        const cidades = JSON.parse(
          await fs.readFile(`./estados/${estado.Sigla}.json`)
        );
        menorCidade = cidades[0].Nome;
        await Promise.all(
          await cidades.map((cidade) => {
            if (cidade.Nome.length < menorCidade.length) {
              menorCidade = cidade.Nome;
            } else {
              if (cidade.Nome.length === menorCidade.length) {
                let aux = [cidade.Nome, menorCidade];
                aux.sort((a, b) => {
                  return a.localeCompare(b);
                });
                menorCidade = aux[0];
              }
            }
          })
        );
        menoresCidades.push({
          uf: estado.Sigla,
          nome: menorCidade,
        });
      })
    );
    if (imprimirEstados) {
      menoresCidades.forEach((cidade) => {
        console.log(`${cidade.nome} - ${cidade.uf}`);
      });
    } else {
      return menoresCidades;
    }
  } catch (err) {
    console.log(err);
  }
}

async function maiorCidadeEstados() {
  let maioresCidades = await maioresCidadesEstado(false);
  let maiorCidade = maioresCidades[0];
  maioresCidades.forEach((cidade) => {
    if (cidade.nome.length > maiorCidade.nome.length) {
      maiorCidade.nome = cidade.nome;
      maiorCidade.uf = cidade.uf;
    } else {
      if (cidade.nome.length === maiorCidade.nome.length) {
        let aux = [
          { nome: cidade.nome, uf: cidade.uf },
          { nome: maiorCidade.nome, uf: maiorCidade.uf },
        ];
        aux.sort((a, b) => {
          return a.nome.localeCompare(b.nome);
        });
        maiorCidade.nome = aux[0].nome;
        maiorCidade.uf = aux[0].uf;
      }
    }
  });
  console.log(`${maiorCidade.nome} - ${maiorCidade.uf}`);
}

async function menorCidadeEstados() {
  let menoresCidades = await menoresCidadesEstado(false);
  let menorCidade = menoresCidades[0];
  menoresCidades.forEach((cidade) => {
    if (cidade.nome.length < menorCidade.nome.length) {
      menorCidade.nome = cidade.nome;
      menorCidade.uf = cidade.uf;
    } else {
      if (cidade.nome.length === menorCidade.nome.length) {
        let aux = [
          { nome: cidade.nome, uf: cidade.uf },
          { nome: menorCidade.nome, uf: menorCidade.uf },
        ];
        aux.sort((a, b) => {
          return a.nome.localeCompare(b.nome);
        });
        menorCidade.nome = aux[0].nome;
        menorCidade.uf = aux[0].uf;
      }
    }
  });
  console.log(`${menorCidade.nome} - ${menorCidade.uf}`);
}
