<script>
  export let requests;
  function pending_handle(req, approved) {
    //send approval/disapproval websocket message
    req.approve_callback(approved);
    //hide
    document.getElementById("pending-req-"+req.public_key).remove();
  }
</script>

<div class="widget">
  <h2>Pending Requests</h2>
  <div>
	{#each requests as req}
      <!--{nick: nick, callback: cb}-->
      <div id={"pending-req-"+req.public_key}>
        <h3>Pending Request from <span class="nickname">{req.nick}</span></h3>
        <button on:click={() => pending_handle(req, true )} type="button" class="btn btn-success">Accept</button>
        <button on:click={() => pending_handle(req, false)} type="button" class="btn btn-danger">Decline</button>
      </div>
    {/each}
  </div>
</div>

<style>
  .nickname::before, .nickname::after {
    content: '"';
  }
</style>
