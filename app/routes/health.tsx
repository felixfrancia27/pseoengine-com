export const loader = () => {
  return new Response("OK", {
    headers: { "content-type": "text/plain" },
  });
};
