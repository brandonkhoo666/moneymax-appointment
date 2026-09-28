const url = 'http://localhost:3000/bookings/makeBooking';

const requests = Array.from({ length: 10 }, (_, i) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      appointmentId: 1,
      date: '2026-10-01',
      startTime: '10:00:00',
      attendeeName: `Concurrent User ${i + 1}`,
      attendeeEmail: `concurrent${i + 1}@test.com`,
    }),
  });
});

const start = Date.now();

Promise.all(
  requests.map(async (request, index) => {
    const response = await request;
    const body = await response.text();

    return {
      request: index + 1,
      status: response.status,
      body,
    };
  }),
).then((results) => {
  console.log(`Finished in ${Date.now() - start}ms`);
  console.table(results);
});
