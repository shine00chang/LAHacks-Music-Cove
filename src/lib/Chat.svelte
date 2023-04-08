<script>
  let messages = {};
  export let latest_message;
  $: {
    messages = [...messages, latest_message];
  }
</script>

<div>
  {#each messages as message}
    <span class="message-container"><b class="message-author" title={message.public_key}>{message.nickname}</b>: <span class="message-content">{message.content}</span></span>
  {/each}
</div>
