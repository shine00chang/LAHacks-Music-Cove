import { json } from '@sveltejs/kit';

export async function GET({ url }) {
  let resp = await fetch("https://soundcloud.com/oembed?format=json&url="+encodeURIComponent(url.searchParams.get('url')))
  return json(await resp.json());
}
