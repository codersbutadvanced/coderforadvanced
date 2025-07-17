import time
import itertools
import string
import getpass

# === Display ===
print("=== 💣 Ultra-Advanced Brute Force Cracker ===")

# === Secure target password input ===
target_password = getpass.getpass("Enter a target password (hidden): ").strip()

# === Choose mode ===
print("\nSelect attack mode:")
print("1. Brute Force")
print("2. Dictionary (Wordlist)")
mode = input("Mode (1/2): ").strip()

# === Wordlist mode ===
if mode == "2":
    wordlist = ["123", "abc", "password", "letmein", "qwerty", "admin"]
    print(f"\n🧠 Wordlist loaded ({len(wordlist)} words)")
    start = time.time()
    for word in wordlist:
        print(f"Trying: {word}", end='\r')
        if word == target_password:
            print(f"\n✅ Password found in wordlist: {word}")
            break
    else:
        print("\n❌ Password not found in wordlist.")
    end = time.time()
    print(f"⏱️ Time taken: {round(end - start, 4)} seconds")

else:
    # === Difficulty level ===
    print("\nSelect brute-force difficulty:")
    print("1. Easy (lowercase)")
    print("2. Medium (letters)")
    print("3. Hard (letters + digits)")
    choice = input("Enter (1/2/3): ").strip()

    if choice == '1':
        charset = string.ascii_lowercase
    elif choice == '2':
        charset = string.ascii_letters
    elif choice == '3':
        charset = string.ascii_letters + string.digits
    else:
        print("Invalid input. Defaulting to Easy.")
        charset = string.ascii_lowercase

    # === Start brute-force ===
    start_time = time.time()
    found = False
    attempts = 0
    max_length = 5  # You can change this

    print(f"\n🚀 Cracking password of max length {max_length} using {len(charset)} characters...")

    for length in range(1, max_length + 1):
        for guess in itertools.product(charset, repeat=length):
            attempts += 1
            guess_word = ''.join(guess)
            print(f"Trying: {guess_word}", end='\r')
            if guess_word == target_password:
                found = True
                duration = round(time.time() - start_time, 4)
                print(f"\n✅ Password found: {guess_word}")
                print(f"🔢 Attempts: {attempts}")
                print(f"⚡ Rate: {round(attempts/duration)} guesses/sec")
                print(f"⏱️ Time taken: {duration} seconds")

                # === Save results to file ===
                with open("bruteforce_result.txt", "w") as f:
                    f.write(f"Password: {guess_word}\n")
                    f.write(f"Attempts: {attempts}\n")
                    f.write(f"Time: {duration} sec\n")
                print("💾 Result saved to 'bruteforce_result.txt'")
                break
        if found:
            break

    if not found:
        print("\n❌ Password not found in brute-force range.")
