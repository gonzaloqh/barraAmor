/**********************
 * CONFIGURACIÓN
 **********************/
const owner = "gonzaloqh";          // tu usuario GitHub
const repo = "barraAmor";           // nombre del repositorio
const filePath = "data.json";       // archivo persistente
const branch = "main";              // rama

/**********************
 * LECTURA PÚBLICA
 **********************/
async function cargarNumero() {
  try {
    const r = await fetch("data.json?ts=" + Date.now());
    const d = await r.json();
    document.getElementById("numero").innerText = d.valor;
  } catch (e) {
    document.getElementById("numero").innerText = "Error";
    console.error(e);
  }
}

cargarNumero();

/**********************
 * TOKEN PRIVADO (SOLO TÚ)
 **********************/
let token = localStorage.getItem("gh_token");

function pedirToken() {
  token = prompt("Pega tu GitHub Personal Access Token:");
  if (!token) {
    alert("Token requerido para editar");
    return;
  }
  localStorage.setItem("gh_token", token);
}

/**********************
 * MOSTRAR EDITOR (CTRL + M)
 **********************/
document.addEventListener("keydown", e => {
    console.log("keyprev");
    if (e.ctrlKey && e.key.toLowerCase() === "m") {
        
    console.log("keydonw");
    console.log(localStorage.getItem("gh_token"));
    if (!token) {
      pedirToken();
    }
    if (token) {
      document.getElementById("editor").style.display = "block";
    }
  }
});

/**********************
 * GUARDAR NUEVO VALOR
 **********************/
async function guardar() {
  try {
    const nuevo = document.getElementById("nuevoValor").value;

    if (nuevo === "") {
      alert("Ingresa un número");
      return;
    }

    // Obtener SHA actual del archivo
    const infoResp = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        headers: {
          Authorization: "token " + token,
          Accept: "application/vnd.github+json"
        }
      }
    );

    if (!infoResp.ok) {
      throw new Error("No se pudo leer el archivo (token inválido o permisos)");
    }

    const fileInfo = await infoResp.json();

    // Nuevo contenido
    const contenido = btoa(
      JSON.stringify({ valor: Number(nuevo) }, null, 2)
    );

    // Commit del cambio
    const putResp = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: "token " + token,
          "Content-Type": "application/json",
          Accept: "application/vnd.github+json"
        },
        body: JSON.stringify({
          message: "Actualizar número desde GitHub Pages",
          content: contenido,
          sha: fileInfo.sha,
          branch: branch
        })
      }
    );

    if (!putResp.ok) {
      throw new Error("Error al guardar el archivo");
    }

    alert("Número actualizado correctamente");
    location.reload();

  } catch (err) {
    alert(err.message);
    console.error(err);
  }
}
