export function load({ params }) {
  return {
    room_name: String(params.slug),
  };
}
