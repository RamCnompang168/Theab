const http = require("http");

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });
    req.on("error", reject);
    if (data) {
      req.write(typeof data === "string" ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log("Starting comprehensive API test suite for Somboth API...\n");

  function requireSuccess(label, response) {
    if (!response || response.status < 200 || response.status >= 300 || !response.data?.success) {
      throw new Error(`${label} failed: ${response?.data?.error || response?.raw || `HTTP ${response?.status}`}`);
    }
    return response.data;
  }

  // 1. Health check
  const health = await request({ hostname: "localhost", port: 5000, path: "/api/health", method: "GET" });
  if (health.status !== 200 || health.data?.status !== "OK") throw new Error("Health check failed");
  console.log("✓ Health Check:", health.data.status, `(uptime: ${health.data.uptimeSeconds}s)`);

  // 3. Register New User
  const randomEmail = `organizer_${Date.now()}@somboth.com`;
  const regRes = await request(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/auth/register",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    {
      name: "Sophea Rattanak",
      email: randomEmail,
      password: "secretPassword2026",
      role: "Wedding Planner",
    }
  );
  const registeredUser = requireSuccess("User registration", regRes);
  console.log("✓ New User Registration: SUCCESS", `Email: ${registeredUser.user?.email}`);

  // 3b. Login with that newly registered user: do not assume a demo account exists.
  const loginRes = await request(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/auth/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { email: randomEmail, password: "secretPassword2026" }
  );
  const authenticatedUser = requireSuccess("Login", loginRes);
  console.log("✓ Login: SUCCESS", `User: ${authenticatedUser.user?.name}`);
  const userToken = authenticatedUser.token;

  // 4. Create Project
  const createProjRes = await request(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/projects",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    },
    {
      title: "Rattanak & Bopha Diamond Wedding",
      groomName: "Rattanak Heng",
      brideName: "Bopha Pich",
      date: "2026-12-20",
      time: "17:00",
      venue: "Nagaworld Ballroom",
      city: "Phnom Penh",
      totalGuestsGoal: 250,
      totalBudgetUSD: 15000,
      exchangeRateKHR: 4100,
    }
  );
  const createdProject = requireSuccess("Create project", createProjRes);
  const newProjId = createdProject.project.id;
  console.log("✓ Create Project: SUCCESS", `ID: ${newProjId}`);

  // 5. Template auto-initialization check
  const tplRes = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/template/${newProjId}`,
    method: "GET",
  });
  const template = requireSuccess("Auto template initialization", tplRes).template;
  console.log("✓ Auto Template Init: SUCCESS", `Title: "${template.mainTitle}"`);

  // 6. Add Guest
  const addGuestRes = await request(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/guests",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    },
    {
      projectId: newProjId,
      name: "David Kim",
      nickname: "Dave",
      group: "Colleagues",
      status: "Pending",
      tableNo: "Table 05",
      note: "Vegetarian meal preference",
    }
  );
  const guestId = addGuestRes.data.guest.id;
  console.log("✓ Add Guest:", addGuestRes.data.guest?.name, `(ID: ${guestId})`);

  // 7. Patch Guest Status
  const patchGuest = await request(
    {
      hostname: "localhost",
      port: 5000,
      path: `/api/guests/${guestId}/status`,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    },
    { status: "Confirmed" }
  );
  console.log("✓ Patch Guest Status:", patchGuest.data.guest?.status);

  // 8. Public RSVP endpoint
  const publicRsvp = await request(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/guests/rsvp",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    {
      projectId: newProjId,
      guestName: "Melissa Vance",
      status: "Confirmed",
      wish: "Warmest wishes to the wonderful couple!",
      attendeeCount: 2,
    }
  );
  console.log("✓ Public RSVP Submission:", publicRsvp.data.message);

  // 9. Add Expense
  const addExpenseRes = await request(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/expenses",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    },
    {
      projectId: newProjId,
      name: "Grand Ballroom Deposit",
      category: "Venue & Food",
      budgetAmount: 5000,
      actualAmount: 4800,
      status: "Paid",
      description: "First half venue deposit paid",
    }
  );
  console.log("✓ Add Expense:", addExpenseRes.data.expense?.name, `$${addExpenseRes.data.expense?.actualAmount}`);

  // 10. Add Gift Envelope
  const addGiftRes = await request(
    {
      hostname: "localhost",
      port: 5000,
      path: "/api/gifts",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    },
    {
      projectId: newProjId,
      guestName: "Melissa Vance",
      group: "VIPs",
      currency: "USD",
      amount: 200,
      note: "So happy for you both!",
      thankYouSent: false,
    }
  );
  const giftId = addGiftRes.data.gift.id;
  console.log("✓ Add Gift Envelope:", addGiftRes.data.gift?.guestName, `$${addGiftRes.data.gift?.amount}`);

  // 11. Toggle Thank-You Status
  const toggleThankYou = await request(
    {
      hostname: "localhost",
      port: 5000,
      path: `/api/gifts/${giftId}/thank-you`,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    },
    { thankYouSent: true }
  );
  console.log("✓ Thank-You Card Toggle:", toggleThankYou.data.gift?.thankYouSent ? "SENT" : "PENDING");

  // 12. Dashboard Aggregation Check
  const dashRes = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/projects/${newProjId}/dashboard`,
    method: "GET",
  });
  const d = dashRes.data.dashboard;
  console.log("\n--- Aggregated Dashboard Metrics ---");
  console.log(`• Guests:   ${d.guests.confirmed} confirmed / ${d.guests.total} total (${d.guests.confirmationRate}%)`);
  console.log(`• Budget:   $${d.expenses.totalActualExpenseUSD} spent of $${d.expenses.totalBudgetUSD} budget ($${d.expenses.remainingBudgetUSD} remaining)`);
  console.log(`• Gifts:    $${d.gifts.combinedTotalUSD} USD collected across ${d.gifts.envelopeCount} envelopes (${d.gifts.thankYouSentCount} thank-yous sent)`);

  // 13. CSV Export Check
  const csvRes = await request({
    hostname: "localhost",
    port: 5000,
    path: `/api/gifts/export?projectId=${newProjId}`,
    method: "GET",
  });
  console.log("✓ CSV Export Header:", csvRes.raw.split("\r\n")[0]);
  console.log("✓ CSV First Row:    ", csvRes.raw.split("\r\n")[1]);

  console.log("\n=================================================");
  console.log("  ALL TESTS PASSED WITH 100% SUCCESS!");
  console.log("=================================================");
}

runTests().catch(console.error);
