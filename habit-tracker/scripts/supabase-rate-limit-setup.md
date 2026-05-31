# Supabase Auth Rate Limiting Setup

## Step-by-step instructions

1. Go to https://supabase.com/dashboard → Select your project
2. Navigate to: **Authentication** → **Settings** → **Rate Limits** (sidebar)

3. Set these values:

   | Setting | Recommended Value | Reason |
   |---------|------------------|--------|
   | **Sign-up** | 3 per hour per IP | Prevents mass account creation |
   | **Sign-in** | 10 per minute per IP | Allows legit retries but blocks brute force |
   | **Token refresh** | 30 per minute per IP | Standard refresh rate |
   | **Password reset** | 3 per hour per email | Prevents reset spam |
   | **Magic link / OTP** | 3 per hour per email | Prevents SMS/email bombing |
   | **SMS** | 3 per hour per phone | Same as above |
   | **Anonymous sign-ins** | 5 per minute per IP | Prevent anonymous abuse |

4. Click **Save**

## Important Notes

- These are Supabase server-side rate limits — they apply before your app can even process the request
- Combined with the client-side exponential backoff (30-second lock after 3 failed login attempts), this provides defense in depth
- Rate limits reset on a rolling window (not at fixed intervals)
- You can adjust these later based on real traffic patterns
- The client-side lock in `AuthContext.jsx` will stop most brute force before hitting Supabase limits
