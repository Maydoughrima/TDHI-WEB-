// MOCK BACKEND – replace with real API later
export function getPaycode() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          code: "P24062",
          period: "Jan 1 – Jan 15, 2024",
        },
        {
          id: 2,
          code: "P24063",
          period: "Jan 16 – Jan 31, 2024",
        },
      ]);
    }, 400);
  });

  /*
  REAL BACKEND
  return fetch("/api/paycodes").then(res => res.json());
  */
}
