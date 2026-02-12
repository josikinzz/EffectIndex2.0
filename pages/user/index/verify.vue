<template>
  <div>
    <h1>Verify Your Email</h1>
    <div v-if="showOtpInput">
      <input
        v-model="otp"
        placeholder="Enter code"
      >
      <button @click="verifyOtp">
        Verify
      </button>
      <button @click="resendOtp">
        Resend Code
      </button>
    </div>
    <div v-else>
      <input
        v-model="email"
        placeholder="Enter your email"
      >
      <button @click="sendCode">
        Send Code
      </button>
    </div>
  </div>
</template>

<script setup>
const apiFetch = useApiFetch();
const { $toast } = useNuxtApp();
const router = useRouter();

const otp = ref("");
const email = ref("");
const showOtpInput = ref(false);

onMounted(() => {
  const unverifiedEmail = localStorage.getItem("unverifiedEmail");
  const unverifiedOtpSentDate = localStorage.getItem("unverifiedOtpSentDate");

  if (unverifiedEmail && unverifiedOtpSentDate) {
    email.value = unverifiedEmail;
    showOtpInput.value = true;
  }
});

const validateEmail = (value) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(value.toLowerCase());
};

const sendCode = async () => {
  if (!validateEmail(email.value)) {
    $toast?.error?.("Please enter a valid email address.");
    return;
  }

  try {
    const payload = { email: email.value };
    await apiFetch("/api/otps/sendCode", { method: 'POST', body: payload });
    localStorage.setItem("unverifiedEmail", email.value);
    localStorage.setItem("unverifiedOtpSentDate", new Date().toISOString());
    showOtpInput.value = true;
    $toast?.success?.("OTP sent to your email.");
  } catch (error) {
    $toast?.error?.(error?.message || "Error sending OTP.");
  }
};

const verifyOtp = async () => {
  try {
    const payload = {
      email: email.value,
      otp: otp.value,
    };

    const response = await apiFetch("/api/otps/verifyCode", { method: 'POST', body: payload });

    if (response?.success) {
      $toast?.success?.("Email verified successfully!");
      router.push("/user/login");
    } else {
      $toast?.error?.(response?.message || "Verification failed.");
    }
  } catch (error) {
    $toast?.error?.(error?.message || "An error occurred during verification.");
  }
};

const resendOtp = async () => {
  try {
    const payload = { email: email.value };
    await apiFetch("/api/otps/resendCode", { method: 'POST', body: payload });
    localStorage.setItem("unverifiedOtpSentDate", new Date().toISOString());
    $toast?.success?.("OTP resent to your email.");
  } catch (error) {
    $toast?.error?.(error?.message || "Error resending OTP.");
  }
};
</script>
