<script lang="ts">
let form: HTMLFormElement | null = $state(null)

async function onsubmit(event: SubmitEvent) {
  event.preventDefault()
  if (form) {
    await fetch('/', {
      body: new FormData(form),
      method: 'POST'
    })
  }
}
</script>

<form bind:this={form} data-netlify="true" method="POST" name="contact" {onsubmit}>
  <p><label>Your Name: <input name="name"/></label></p>
  <p><label>Your Email: <input name="email" type="email"/></label></p>
  <div class="cf-turnstile" data-sitekey="0x4AAAAAAA2MQi7HUkWF0UEu"></div>
  <p><button type="submit">Send</button></p>
</form>

<svelte:head>
  <script defer src="https://challenges.cloudflare.com/turnstile/v0/api.js"></script>
</svelte:head>