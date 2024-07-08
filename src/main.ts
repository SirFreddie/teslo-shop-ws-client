import "./style.css";
import { setupCounter } from "./counter.ts";
import { connectToServer } from "./socket-client.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Websocket - Client</h1>

    <input id="jwt-token" placeholder="Json Web Token" />
    <button id="btn-connect">Connect</button>

    <br />
    <span id="server-status">OFFLINE</span>

    <ul id="clients-ul"></ul>

    <form id="form">
      <input placeholder="message" type="text" id="message-input" />
      <button type="submit">Send</button>
    </form>

    <h3>Messages</h3>
    <ul id="messages-ul"></ul>
  </div>
`;

// setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
// connectToServer();

const jwtToken = document.querySelector<HTMLInputElement>("#jwt-token");
const btnConnect = document.querySelector<HTMLButtonElement>("#btn-connect");

btnConnect?.addEventListener("click", () => {
  if (jwtToken && jwtToken.value.trim().length <= 0)
    return alert("Invalid JWT Token");

  connectToServer(jwtToken!.value);
});
