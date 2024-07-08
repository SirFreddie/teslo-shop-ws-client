import { Manager, Socket } from "socket.io-client";

let socket: Socket;

export const connectToServer = (token: string) => {
  const manager = new Manager(
    `nest-teslo-shop-production-f2c2.up.railway.app/socket.io/socket.io.js`,
    {
      extraHeaders: {
        authentication: token,
      },
    }
  );

  socket?.removeAllListeners();
  socket = manager.socket("/");

  addListeners(socket);
};

const addListeners = (socket: Socket) => {
  const serverStatusLabel =
    document.querySelector<HTMLSpanElement>("#server-status")!;
  const clientsUl = document.querySelector<HTMLUListElement>("#clients-ul")!;
  const form = document.querySelector<HTMLFormElement>("#form")!;
  const messageInput =
    document.querySelector<HTMLInputElement>("#message-input")!;
  const messagesUl = document.querySelector<HTMLUListElement>("#messages-ul")!;

  socket.on("connect", () => {
    serverStatusLabel.innerText = "ONLINE";
    serverStatusLabel.style.color = "green";
  });

  socket.on("disconnect", () => {
    serverStatusLabel.innerText = "OFFLINE";
    serverStatusLabel.style.color = "red";
  });

  socket.on("clients-updated", (clients: string[]) => {
    let clientsHtml = "";

    clients.forEach((clientId: string) => {
      clientsHtml += `<li>${clientId}</li>`;
    });

    clientsUl.innerHTML = clientsHtml;
  });

  socket.on(
    "message-from-server",
    (payload: { fullName: string; message: string }) => {
      const newMessage = `
        <li>
          <strong>${payload.fullName}</strong>: <span>${payload.message}</span>
        </li>
      `;
      const messageLi = document.createElement("li");
      messageLi.innerHTML = newMessage;

      messagesUl.appendChild(messageLi);
    }
  );

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (messageInput.value.trim().length <= 0) return;

    const message = messageInput.value;

    socket.emit("message-from-client", { message });

    messageInput.value = "";
  });
};
