const owner = "gonzaloqh.github.io";
const repo = "barraAmor";
const filePath = "data.json";
const branch = "main";

async function cargarNumero() {
  const r = await fetch("data.json?ts=" + Date.now());
  const d = await r.json();
  document.getElementById("numero").innerText = d.valor;
}

cargarNumero();

const clientId = "Ov23li6OFkNKL9Ek3Z6z";

function loginGitHub() {
  const redirect = location.href;
  location.href =
    `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo&redirect_uri=${redirect}`;
}

async function obtenerUsuario(token) {
  const r = await fetch("https://api.github.com/user", {
    headers: { Authorization: "token " + token }
  });
  return r.json();
}

document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.key === "m") {
    loginGitHub();
  }
});

async function guardar() {
  const nuevo = document.getElementById("nuevoValor").value;

  const fileInfo = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      headers: { Authorization: "token " + sessionStorage.token }
    }
  ).then(r => r.json());

  const contenido = btoa(JSON.stringify({ valor: Number(nuevo) }, null, 2));

  await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: "token " + sessionStorage.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Actualizar número",
        content: contenido,
        sha: fileInfo.sha,
        branch
      })
    }
  );

  alert("Número actualizado");
  location.reload();
}
