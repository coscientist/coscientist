---
name: otp-send-errors-swallowed
description: An error thrown inside Better Auth sendVerificationOTP never reaches the client unless the failedSignInSends hook marks the request
metadata:
  type: project
---

Better Auth runs `sendVerificationOTP` through `runInBackgroundOrAwait`, which catches every error, logs `Failed to run background task`, and lets the endpoint answer 200 `{"success":true}`. `lib/auth.ts` adds the request context to `failedSignInSends` when a sign-in send fails, and `hooks.after` turns that mark into 503 `OTP_DELIVERY_FAILED`.

A new mail path inside a Better Auth callback needs the same mark, or its delivery failures read as success. Leave non-sign-in OTP types unmarked: Better Auth calls the sender for them only when the account exists, so a 503 there tells a caller which emails have accounts.
