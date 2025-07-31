export const initiatePayment = async (plan_id, amount, phone) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch("http://localhost:8000/create-payment", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plan_id, amount, phone }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Server responded with error:", res.status, data);
      throw new Error(data.detail || "Failed to initiate payment");
    }

    if (data.success && data.payment_link) {
      window.location.href = data.payment_link;
    } else {
      throw new Error("Payment link not received.");
    }
  } catch (error) {
    console.error("Payment error:", error.message || error);
    throw error;
  }
};
