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


<div class="row">
  <div class="msgs">
    {#each messages as message}
    <div>
      <span class="message-container"
        ><b class="message-author" title={message.key}>{message.author}</b>:
        <span class="message-content">{message.text}</span></span
      >
    </div>
    {/each}
  </div>

  <form class="input-box">
    <input type="text" bind:value={text_input} size="70" style="border-radius: 15px"/>
    <button on:click={onSend} style={"background-color: red; color: white; border-radius: 15px; width: 40px; height: 45px; margin-left: 2px"}>⮕ </button>
  </form>

  </div>

<div>



  <style>
    .input-box {
      position: absolute;
      bottom: 0;
      left: 0;
      margin: 10px;
      display: flex
    }

    .left {
      height: 92vh
    }

    .right {
      height: 90vh
    }

    .msgs {
      margin-left: 35px;
      margin-top: 15px
    }
  </style>


</div>
