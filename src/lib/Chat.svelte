<script>
  export let emit;
  export let nickname = "";

  let messages = [];
  let text_input = "";
  document.addEventListener("chat-message", (event) => {
    const msg = event.detail;
    const author = msg.data.author;
    const text = msg.data.text;
    const key = msg.hdr.signK;
    messages = [
      ...messages,
      {
        text: text,
        key: key,
        author: author,
      },
    ];
  });

  const onSend = () => {
    const hdr = {};
    const data = {
      event: "chat-message",
      text: text_input.trim(),
      author: nickname,
    };
    console.log("Chat sending: ", hdr, data);
    emit(hdr, data);
  };
</script>

<div>
  {#each messages as message}
    <div>
      <span class="message-container"
        ><b class="message-author" title={message.key}>{message.author}</b>:
        <span class="message-content">{message.text}</span></span
      >
    </div>
  {/each}
  <form>
    <input type="text" bind:value={text_input} />
    <button on:click={onSend}>⮕ </button>
  </form>
</div>
